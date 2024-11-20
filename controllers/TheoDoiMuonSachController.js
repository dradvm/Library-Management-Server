const theoDoiMuonSachModel = require("../models/TheoDoiMuonSachModel")
const mongoose = require("mongoose");
const theoDoiMuonSachController = {
    getAllTheoDoiMuonSach: async (req, res) => {
        theoDoiMuonSachModel.find({})
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    getAllTheoDoiMuonSach: async (req, res) => {
        const { theoDoiMuonSachPerPage, currentPage, trangThais } = req.query
        theoDoiMuonSachModel.aggregate([
            {
                $match: { trangThai: { $in: trangThais } }
            },
            {
                $addFields: {
                    sortOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$trangThai", "Waiting Confirm"] }, then: 1 },
                                { case: { $eq: ["$trangThai", "Rejected"] }, then: 2 },
                                { case: { $eq: ["$trangThai", "Confirmed"] }, then: 3 },
                                { case: { $eq: ["$trangThai", "Book Returned"] }, then: 4 },
                                { case: { $eq: ["$trangThai", "Out Dated"] }, then: 5 }
                            ],
                            default: 4
                        }
                    }
                }
            },
            {

                $group: {
                    _id: ["maTheoDoiMuonSach", "maDocGia", "ngayMuon", "ngayTra", "trangThai"].reduce((acc, field) => {
                        acc[field] = `$${field}`;
                        return acc;
                    }, {}),
                    sachs: { $addToSet: "$maSach" },
                    items: { $push: "$$ROOT" }
                }
            },
            { $sort: { "items.sortOrder": 1 } },
            { $skip: parseInt((currentPage - 1) * theoDoiMuonSachPerPage) },
            { $limit: parseInt(theoDoiMuonSachPerPage) },
            {
                $project: {
                    _id: 0,
                    maTheoDoiMuonSach: "$_id.maTheoDoiMuonSach",
                    maDocGia: "$_id.maDocGia",
                    ngayMuon: "$_id.ngayMuon",
                    ngayTra: "$_id.ngayTra",
                    trangThai: "$_id.trangThai",
                    sachs: 1,
                }
            }
        ])
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))

    },
    getAllTheoDoiMuonSachByDocGia: async (req, res) => {
        const { theoDoiMuonSachPerPage, currentPage, trangThais, maDocGia } = req.query
        theoDoiMuonSachModel.aggregate([
            {
                $match: { trangThai: { $in: trangThais }, maDocGia: new mongoose.Types.ObjectId(maDocGia) }
            },
            {
                $addFields: {
                    sortOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$trangThai", "Waiting Confirm"] }, then: 1 },
                                { case: { $eq: ["$trangThai", "Rejected"] }, then: 2 },
                                { case: { $eq: ["$trangThai", "Confirmed"] }, then: 3 },
                                { case: { $eq: ["$trangThai", "Book Returned"] }, then: 4 },
                                { case: { $eq: ["$trangThai", "Out Dated"] }, then: 5 }
                            ],
                            default: 4
                        }
                    }
                }
            },
            {

                $group: {
                    _id: ["maTheoDoiMuonSach", "maDocGia", "ngayMuon", "ngayTra", "trangThai"].reduce((acc, field) => {
                        acc[field] = `$${field}`;
                        return acc;
                    }, {}),
                    sachs: { $addToSet: "$maSach" },
                    items: { $push: "$$ROOT" }
                }
            },
            { $sort: { "items.sortOrder": 1 } },
            { $skip: parseInt((currentPage - 1) * theoDoiMuonSachPerPage) },
            { $limit: parseInt(theoDoiMuonSachPerPage) },
            {
                $project: {
                    _id: 0,
                    maTheoDoiMuonSach: "$_id.maTheoDoiMuonSach",
                    maDocGia: "$_id.maDocGia",
                    ngayMuon: "$_id.ngayMuon",
                    ngayTra: "$_id.ngayTra",
                    trangThai: "$_id.trangThai",
                    sachs: 1,
                }
            }
        ])
            .then((data) => {
                res.status(200).json(data)
            })
            .catch((err) => res.status(500).json({ message: err.message }))

    },
    getPagesOfTheoDoiMuonSach: async (req, res) => {
        const { theoDoiMuonSachPerPage, trangThais } = req.query
        theoDoiMuonSachModel.aggregate([
            {
                $match: { trangThai: { $in: trangThais } }
            },
            {

                $group: {
                    _id: ["maTheoDoiMuonSach", "maDocGia", "ngayMuon", "ngayTra"].reduce((acc, field) => {
                        acc[field] = `$${field}`;
                        return acc;
                    }, {}),
                    sachs: { $addToSet: "$maSach" },
                    items: { $push: "$$ROOT" }
                }
            },
            { $sort: { _id: 1 } },
            { $count: "count" }
        ])
            .then((data) => res.status(200).json(({ count: Math.ceil(parseInt(data[0].count) / theoDoiMuonSachPerPage) })))
            .catch((err) => res.status(500).json({ message: err.message }))

    },
    getPagesOfTheoDoiMuonSachByDocGia: async (req, res) => {
        const { theoDoiMuonSachPerPage, trangThais, maDocGia } = req.query
        theoDoiMuonSachModel.aggregate([
            {
                $match: { trangThai: { $in: trangThais }, maDocGia: new mongoose.Types.ObjectId(maDocGia) }
            },
            {

                $group: {
                    _id: ["maTheoDoiMuonSach", "maDocGia", "ngayMuon", "ngayTra"].reduce((acc, field) => {
                        acc[field] = `$${field}`;
                        return acc;
                    }, {}),
                    sachs: { $addToSet: "$maSach" },
                    items: { $push: "$$ROOT" }
                }
            },
            { $sort: { _id: 1 } },
            { $count: "count" }
        ])
            .then((data) => {
                res.status(200).json(({ count: Math.ceil(parseInt(data[0].count) / theoDoiMuonSachPerPage) }))
            })
            .catch((err) => {
                res.status(500).json({ message: err.message })
            })

    },
    getTheoDoiMuonSachByMaDocGia: async (req, res) => {
        theoDoiMuonSachModel.find({
            maDocGia: req.query.maDocGia
        })
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    createTheoDoiMuonSachs: async (req, res) => {

        theoDoiMuonSachModel.find({})
            .then((data) => Math.max(...data.map((item) => parseInt(item.maTheoDoiMuonSach.replace("TDMS", "")))))
            .then((data) => {
                data = (data === -Infinity || data === Infinity) ? 1 : (data + 1)
                const newMaTDMS = `TDMS${data.toString().padStart(9, "0")}`
                const theoDoiMuonSachs = req.body.map((item) => {
                    return {
                        maTheoDoiMuonSach: newMaTDMS,
                        trangThai: "Waiting Confirm",
                        ...item
                    }
                })

                return theoDoiMuonSachModel.insertMany(theoDoiMuonSachs)
            })
            .then((data) => res.status(200).json({ message: "Tạo phiếu mượn thành công!" }))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    updateTheoDoiMuonSach: async (req, res) => {
        theoDoiMuonSachModel.findByIdAndUpdate(req.params.id, req.body)
            .then((data) => res.status(200).json("Cập nhật thành công!"))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    updateTrangThaiTheoDoiMuonSach: async (req, res) => {
        const { maTheoDoiMuonSach, trangThai, msNV } = req.body
        console.log("A")
        console.log(req.body)
        theoDoiMuonSachModel.updateMany({
            maTheoDoiMuonSach: maTheoDoiMuonSach
        }, {
            $set: {
                trangThai: trangThai,
                msNV: msNV
            }

        })
            .then((data) => res.status(200).json({ message: "Cập nhật thành công!" }))
            .catch((err) => {
                console.log(err)
                res.status(500).json({ message: err.message })
            })
    },
    deleteTheoDoiMuonSach: async (req, res) => {
        theoDoiMuonSachModel.findByIdAndDelete(req.params.id)
            .then((data) => res.status(200).json("Xóa thành công!"))
            .catch((err) => res.status(500).json({ message: err.message }))
    }
}

module.exports = theoDoiMuonSachController