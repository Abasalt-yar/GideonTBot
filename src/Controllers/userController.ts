import { readFileSync, writeFileSync } from "fs";

const SUDO = JSON.parse(readFileSync("./Configs/sudo.json").toString());

const isSudo = (uid: string): boolean => {
  return SUDO[uid] != undefined ? true : false;
};

import { model } from "mongoose";

import { UserSchema, IUserSchema } from "../Database/users.js";

const UserModel = model<IUserSchema>("users", UserSchema);
let Users: { [index: string]: { [index: string]: IUserSchema } } = {};

export const clearAdmins = async (gid: string): Promise<boolean> => {
    try {
        for (const key2 in Users[gid]) {
            if (Users[gid][key2].rank < 4) {
                Users[gid][key2].rank = 0;
            }
        }
        await UserModel.updateMany({
            gid: gid,
            rank: {
                $lt: 4
            }
        },{
            rank: 0
        })
        return true
    } catch (error) {
        return false
    }
};

export const addSudo = async (uid: string): Promise<boolean> => {
  try {
    SUDO[uid] = true;

    for (const key in Users) {
      for (const key2 in Users[key]) {
        if (Users[key][key2].uid == uid) {
          Users[key][key2].rank = 4;
        }
      }
    }
    await UserModel.updateMany(
      {
        uid: uid,
      },
      {
        rank: 4,
      }
    );
    writeFileSync("./Configs/sudo.json", JSON.stringify(SUDO, null, 2));
    return true;
  } catch (error) {
    return false;
  }
};

const fetchUsers = async () => {
  UserModel.find(async (err, res: undefined | Array<IUserSchema>) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    res.forEach((user: IUserSchema) => {
      if (Users[user.gid] == undefined) Users[user.gid] = {};
      Users[user.gid][user.uid] = user;
    });
    console.log(`Users Loaded | Count: ${Object.keys(res).length} User(s) `);
  });
};
async function checkUser(
  gid: string | number,
  uid: string | number,
  isOwner: string | number | boolean
) {
  return new Promise(async (res, rej) => {
    if (gid == "") {
      rej(new Error(`Given parameter Is ''`));
      return;
    }
    if (Users[gid] != undefined && Users[gid][uid] != undefined) {
      res(true);
      return;
    }

    if (Users[gid] == undefined) Users[gid] = {};
    try {
      await UserModel.create({
        uid: uid,
        gid: gid,
        rank: SUDO[uid.toString()] ? 4 : isOwner == true ? 3 : 0,
      })
        .then((d) => {
          Users[gid][uid] = d;
          res(true);
        })
        .catch((e) => {
          rej(e);
        });
    } catch (error) {
      rej(error);
    }
  });
}

function changeUserInfo(
  gid: number | string,
  uid: number | string,
  what: string,
  value: any
) {
  return new Promise(async (res, rej): Promise<any> => {
    if (gid == "") {
      rej(new Error(`Given parameter Is ''`));
      return;
    }
    if (Users[gid] == undefined || Users[gid][uid] == undefined) {
      rej(`User ID: ${uid} | GP: ${gid} | undefiend`);
      return;
    }
    if (Users[gid][uid][what] == undefined) {
      rej(`Unknown Index ${what} | ${value}`);
      return;
    }

    let dataToUpdate: { [index: string]: any } = {};
    dataToUpdate[what] = value;
    let old = Users[gid][uid][what];
    try {
      Users[gid][uid][what] = value;
      await UserModel.updateOne(
        {
          gid: gid.toString(),
          uid: uid.toString(),
        },
        dataToUpdate
      );
      res(true);
    } catch (error) {
      try {
        Users[gid][uid][what] = old;
      } catch (error) {}
      rej(error);
    }
  });
}

function getUser(gid: string | number, uid: string | number) {
  if (gid == "") {
    return;
  }
  return Users[gid] == undefined ? undefined : Users[gid][uid];
}

export { fetchUsers, checkUser, getUser, changeUserInfo, isSudo };
