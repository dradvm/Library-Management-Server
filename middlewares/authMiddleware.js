const { getTokenFormReq, generateAccessToken, generateDataUser } = require("../utils/token")
const nhanVienModel = require("../models/NhanVienModel")
const docGiaModel = require("../models/DocGiaModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const authMiddleware = async (req, res, next) => {
    accessToken = getTokenFormReq(req)
    const isManager = req.headers['ismanager'] === 'true'
    const notLogin = req.headers['notlogin'] === 'true'
    if (!true) {
        next()
    }
    else if (accessToken) {
        jwt.verify(accessToken, process.env.SERCETKEYACCESSTOKEN, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    user = generateDataUser(jwt.decode(accessToken), isManager)
                    var model
                    var condition
                    if (isManager) {
                        model = nhanVienModel
                        condition = { msNV: user.msNV }
                    }
                    else {
                        model = docGiaModel
                        condition = { maDocGia: user.maDocGia }
                    }
                    model.findOne(condition)
                        .then((data) => {
                            if (!data.refreshToken) {
                                return res.status(401).json({ message: "Refresh Token Missing" })
                            }
                            jwt.verify(data.refreshToken, process.env.SERCETKEYREFRESHTOKEN, (err) => {
                                if (err || data.refreshToken != req.cookies.refreshToken) {
                                    return res.status(440).json({ message: "Token hết hạn" })
                                }
                                else {
                                    newAccessToken = generateAccessToken(user)
                                    res.setHeader("newAccessToken", newAccessToken)
                                    return next()
                                }
                            })
                        })
                        .catch((err) => res.status(500))
                }
                else {
                    return res.status(440).json({ message: "Invalid token" })
                }
            }
            else {
                res.setHeader("newAccessToken", null)
                return next()
            }
        })
    }
    else {
        if (notLogin) {
            res.setHeader("newAccessToken", null)
            return next()
        }
        else {
            res.status(440).json({ message: "Not allow" })
        }
    }
}

module.exports = authMiddleware