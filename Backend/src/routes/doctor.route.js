import { registerdoctor, logindoctor, logoutdoctor, accesstokenrenewal, updatepassword, resetForgottenPassword, updateprofile,updateprofilepic, updatedocument, getdoctorprofiledetailsprivate} from "../controllers/doctor.controller.js";
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifydoctor } from '../middlewares/doctorauth.middleware.js';
import { verifyTempjwt } from "../middlewares/verifytempjwt.middleware.js"
import { sendotp, verifyotp, sendForgetPasswordOtp, verifyForgotPasswordOtp } from "../controllers/otp.controller.js"
import { getallappointmentfordoctor, verifyappointment } from "../controllers/appointment.controller.js";

const router = Router();

router.route('/register').post(
    upload.fields(
        [{
            name: "aadhar",
            maxCount: 1
        },
        {
            name: "medicaldegree",
            maxCount: 1
        },
        {
            name: "profilepicture",
            maxCount: 1
        },
        {
            name: "medicallicense",
            maxCount: 1
        }
        ]
    ),
    registerdoctor);
router.route('/login').post(logindoctor);
router.route('/logout').post(verifydoctor, logoutdoctor);
router.route("/update-profile").patch(verifydoctor, updateprofile);
router.route("/update-profilepicture").patch(verifydoctor, upload.single("profilepicture"), updateprofilepic);
router.route("/profile").get(verifydoctor,getdoctorprofiledetailsprivate );
router.route("/renew-access-token").post(accesstokenrenewal);
router.route("/update-document").patch(verifydoctor, upload.fields([
    {
        name: "medicaldegree",
        maxCount: 1
    },
    {

        name: "medicallicense",
        maxCount: 1
    }

]), updatedocument);

router.route("/update-password/send-otp").post(verifydoctor, sendotp);
router.route("/update-password/verify-otp").post(verifydoctor, verifyotp);
router.route("/update-password").patch(verifydoctor, updatepassword);

router.route("/forgot-password/send-otp").post(sendForgetPasswordOtp);
router.route("/forgot-password/verify-otp").post(verifyTempjwt, verifyForgotPasswordOtp);
router.route("/forgot-password/update-password").patch(verifyTempjwt, resetForgottenPassword);


router.route("/appointments").get(verifydoctor,getallappointmentfordoctor)
router.route("/verify-appointment").post(verifydoctor,verifyappointment)

export default router;