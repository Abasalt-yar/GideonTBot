import {Schema} from 'mongoose';

export interface IGroupSchema {
    gid: string,
    locks: string,
    lang: string,
    ownerid: string
}


export let GroupSchema = new Schema<IGroupSchema>({
    gid: {
        type: String,
        unique:true
    },
    locks: {
        type: String,
        default: JSON.stringify({})
    },
    lang: {
        type: String,
        default: "fa"
    },
    ownerid: {
        type: String
    }
    

},{
    collection: "groups"
})
