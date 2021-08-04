const MODE : String = process.env.MODE?.toString() || ""
if (MODE == undefined) {
    console.error(`Use (npm start) or (npm run dev)`);
    process.exit(1);
}
import {
    config
} from "dotenv"
config({
    path: "./Configs/main.env"
})
import {
    Bot, Context
} from "grammy"
import {run} from "@grammyjs/runner"

import {MessageEntity} from "./../node_modules/@grammyjs/types/message"
import { getUserIDByUsername, startClient,isClientRunning } from "./GramJS/core"

export const bot = new Bot(MODE == "development" ? (process.env.DEVBOTTOKEN?.toString() || "") : (process.env.BOTTOKEN?.toString() || ""))

export type newMessageEntity = MessageEntity & {text?:string,userid?:number}

bot.use(async(msg:Context,next:Function)=>{
    if (isClientRunning() == false) return
    console.log(msg.message)
    if (msg.message?.entities != undefined) {
        let t = msg.message.text || msg.message.caption
        let entities: newMessageEntity[] = msg.message.entities
        for (let index = 0; index < entities.length; index++) {
            entities[index].text = t.substr(entities[index].offset,entities[index].length)
            if (entities[index].type == "mention") {
                try {
                    entities[index].userid = await getUserIDByUsername(entities[index].text)
                } catch (error) {
                    //console.log(error)   
                }
            }   
        }
        msg.message.entities = entities
    }
    next()
})


bot.hears("ping", async (msg:Context, next) => {
    if (msg.message?.from?.is_bot == true) return
    try {
        if (await allowedToUse(msg) != true && isSudo((msg.message?.chat?.id || "").toString()) == false) return
        let start = Date.now()
        let m = await msg.reply("Pong !")
        let end = Date.now()
        await bot.api.editMessageText(Number(msg.message?.chat?.id), m.message_id, `Pong ! Response Time: ${end - start} ms | Uptime: ${process.uptime().toLocaleString()}msg`)
        
    } catch (error) {
        console.log(error)
    }
    next()
})


run(bot)
export let _botID = 0

bot.api.getMe().then(async(me)=>{
    console.log(`Running As ${me.username}`)
    await bot.api.sendMessage(384934251,"Bot Started")
    _botID = me.id
}).catch((e)=>{
    console.log(e)
    process.exit(0)
})
import {
    connectDB
} from "./Database/core"
connectDB((process.env.MONGOURL?.toString() || ""))



//* Fetch Data
import {
    fetchUsers, isSudo
} from "./Controllers/userController"
fetchUsers()
import {
    fetchGroups
} from "./Controllers/gpController"
fetchGroups()

//* Load Events
import {
    GroupCoreComposer
} from "./Events/GroupEvents/core"
import {
    UserCoreComposer
} from "./Events/UserEvents/core"
import {
    lockComposer
} from "./Events/GroupEvents/locks"
import {
    allowedToUse,
    adminComposer
} from "./Events/GroupEvents/adminCommands"

import { sudoComposer } from "./Events/GroupEvents/sudoCommands";

bot.filter((ctx)=> ctx.chat?.type == "supergroup").use(GroupCoreComposer,UserCoreComposer,lockComposer,adminComposer,sudoComposer)


startClient(bot)
