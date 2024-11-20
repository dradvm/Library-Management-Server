var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");
require("dotenv").config()

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGEBUCKET
});

const bucket = admin.storage().bucket()
const getSignedUrl = async (filePath) => {
    try {
        const expiredDate = new Date()
        expiredDate.setDate(expiredDate.getDate() + 3)
        const file = bucket.file(filePath)
        const signUrl = await file.getSignedUrl({
            action: 'read',
            expires: expiredDate
        })
        return {
            hinhAnh: signUrl[0],
            hinhAnhHetHan: expiredDate
        }
    }
    catch (err) {
        console.error('Error getting signed URL:', err);
    }
}


const getNewUrlSign = async (modelData, modelClass) => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    if (date >= modelData.hinhAnhHetHan) {
        getSignedUrl(modelData.duongDanHinhAnh)
            .then((data) => {
                return modelClass.findByIdAndUpdate(modelData._id, data)
            })
            .then((data) => console.log("Update!"))
            .catch((err) => res.status(500).json({ message: err.message }))
    }
}
const getNewUrlSignForAll = async (modelDataList, modelClass) => {
    modelDataList.forEach((modelData) => {
        getNewUrlSign(modelData, modelClass)
    })
    return modelClass.find({})
}

const uploadImageToFirebase = (file, filePath = "") => {
    return new Promise((resolve, reject) => {
        const blob = bucket.file(filePath)
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        })
        blobWriter.on('error', (err) => {
            reject(err)
        })
        blobWriter.on('finish', () => {
            resolve(getSignedUrl(filePath))
        })
        blobWriter.end(file.buffer)
    })
}

const deleteImageFromFirebase = async (filePath = "") => {
    const blob = bucket.file(filePath)
    blob.delete()
        .then((data) => { })
        .catch((err) => {
            console.log("A")
            console.log(err.message)
        })
}

module.exports = {
    uploadImageToFirebase,
    deleteImageFromFirebase,
    getSignedUrl,
    getNewUrlSign,
    getNewUrlSignForAll
}