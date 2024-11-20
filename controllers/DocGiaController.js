const docGiaModel = require("../models/DocGiaModel")

const docGiaController = {
    getAllDocGia: async (req, res) => {
        docGiaModel.find({})
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    getOneDocGiaById: async (req, res) => {
        docGiaModel.findById(req.params.id)
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    createDocGia: async (req, res) => {
        docGiaModel.create(req.body)
            .then((data) => res.status(200).json({ message: "Tạo độc giả mới thành công!" }))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    updateDocGia: async (req, res) => {
        docGiaModel.findByIdAndUpdate(req.params.id, req.body)
            .then((data) => res.status(200).json({ message: "Cập nhật độc giả thành công!" }))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    deleteDocGia: async (req, res) => {
        docGiaModel.findByIdAndDelete(req.params.id)
            .then((data) => res.status(200).json({ message: "Xóa độc giả thành công!" }))
            .catch((err) => res.status(500).json({ message: err.message }))
    }
}

module.exports = docGiaController