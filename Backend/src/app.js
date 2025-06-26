import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public"))
app.use(cookieparser())



import patientRouter from "./routes/patient.route.js"
import doctorRouter from "./routes/doctor.route.js"
import adminRouter from "./routes/admin.route.js"


app.use("/api/v1/patient",patientRouter)
app.use("/api/v1/doctor",doctorRouter)
app.use("/api/v1/admin",adminRouter)

export { app }
