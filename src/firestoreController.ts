import * as admin from "firebase-admin"

const serviceAccount = require("../firebase-test-serviceAccount.json")

type Logs = {
    follower: string[],
    timestamp: admin.firestore.Timestamp
}

interface FollowerDatas {
    "follower-log": Logs[]
}


/*

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
db.collection('users').doc('leg9MSQ3gipew1S3vMyw').get().then((snapshot)=>{
    const d = snapshot.data() as FollowerDatas
    console.log(d["follower-log"])
    console.log(typeof(d["follower-log"]))
    d["follower-log"].map(data => {
        console.log(`${data.timestamp.toDate()}:: ${data.follower}`)
    })
}).catch(err=>{
    console.log("エラー")
    console.log(err)
})
*/

// id
// leg9MSQ3gipew1S3vMyw
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
    
    /*
    updateFollowersData = async (id:string, newFollowerLog: Logs) => {
        const db = admin.firestore()
        await db.collection('users').doc(id).get().then((snapshot)=>{
            const d = snapshot.data() as FollowerDatas
            console.log(d["follower-log"])
            console.log(typeof(d["follower-log"]))
            const recentFollowersLog = d["follower-log"][-1]
            const newFollowersLogs = [...d["follower-log"], newFollowerLog]
        }).catch(err=>{
            console.log("エラー")
            console.log(err)
        })
        let hoge = this.checkCompareStringArray([],[])
    }
    */
}