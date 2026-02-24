import { Router } from "express";
import {
  createAppointment,
  cancelappointment,
  updateappointment,
  getappointment,
  getallappointmentforpatient,
  checkavailability,
} from "../controllers/appointment.controller.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/availability", verifyAuth, checkavailability);
router.get("/", verifyAuth, getallappointmentforpatient);
router.post("/book-appointment/:doctorid", verifyAuth, createAppointment);
router.post("/cancelAppointment/:appointmentid", verifyAuth, cancelappointment);
router.patch("/updateappointment/:appointmentid", verifyAuth, updateappointment);
router.get("/:appointmentid", verifyAuth, getappointment);

export default router;