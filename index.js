const express = require("express")
const cors = require("cors")
const morgan = require("./utils/morgan")
const cookieParser = require("cookie-parser")
const connection = require("./utils/connection")
const sachRoute = require("./routes/SachRoute")
const docGiaRoute = require("./routes/DocGiaRoute")
const nhanVienRoute = require("./routes/NhanVienRoute")
const nhaXuatBanRoute = require("./routes/NhaXuatBanRoute")
const theoDoiMuonSachRoute = require("./routes/TheoDoiMuonSachRoute")
const authRoute = require("./routes/AuthRoute")
const schedule = require("./utils/nodecron")
const authMiddleware = require("./middlewares/authMiddleware")
const path = require("path")
require("dotenv").config()


const app = express()
const port = process.env.port || 3000
const router = express.Router()

router.use("/Auth", authRoute)

router.use(authMiddleware)

router.use("/Sach", sachRoute)
router.use("/NhaXuatBan", nhaXuatBanRoute)
router.use("/NhanVien", nhanVienRoute)
router.use("/DocGia", docGiaRoute)
router.use("/TheoDoiMuonSach", theoDoiMuonSachRoute)




connection()
schedule.start()
app.use(cors())
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .use(cookieParser())
    .use(morgan)
    .use("/api", router)

    .listen(port, () => {
        console.log(`Server running at port: ${port}`)
    })