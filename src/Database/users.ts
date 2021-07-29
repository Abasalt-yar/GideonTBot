import {Schema} from 'mongoose';

export interface IUserSchema {
    uid: string,
    gid: string,
    nickname: string,
    rank: number,
    warns: number,
    muted: number,
    mutetime: number,

}

export let UserSchema = new Schema<IUserSchema>({
    uid: String,
    gid: String,
    nickname: {
        type:String,
        default: ""
    },
    rank: {
        type: Number,
        default:0
    },
    warns: {
        type: Number,
        default:0
    },
    muted: {
        type: Number,
        default: 0
    },
    mutetime: {
        type: String,
        default: ""
    }
    

},{
    collection: "users"
})

