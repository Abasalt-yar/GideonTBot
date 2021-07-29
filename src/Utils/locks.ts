const mainLocks: {[index:string]:any} = {}

import {FilterQuery} from "grammy"

const locks: {[index:string]:FilterQuery} = {
    "url": "::url",
    "link": "::url",
    "لینک": "::url",
    "گروه": "message",
    "gp": "message",
    "group": "message",
    "all": "message",
    "command": "::bot_command",
    "دستورات": "::bot_command",
}
for (const [key,val] of Object.entries(locks))
    mainLocks[val] = val

export {locks,mainLocks}
