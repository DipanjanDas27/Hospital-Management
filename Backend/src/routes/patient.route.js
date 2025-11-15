import { Router } from 'express';
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
    getPatient
} from '../controllers/patient.controller.js';
import {
    sendotp,
    verifyotp,
    sendForgetPasswordOtp, 
    verifyForgotPasswordOtp,
} from "../controllers/otp.controller.js";
import { verifypatient } from "../middlewares/patientauth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js';
import { verifyTempjwt } from '../middlewares/verifytempjwt.middleware.js';
import { getalldoctorprofiledetails, getdoctorbydept, getdoctorprofiledetails } from '../controllers/doctor.controller.js';
import { getAllDepartments } from '../controllers/department.controller.js';
import { getprescription, getallprescriptionsforpatient, getprescriptionbyappointment } from '../controllers/prescription.contorller.js';
import { getlabtest, getalllabtestsforpatient, getlabtestbyprescription } from '../controllers/labtest.controller.js';

const router = Router();

router.route("/register").post(upload.single("profilepicture"), registerPatient);
router.route("/login").post(loginPatient);
router.route("/logout").post(verifypatient, logoutPatient);
router.route("/update-profile").patch(verifypatient, updateprofile);
router.route("/update-profilepicture").patch(verifypatient, upload.single("profilepicture"), updateprofilepic);
router.route("/get-profile").get(verifypatient, getprofiledetails);
router.route("/get-patient").get(verifypatient, getPatient);
router.route("/renew-access-token").post(accesstokenrenewal);

router.route("/update-password/send-otp").post(verifypatient, sendotp);
router.route("/update-password/verify-otp").post(verifypatient, verifyotp);
router.route("/update-password").patch(verifypatient, updatepassword);

router.route("/forgot-password/send-otp").post(sendForgetPasswordOtp);
router.route("/forgot-password/verify-otp").post(verifyTempjwt, verifyForgotPasswordOtp);
router.route("/forgot-password/update-password").patch(verifyTempjwt, resetForgottenPassword);

router.route("/doctors/:doctorid").get(verifypatient, getdoctorprofiledetails);
router.route("/doctors").get(verifypatient, getalldoctorprofiledetails);
router.route("/departments").get(verifypatient,getAllDepartments);
router.route("/departments/:deptname/doctors").get(verifypatient,getdoctorbydept); 

// Prescription routes - Read only access for patients (their own prescriptions)
router.route("/prescriptions").get(verifypatient, getallprescriptionsforpatient);
router.route("/prescriptions/appointment/:appointmentid").get(verifypatient, getprescriptionbyappointment);
router.route("/prescriptions/:prescriptionid").get(verifypatient, getprescription);

// Labtest routes - Read only access for patients (their own lab tests)
router.route("/labtests").get(verifypatient, getalllabtestsforpatient);
router.route("/labtests/prescription/:prescriptionid").get(verifypatient, getlabtestbyprescription);
router.route("/labtests/:labtestid").get(verifypatient, getlabtest);

export default router;
