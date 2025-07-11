import { Router } from 'express';
import { registerPatient, loginPatient, logoutPatient } from '../controllers/patient.controller.js';
import { verifypatient } from "../middlewares/patientauth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js';
const router = Router();

router.route("/register").post(upload.single("profilepicture"), registerPatient);
router.route("/login").post(loginPatient);
router.route("/logout").post(verifypatient, logoutPatient);


export default router;
