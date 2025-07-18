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
    updateprofilepic
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

const router = Router();

router.route("/register").post(upload.single("profilepicture"), registerPatient);
router.route("/login").post(loginPatient);
router.route("/logout").post(verifypatient, logoutPatient);
router.route("/update-profile").patch(verifypatient, updateprofile);
router.route("/get-profile").get(verifypatient, getprofiledetails);
router.route("/renew-access-token").post(accesstokenrenewal);

router.route("/update-password/send-otp").post( verifypatient, sendotp);          
router.route("/update-password/verify-otp").post( verifypatient, verifyotp);     
router.route("/update-password").patch( verifypatient, updatepassword); 

router.route("/forgot-password/send-otp").post( sendForgetPasswordOtp);          
router.route("/forgot-password/verify-otp").post( verifyTempjwt,verifyForgotPasswordOtp);      
router.route("/forgot-password/update-password").patch( verifyTempjwt, resetForgottenPassword); 

router.route("/update-profilepicture").patch(verifypatient,upload.single("profilepicture"), updateprofilepic);



export default router;
