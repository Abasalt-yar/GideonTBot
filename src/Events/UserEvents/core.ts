
import {checkUser,getUser} from "../../Controllers/userController.js"


import {bot,newMessageEntity,_botID} from "../../app.js"
import { Composer, Context } from "grammy";


let coreUserEvent = async (msg : Context,next:Function)=>{
    if (msg.message?.from == undefined) return
    if (msg.message?.from?.is_bot == true) return //* Anyway It's not working, but it's for precaution
    if (msg.message?.chat.type != "supergroup") {next();return}
    try {
        
        await checkUser(msg.message?.chat.id,msg.message?.from?.id || "", (await bot.api.getChatMember(msg.message.chat.id,msg.message?.from?.id)).status == "creator" ? true : false)
        
    } catch (error) {
        if (process.env.MODE == "production") {return}
        console.log(error)
        return
    }
    if (msg.message.reply_to_message?.from?.id != undefined && msg.message.reply_to_message?.from?.is_bot == false) { 
        try {
            await checkUser(msg.message.chat.id,msg.message.reply_to_message?.from?.id, (await bot.api.getChatMember(msg.message.chat.id,msg.message.reply_to_message?.from?.id)).status == "creator" ? true : false)
            
        } catch (error) {
            if (process.env.MODE == "production") {return}
            console.log(error)
            return
        }
    }
    if (msg.message.entities != undefined && msg.message.entities[0] != undefined) {
        try {
            let _: newMessageEntity[] = [...msg.message.entities]
            if (_[0]?.type == "mention") {
                await checkUser(msg.message.chat.id,_[0].userid, (await bot.api.getChatMember(msg.message.chat.id,_[0].userid)).status == "creator" ? true : false)
            }
        } catch (error) {
            if (process.env.MODE == "production") {return}
            console.log(error)
            return
        }
    }
    next()
}

export const UserCoreComposer = new Composer()

UserCoreComposer.on("message",coreUserEvent)


