
import {checkUser,getUser} from "../../Controllers/userController.js"
import {getGroup,changeGroupInfo} from "../../Controllers/gpController.js"

import {bot} from "../../app.js"

import {locks,mainLocks}  from "../../Utils/locks.js"

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
        if (locks[what] == undefined) {
            await msg.reply(texts[`${lang}-wrongLock`],{
                reply_to_message_id:msg.message.message_id,
                reply_markup: new InlineKeyboard().text(texts[`${lang}-manageLockMenu`],"manageLockMenu")
            })
            return
        }
        let _ = msg.message?.text?.toLocaleLowerCase().search((/unlock|بازکردن/))
        let currentLocks = JSON.parse(getGroup(msg.message.chat.id).locks)
        let newStatus = _ != -1 ? false : true
        if (currentLocks[locks[what]] == newStatus) {
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
        currentLocks[locks[what]] = newStatus
        try {
            
            await changeGroupInfo(msg.message.chat.id,"locks",JSON.stringify(currentLocks))
            await msg.reply(replaceMessage(texts[`${lang}-${currentLocks[locks[what]] == true ? "" : "un"}Locked`],[what]),{
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
            await msg.deleteMessage()
            
        } catch (error) {
            if (process.env.MODE == "production") {return}
            console.log(error)
            return
        }
        next()
    }
}


export const lockComposer = new Composer()

lockComposer.hears(/^\/?(lock|unlock|قفل|بازکردن) *(.+)?/i,lockToggle)
//bot.on(["::url",":sticker",":video",":voice","::hashtag","::mention"])

for (const [key,val] of Object.entries(mainLocks)) {
    lockComposer.on(val,normalLockHandle(val))
}

    

