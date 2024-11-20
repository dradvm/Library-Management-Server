const nhanVienModel = require("../models/NhanVienModel")
const { uploadImageToFirebase, deleteImageFromFirebase, getNewUrlSignForAll } = require("../utils/firebase")


const nhanVienController = {
    getAllNhanVien: async (req, res) => {
        nhanVienModel.find()
            .select("-password -refreshToken")
            .then((data) => getNewUrlSignForAll(data, nhanVienModel))
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    getNhanVienByMSNV: async (req, res) => {
        nhanVienModel.findOne({ msNV: req.params.msNV })
            .select("-password -refreshToken")
            .then((data) => res.status(200).json(data))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    getAllNhanVienByFilter: async (req, res) => {
        const { keySearch, nhanVienPerPage, currentPage } = req.query
        const hoTenNVRegex = new RegExp(keySearch !== undefined ? keySearch : "", "i")
        const msNVRegex = new RegExp('^[Nn][Vv]?\\d{0,5}$')
        var searchRegex
        if (msNVRegex.test(keySearch)) {
            searchRegex = {
                msNV: new RegExp(keySearch)
            }
        }
        else {
            searchRegex = {
                hoTenNV: hoTenNVRegex
            }
        }

        nhanVienModel.find({})
            .then((data) => getNewUrlSignForAll(data, nhanVienModel))
            .then((data) => nhanVienModel.find(searchRegex)
                .skip((currentPage - 1) * nhanVienPerPage)
                .limit(nhanVienPerPage)
            )
            .then((data) => res.status(200).json(data))
            .catch((err) => {
                res.status(500).json({ message: err.message })
            })
    },
    getPagesOfNhanVien: async (req, res) => {
        const { keySearch, nhanVienPerPage } = req.query
        const hoTenNVRegex = new RegExp(keySearch !== undefined ? keySearch : "", "i")
        const msNVRegex = new RegExp('^[Nn][Vv]?\\d{0,5}$')
        var searchRegex
        if (msNVRegex.test(keySearch)) {
            searchRegex = {
                msNV: new RegExp(keySearch)
            }
        }
        else {
            searchRegex = {
                hoTenNV: hoTenNVRegex
            }
        }
        nhanVienModel.countDocuments(searchRegex)
            .then((data) => res.status(200).json({ count: Math.ceil(parseInt(data) / nhanVienPerPage) }))
            .catch((err) => res.status(500).json(err.message))
    },
    createNhanVien: async (req, res) => {
        if (req.file) {
            const filePath = `NhanVien/${Date.now()}-${req.file.originalname}`
            uploadImageToFirebase(req.file, filePath)
                .then((data) => {
                    const nhanVien = {
                        ...req.body,
                        ...data,
                        duongDanHinhAnh: filePath,
                        msNV: "",
                        password: ""
                    }
                    const currentYear = new Date().getFullYear() - 2000
                    nhanVienModel.find({})
                        .then((data) => Math.max(...data.map((item) => parseInt(item.msNV.replace(`NV${currentYear}`, "")))))
                        .then((data) => {
                            data = (data === -Infinity || data === Infinity) ? 1 : (data + 1)
                            const newMSNV = `NV${currentYear}${data.toString().padStart(3, "0")}`
                            nhanVien.msNV = newMSNV
                            nhanVien.password = newMSNV
                            return nhanVienModel.create(nhanVien)
                        })
                        .then((data) => res.status(200).json({ message: "Tạo thành công nhân viên mới" }))
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
    updateNhanVien: async (req, res) => {
        if (req.file) {
            const filePath = `Sach/${Date.now()}-${req.file.originalname}`
            nhanVienModel.findById(req.params.id)
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
                    nhanVienModel.findByIdAndUpdate(req.params.id, sach)
                        .then((data) => res.status(200).json({ message: "Cập nhật nhân viên thành công!" }))
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
            nhanVienModel.findByIdAndUpdate(req.params.id, req.body)
                .then((data) => res.status(200).json({ message: "Cập nhật nhân viên thành công" }))
                .catch((err) => res.status(500).json({ message: err.message }))
        }
    },
    deleteNhanVien: async (req, res) => {
        nhanVienModel.findByIdAndDelete(req.params.id)
            .then((data) => res.status(200).json({ message: "Xóa nhân viên thành công" }))
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    getEnumChucVuValues: (req, res) => {
        res.status(200).json(nhanVienModel.schema.path("chucVu").enumValues)
    }
}

module.exports = nhanVienController