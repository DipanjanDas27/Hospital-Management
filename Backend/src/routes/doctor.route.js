import { registerdoctor, logindoctor, logoutdoctor } from "../controllers/doctor.controller.js";
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifydoctor } from '../middlewares/doctorauth.middleware.js';

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

export default router;