const mongoose = require("mongoose")

const sachSchema = new mongoose.Schema({
    maSach: {
        type: String,
        require: true,
        unique: true,
        length: [8, "Ma Sach co do dai 8 ki tu"]
    },
    tenSach: {
        type: String,
        require: true,
        minlength: [1, "Ten sachtoi thieu 1 ki tu"],
        maxlength: [200, "Ten sach toi da 200 ki tu"]
    },
    donGia: {
        type: Number,
        require: true,
        min: [0, "Don gia phai la so duong"]
    },
    soQuyen: {
        type: Number,
        require: true,
        min: [1, "So quyen toi thieu 1 quyen"]
    },
    namXuatBan: {
        type: Number,
        require: true,
        min: [0, "Nam nho nhat la 0"],
        max: [new Date().getFullYear(), `Nam lon nhat la ${new Date().getFullYear()}`]
    },
    maNXB: {
        type: mongoose.Schema.ObjectId,
        ref: "NhaXuatBan",
        require: true
    },
    tacGia: {
        type: String,
        require: true,
        minlength: [1, "Tac gia toi thieu 1 ky tu"],
        maxlength: [200, "Tac gia toi da 200 ki tu"]
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

module.exports = mongoose.model("sach", sachSchema)