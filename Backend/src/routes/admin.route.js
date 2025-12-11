import { registeradmin, loginadmin, logoutadmin, accesstokenrenewal, updatepassword, getprofiledetails, resetForgottenPassword, updateprofile, updateprofilepic,getCurrentAdmin } from "../controllers/admin.controller.js";
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyadmin } from '../middlewares/adminauth.middleware.js';
import { verifyTempjwt } from "../middlewares/verifytempjwt.middleware.js";
import { sendotp, sendForgetPasswordOtp, verifyotp, verifyForgotPasswordOtp } from "../controllers/otp.controller.js";
import { getallappointmentforadmin,getappointment,gettodayappointment } from "../controllers/appointment.controller.js";
import { getalldoctorprofiledetails, getdoctorbydept, getdoctorprofiledetails } from "../controllers/doctor.controller.js";
import { createDepartment, getAllDepartments, updateDepartment } from "../controllers/department.controller.js";

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
router.route("/get-admin").get(verifyadmin, getCurrentAdmin);
router.route("/renew-access-token").post(accesstokenrenewal);

router.route("/update-password/send-otp").post(verifyadmin, sendotp);
router.route("/update-password/verify-otp").post(verifyadmin, verifyotp);
router.route("/update-password").patch(verifyadmin, updatepassword);

router.route("/forgot-password/send-otp").post(sendForgetPasswordOtp);
router.route("/forgot-password/verify-otp").post(verifyTempjwt, verifyForgotPasswordOtp);
router.route("/forgot-password/update-password").patch(verifyTempjwt, resetForgottenPassword);


router.route("/todayappointments").get(verifyadmin,gettodayappointment)
router.route("/appointments").get(verifyadmin, getallappointmentforadmin);
router.route("/appointments/:appointmentid").get(verifyadmin, getappointment);
router.route("/doctors").get(verifyadmin, getalldoctorprofiledetails);
router.route("/doctors/:doctorid").get(verifyadmin, getdoctorprofiledetails);
router.route("/departments/:deptname/doctors").get(verifyadmin,getdoctorbydept);

router.route("/create-department").post(verifyadmin,createDepartment);
router.route("/departments").get(verifyadmin,getAllDepartments);
router.route("/update-department/:id").patch(verifyadmin,updateDepartment);
export default router;