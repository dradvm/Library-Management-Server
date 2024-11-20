const express = require("express")
const router = express.Router()
const upload = require("../utils/multer")
const sachController = require("../controllers/SachController")

router.get("/", sachController.getAllSach)
router.post("/create", upload.single("hinhAnh"), sachController.createSach)
router.patch("/update/:id", upload.single("hinhAnh"), sachController.updateSach)
router.delete("/delete/:id", sachController.deleteSach)
router.get("/search", sachController.getAllSachByFilter)
router.get("/pages", sachController.getPagesOfSach)
router.get("/searchByMaSach/:maSach", sachController.getSachByMaSach)
router.get("/searchById/:id", sachController.getSachById)
router.get("/newMaSach", sachController.getNewMaSach)


module.exports = router