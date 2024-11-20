const mongoose = require("mongoose")

const nhaXuatBanSchema = new mongoose.Schema({
    maNXB: {
        type: String,
        require: true,
        unique: true
    },
    tenNXB: {
        type: String,
        require: true,
    },
    diaChi: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("NhaXuatBan", nhaXuatBanSchema)