import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import generateOtp from "../utils/otpgenerator.js";
import sendMail from "../services/mail.js";
import {
  appointmentcancellation,
  appointmentconfirmation,
  appointmentupdation,
} from "../utils/emailtemplate.js";

const parseTime = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date;
};

const formatTime = (date) => date.toTimeString().slice(0, 5);

const checkavailability = asyncHandler(async (req, res) => {
  const { doctorid, month, year } = req.query;

  if (!doctorid) throw new apiError(400, "Doctor ID missing");

  const doctor = await Doctor.findById(doctorid);
  if (!doctor) throw new apiError(404, "Doctor not found");

  const finalMonth = Number(month);
  const finalYear = Number(year);

  if (!finalMonth || !finalYear)
    throw new apiError(400, "Month or Year missing");

  const shiftSchedule = doctor.shift;
  const totalDaysInMonth = new Date(finalYear, finalMonth, 0).getDate();

  const monthStart = new Date(Date.UTC(finalYear, finalMonth - 1, 1));
  const monthEnd = new Date(
    Date.UTC(finalYear, finalMonth - 1, totalDaysInMonth, 23, 59, 59)
  );

  const bookedAppointments = await Appointment.find({
    "doctordetails.doctorusername": doctor.doctorusername,
    appointmentdate: { $gte: monthStart, $lte: monthEnd },
    status: { $in: ["Confirmed"] },
  }).select("appointmentdate appointmenttime");

  const dateSlotMap = {};

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const localDate = new Date(Date.UTC(finalYear, finalMonth - 1, day));
    const weekday = localDate.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });

    const applicableShifts = shiftSchedule.filter(
      (s) => s.day === weekday
    );
    if (!applicableShifts.length) continue;

    const dateStr = localDate.toISOString().split("T")[0];
    dateSlotMap[dateStr] = [];

    for (const shift of applicableShifts) {
      const shiftStart = parseTime(shift.starttime);
      const shiftEnd = parseTime(shift.endtime);
      const slotInterval =
        (shiftEnd - shiftStart) / shift.patientslot;

      for (let i = 0; i < shift.patientslot; i++) {
        const slotTime = new Date(
          shiftStart.getTime() + i * slotInterval
        );
        dateSlotMap[dateStr].push(formatTime(slotTime));
      }
    }
  }

  for (const appt of bookedAppointments) {
    const apptDate = new Date(appt.appointmentdate)
      .toISOString()
      .split("T")[0];

    if (dateSlotMap[apptDate]) {
      dateSlotMap[apptDate] = dateSlotMap[apptDate].filter(
        (time) => time !== appt.appointmenttime
      );
    }
  }

  const availabilityArray = Object.entries(dateSlotMap).map(
    ([date, times]) => ({
      date,
      availableSlots: times.length,
      isAvailable: times.length > 0,
      availableTimes: times,
    })
  );

  return res
    .status(200)
    .json(new apiResponse(200, availabilityArray, "Success"));
});

const createAppointment = asyncHandler(async (req, res) => {
  if (!req.patient) throw new apiError(401, "Unauthorized");

  const { doctorid } = req.params;
  const { appointmenttime, appointmentdate, symptoms, medicalhistory } =
    req.body;

  if (!appointmenttime || !appointmentdate)
    throw new apiError(400, "Date and time required");

  const doctor = await Doctor.findById(doctorid).select(
    "doctorusername doctorname specialization department qualification"
  );

  if (!doctor) throw new apiError(404, "Doctor not found");

  try {
    const created = await Appointment.create({
      patientdetails: {
        patientname: req.patient.patientname,
        patientusername: req.patient.patientusername,
        age: req.patient.age,
        sex: req.patient.sex,
        phonenumber: req.patient.phonenumber,
      },
      doctordetails: {
        _id: doctor._id,
        doctorname: doctor.doctorname,
        doctorusername: doctor.doctorusername,
        specialization: doctor.specialization,
        department: doctor.department,
        qualification: doctor.qualification,
      },
      appointmentdate: new Date(appointmentdate),
      appointmenttime,
      symptoms,
      medicalhistory: medicalhistory || "None",
      uniquecode: generateOtp(),
      status: "Confirmed",
    });

    sendMail({
      to: req.patient.email,
      subject: "Appointment Scheduled Successfully",
      html: appointmentconfirmation(
        created.uniquecode,
        req.patient.patientname,
        doctor.doctorname,
        doctor.department,
        appointmentdate,
        appointmenttime
      ),
    }).catch(console.error);

    return res
      .status(201)
      .json(new apiResponse(201, created, "Created"));

  } catch (error) {
    if (error.code === 11000)
      throw new apiError(400, "Slot already booked");
    throw error;
  }
});

