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
    "منشن": "::mention",
    "mention": "::mention",
    "photo": ":photo",
    "pic": ":photo",
    "عکس": ":photo",
    "document": ":document",
    "فایل": ":document",
    "voice": ":voice",
    "ویس": ":voice",
    "music": ":audio",
    "صدا": ":audio",
    "آهنگ": ":audio",
    "اهنگ": ":audio",
    "bot": ":new_chat_members:is_bot",
    "ربات": ":new_chat_members:is_bot",
    "entry": ":new_chat_members",
    "ورودی": ":new_chat_members",
    "forward": ":forward_date",
    "فروارد": ":forward_date",
    "contact": ":contact",
    "مخاطب": ":contact",
    "location": ":location",
    "لوکیشن": ":location",
    "استیکر": ":sticker",
    "sticker": ":sticker",
    "video": ":video",
    "ویدیو": ":video",
}

const CustomLocks = {
    "via": "C:ctx.msg.via_bot != undefined",
    "اینلاین": "C:ctx.msg.via_bot != undefined"
}

for (const [key,val] of Object.entries(locks))
    mainLocks[val] = val

for (const [key,val] of Object.entries(CustomLocks))
    mainLocks[val] = val

export {locks,mainLocks,CustomLocks}
