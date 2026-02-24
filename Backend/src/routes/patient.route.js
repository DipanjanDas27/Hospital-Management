import { Router } from "express";
import {
  registerPatient,
  loginPatient,
  logoutPatient,
  updatepassword,
  updateprofile,
  resetForgottenPassword,
  accesstokenrenewal,
  getprofiledetails,
  updateprofilepic,
  getPatient,
} from "../controllers/patient.controller.js";
import {
  sendotp,
  verifyotp,
  sendForgetPasswordOtp,
  verifyForgotPasswordOtp,
} from "../controllers/otp.controller.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyTempjwt } from "../middlewares/verifytempjwt.middleware.js";
import {
  getalldoctorprofiledetails,
  getdoctorbydept,
  getdoctorprofiledetails,
} from "../controllers/doctor.controller.js";
import { getAllDepartments } from "../controllers/department.controller.js";
import {
  getprescription,
  getallprescriptionsforpatient,
  getprescriptionbyappointment,
} from "../controllers/prescription.contorller.js";
import {
  getlabtest,
  getalllabtestsforpatient,
  getlabtestbyprescription,
} from "../controllers/labtest.controller.js";

const router = Router();

router.post("/register", upload.single("profilepicture"), registerPatient);
router.post("/login", loginPatient);
router.post("/logout", verifyAuth, logoutPatient);

router.patch("/update-profile", verifyAuth, updateprofile);
router.patch("/update-profilepicture", verifyAuth, upload.single("profilepicture"), updateprofilepic);

router.get("/get-profile", verifyAuth, getprofiledetails);
router.get("/get-patient", verifyAuth, getPatient);
router.post("/renew-access-token", accesstokenrenewal);

router.post("/update-password/send-otp", verifyAuth, sendotp);
router.post("/update-password/verify-otp", verifyAuth, verifyotp);
router.patch("/update-password", verifyAuth, updatepassword);

router.post("/forgot-password/send-otp", sendForgetPasswordOtp);
router.post("/forgot-password/verify-otp", verifyTempjwt, verifyForgotPasswordOtp);
router.patch("/forgot-password/update-password", verifyTempjwt, resetForgottenPassword);

router.get("/doctors/:doctorid", verifyAuth, getdoctorprofiledetails);
router.get("/doctors", verifyAuth, getalldoctorprofiledetails);
router.get("/departments", verifyAuth, getAllDepartments);
router.get("/departments/:deptname/doctors", verifyAuth, getdoctorbydept);

router.get("/prescriptions", verifyAuth, getallprescriptionsforpatient);
router.get("/prescriptions/appointment/:appointmentid", verifyAuth, getprescriptionbyappointment);
router.get("/prescriptions/:prescriptionid", verifyAuth, getprescription);

router.get("/labtests", verifyAuth, getalllabtestsforpatient);
router.get("/labtests/prescription/:prescriptionid", verifyAuth, getlabtestbyprescription);
router.get("/labtests/:labtestid", verifyAuth, getlabtest);

export default router;