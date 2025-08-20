import { Router } from "express";
import { verifypatient } from "../middlewares/patientauth.middleware";
import { createAppointment,cancelappointment,updateappointment,getappointment,getallappointmentforpatient,checkavailability } from "../controllers/appointment.controller";

const router = Router()


router.route("/availability").get(verifypatient, checkavailability);
router.route("/").get(verifypatient, getallappointmentforpatient)
router.route("/:doctorid").post(verifypatient, createAppointment);
router.route("/:appointmentid/cancel").post(verifypatient, cancelappointment);
router.route("/:appointmentid/update").patch(verifypatient, updateappointment);
router.route("/:appointmentid").get(verifypatient, getappointment)


export default router