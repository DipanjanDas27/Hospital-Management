import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import cookieparser from "cookie-parser"


const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
   global.io=io

   io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', ({ username, role }) => {
    if (!username || !role) return;
 
    if (role === 'admin') {
      socket.join(`admin`);
    } else if (role === 'doctor') {
      socket.join(`doctor:${username}`);
    } else if (role === 'patient') {
      socket.join(`patient:${username}`);
    }
    console.log(`${role} ${username} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});





app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public"))
app.use(cookieparser())

import patientRouter from "./routes/patient.route.js"
import doctorRouter from "./routes/doctor.route.js"
import adminRouter from "./routes/admin.route.js"
import appointmentRouter from "./routes/appointment.route.js"

app.use("/api/v1/patient", patientRouter)
app.use("/api/v1/doctor", doctorRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/patient/appointments", appointmentRouter)


export { app }
