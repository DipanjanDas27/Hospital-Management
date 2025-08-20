import { registeradmin, loginadmin, logoutadmin, accesstokenrenewal, updatepassword, getprofiledetails, resetForgottenPassword, updateprofile, updateprofilepic } from "../controllers/admin.controller.js";
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyadmin } from '../middlewares/adminauth.middleware.js';
import { verifyTempjwt } from "../middlewares/verifytempjwt.middleware.js";
import { sendotp, sendForgetPasswordOtp, verifyotp, verifyForgotPasswordOtp } from "../controllers/otp.controller.js";
import { getallappointmentforadmin } from "../controllers/appointment.controller.js";
import { getalldoctorprofiledetails, getdoctorprofiledetails } from "../controllers/doctor.controller.js";
const router = Router();

router.route('/register').post(
    upload.fields(
        [{
            name: "aadhar",
            maxCount: 1 
        },
        {
            name: "adminId",
            maxCount: 1
        },
        {
            name: "profilepicture",
            maxCount: 1
        },
        {
            name: "appointmentletter",
            maxCount: 1
        }
        ]
    ),
    registeradmin);
router.route('/login').post(loginadmin);
router.route('/logout').post(verifyadmin, logoutadmin);
router.route("/update-profile").patch(verifyadmin, updateprofile);
router.route("/update-profilepicture").patch(verifyadmin, upload.single("profilepicture"), updateprofilepic);
router.route("/get-profile").get(verifyadmin, getprofiledetails);
router.route("/renew-access-token").post(accesstokenrenewal);

router.route("/update-password/send-otp").post(verifyadmin, sendotp);
router.route("/update-password/verify-otp").post(verifyadmin, verifyotp);
router.route("/update-password").patch(verifyadmin, updatepassword);

router.route("/forgot-password/send-otp").post(sendForgetPasswordOtp);
router.route("/forgot-password/verify-otp").post(verifyTempjwt, verifyForgotPasswordOtp);
router.route("/forgot-password/update-password").patch(verifyTempjwt, resetForgottenPassword);



router.route("/appointments").get(verifyadmin, getallappointmentforadmin);
router.route("/doctors").get(verifyadmin, getalldoctorprofiledetails);
router.route("/doctors/:doctorid").get(verifyadmin, getdoctorprofiledetails);


export default router;