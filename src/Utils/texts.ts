const texts : {[index:string]:any} = {
    "fa-wrongLock": `قفل وارد شده اشتباه میباشد ! برای دیدن لیست قفل ها روی دکمه زیر کلیک کنید`,
    "en-wrongLock": `Unknown lock, click button blow to enter 'Manage Locks' Menu.`,
    "fa-manageLockMenu": `لیست قفل ها`,
    "en-manageLockMenu": `Manage Locks`,
    "en-changedLang": `Language has been set to en.`,
    "fa-changedLang": `زبان با موفقیت به فارسی تغییر کرد.`,
    "fa-Locked": `شما با موفقیت (( ArgumentToReplace )) را قفل کردید.`,
    "fa-unLocked": `شما با موفقیت (( ArgumentToReplace )) را بازکردید کردید.`,
    "en-Locked": `You just locked (( ArgumentToReplace )).`,
    "en-unLocked": `You just unLocked (( ArgumentToReplace ))`,
    "en-banned": `You just banned <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a>`,
    "fa-banned": `شما یوزر <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> را بن کردید !`,
    "en-isAdmin": `This person is an admin !`,
    "fa-isAdmin": `این شخص ادمین میباشد !`,
    "en-botSelf": `You really wanna do this to me?`,
    "fa-botSelf": `واقعا میخوای اینکارو بکنی ؟`,
    "en-donthavePerm": `Sorry... I don't have access...`,
    "fa-donthavePerm": `متاسفانه من دسترسی به این کار رو نداریم...`,
    "en-unbanned": `You just unBanned <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a>`,
    "fa-unbanned": `شما یوزر <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> را آنبن کردید !`,
    "fa-sameLock": `وضعیت این قفل در حال حاظر همین میباشد !`,
    "en-sameLock": `You can't change the lock state to the same !`,
    "en-kicked": `You just removed <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a>`,
    "fa-kicked": `شما یوزر <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> را اخراج کردید !`,
    "en-userIsntInGroup": `User isn't in this group.`,
    "fa-userIsntInGroup": `کاربر در این گروه نیست.`,
    "en-promote": `You just promoted <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> to ArgumentToReplace`,
    "fa-promote": `شما یوزر <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> را به مقام ArgumentToReplace ارتقا دادید.`,
    "en-demote": `You just demoted <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> to a normal user.`,
    "fa-demote": `شما مقام <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> را گرفتید.`,
    "en-doesntHaveWarn": `Sorry... This user doesn't have any warns`,
    "fa-doesntHaveWarn": `ببخشید ولی این شخص وارنی ندارد.`,
    "fa-warnMax": `وارن های <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> 3/3 شد و بن شد !`,
    "en-warnMax": `Aha... 3/3 Warns ! <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> Banned.`,
    "fa-warnGiven": `شما به <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> یک وارن دادید. ArgumentToReplace/3.`,
    "en-warnGiven": `Ok that's it. <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> got a warn. ArgumentToReplace/3`,
    "fa-warnRemoved": `شما وارن های <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> را پاک کردید`,
    "en-warnRemoved": `Ok, <a href="tg://user?id=ArgumentToReplace">ArgumentToReplace ArgumentToReplace ArgumentToReplace</a> is clear now`,
}

function replaceMessage(text :string,args :Array<any>) {
    let i = 0;
    let a = text
    a = a.replace(/ArgumentToReplace/g,function (params) {
        let hom = i
        i++
        return args[hom] != undefined ? args[hom] : ""
    })
    return a
}


export {replaceMessage,texts}