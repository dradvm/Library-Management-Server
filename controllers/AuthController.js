const nhanVienModel = require("../models/NhanVienModel")
const docGiaModel = require("../models/DocGiaModel")
const bcrypt = require("bcrypt")
const { generateRefreshToken, generateAccessToken, generateDataUser } = require("../utils/token")
require("dotenv").config()

const AuthController = {
    loginEmployee: async (req, res) => {
        const userLogin = req.body
        nhanVienModel.findOne({
            msNV: userLogin.msNV
        })
            .then((data) => {
                if (!data) {
                    res.status(401).json({ message: "Nhân viên không tồn tại" })
                    return null
                }
                return bcrypt.compare(userLogin.password, data.password).then((check) => {
                    if (check) {
                        return data
                    }
                    else {
                        res.status(401).json({ message: "Mã số nhân viên hoặc mật khẩu không đúng" })
                        return null
                    }
                })
            })

            .then((userData) => {
                if (userData) {
                    return nhanVienModel.findByIdAndUpdate(userData._id, {
                        refreshToken: generateRefreshToken(generateDataUser(userData, true))
                    }, { new: true })
                }
                else {
                    return null
                }

            })
            .then((userData) => {
                if (userData) {
                    res.cookie('refreshToken', userData.refreshToken, {
                        httpOnly: true,
                        sameSite: 'Strict',
                        maxAge: 24 * 60 * 60 * 1000
                    });
                    return res.status(200).json(generateAccessToken(generateDataUser(userData, true)))
                }
            })
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    login: async (req, res) => {
        const userLogin = req.body
        docGiaModel.findOne({
            email: userLogin.email
        })
            .then((data) => {
                if (!data) {
                    res.status(401).json({ message: "Email chưa được đăng ký" })
                    return null
                }
                return bcrypt.compare(userLogin.password, data.password).then((check) => {
                    if (check) {
                        return data
                    }
                    else {
                        res.status(401).json({ message: "Email hoặc mật khẩu không đúng" })
                        return null
                    }
                })
            })

            .then((userData) => {
                if (userData) {
                    return docGiaModel.findByIdAndUpdate(userData._id, {
                        refreshToken: generateRefreshToken(generateDataUser(userData, false))
                    }, { new: true })
                }
                else {
                    return null
                }

            })
            .then((userData) => {
                if (userData) {
                    res.cookie('refreshToken', userData.refreshToken, {
                        httpOnly: true,
                        sameSite: 'Strict',
                        maxAge: 24 * 60 * 60 * 1000
                    });
                    return res.status(200).json(generateAccessToken(generateDataUser(userData, false)))
                }
            })
            .catch((err) => res.status(500).json({ message: err.message }))
    },
    register: async (req, res) => {
        const docGia = req.body
        if (docGia.phai == "Male") {
            docGia.phai = true
        }
        else {
            docGia.phai = false
        }
        docGia.ngaySinh = new Date(docGia.ngaySinh)
        docGiaModel.exists({ email: docGia.email })
            .then((exist) => {
                if (exist) {
                    res.status(409).json({ message: "Email đã được đăng ký" })
                    return null
                }
                else {
                    return docGiaModel.find({})
                }
            })
            .then((data) => {
                if (data) {
                    return Math.max(...data.map((item) => parseInt(item.maDocGia.replace("DG", ""))))
                }
                else {
                    return null
                }
            })
            .then((data) => {
                if (data) {
                    data = (data === -Infinity || data === Infinity) ? 1 : (data + 1)
                    const newMaDocGia = `DG${data.toString().padStart(7, "0")}`
                    return docGiaModel.create({
                        maDocGia: newMaDocGia,
                        ...req.body
                    })
                }
                else {
                    return null
                }
            })
            .then((data) => {
                if (data) {
                    res.status(200).json({ message: "Đăng ký thành công" })
                }
            })
            .catch((err) => {
                console.log(err.message)
                res.status(500).json({ message: err.message })
            })
    }
}
module.exports = AuthController
