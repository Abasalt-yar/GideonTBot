import { Bot, Context } from 'grammy';
import { TelegramClient } from 'telegram'
import { StringSession }  from 'telegram/sessions'
import {Logger} from "telegram/extensions";
Logger.setLevel("error")

const apiId = Number(process.env.APIID)
const apiHash = process.env.APIHASH
const client = new TelegramClient(new StringSession(''), apiId, apiHash, { connectionRetries: 5 });
export const startClient = async(bot: Bot<Context>): Promise<void> =>{
    return new Promise(async (res,rej)=>{
        try {
            await client.start({
                botAuthToken: bot.token
            });
            console.log(`Client Connected !`)
            res()
        } catch (error) {
            console.log(error)
            rej()
            process.exit(0)
            
        }
    })
    
}

export const isClientRunning = ()=>{
    return client.connected
}

export const getUserIDByUsername = async(username)=>{
    try {
        let u = await client.getEntity(username.toString())
        return u != undefined ? u.id : undefined
    } catch (error) {
        if (process.env.MODE == "production") {return}
        console.log(error)
        return
    }
}