const mongoose = require("mongoose")

const theoDoiMuonSach = new mongoose.Schema({
    maTheoDoiMuonSach: {
        type: String,
        require: true
    },
    maDocGia: {
        type: mongoose.Schema.ObjectId,
        ref: "DocGia",
        require: true
    },
    msNV: {
        type: mongoose.Schema.ObjectId,
        ref: "NhanVien",
    },
    ngayMuon: {
        type: Date,
        require: true,
        default: Date()
    },
    ngayTra: {
        type: Date,
        require: true
    },
    maSach: {
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: "Sach"
    },
    trangThai: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("TheoDoiMuonSach", theoDoiMuonSach)