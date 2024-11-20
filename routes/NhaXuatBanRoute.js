const express = require("express")
const router = express.Router()
const upload = require("../utils/multer")
const nhaXuatBanController = require("../controllers/NhaXuatBanController")

router.get("/", nhaXuatBanController.getAllNhaXuatBan)
router.post("/create", nhaXuatBanController.createNhaXuatBan)
router.patch("/update/:id", nhaXuatBanController.updateNhaXuatBan)
router.delete("/delete/:id", nhaXuatBanController.deleteNhaXuatBan)
router.get("/search/:id", nhaXuatBanController.getOneNhaXuatBanById)
router.get("/search", nhaXuatBanController.getAllNhaXuatBanByFilter)
router.get("/pages", nhaXuatBanController.getPagesOfNhaXuatBan)




module.exports = router