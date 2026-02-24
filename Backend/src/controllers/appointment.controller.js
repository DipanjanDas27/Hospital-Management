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

const formatAppointment = (appointment) => {
  return {
    _id: appointment._id,
    appointmentdate: appointment.appointmentdate,
    appointmenttime: appointment.appointmenttime,
    symptoms: appointment.symptoms,
    medicalhistory: appointment.medicalhistory,
    status: appointment.status,
    uniquecode: appointment.uniquecode,
    patientdetails: appointment.patient,
    doctordetails: appointment.doctor,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
};

const createAppointment = asyncHandler(async (req, res) => {
  const { appointmenttime, appointmentdate, symptoms, medicalhistory } =
    req.body;
  const { doctorid } = req.params;

  if (!req.patient) throw new apiError(401, "Unauthorized");
  if (!appointmenttime || !appointmentdate)
    throw new apiError(400, "Date and time required");

  const doctor = await Doctor.findById(doctorid);
  if (!doctor) throw new apiError(404, "Doctor not found");

  try {
    const created = await Appointment.create({
      patient: req.patient._id,
      doctor: doctor._id,
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
        created.appointmentdate,
        appointmenttime
      ),
    }).catch(() => {});

    return res
      .status(201)
      .json(new apiResponse(201, created, "Appointment created"));
  } catch (error) {
    if (error.code === 11000)
      throw new apiError(400, "Slot already booked");
    throw error;
  }
});

const cancelappointment = asyncHandler(async (req, res) => {
  const { appointmentid } = req.params;

  const appointment = await Appointment.findById(appointmentid)
    .populate("patient")
    .populate("doctor");

  if (!appointment) throw new apiError(404, "Appointment not found");

  if (
    req.patient &&
    appointment.patient._id.toString() !== req.patient._id.toString()
  )
    throw new apiError(403, "Not allowed");

  appointment.status = "Cancelled";
  appointment.deleteafter = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  await appointment.save();

  sendMail({
    to: appointment.patient.email,
    subject: "Appointment Cancelled",
    html: appointmentcancellation(
      appointment.patient.patientname,
      appointment.doctor.doctorname,
      appointment.appointmentdate,
      appointment.appointmenttime
    ),
  }).catch(() => {});

  return res
    .status(200)
    .json(new apiResponse(200, formatAppointment(appointment)));
});

const updateappointment = asyncHandler(async (req, res) => {
  const { appointmentid } = req.params;
  const { appointmenttime, appointmentdate, symptoms, medicalhistory } =
    req.body;

  const appointment = await Appointment.findById(appointmentid);
  if (!appointment) throw new apiError(404, "Appointment not found");

  appointment.appointmenttime = appointmenttime;
  appointment.appointmentdate = new Date(appointmentdate);
  appointment.symptoms = symptoms;
  appointment.medicalhistory = medicalhistory || "None";

  try {
    await appointment.save();
  } catch (error) {
    if (error.code === 11000)
      throw new apiError(400, "Slot already booked");
    throw error;
  }

  return res
    .status(200)
    .json(new apiResponse(200, appointment));
});

const getappointment = asyncHandler(async (req, res) => {
  const { appointmentid } = req.params;

  const appointment = await Appointment.findById(appointmentid)
    .populate("patient", "patientname patientusername age sex phonenumber email")
    .populate(
      "doctor",
      "doctorname doctorusername department specialization qualification"
    );

  if (!appointment) throw new apiError(404, "Not found");

  return res
    .status(200)
    .json(new apiResponse(200, formatAppointment(appointment)));
});

const getallappointmentforpatient = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    patient: req.patient._id,
  })
    .populate(
      "doctor",
      "doctorname doctorusername department specialization qualification"
    )
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new apiResponse(
      200,
      appointments.map(formatAppointment)
    )
  );
});

const getallappointmentfordoctor = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    doctor: req.doctor._id,
  })
    .populate(
      "patient",
      "patientname patientusername age sex phonenumber"
    )
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new apiResponse(
      200,
      appointments.map(formatAppointment)
    )
  );
});

const getallappointmentforadmin = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate(
      "patient",
      "patientname patientusername age sex phonenumber"
    )
    .populate(
      "doctor",
      "doctorname doctorusername department specialization qualification"
    )
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new apiResponse(
      200,
      appointments.map(formatAppointment)
    )
  );
});

export {
  createAppointment,
  cancelappointment,
  updateappointment,
  getappointment,
  getallappointmentforpatient,
  getallappointmentfordoctor,
  getallappointmentforadmin,
};