const mongoose = require("mongoose")

const bcrypt = require("bcrypt")
const docGiaSchema = new mongoose.Schema({
    maDocGia: {
        type: String,
        require: true,
        unique: true
    },
    hoLot: {
        type: String,
        require: true
    },
    ten: {
        type: String,
        require: true
    },
    ngaySinh: {
        type: Date,
        require: true
    },
    phai: {
        type: Boolean,
        require: true,
    },
    diaChi: {
        type: String,
        require: true
    },
    dienThoai: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    refreshToken: {
        type: String,
        default: null
    },
})

docGiaSchema.pre("save", async function (next) {
    const user = this
    if (!user.isModified("password")) {
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    next()
})

module.exports = mongoose.model("DocGia", docGiaSchema)