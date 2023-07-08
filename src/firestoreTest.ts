import * as admin from "firebase-admin"

const serviceAccount = require("../firebase-test-serviceAccount.json")

type Logs = {
    follower: string[],
    timestamp: admin.firestore.Timestamp
}

interface FollowerDatas {
    "follower-log": Logs[]
}



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

