import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"



const app = express()
const allowedOrigins = [
    process.env.CORS_ORIGIN_DOCTOR,
    process.env.CORS_ORIGIN_PATIENT,
    process.env.CORS_ORIGIN_ADMIN,
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); 
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
app.use(cookieparser())
app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public"))

import patientRouter from "./routes/patient.route.js"
import doctorRouter from "./routes/doctor.route.js"
import adminRouter from "./routes/admin.route.js"
import appointmentRouter from "./routes/appointment.route.js"
import cronRoutes from "./routes/cron.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js"
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
});

app.use(limiter);
app.use("/api/v1/patient/login", authLimiter);
app.use("/api/v1/doctor/login", authLimiter);
app.use("/api/v1/admin/login", authLimiter);


app.use("/api/v1", cronRoutes);
app.use("/api/v1/patient", patientRouter)
app.use("/api/v1/doctor", doctorRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/patient/appointments", appointmentRouter)
app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});




export { app }
export default app;
