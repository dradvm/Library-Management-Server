const express = require("express")
const router = express.Router()
const theoDoiMuonSachController = require("../controllers/TheoDoiMuonSachController")

router.get("/", theoDoiMuonSachController.getAllTheoDoiMuonSach)
router.get("/byDocGia", theoDoiMuonSachController.getAllTheoDoiMuonSachByDocGia)
// router.get("/waitingConfirm", theoDoiMuonSachController.getAllTheoDoiMuonSachWaitingConfirm)
router.get("/pages", theoDoiMuonSachController.getPagesOfTheoDoiMuonSach)
router.get("/pagesByDocGia", theoDoiMuonSachController.getPagesOfTheoDoiMuonSachByDocGia)
router.post("/createMany", theoDoiMuonSachController.createTheoDoiMuonSachs)
router.post("/updateTrangThaiTheoDoiMuonSach", theoDoiMuonSachController.updateTrangThaiTheoDoiMuonSach)
router.patch("/update/:id", theoDoiMuonSachController.updateTheoDoiMuonSach)
router.delete("/delete/:id", theoDoiMuonSachController.deleteTheoDoiMuonSach)

module.exports = router