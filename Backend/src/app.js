import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
import { apiError } from "./utils/apiError.js"


const app = express()
const allowedOrigins = [
    process.env.CORS_ORIGIN_DOCTOR,
    process.env.CORS_ORIGIN_PATIENT,
    process.env.CORS_ORIGIN_ADMIN,
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); // allow Postman/localhost
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

app.use("/api/v1/patient", patientRouter)
app.use("/api/v1/doctor", doctorRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/patient/appointments", appointmentRouter)

app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});



app.use((err, req, res, next) => {
    console.error("Error caught by middleware:", err);

    if (err instanceof apiError) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Something went wrong",
            errors: err.errors || [],
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

export { app }
export default app;
