
import {checkGroup} from "../../Controllers/gpController.js"
import {bot,newMessageEntity} from "../../app.js"
import { Composer, Context, GrammyError } from "grammy"
import { texts } from "../../Utils/texts.js"


export const getTargetUserid = async(msg:Context,regex: RegExp) => {
    if (msg.message.reply_to_message?.from?.id != undefined) {
        return msg.message.reply_to_message.from.id.toString()
        
    }else if (msg.message.entities != undefined){
        let _: newMessageEntity[] = [...msg.message.entities]
        if (_[0]?.type == "mention") {
            return _[0].userid.toString()
        }
        
    }else if (isNaN(Number((msg.message.text.replace(regex,"")))) == false) {
        return (msg.message.text.replace(regex,"")).toString()
    } else return "false"
}

let coreGroupEvent = async (msg: Context,next:Function)=>{
    if (msg.message?.from?.is_bot == true) return
    if (msg.message?.chat.type != "supergroup") {next();return}
    try {
        const admins = await bot.api.getChatAdministrators(msg.message?.chat.id)
        let owner = admins.filter((admin)=>admin.status == "creator")
        await checkGroup(msg.message?.chat.id,owner[0].user.id)
    } catch (error) {
        if (process.env.MODE == "production") return
        console.log(error)
        return
    }
    next()
}

export const GroupCoreComposer = new Composer()

GroupCoreComposer.on("message",coreGroupEvent)


export const handleGrammyError = async(msg:Context,error: GrammyError,lang:string) => {
    try {
        if (error.description == "Bad Request: user is an administrator of the chat") {
            await msg.reply(texts[`${lang}-isAdmin`],{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true
            })
            return
        }else if (error.description == "Bad Request: can't restrict self") {
            await msg.reply(texts[`${lang}-botSelf`],{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true
            })
            return
        }else if (error.description == "Bad Request: user not found") {
            await msg.reply(texts[`${lang}-userIsntInGroup`],{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true
            })
        }
    } catch (error) {
        
    }
    return
}