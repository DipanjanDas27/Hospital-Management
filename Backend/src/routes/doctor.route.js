import {
  registerdoctor,
  logindoctor,
  logoutdoctor,
  accesstokenrenewal,
  updatepassword,
  resetForgottenPassword,
  updateprofile,
  updateprofilepic,
  updatedocument,
  getdoctorprofiledetailsprivate,
  getCurrentDoctor,
} from "../controllers/doctor.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { verifyTempjwt } from "../middlewares/verifytempjwt.middleware.js";
import {
  sendotp,
  verifyotp,
  sendForgetPasswordOtp,
  verifyForgotPasswordOtp,
} from "../controllers/otp.controller.js";
import {
  getallappointmentfordoctor,
  getappointment,
  gettodayappointment,
  verifyappointment,
} from "../controllers/appointment.controller.js";
import {
  createprescription,
  getprescription,
  getallprescriptionsfordoctor,
  getprescriptionbyappointment,
  updateprescription,
  deleteprescription,
} from "../controllers/prescription.contorller.js";
import {
  createlabtest,
  getlabtest,
  getalllabtestsfordoctor,
  getlabtestbyprescription,
  updatelabtest,
  updatetestresults,
  verifylabtest,
  deletelabtest,
} from "../controllers/labtest.controller.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "medicaldegree", maxCount: 1 },
    { name: "profilepicture", maxCount: 1 },
    { name: "medicallicense", maxCount: 1 },
  ]),
  registerdoctor
);

router.post("/login", logindoctor);

router.post("/logout", verifyAuth, logoutdoctor);
router.patch("/update-profile", verifyAuth, updateprofile);
router.patch(
  "/update-profilepicture",
  verifyAuth,
  upload.single("profilepicture"),
  updateprofilepic
);

router.get("/profile", verifyAuth, getdoctorprofiledetailsprivate);
router.get("/get-doctor", verifyAuth, getCurrentDoctor);
router.post("/renew-access-token", accesstokenrenewal);

router.patch(
  "/update-document",
  verifyAuth,
  upload.fields([
    { name: "medicaldegree", maxCount: 1 },
    { name: "medicallicense", maxCount: 1 },
  ]),
  updatedocument
);

router.post("/update-password/send-otp", verifyAuth, sendotp);
router.post("/update-password/verify-otp", verifyAuth, verifyotp);
router.patch("/update-password", verifyAuth, updatepassword);

router.post("/forgot-password/send-otp", sendForgetPasswordOtp);
router.post("/forgot-password/verify-otp", verifyTempjwt, verifyForgotPasswordOtp);
router.patch("/forgot-password/update-password", verifyTempjwt, resetForgottenPassword);

router.get("/todayappointments", verifyAuth, gettodayappointment);
router.get("/appointments", verifyAuth, getallappointmentfordoctor);
router.post("/appointments/verify-appointment", verifyAuth, verifyappointment);
router.get("/appointments/:appointmentid", verifyAuth, getappointment);

router.get("/prescriptions", verifyAuth, getallprescriptionsfordoctor);
router.get("/prescriptions/appointment/:appointmentid", verifyAuth, getprescriptionbyappointment);
router.post("/prescriptions/:appointmentid", verifyAuth, createprescription);
router.get("/prescriptions/:prescriptionid", verifyAuth, getprescription);
router.patch("/prescriptions/:prescriptionid", verifyAuth, updateprescription);
router.delete("/prescriptions/:prescriptionid", verifyAuth, deleteprescription);

router.get("/labtests", verifyAuth, getalllabtestsfordoctor);
router.post("/labtests", verifyAuth, createlabtest);
router.get("/labtests/prescription/:prescriptionid", verifyAuth, getlabtestbyprescription);
router.patch("/labtests/:labtestid/test-results", verifyAuth, updatetestresults);
router.post("/labtests/:labtestid/verify", verifyAuth, verifylabtest);
router.get("/labtests/:labtestid", verifyAuth, getlabtest);
router.patch("/labtests/:labtestid", verifyAuth, updatelabtest);
router.delete("/labtests/:labtestid", verifyAuth, deletelabtest);

export default router;