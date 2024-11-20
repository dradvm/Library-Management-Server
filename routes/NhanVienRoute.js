const express = require("express")
const router = express.Router()
const nhanVienController = require("../controllers/NhanVienController")
const upload = require("../utils/multer")

router.get("/", nhanVienController.getAllNhanVien)
router.post("/create", upload.single("hinhAnh"), nhanVienController.createNhanVien)
router.patch("/update/:id", upload.single("hinhAnh"), nhanVienController.updateNhanVien)
router.delete("/delete/:id", nhanVienController.deleteNhanVien)
router.get("/search", nhanVienController.getAllNhanVienByFilter)
router.get("/pages", nhanVienController.getPagesOfNhanVien)
router.get("/searchByMSNV/:msNV", nhanVienController.getNhanVienByMSNV)
router.get("/enumChucVuValues", nhanVienController.getEnumChucVuValues)
module.exports = router