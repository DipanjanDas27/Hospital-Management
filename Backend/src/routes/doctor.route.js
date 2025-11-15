import { registerdoctor, logindoctor, logoutdoctor, accesstokenrenewal, updatepassword, resetForgottenPassword, updateprofile,updateprofilepic, updatedocument, getdoctorprofiledetailsprivate, getCurrentDoctor} from "../controllers/doctor.controller.js";
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifydoctor } from '../middlewares/doctorauth.middleware.js';
import { verifyTempjwt } from "../middlewares/verifytempjwt.middleware.js"
import { sendotp, verifyotp, sendForgetPasswordOtp, verifyForgotPasswordOtp } from "../controllers/otp.controller.js"
import { getallappointmentfordoctor, getappointment, verifyappointment } from "../controllers/appointment.controller.js";
import { createprescription, getprescription, getallprescriptionsfordoctor, getprescriptionbyappointment, updateprescription, deleteprescription } from "../controllers/prescription.contorller.js";
import { createlabtest, getlabtest, getalllabtestsfordoctor, getlabtestbyprescription, updatelabtest, updatetestresults, verifylabtest, deletelabtest } from "../controllers/labtest.controller.js";

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
router.route("/appointments/verify-appointment").post(verifydoctor,verifyappointment)
router.route("/appointments/:appointmentid").get(verifydoctor,getappointment)
router.route("/get-doctor").get(verifydoctor,getCurrentDoctor)

// Prescription routes - Full CRUD access for doctors
router.route("/prescriptions").get(verifydoctor, getallprescriptionsfordoctor);
router.route("/prescriptions/appointment/:appointmentid").get(verifydoctor, getprescriptionbyappointment);
router.route("/prescriptions/:appointmentid").post(verifydoctor, createprescription);
router.route("/prescriptions/:prescriptionid").get(verifydoctor, getprescription);
router.route("/prescriptions/:prescriptionid").patch(verifydoctor, updateprescription);
router.route("/prescriptions/:prescriptionid").delete(verifydoctor, deleteprescription);

// Labtest routes - Full CRUD access for doctors
router.route("/labtests").get(verifydoctor, getalllabtestsfordoctor);
router.route("/labtests").post(verifydoctor, createlabtest);
router.route("/labtests/prescription/:prescriptionid").get(verifydoctor, getlabtestbyprescription);
router.route("/labtests/:labtestid/test-results").patch(verifydoctor, updatetestresults);
router.route("/labtests/:labtestid/verify").post(verifydoctor, verifylabtest);
router.route("/labtests/:labtestid").get(verifydoctor, getlabtest);
router.route("/labtests/:labtestid").patch(verifydoctor, updatelabtest);
router.route("/labtests/:labtestid").delete(verifydoctor, deletelabtest);

export default router;