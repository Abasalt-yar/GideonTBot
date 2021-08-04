
import {checkUser,getUser} from "../../Controllers/userController.js"
import {getGroup,changeGroupInfo} from "../../Controllers/gpController.js"

import {bot} from "../../app.js"

import {CustomLocks, locks,mainLocks}  from "../../Utils/locks.js"

import {texts,replaceMessage} from "../../Utils/texts.js"
import { Composer, Context, InlineKeyboard } from "grammy"

const checkLock = (msg: Context,whatLock:string)=>{
    if (msg.message?.chat.type != "supergroup") return false
    if (getGroup(msg.message.chat.id) == undefined) return false
    if (JSON.parse(getGroup(msg.message.chat.id).locks)[whatLock] != true) return false
    return true
}

let lockToggle = async(msg:Context)=>{
    try {
        if (msg.message?.from?.is_bot == true) return
        if (msg.message?.chat.type != "supergroup") return
        if (getUser(msg.message.chat.id,msg.message?.from?.id || "") == undefined) return
        if (getUser(msg.message.chat.id,msg.message?.from?.id || "").rank < 2) return
        const what = msg.message?.text?.toLocaleLowerCase().replace(/\/?(lock|unlock|قفل|بازکردن) /i,"").toLocaleLowerCase() || ""
        let lang = getGroup(msg.message.chat.id).lang
        const whatLock = locks[what] != undefined ? locks[what] : CustomLocks[what]
        if (whatLock == undefined) {
            await msg.reply(texts[`${lang}-wrongLock`],{
                reply_to_message_id:msg.message.message_id,
                reply_markup: new InlineKeyboard().text(texts[`${lang}-manageLockMenu`],"manageLockMenu")
            })
            return
        }
        let _ = msg.message?.text?.toLocaleLowerCase().search((/unlock|بازکردن/))
        let currentLocks = JSON.parse(getGroup(msg.message.chat.id).locks)
        let newStatus = _ != -1 ? false : true
        if (currentLocks[whatLock] == newStatus) {
            try {
                await msg.reply(texts[`${lang}-sameLock`],{
                    reply_to_message_id:msg.message.message_id,
                    allow_sending_without_reply:true
                })
            } catch (error) {
                if (process.env.MODE == "production") {return}
                    console.log(error)
            }
            return
        }
        currentLocks[whatLock] = newStatus
        try {
            
            await changeGroupInfo(msg.message.chat.id,"locks",JSON.stringify(currentLocks))
            await msg.reply(replaceMessage(texts[`${lang}-${currentLocks[whatLock] == true ? "" : "un"}Locked`],[what]),{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true
            })
        } catch (error) {
            if (process.env.MODE == "production") {return}
            console.log(error)    
        }
    } catch (error) {
        if (process.env.MODE == "production") {return}
        console.log(error)
        return
    }
}

let normalLockHandle = (giveType:string)=>{
    return async (msg:Context,next:Function) =>{
    
        try {
            if (checkLock(msg,giveType) == false) {next();return}
            if (getUser(msg.message?.chat.id || "",msg.message?.from?.id || "").rank > 0) {next();return}
            if ( (giveType == ":new_chat_members" || giveType == ":new_chat_members:is_bot") && msg.message.new_chat_members != undefined && msg.message.new_chat_members[0] != undefined){
                if (giveType == ":new_chat_members:is_bot" && msg.message.new_chat_members[0].is_bot == true)
                    await bot.api.banChatMember(msg.message.chat.id,msg.message.new_chat_members[0].id,{
                        revoke_messages:true
                    })
                else 
                    await bot.api.banChatMember(msg.message.chat.id,msg.message.new_chat_members[0].id,{
                        revoke_messages:true,
                        until_date: 32
                    })

            }else {
                await msg.deleteMessage()
                const ctx = msg
                
            }
            
        } catch (error) {
            if (process.env.MODE == "production") {return}
            console.log(error)
            return
        }
        next()
    }
}


export const lockComposer = new Composer()

//bot.on(["::url",":sticker",":video",":voice","::hashtag","::mention"])

for (const [key,val] of Object.entries(mainLocks)) {
    if (val.startsWith("C:") == false)
    lockComposer.on(val,normalLockHandle(val))
    else 
    lockComposer.filter((ctx)=>eval(val.replace("C:",""))).on("message",normalLockHandle(val))
}

lockComposer.hears(/^\/?(lock|unlock|قفل|بازکردن)(?: (.+))?$/i,lockToggle)

    

