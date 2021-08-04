import {
    addSudo,
    changeUserInfo,
    checkUser,
    getUser
} from "../../Controllers/userController.js"
import {
    getGroup,
    changeGroupInfo,
    getGroups
} from "../../Controllers/gpController.js"

import {
    bot, _botID
} from "../../app.js"
import {
    locks
} from "../../Utils/locks.js"



import {
    texts,
    replaceMessage
} from "../../Utils/texts.js"
import {
    Composer,
    GrammyError,
    InlineKeyboard
} from "grammy"
import { Context } from "grammy"
import { ChatFromGetChat, MessageEntity } from "grammy/out/platform"
import { getUserIDByUsername } from "../../GramJS/core.js"
import { getTargetUserid, handleGrammyError } from "./core.js"
import { Console } from "console"
import { allowedToUse } from "./adminCommands.js"
import { IGroupSchema } from "../../Database/groups.js"



type Supergroup = ChatFromGetChat & {title?: string}
let sudoGpListCommand = async (msg:Context) => {
    try {
        if (await allowedToUse(msg,4) != true) return
        const gps = getGroups()
        await msg.reply(`Length: ${Object.keys(gps).length}`)
        for (const [key,val] of Object.entries(gps)) {
            try {
                const gp: IGroupSchema = val
                const g:Supergroup = await bot.api.getChat(gp.gid)
                await msg.reply(`Gp ID: ${gp.gid} | Name: ${g.title}`)
            } catch (error) {
                
            }
        }
    } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}


let sudoGpMembersCommand = async (msg:Context) => {
    try {
        if (await allowedToUse(msg,4) != true) return
        let text = msg.message.text.replace(/^\/?(gpmembers) /i,"")
        try {
            const admins = await bot.api.getChatAdministrators(text)
            const members = await bot.api.getChatMemberCount(text)
            await msg.reply(`Admins: ${Object.keys(admins).length} | Members: ${members}`)
            await msg.reply(JSON.stringify(getGroups()[text.toString()]).toString())
            for(const [key,val] of Object.entries(admins)) {
                await msg.reply(`Status :${val.status} | Userid: ${val.user.id} | Name & Username: ${val.user.first_name} ${val.user.last_name} @${val.user.username}`)
            }
        } catch (error) {
            try {
                await msg.reply(`Chat Not Found | ${text} | ${error}`)
            } catch (error) {
                
            }
        }
    } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}


let sudoSetSudoCommand = async (msg:Context) => {
    try {
        if (await allowedToUse(msg,4) != true) return
        let uid = Number(await getTargetUserid(msg,new RegExp(/\/?(warn|unwarn|وارن|حذف وارن) /,"i")))

        if (uid == undefined) return
        try {
            let res = await addSudo(uid.toString())
            if (res == false) throw new Error("false")
            await msg.reply("Done",{
                reply_to_message_id: msg.message.message_id,
                allow_sending_without_reply:true
            })
        } catch (error) {
            
        }
     } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}

export const sudoComposer =  new Composer()
sudoComposer.hears(/^\/?(gplist)(?: (.+))?$/i, sudoGpListCommand)
sudoComposer.hears(/^\/?(gpmembers)(?: (.+))?$/i, sudoGpMembersCommand)
sudoComposer.hears(/^\/?(setsudo)(?: (.+))?$/i, sudoSetSudoCommand)
    

