import { Router } from "express";
import { autoCancelExpiredAppointments } from "../controllers/cron.controller.js";

const router = Router();

router.get("/auto-cancel", autoCancelExpiredAppointments);

export default router;