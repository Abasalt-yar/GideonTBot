import {Error, model} from 'mongoose';

import {
    GroupSchema,IGroupSchema
} from "../Database/groups.js"
const GpModel = model<IGroupSchema>("groups", GroupSchema)

let Groups: {[index:string]:IGroupSchema} = {}

export const getGroups = ()=>{
    return Groups
}

const fetchGroups = async () => {
    console.log("Called")
    GpModel.find(async (err, res: undefined | Array<IGroupSchema>) => {
        if (err) {
            console.log(err)
            process.exit(1)
        }
        res.forEach((gp: IGroupSchema) => {
            Groups[gp.gid] = gp
        })
        console.log(`Groups Loaded | Count: ${Object.keys(Groups).length} Groups(s) `)
    })
}




async function checkGroup(gid: number | string,uid: number | string | undefined) {

    return new Promise(async (res, rej) => {
        if (gid == "") {rej(new Error(`Given parameter Is ''`));return}
        if (Groups[gid.toString()] != undefined) {
            if (uid != undefined && Groups[gid.toString()].ownerid != uid.toString()) {
                try {
                    await GpModel.updateOne({
                        gid: gid.toString()
                    },{
                        ownerid: uid.toString()
                    })
                } catch (error) {
                    rej(error)
                    return
                }
            }
            res(true);
            return
        }
        try {
            GpModel.create({
                gid: gid.toString(),
                ownerid: uid.toString()
            }).then((d) => {
                Groups[gid.toString()] = d
                res(true)
            }).catch((e) => {
                rej(e)
            })
        } catch (error) {
            rej(error)
        }
    })
}

function getGroup(gid: number | string) {
    if (gid == "") {return}
    return Groups[gid]
}

function changeGroupInfo(gid: number | string, what: string, value: any) {
    return new Promise(async (res, rej): Promise<any> => {
        if (gid == "") {rej(new Error(`Given parameter Is ''`));return}
        if (Groups[gid] == undefined) {
            rej(undefined);
            return 
        }
        if (Groups[gid][what] == undefined) {
            rej(`Unknown Index ${what} | ${value}`);
            return 
        }
        let dataToUpdate: {[index:string]:any} = {}
        dataToUpdate[what] = value
        let old = Groups[gid][what]
        try {

            Groups[gid][what] = value
            await GpModel.updateOne({
                gid: gid.toString()
            }, dataToUpdate)
            res(true)
        } catch (error) {
            try {
                Groups[gid][what] = old
            } catch (error) {

            }
            rej(error)
        }
    })
}

export {
    fetchGroups,
    checkGroup,
    getGroup,
    changeGroupInfo
}