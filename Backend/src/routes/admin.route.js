import {
  registeradmin,
  loginadmin,
  logoutadmin,
  accesstokenrenewal,
  updatepassword,
  getprofiledetails,
  resetForgottenPassword,
  updateprofile,
  updateprofilepic,
  getCurrentAdmin,
} from "../controllers/admin.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { verifyTempjwt } from "../middlewares/verifytempjwt.middleware.js";
import {
  sendotp,
  sendForgetPasswordOtp,
  verifyotp,
  verifyForgotPasswordOtp,
} from "../controllers/otp.controller.js";
import {
  getallappointmentforadmin,
  getappointment,
  gettodayappointment,
} from "../controllers/appointment.controller.js";
import {
  getalldoctorprofiledetails,
  getdoctorbydept,
  getdoctorprofiledetails,
} from "../controllers/doctor.controller.js";
import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
} from "../controllers/department.controller.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "adminId", maxCount: 1 },
    { name: "profilepicture", maxCount: 1 },
    { name: "appointmentletter", maxCount: 1 },
  ]),
  registeradmin
);

router.post("/login", loginadmin);

router.post("/logout", verifyAuth, logoutadmin);
router.patch("/update-profile", verifyAuth, updateprofile);
router.patch(
  "/update-profilepicture",
  verifyAuth,
  upload.single("profilepicture"),
  updateprofilepic
);
router.get("/get-profile", verifyAuth, getprofiledetails);
router.get("/get-admin", verifyAuth, getCurrentAdmin);
router.post("/renew-access-token", accesstokenrenewal);

router.post("/update-password/send-otp", verifyAuth, sendotp);
router.post("/update-password/verify-otp", verifyAuth, verifyotp);
router.patch("/update-password", verifyAuth, updatepassword);

router.post("/forgot-password/send-otp", sendForgetPasswordOtp);
router.post("/forgot-password/verify-otp", verifyTempjwt, verifyForgotPasswordOtp);
router.patch("/forgot-password/update-password", verifyTempjwt, resetForgottenPassword);

router.get("/todayappointments", verifyAuth, gettodayappointment);
router.get("/appointments", verifyAuth, getallappointmentforadmin);
router.get("/appointments/:appointmentid", verifyAuth, getappointment);

router.get("/doctors", verifyAuth, getalldoctorprofiledetails);
router.get("/doctors/:doctorid", verifyAuth, getdoctorprofiledetails);
router.get("/departments/:deptname/doctors", verifyAuth, getdoctorbydept);

router.post("/create-department", verifyAuth, createDepartment);
router.get("/departments", verifyAuth, getAllDepartments);
router.patch("/update-department/:id", verifyAuth, updateDepartment);

export default router;