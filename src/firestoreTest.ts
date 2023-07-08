import * as admin from "firebase-admin"

const serviceAccount = require("../firebase-test-serviceAccount.json")

type Shop = {
    followers: String[],
    timeStamp: EpochTimeStamp
}



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
db.collection('users').doc('leg9MSQ3gipew1S3vMyw').get().then((snapshot)=>{
    console.log(snapshot.data())
}).catch(err=>{
    console.log("エラー")
    console.log(err)
})

