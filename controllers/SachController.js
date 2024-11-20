const sachModel = require("../models/SachModel")
const { uploadImageToFirebase, deleteImageFromFirebase, getNewUrlSignForAll } = require("../utils/firebase")
const randomstring = require("randomstring")



const sachController = {
    getAllSach: async (req, res) => {

        sachModel.find({})
            .then((data) => getNewUrlSignForAll(data, sachModel))
            .populate({
                path: "maNXB",
                select: "tenNXB"
            })
            .then((data) => res.status(200).json(data))
            .catch((err) => {
                res.status(500).json({ message: err.message })
            })
    },
    getAllSachByFilter: async (req, res) => {
        const { tenSach, sachPerPage, currentPage } = req.query
        const tenSachRegex = new RegExp(tenSach !== undefined ? tenSach : "", "i")
        sachModel.find({})
            .then((data) => getNewUrlSignForAll(data, sachModel))
            .then((data) => sachModel.find({
                tenSach: tenSachRegex
            }).populate({
                path: "maNXB",
                select: "tenNXB"
            })
                .skip((currentPage - 1) * sachPerPage)
                .limit(sachPerPage)
            )
            .then((data) => res.status(200).json(data))
            .catch((err) => {
                res.status(500).json({ message: err.message })
            })
    },
    getPagesOfSach: async (req, res) => {
        const { tenSach, sachPerPage } = req.query
        const tenSachRegex = new RegExp(tenSach !== undefined ? tenSach : "", "i")
        sachModel.countDocuments({
            tenSach: tenSachRegex
        })
            .then((data) => res.status(200).json({ count: Math.ceil(parseInt(data) / sachPerPage) }))
            .catch((err) => res.status(500).json(err.message))
    },
    getSachById: async (req, res) => {
        sachModel.findById(req.params.id)
            .then((data) => getNewUrlSignForAll([data], sachModel))
            .then((data) => sachModel.findById(req.params.id))
            .then((data) => res.status(200).json(data))
            .catch((err) => {
                res.status(500).json({ message: err.message })
            })
    },
    getSachByMaSach: async (req, res) => {
        sachModel.findOne({
            maSach: req.params.maSach
        })
            .populate({
                path: "maNXB",
                select: "tenNXB"
            })
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    getSachByTenSach: async (req, res) => {
        sachModel.findOne({
            tenSach: req.query.tenSach
        })
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    createSach: async (req, res) => {
        if (req.file) {
            const filePath = `Sach/${Date.now()}-${req.file.originalname}`
            uploadImageToFirebase(req.file, filePath)
                .then((data) => {
                    const sach = {
                        ...req.body,
                        ...data,
                        duongDanHinhAnh: filePath,
                    }
                    sachModel.create(sach)
                        .then((data) => res.status(200).json({ message: "Tạo sách mới thành công!" }))
                        .catch((err) => {
                            deleteImageFromFirebase(filePath)
                                .then((data) => res.status(500).json({ message: err.message }))
                                .catch((err) => res.status(500).json({ message: err.message }))
                        })
                })
                .catch((err) => {
                    res.status(500).json({ message: err.message })
                })
        }
        else {
            res.status(500).json({ message: "Không có file" })
        }
    },
    updateSach: async (req, res) => {
        if (req.file) {
            const filePath = `Sach/${Date.now()}-${req.file.originalname}`
            sachModel.findById(req.params.id)
                .then((data) => deleteImageFromFirebase(data.duongDanHinhAnh))
                .catch((err) => {
                    res.status(500).json({ message: err.message })
                })
            uploadImageToFirebase(req.file, filePath)
                .then((data) => {
                    const sach = {
                        ...req.body,
                        ...data,
                        duongDanHinhAnh: filePath,
                    }
                    sachModel.findByIdAndUpdate(req.params.id, sach)
                        .then((data) => res.status(200).json({ message: "Cập nhật sách thành công!" }))
                        .catch((err) => {
                            deleteImageFromFirebase(filePath)
                                .then((data) => res.status(500).json({ message: err.message }))
                                .catch((err) => res.status(500).json({ message: err.message }))
                        })
                })
                .catch((err) => {
                    res.status(500).json({ message: err.message })
                })
        }
        else {
            sachModel.findByIdAndUpdate(req.params.id, req.body)
                .then((data) => res.status(200).json({ message: "Cập nhật sách thành công" }))
                .catch((err) => res.status(500).json({ message: err.message }))
        }
    },
    deleteSach: async (req, res) => {
        sachModel.findByIdAndDelete(req.params.id)
            .then((data) => deleteImageFromFirebase(data.duongDanHinhAnh))
            .then((data) => res.status(200).json({ message: "Xóa sách thành công!" }))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    getNewMaSach: async (req, res) => {
        var newMaSach = null
        while (!newMaSach) {
            var maSach = randomstring.generate({
                charset: "alphanumeric",
                length: 8
            })
            var check = await sachModel.findOne({ maSach: maSach })
            if (!check) {
                newMaSach = maSach
            }
        }
        res.json(newMaSach.toUpperCase())
    },

}

module.exports = sachController