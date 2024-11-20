const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const nhanVienSchema = new mongoose.Schema({
    msNV: {
        type: String,
        require: true,
        unique: true
    },
    hoTenNV: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    chucVu: {
        type: String,
        enum: ["ADMIN", "Nhân viên"],
        require: true
    },
    diaChi: {
        type: String,
        require: true
    },
    soDienThoai: {
        type: String,
        require: true
    },
    refreshToken: {
        type: String,
        default: null
    },
    hinhAnh: {
        type: String,
        require: true
    },
    duongDanHinhAnh: {
        type: String,
        require: true
    },
    hinhAnhHetHan: {
        type: Date,
        require: true,
        default: Date()
    }
})


nhanVienSchema.pre("save", async function (next) {
    const user = this
    if (!user.isModified("password")) {
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    next()
})


module.exports = mongoose.model("NhanVien", nhanVienSchema)