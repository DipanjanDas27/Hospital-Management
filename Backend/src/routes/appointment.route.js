import { Router } from "express";
import { verifypatient } from "../middlewares/patientauth.middleware.js";
import { createAppointment,cancelappointment,updateappointment,getappointment,getallappointmentforpatient,checkavailability } from "../controllers/appointment.controller.js";
const router = Router()


router.route("/availability").get(verifypatient, checkavailability);
router.route("/").get(verifypatient, getallappointmentforpatient)
router.route("/book-appointment/:doctorid").post(verifypatient, createAppointment);
router.route("/cancelAppointment/:appointmentid").post(verifypatient, cancelappointment);
router.route("/updateappointment/:appointmentid").patch(verifypatient, updateappointment);
router.route("/:appointmentid").get(verifypatient, getappointment)


export default router