import { Appointment } from "../models/appointment.model.js";
import { Patient } from "../models/patient.model.js";
import sendMail from "../services/mail.js";
import { appointmentcancellation } from "../utils/emailtemplate.js";

const autoCancelExpiredAppointments = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiredAppointments = await Appointment.find({
    status: "Confirmed",
    appointmentdate: { $lt: today },
  });

  if (!expiredAppointments.length) {
    return res.status(200).json({ message: "No expired appointments" });
  }

  await Appointment.updateMany(
    {
      status: "Confirmed",
      appointmentdate: { $lt: today },
    },
    {
      $set: {
        status: "Cancelled",
        deleteafter: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    }
  );

  for (const appointment of expiredAppointments) {
    try {
      const patient = await Patient.findOne({
        patientusername: appointment.patientdetails.patientusername,
      }).select("email patientname");

      if (!patient?.email) continue;

      sendMail({
        to: patient.email,
        subject: "Appointment Auto Cancelled",
        html: appointmentcancellation(
          patient.patientname,
          appointment.doctordetails.doctorname,
          appointment.appointmentdate,
          appointment.appointmenttime
        ),
      });
    } catch (error) {
      console.error("Error sending cancellation email:", error);
    }
  }

  return res.status(200).json({
    message: "Auto cancellation completed",
    cancelledCount: expiredAppointments.length,
  });
};

export { autoCancelExpiredAppointments };