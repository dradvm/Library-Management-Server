const cron = require('node-cron');
const theoDoiMuonSachModel = require('../models/TheoDoiMuonSachModel')

var schedule = cron.schedule('0 0 * * *', async () => {
    theoDoiMuonSachModel.find({
        trangThai: ["Waiting Confirm", "Confirmed"]
    })
        .then((theoDoiMuonSachs) => {
            theoDoiMuonSachs.forEach(async (theoDoiMuonSach) => {
                if (new Date() > theoDoiMuonSach.ngayTra) {
                    theoDoiMuonSach.trangThai = "Out Dated"
                    await theoDoiMuonSach.save()
                }
            })
        })
        .catch((err) => console.log(err))
}, {
    scheduled: false
});
module.exports = schedule