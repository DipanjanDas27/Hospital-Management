import { registerdoctor } from "../controllers/doctor.controller.js";
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
const router = Router();

router.route('/register').post(
    upload.fields({}),
    registerdoctor);

export default router;