const cancelappointment = asyncHandler(async (req, res) => {
  if (!req.patient) throw new apiError(401, "Unauthorized");

  const { appointmentid } = req.params;

  const appointment = await Appointment.findById(appointmentid);
  if (!appointment) throw new apiError(404, "Not found");

  if (
    appointment.patientdetails.patientusername !==
    req.patient.patientusername
  )
    throw new apiError(403, "Forbidden");

  appointment.status = "Cancelled";
  appointment.deleteafter = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  await appointment.save({ validateBeforeSave: false });

  sendMail({
    to: req.patient.email,
    subject: "Appointment Cancelled",
    html: appointmentcancellation(
      req.patient.patientname,
      appointment.doctordetails.doctorname,
      appointment.appointmentdate,
      appointment.appointmenttime
    ),
  }).catch(console.error);

  return res
    .status(200)
    .json(new apiResponse(200, appointment, "Cancelled"));
});

const updateappointment = asyncHandler(async (req, res) => {
  if (!req.patient) throw new apiError(401, "Unauthorized");

  const { appointmentid } = req.params;
  const { appointmenttime, appointmentdate, symptoms, medicalhistory } =
    req.body;

  const appointment = await Appointment.findById(appointmentid);
  if (!appointment) throw new apiError(404, "Not found");

  if (
    appointment.patientdetails.patientusername !==
    req.patient.patientusername
  )
    throw new apiError(403, "Forbidden");

  try {
    appointment.appointmenttime = appointmenttime;
    appointment.appointmentdate = new Date(appointmentdate);
    appointment.symptoms = symptoms;
    appointment.medicalhistory = medicalhistory || "None";

    await appointment.save();

    sendMail({
      to: req.patient.email,
      subject: "Appointment Updated",
      html: appointmentupdation(
        req.patient.patientname,
        appointment.doctordetails.doctorname,
        appointment.appointmentdate,
        appointment.appointmenttime
      ),
    }).catch(console.error);

    return res
      .status(200)
      .json(new apiResponse(200, appointment, "Updated"));

  } catch (error) {
    if (error.code === 11000)
      throw new apiError(400, "Slot already booked");
    throw error;
  }
});

const getappointment = asyncHandler(async (req, res) => {
  const { appointmentid } = req.params;

  if (!req.patient && !req.doctor && !req.admin)
    throw new apiError(401, "Unauthorized");

  const appointment = await Appointment.findById(appointmentid);
  if (!appointment)
    throw new apiError(404, "Not found");

  if (
    req.patient &&
    appointment.patientdetails.patientusername !==
      req.patient.patientusername
  )
    throw new apiError(403, "Forbidden");

  if (
    req.doctor &&
    appointment.doctordetails.doctorusername !==
      req.doctor.doctorusername
  )
    throw new apiError(403, "Forbidden");

  return res
    .status(200)
    .json(new apiResponse(200, appointment, "Fetched"));
});

const getallappointmentforpatient = asyncHandler(async (req, res) => {
  if (!req.patient) throw new apiError(401, "Unauthorized");

  const appointments = await Appointment.find({
    "patientdetails.patientusername":
      req.patient.patientusername,
  }).select("doctordetails appointmenttime appointmentdate status");

  return res
    .status(200)
    .json(new apiResponse(200, appointments, "Fetched"));
});

const gettodayappointment = asyncHandler(async (req, res) => {
  if (!req.doctor && !req.admin)
    throw new apiError(401, "Unauthorized");

  const doctorusername = req.doctor?.doctorusername;

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    "doctordetails.doctorusername": doctorusername,
    status: "Confirmed",
    appointmentdate: { $gte: start, $lte: end },
  }).select("patientdetails appointmenttime appointmentdate status");

  return res
    .status(200)
    .json(new apiResponse(200, appointments, "Fetched"));
});

const getallappointmentfordoctor = asyncHandler(async (req, res) => {
  if (!req.doctor) throw new apiError(401, "Unauthorized");

  const appointments = await Appointment.find({
    "doctordetails.doctorusername":
      req.doctor.doctorusername,
    status: { $in: ["Confirmed", "Completed"] },
  }).select("patientdetails appointmenttime appointmentdate status");

  return res
    .status(200)
    .json(new apiResponse(200, appointments, "Fetched"));
});

const getallappointmentforadmin = asyncHandler(async (req, res) => {
  if (!req.admin) throw new apiError(401, "Unauthorized");

  const appointments = await Appointment.find().select(
    "patientdetails doctordetails appointmenttime appointmentdate status"
  );

  return res
    .status(200)
    .json(new apiResponse(200, appointments, "Fetched"));
});

const verifyappointment = asyncHandler(async (req, res) => {
  if (!req.doctor) throw new apiError(401, "Unauthorized");

  const { code, appointmentid } = req.body;

  const appointment = await Appointment.findById(
    appointmentid
  );
  if (!appointment)
    throw new apiError(404, "Not found");

  if (
    appointment.doctordetails.doctorusername !==
    req.doctor.doctorusername
  )
    throw new apiError(403, "Forbidden");

  if (appointment.uniquecode !== code)
    throw new apiError(400, "Invalid code");

  appointment.uniquecode = "";
  appointment.status = "Completed";

  await appointment.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, appointment, "Verified"));
});

export {
  createAppointment,
  cancelappointment,
  updateappointment,
  getappointment,
  getallappointmentforpatient,
  gettodayappointment,
  getallappointmentforadmin,
  getallappointmentfordoctor,
  verifyappointment,
  checkavailability,
};