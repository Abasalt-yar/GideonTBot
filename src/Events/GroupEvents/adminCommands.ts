import {
    changeUserInfo,
    checkUser,
    clearAdmins,
    getUser
} from "../../Controllers/userController.js"
import {
    getGroup,
    changeGroupInfo
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
import { MessageEntity } from "grammy/out/platform"
import { getUserIDByUsername } from "../../GramJS/core.js"
import { getTargetUserid, handleGrammyError } from "./core.js"
import { Console } from "console"


export const allowedToUse = async (msg : Context,adminLevel = 2)=>{
    try {
        if (msg.message?.from?.is_bot == true) return
        if (msg.message?.chat.type != "supergroup") return
        if (getGroup(msg.message?.chat.id) == undefined) return
        if (getUser(msg.message?.chat.id, msg.message?.from.id) == undefined) return
        if (getUser(msg.message?.chat.id, msg.message?.from.id).rank < adminLevel) return
        return true
    } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}

let adminLangCommand = async (msg:Context) => {
    try {
        if (await allowedToUse(msg) != true) return
        const what = msg.message?.text?.replace(/\/?(lang) /i, "").toLocaleLowerCase()
        if (what == "fa" || what == "en") {
            await changeGroupInfo(msg.message?.chat.id,"lang",what)
            await msg.reply(texts[`${what}-changedLang`], {
                reply_to_message_id: msg.message?.message_id,
                allow_sending_without_reply: true
            })
        }
    } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}

let adminBanCommand = async (msg:Context) => {
    try {
        if (await allowedToUse(msg) != true) return
        let lang = getGroup(msg.message.chat.id).lang
        let me = await bot.api.getChatMember(msg.message.chat.id,_botID)
        if (me.status != "administrator" || me.can_restrict_members == false) {
            await msg.reply(texts[`${lang}-donthavePerm`],{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true
            })
            return
        }
        let uid = Number(await getTargetUserid(msg,new RegExp(/\/?(ban|unban|بن|آنبن|انبن|ان بن) /,"i")))

        if (uid == undefined) return
        let u = getUser(msg.message.chat.id,uid)
        if (u != undefined && u.rank > 0) {
            try {
                await msg.reply(texts[`${lang}-donthavePerm`],{
                    reply_to_message_id:msg.message.message_id,
                    allow_sending_without_reply:true
                })
            } catch (error) {
                
            }
            return
        }
        try {
            let u = await bot.api.getChatMember(msg.message.chat.id,uid)
            
            let unban: any = msg.message.text.match(/\/?(unban|آنبن|انبن|ان بن)/i)
            unban = (unban != undefined && unban[0] != undefined) ? true : false
            if (unban == true) 
                await bot.api.unbanChatMember(msg.message.chat.id,uid,{
                    only_if_banned:true
                })
            else 
                await bot.api.banChatMember(msg.message.chat.id,uid,{
                    revoke_messages:true, 
                })
            await msg.reply(replaceMessage(texts[`${lang || "en"}-${unban == true ? `un` : ``}banned`],[uid,u.user.first_name,u.user.last_name , u.user.username]),{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true,
                parse_mode: "HTML"
            })
            
        } catch (error) {
            try {
                if (error instanceof GrammyError) {
                    handleGrammyError(msg,error,lang)
                }else 
                    await msg.reply("Error...",{
                        reply_to_message_id:msg.message.message_id,
                        allow_sending_without_reply:true
                    })
            } catch (error) {
                if (process.env.MODE == "production") {
                    return
                }
                console.log(error)
            }
            if (process.env.MODE == "production") {
                return
            }
            console.log(error)
            return    
        }
    } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}

let adminKickCommand = async (msg:Context) => {
    try {
        if (await allowedToUse(msg) != true) return
        let lang = getGroup(msg.message.chat.id).lang
        let me = await bot.api.getChatMember(msg.message.chat.id,_botID)
        if (me.status != "administrator" || me.can_restrict_members == false) {
            await msg.reply(texts[`${lang}-donthavePerm`],{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true
            })
            return
        }
        let uid = Number(await getTargetUserid(msg,new RegExp(/\/?(remove|kick|اخراج) /,"i")))

        if (uid == undefined) return
        let u = getUser(msg.message.chat.id,uid)
        if (u != undefined && u.rank > 0) {
            try {
                await msg.reply(texts[`${lang}-donthavePerm`],{
                    reply_to_message_id:msg.message.message_id,
                    allow_sending_without_reply:true
                })
            } catch (error) {
                
            }
            return
        }
        try {
            let u = await bot.api.getChatMember(msg.message.chat.id,uid)
            
            await bot.api.banChatMember(msg.message.chat.id,uid,{
                until_date: 32
            })
            
            await msg.reply(replaceMessage(texts[`${lang || "en"}-kicked`],[uid,u.user.first_name,u.user.last_name , u.user.username]),{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true,
                parse_mode: "HTML"
            })
            
        } catch (error) {
            try {
                if (error instanceof GrammyError) {
                    try {
                        handleGrammyError(msg,error,lang)
                        return
                    } catch (error) {
                        
                    }
                }else 
                    await msg.reply("Error...",{
                        reply_to_message_id:msg.message.message_id,
                        allow_sending_without_reply:true
                    })
            } catch (error) {
                if (process.env.MODE == "production") {
                    return
                }
                console.log(error)
            }
            if (process.env.MODE == "production") {
                return
            }
            console.log(error)
            return    
        }
    } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}
let adminVipCommand = async (msg:Context) => {
    try {
        if (await allowedToUse(msg) != true) return
        let lang = getGroup(msg.message.chat.id).lang
        let me = await bot.api.getChatMember(msg.message.chat.id,_botID)
        if (me.status != "administrator") {
            await msg.reply(texts[`${lang}-donthavePerm`],{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true
            })
            return
        }
        let uid = Number(await getTargetUserid(msg,new RegExp(/\/?(vip|setvip|unvip|ویژه|حذف ویژه) /,"i")))
        if (uid == undefined) return
        let u = getUser(msg.message.chat.id,uid)
        let demote: any = msg.message.text.match(/\/?(unvip|حذف ویژه)/i)
            demote = (demote != undefined && demote[0] != undefined) ? true : false    
        if (u != undefined) {
            let dontreturn : boolean = false
            if (demote == true && u.rank == 1) dontreturn = true
            else if (demote == false && u.rank == 0) dontreturn = true
            if (dontreturn == false) {
                try {
                    await msg.reply(texts[`${lang}-donthavePerm`],{
                        reply_to_message_id:msg.message.message_id,
                        allow_sending_without_reply:true
                    })
                } catch (error) {
                    
                }
                
                return    
            }
            
        }
        try {
            let u = await bot.api.getChatMember(msg.message.chat.id,uid)
            
            
            await changeUserInfo(msg.message.chat.id.toString(),uid.toString(),"rank",demote == true ? 0 : 1)
            
            await msg.reply(replaceMessage(texts[`${lang || "en"}-${demote == true ? `demote` : `promote`}`],[uid,u.user.first_name,u.user.last_name , u.user.username,"VIP"]),{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true,
                parse_mode: "HTML"
            })
            
        } catch (error) {
            try {
                if (error instanceof GrammyError) {
                    try {
                        handleGrammyError(msg,error,lang)
                        return
                    } catch (error) {
                        
                    }
                }else 
                    await msg.reply("Error...",{
                        reply_to_message_id:msg.message.message_id,
                        allow_sending_without_reply:true
                    })
            } catch (error) {
                if (process.env.MODE == "production") {
                    return
                }
                console.log(error)
            }
            if (process.env.MODE == "production") {
                return
            }
            console.log(error)
            return    
        }
    } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}

let adminAdminCommand = async (msg:Context) => {
    try {
        if (await allowedToUse(msg,3) != true) return
        let lang = getGroup(msg.message.chat.id).lang
        let me = await bot.api.getChatMember(msg.message.chat.id,_botID)
        if (me.status != "administrator") {
            await msg.reply(texts[`${lang}-donthavePerm`],{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true
            })
            return
        }
        let newRank: any = msg.message.text.match(/\/?(setowner|مالک)/i)
        let myRank = getUser(msg.message?.chat.id, msg.message?.from.id).rank
        newRank = (newRank != undefined && newRank[0] != undefined) ? 3 : 2
        let uid = Number(await getTargetUserid(msg,new RegExp(/\/?(promote|setadmin|demote|setowner|مالک|حذف مالک|مدیر|حذف مدیر) /,"i")))
        if (uid == undefined) return
        let target = await bot.api.getChatMember(msg.message.chat.id,uid)
        let u = getUser(msg.message.chat.id,uid)
        let demote: any = msg.message.text.match(/\/?(demote|حذف مدیر|حذف مالک)/i)
            demote = (demote != undefined && demote[0] != undefined) ? true : false    
        if (u != undefined) {
            
            let dontreturn : boolean = false
            if (demote == true && u.rank > 1 && u.rank <= myRank && target.status != "creator") dontreturn = true
            else if (demote == false && u.rank < 2) dontreturn = true
            if (dontreturn == false) {
                try {
                    await msg.reply(texts[`${lang}-donthavePerm`],{
                        reply_to_message_id:msg.message.message_id,
                        allow_sending_without_reply:true
                    })
                } catch (error) {
                    
                }
                
                return    
            }
            
        }
        try {
            let u = await bot.api.getChatMember(msg.message.chat.id,uid)
            
            
            await changeUserInfo(msg.message.chat.id.toString(),uid.toString(),"rank",demote == true ? 0 : newRank)
            
            await msg.reply(replaceMessage(texts[`${lang || "en"}-${demote == true ? `demote` : `promote`}`],[uid,u.user.first_name,u.user.last_name , u.user.username,newRank == 2 ? "Admin" : "Owner"]),{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true,
                parse_mode: "HTML"
            })
            
        } catch (error) {
            try {
                if (error instanceof GrammyError) {
                    try {
                        handleGrammyError(msg,error,lang)
                        return
                    } catch (error) {
                        
                    }
                }else 
                    await msg.reply("Error...",{
                        reply_to_message_id:msg.message.message_id,
                        allow_sending_without_reply:true
                    })
                    if (process.env.MODE == "production") {
                        return
                    }
            } catch (error) {
                if (process.env.MODE == "production") {
                    return
                }
                console.log(error)
            }
            if (process.env.MODE == "production") {
                return
            }
            console.log(error)
            return    
        }
    } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}


let adminWarnCommand = async (msg:Context) => {
    try {
        if (await allowedToUse(msg,2) != true) return
        let lang = getGroup(msg.message.chat.id).lang
        let me = await bot.api.getChatMember(msg.message.chat.id,_botID)
        if (me.status != "administrator" || me.can_restrict_members == false) {
            await msg.reply(texts[`${lang}-donthavePerm`],{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true
            })
            return
        }
        let uid = Number(await getTargetUserid(msg,new RegExp(/\/?(warn|unwarn|وارن|حذف وارن) /,"i")))

        if (uid == undefined) return
        let u = getUser(msg.message.chat.id,uid)
        let _warns = u.warns
        let removewarn: any = msg.message.text.match(/\/?(unwarn|حذف وارن)/i)
            removewarn = (removewarn != undefined && removewarn[0] != undefined) ? true : false
        if (removewarn == true && _warns == 0) {
            try {
                await msg.reply(texts[`${lang}-doesntHaveWarn`],{
                    reply_to_message_id:msg.message.message_id,
                    allow_sending_without_reply:true
                })
            } catch (error) {
                
            }
        } 
        if (u != undefined && u.rank > 0) {
            try {
                await msg.reply(texts[`${lang}-donthavePerm`],{
                    reply_to_message_id:msg.message.message_id,
                    allow_sending_without_reply:true
                })
            } catch (error) {
                
            }
            return
        }
        try {
            let u = await bot.api.getChatMember(msg.message.chat.id,uid)
            if (removewarn == false) {
                if (_warns == 2) {
                    await changeUserInfo(msg.message.chat.id,uid,"warns",0)
                    await bot.api.banChatMember(msg.message.chat.id,uid)
                }else {
                    await changeUserInfo(msg.message.chat.id,uid,"warns",_warns + 1)
                }
            }else {
                await changeUserInfo(msg.message.chat.id,uid,"warns",0)
            }
            
            
            await msg.reply(replaceMessage(texts[`${lang || "en"}-warn${removewarn == true ? `Removed` : (_warns > 1 ? `Max` : `Given`)}`],[uid,u.user.first_name,u.user.last_name , u.user.username,_warns + 1]),{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true,
                parse_mode: "HTML"
            })
            
        } catch (error) {
            try {
                if (error instanceof GrammyError) {
                    try {
                        handleGrammyError(msg,error,lang)
                        return
                    } catch (error) {
                        
                    }
                }else 
                    await msg.reply("Error...",{
                        reply_to_message_id:msg.message.message_id,
                        allow_sending_without_reply:true
                    })
            } catch (error) {
                if (process.env.MODE == "production") {
                    return
                }
                console.log(error)
            }
            if (process.env.MODE == "production") {
                return
            }
            console.log(error)
            return    
        }
    } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}


let adminConfigCommand = async (msg:Context) => {
    try {
        if (await allowedToUse(msg,3) != true) return
        let lang = getGroup(msg.message.chat.id).lang
        let me = await bot.api.getChatMember(msg.message.chat.id,_botID)
        if (me.status != "administrator" || me.can_restrict_members == false) {
            await msg.reply(texts[`${lang}-donthavePerm`],{
                reply_to_message_id:msg.message.message_id,
                allow_sending_without_reply:true
            })
            return
        }
        const admins = await bot.api.getChatAdministrators(msg.message.chat.id)
        const res = await clearAdmins(msg.message.chat.id.toString())
        if (res == false) throw new Error("clearAdmins Failed")
        let list = []
        console.log(admins)
        for (const admin of admins) {
           let r = getUser(msg.message.chat.id,admin.user.id)
           if (r != undefined && r.rank == 4) {continue}
           if (admin.user.is_bot == true) continue
           if (r == undefined) await checkUser(msg.message.chat.id,admin.user.id,admin.status == "creator")
           try {
            if (admin.status == "administrator") 
                {
                    await changeUserInfo(msg.message.chat.id,admin.user.id,"rank",2)
                    list.push(admin.user)
                }
            else if (admin.status == "creator")
                {
                    await changeUserInfo(msg.message.chat.id,admin.user.id,"rank",3)
                    list.push(admin.user)
                }
           } catch (error) {
               
           }
       }
       console.log(list)
       await msg.reply(replaceMessage(texts[`${lang}-configCompleted`],[list.length]),{
           reply_to_message_id:msg.message.message_id,
           allow_sending_without_reply:true
       })
    } catch (error) {
        if (process.env.MODE == "production") {
            return
        }
        console.log(error)
        return
    }
}

export const adminComposer =  new Composer()
adminComposer.hears(/^\/?(lang)(?: (.+))?$/i, adminLangCommand)
adminComposer.hears(/^\/?(ban|unban|بن|آنبن|انبن|ان بن)(?: (.+))?$/i, adminBanCommand)
adminComposer.hears(/^\/?(remove|kick|اخراج)(?: (.+))?$/i, adminKickCommand)
adminComposer.hears(/^\/?(vip|setvip|unvip|ویژه|حذف ویژه)(?: (.+))?$/i, adminVipCommand)
adminComposer.hears(/^\/?(promote|setadmin|demote|setowner|مالک|حذف مالک|مدیر|حذف مدیر)(?: (.+))?$/i, adminAdminCommand)
adminComposer.hears(/^\/?(warn|unwarn|وارن|حذف وارن)(?: (.+))?$/i, adminWarnCommand)
adminComposer.hears(/^\/?(config|پیکربندی|کانفیگ)$/i, adminConfigCommand)
    

