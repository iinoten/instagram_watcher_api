import * as admin from "firebase-admin"
import { resolve } from "path"

const serviceAccount = require("../firebase-test-serviceAccount.json")

export type Logs = {
    follower: string[],
    timestamp: admin.firestore.Timestamp
}

interface FollowerDatas {
    "follower-log": Logs[]
}

export type returnFFData = {
    isExistIDsData: boolean,
    newers: string[],
    leavers: string[],
    followersLogs: Logs[]
}

// 初期化を一度だけ行う
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

export default class FireStoreController {
    private checkCompareIDArray = (oldArray: string[], newArray: string[]): {leavers: string[], newers: string[]} => {
        let tmpLeaversList:string[] = []
        let tmpNewersList:string[] = []

        // リスト内にIDが存在しなければリストに追加
        const addIDToTmpNewersList = (id:string) => {
            if(!tmpNewersList.includes(id)) tmpNewersList.push(id)
        }
        const addIDToTmpLeaversList = (id:string) => {
            if(!tmpLeaversList.includes(id)) tmpLeaversList.push(id)
        }

        oldArray.map( oldID => {
            console.log(oldID)
            if(!newArray.includes(oldID)) addIDToTmpLeaversList(oldID)
        } )
        newArray.map( newID => {
            if(!oldArray.includes(newID)) addIDToTmpNewersList(newID)
        } )

        return({leavers: tmpLeaversList, newers: tmpNewersList})
    }
    
    updateFollowersData = (id: string, newFollowerLog: Logs): Promise<returnFFData> => {
        // 複数回のクラッシュ 
        console.log(`oi: ${newFollowerLog.follower}`);
        const db = admin.firestore();
        const doc = db.collection('users').doc(id);
        return new Promise<returnFFData>((resolve, reject) => {
          doc.get().then((snapshot) => {
            const d = snapshot.data() as FollowerDatas;
            const recentFollowersLog = d["follower-log"]?.[d["follower-log"].length - 1];
            const followersLogs: Logs[] = Array.isArray(d["follower-log"]) ? d["follower-log"] : [];
            followersLogs.push({ follower: newFollowerLog.follower, timestamp: admin.firestore.Timestamp.now() });
            const { leavers, newers } = this.checkCompareIDArray(recentFollowersLog?.follower, newFollowerLog.follower);
            doc.set({ "follower-log": followersLogs });
            resolve({
              isExistIDsData: true,
              newers,
              leavers,
              followersLogs,
            });
          }).catch(err => {
            doc.set({ "follower-log": [{ follower: newFollowerLog.follower, timestamp: admin.firestore.Timestamp.now() }] });
            console.log("エラー");
            console.log(err);
            resolve({
              isExistIDsData: false,
              newers: [],
              leavers: [],
              followersLogs: [newFollowerLog]
            }) as unknown as returnFFData;
          });
        });
      };
}
