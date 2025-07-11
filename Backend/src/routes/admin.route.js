import { registeradmin,loginadmin,logoutadmin } from "../controllers/admin.controller.js";
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import {verifyadmin} from '../middlewares/adminauth.middleware.js';
const router = Router();

router.route('/register').post(
    upload.fields(
       [ {
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

export default router;