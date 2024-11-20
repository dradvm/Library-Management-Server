const express = require("express")
const router = express.Router()
const docGiaController = require("../controllers/DocGiaController")

router.get("/", docGiaController.getAllDocGia)
router.post("/create", docGiaController.createDocGia)
router.patch("/update/:id", docGiaController.updateDocGia)
router.delete("/delete/:id", docGiaController.deleteDocGia)
router.get("/search/:id", docGiaController.getOneDocGiaById)

module.exports = router