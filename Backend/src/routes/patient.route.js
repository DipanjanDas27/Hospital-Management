import { Router } from 'express';
import { registerPatient } from '../controllers/patient.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
const router = Router();

router.route('/register').post(
    upload.fields({
        name: "profilepicture",
        maxcount:1
    }),
    registerPatient)

export default router;
