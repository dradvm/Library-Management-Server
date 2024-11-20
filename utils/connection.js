
const mongoose = require("mongoose")
require("dotenv").config()
const sachModel = require("../models/SachModel")
const nhaXuatBanModel = require("../models/NhaXuatBanModel")
module.exports = function connection() {
    mongoose.connect(process.env.MONGODB_CONNECTION + "/" + process.env.MONGODB_DATABASE)
        .then(() => {
            console.log("Connected to database")
        })
        .catch((err) => {
            console.log(err)
            process.exit(1)
        })
}
