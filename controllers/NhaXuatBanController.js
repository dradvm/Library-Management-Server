const nhaXuatBanModel = require("../models/NhaXuatBanModel")

const nhaXuatBanController = {
    getAllNhaXuatBan: async (req, res) => {
        nhaXuatBanModel.find({})
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    getOneNhaXuatBanById: async (req, res) => {
        nhaXuatBanModel.findById(req.params.id)
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    getAllNhaXuatBanByFilter: async (req, res) => {
        const { keySearch, nhaXuatBanPerPage, currentPage } = req.query
        const tenNXBRegex = new RegExp(keySearch !== undefined ? keySearch : "", "i")
        const maNXBRegex = new RegExp('^[Nn][Xx][Bb]?\\d{0,3}$')
        var searchRegex
        if (maNXBRegex.test(keySearch)) {
            searchRegex = {
                maNXB: new RegExp(keySearch)
            }
        }
        else {
            searchRegex = {
                tenNXB: tenNXBRegex
            }
        }

        nhaXuatBanModel.find({})
            .then((data) => nhaXuatBanModel.find(searchRegex)
                .skip((currentPage - 1) * nhaXuatBanPerPage)
                .limit(nhaXuatBanPerPage)
            )
            .then((data) => res.status(200).json(data))
            .catch((err) => {
                res.status(500).json({ message: err.message })
            })
    },
    getPagesOfNhaXuatBan: async (req, res) => {
        const { keySearch, nhaXuatBanPerPage } = req.query
        const tenNXBRegex = new RegExp(keySearch !== undefined ? keySearch : "", "i")
        const maNXBRegex = new RegExp('^[Nn][Xx][Bb]?\\d{0,3}$')
        var searchRegex
        if (maNXBRegex.test(keySearch)) {
            searchRegex = {
                maNXB: new RegExp(keySearch)
            }
        }
        else {
            searchRegex = {
                tenNXB: tenNXBRegex
            }
        }
        nhaXuatBanModel.countDocuments(searchRegex)
            .then((data) => res.status(200).json({ count: Math.ceil(parseInt(data) / nhaXuatBanPerPage) }))
            .catch((err) => res.status(500).json(err.message))
    },
    createNhaXuatBan: async (req, res) => {
        nhaXuatBanModel.find({})
            .then((data) => Math.max(...data.map((item) => parseInt(item.maNXB.replace("NXB", "")))))
            .then((data) => {
                data = (data === -Infinity || data === Infinity) ? 1 : (data + 1)
                const newMaNXB = `NXB${data.toString().padStart(3, "0")}`
                return nhaXuatBanModel.create({
                    maNXB: newMaNXB,
                    ...req.body
                })
            })
            .then((data) => res.status(200).json({ message: "Tạo nhà xuất bản thành công!" }))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    updateNhaXuatBan: async (req, res) => {
        nhaXuatBanModel.findByIdAndUpdate(req.params.id, req.body)
            .then((data) => res.status(200).json({ message: "Cập nhật nhà xuất bản thành công!" }))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    deleteNhaXuatBan: async (req, res) => {
        nhaXuatBanModel.findByIdAndDelete(req.params.id)
            .then((data) => res.status(200).json({ message: "Xóa nhà xuất bản thành công!" }))
            .catch((err) => res.status(500).json({ message: err.message }))
    }

}

module.exports = nhaXuatBanController