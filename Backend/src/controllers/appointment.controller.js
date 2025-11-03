import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";
import { asyncHandler } from "../utils/asynchandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import generateOtp from "../utils/otpgenerator.js"
import sendMail from "../services/mail.js";
import { appointmentcancellation, appointmentconfirmation, appointmentupdation } from "../utils/emailtemplate.js";
import { emitAppointmentCancelled, emitAppointmentCreated, emitAppointmentUpdated } from "../utils/socketEmitter.js";
import { notifyUsers } from "../utils/notification.js";

const parseTime = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date;
};

const formatTime = (date) => {
  return date.toTimeString().slice(0, 5);
};

const checkavailability = asyncHandler(async (req, res) => {
  const { doctorid, month, year } = req.query;
  if (!doctorid) throw new apiError(400, "Doctor ID missing");

  const doctor = await Doctor.findById(doctorid);
  if (!doctor) throw new apiError(404, "Doctor not found");

  const finalDoctorUsername = doctor.doctorusername;
  const finalMonth = Number(month);
  const finalYear = Number(year);

  if (!finalMonth || !finalYear)
    throw new apiError(400, "Month or Year missing");

  const shiftSchedule = doctor.shift;
  const totalDaysInMonth = new Date(finalYear, finalMonth, 0).getDate();

  // ✅ Use start & end of month in UTC to avoid timezone offset
  const monthStart = new Date(Date.UTC(finalYear, finalMonth - 1, 1, 0, 0, 0));
  const monthEnd = new Date(Date.UTC(finalYear, finalMonth - 1, totalDaysInMonth, 23, 59, 59));

  const bookedAppointments = await Appointment.find({
    "doctordetails.doctorusername": finalDoctorUsername,
    appointmentdate: {
      $gte: monthStart,
      $lte: monthEnd,
    },
    status: { $in: ["Pending", "Confirmed"] },
  });

  const dateSlotMap = {};

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const localDate = new Date(Date.UTC(finalYear, finalMonth - 1, day));
    const weekday = localDate.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });

    const applicableShifts = shiftSchedule.filter((s) => s.day === weekday);
    if (applicableShifts.length === 0) continue;

    const dateStr = localDate.toISOString().split("T")[0];
    dateSlotMap[dateStr] = { totaltimes: [] };

    for (const shift of applicableShifts) {
      const shiftStart = parseTime(shift.starttime);
      const shiftEnd = parseTime(shift.endtime);
      const slotInterval = (shiftEnd - shiftStart) / shift.patientslot;

      for (let i = 0; i < shift.patientslot; i++) {
        const slotTime = new Date(shiftStart.getTime() + i * slotInterval);
        const slotStr = formatTime(slotTime);
        dateSlotMap[dateStr].totaltimes.push(slotStr);
      }
    }
  }

  // Remove already booked slots
  for (const appt of bookedAppointments) {
    const apptDate = new Date(appt.appointmentdate).toISOString().split("T")[0];
    if (dateSlotMap[apptDate]) {
      const idx = dateSlotMap[apptDate].totaltimes.indexOf(appt.appointmenttime);
      if (idx !== -1) dateSlotMap[apptDate].totaltimes.splice(idx, 1);
    }
  }

  const availabilityArray = Object.entries(dateSlotMap).map(
    ([date, { totaltimes }]) => ({
      date,
      availableSlots: totaltimes.length,
      isAvailable: totaltimes.length > 0,
      availableTimes: totaltimes,
    })
  );

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        availabilityArray,
        "Available slots fetched successfully"
      )
    );
});




const createAppointment = asyncHandler(async (req, res) => {
    const { appointmenttime, appointmentdate, symptoms } = req.body
    if ([appointmenttime, symptoms].some((field) => !field || field?.trim() === "")) {
        throw new apiError(400, "Some fields are missing")
    }
    if (!appointmentdate) {
        throw new apiError(400, "Date is required")
    }
    if (!req.patient) {
        throw new apiError(401, "Unauthorized patient request");
    }
    const { doctorid } = req.params
    const doctor = await Doctor.findById(doctorid).select("doctorusername doctorname specialization department qualification")
    if (!doctor) {
        throw new apiError(404, "You are requesting to a non existing Doctor")
    }
    const patient = {
        patientname: req.patient?.patientname,
        patientusername: req.patient?.patientusername,
        age: req.patient?.age,
        sex: req.patient?.sex,
        phonenumber: req.patient?.phonenumber
    }
    const doctordetails = {
        _id: doctor._id,
        doctorname: doctor.doctorname,
        doctorusername: doctor.doctorusername,
        specialization: doctor.specialization,
        department: doctor.department,
        qualification: doctor.qualification
    }
    let medicalhistory
    if (req.body.medicalhistory) {
        medicalhistory = req.body.medicalhistory
    }
    const appointmentdateObj = new Date(appointmentdate)
    const existedappointment = await Appointment.findOne({
        $and: [{ appointmenttime }, { appointmentdate: appointmentdateObj }, { "doctordetails.doctorusername": doctordetails.doctorusername }]
    })

    if (existedappointment) {
        throw new apiError(400, "Slot is already booked for that date")
    }
    const uniquecode = generateOtp()
    const createdappointment = await Appointment.create({
        patientdetails: patient,
        doctordetails: doctordetails,
        appointmentdate,
        appointmenttime,
        symptoms,
        medicalhistory: medicalhistory || "None",
        uniquecode,
        status: "Confirmed"
    })
    if (!createdappointment) {
        throw new apiError(500, "Appointment creation failed")
    }

    emitAppointmentCreated(global.io, {
        appointmentId: createdappointment._id,
        doctorUsername: doctor.doctorusername,
        patientUsername: req.patient?.patientusername,
        date: appointmentdate,
        time: appointmenttime
    });

    notifyUsers(global.io, {
        patientUsername: req.patient?.patientusername,
        messageForPatient: {
            type: "appointment",
            action: "created",
            message: `Your appointment is confirmed for ${appointmentdate} at ${appointmenttime}`
        },
        notifyAdmin: true,
        messageForAdmin: {
            type: "appointment",
            action: "created",
            message: `patinet-${req.patient?.patientusername} booked an appointment on ${appointmentdate} at ${appointmenttime}`
        }
    });

    await sendMail({
        to: req.patient?.email,
        subject: "Appointment Scheduled Successfully – Confirmation Code Inside",
        html: appointmentconfirmation(uniquecode, patient.patientname, doctor.doctorname, doctor.department, appointmentdate, appointmenttime)
    })
    return res.status(200)
        .json(new apiResponse(200, createdappointment, "Appointment created Successfully"))

})

const cancelappointment = asyncHandler(async (req, res) => {
    const { appointmentid } = req.params
    if (!req.patient) {
        throw new apiError(401, "Unauthorized patient request");
    }
    const cancelledappointment = await Appointment.findByIdAndUpdate(
        appointmentid,
        {
            $set: {
                status: "Cancelled"
            }
        },
        { new: true }
    ).select("appointmenttime appointmentdate doctordetails patientdetails status")

    const doctorname = cancelledappointment.doctordetails.doctorname
    const patientname = cancelledappointment.patientdetails.patientname

    cancelledappointment.deleteafter = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await cancelledappointment.save({ validateBeforeSave: false })

    emitAppointmentCancelled(global.io, {
        appointmentId: cancelledappointment._id,
        doctorUsername: cancelledappointment.doctordetails.doctorusername,
        patientUsername: req.patient?.patientusername,
        date: cancelledappointment.appointmentdate,
        time: cancelledappointment.appointmenttime
    })

    notifyUsers(global.io, {
        patientUsername: req.patient?.patientusername,
        messageForPatient: {
            type: "appointment",
            action: "cancelled",
            message: `Your appointment is cancelled for ${cancelledappointment.appointmentdate} at ${cancelledappointment.appointmenttime}`
        },
        notifyAdmin: true,
        messageForAdmin: {
            type: "appointment",
            action: "cancelled",
            message: `patinet-${req.patient?.patientusername} cancelled an appointment on ${cancelledappointment.appointmentdate} at ${cancelledappointment.appointmenttime}`
        }
    })

    await sendMail({
        to: req.patient?.email,
        subject: "your appointment is cancelled",
        html: appointmentcancellation(patientname, doctorname, cancelledappointment.appointmentdate, cancelledappointment.appointmenttime)
    })

    return res.status(200).json(new apiResponse(200, cancelledappointment, "the appointment is cancelled successfully"))
})

const updateappointment = asyncHandler(async (req, res) => {
    const { appointmenttime, appointmentdate, symptoms } = req.body;
    const { appointmentid } = req.params;
    let medicalhistory;
    
    if (req.body.medicalhistory) {
        medicalhistory = req.body.medicalhistory;
    }
    
    if (!req.patient) {
        throw new apiError(401, "Unauthorized patient request");
    }
    const currentAppointment = await Appointment.findById(appointmentid);
    if (!currentAppointment) {
        throw new apiError(404, "Appointment not found");
    }

    const existedappointment = await Appointment.findOne({
        _id: { $ne: appointmentid },
        appointmenttime,
        appointmentdate: new Date(appointmentdate),
        "doctordetails.doctorusername": currentAppointment.doctordetails.doctorusername, 
        status: { $in: ["Pending", "Confirmed"] } 
    });

    if (existedappointment) {
        throw new apiError(400, "The slot is already booked");
    }

    const updatedappointment = await Appointment.findByIdAndUpdate(
        appointmentid,
        {
            $set: {
                appointmenttime,
                appointmentdate: new Date(appointmentdate), 
                symptoms,
                medicalhistory: medicalhistory || "None"
            }
        },
        { new: true }
    );

    if (!updatedappointment) {
        throw new apiError(400, "The appointment update failed");
    }

    const doctorName = updatedappointment.doctordetails.doctorname;
    const doctorUsername = updatedappointment.doctordetails.doctorusername;
    const appointmentDate = updatedappointment.appointmentdate;
    const appointmentTime = updatedappointment.appointmenttime;
    const appointmentId = updatedappointment._id;

    emitAppointmentUpdated(global.io, {
        appointmentId,
        doctorUsername,
        patientUsername: req.patient?.patientusername,
        appointmentDate,
        appointmentTime
    });

    notifyUsers(global.io, {
        patientUsername: req.patient?.patientusername,
        messageForPatient: {
            type: "appointment",
            action: "updated",
            message: `Your appointment has been updated. New slot: ${appointmentDate.toLocaleDateString()} at ${appointmentTime}` 
        },
        notifyAdmin: true,
        messageForAdmin: {
            type: "appointment",
            action: "updated",
            message: `Patient ${req.patient?.patientusername} updated their appointment. New slot: ${appointmentDate.toLocaleDateString()} at ${appointmentTime}` 
        }
    });

    await sendMail({
        to: req.patient?.email,
        subject: "Your appointment has been updated",
        html: appointmentupdation(req.patient?.patientname, doctorName, appointmentDate, appointmentTime)
    });

    return res.status(200)
        .json(new apiResponse(200, updatedappointment, "Appointment updated successfully"));
});

const getappointment = asyncHandler(async (req, res) => {
    const { appointmentid } = req.params
    if (!req.patient && !req.doctor && !req.admin) {
        throw new apiError(401, "Unauthorized patient request");
    }
    const appointment = await Appointment.findById(appointmentid)
    if (!appointment) {
        throw new apiError(404, "the appointment doesn't exist")
    }

    return res.status(200).json(new apiResponse(200, appointment, "Appointment fetched successfully"))
})

const getallappointmentforpatient = asyncHandler(async (req, res) => {
    if (!req.patient) {
        throw new apiError(401, "Unauthorized patient request");
    }
    const patientusername = req.patient?.patientusername
    const appointments = await Appointment.find({"patientdetails.patientusername":patientusername}).select("doctordetails appointmenttime appointmentdate status")

    return res.status(200).json(new apiResponse(200, appointments, "All appointments fetched successfully"))
})
const getallappointmentfordoctor = asyncHandler(async (req, res) => {
    if (!req.doctor) {
        throw new apiError(401, "Unauthorized doctor request");
    }
    const doctorusername = req.doctor?.doctorusername
    const appointments = await Appointment.find({"doctordetails.doctorusername": doctorusername}).select("patientdetails appointmenttime appointmentdate status")

    return res.status(200).json(new apiResponse(200, appointments, "All appointments fetched successfully"))
})
const getallappointmentforadmin = asyncHandler(async (req, res) => {
    if (!req.admin) {
        throw new apiError(401, "Unauthorized admin request");
    }
    const appointments = await Appointment.find().select("patientdetails doctordetails appointmenttime appointmentdate status")

    return res.status(200).json(new apiResponse(200, appointments, "All appointments fetched successfully"))
})

const verifyappointment = asyncHandler(async (req, res) => {
    if (!req.doctor) {
        throw new apiError(401, "Unauthorized doctor request");
    }
    const { uniquecode } = req.body
    const { appointmentid } = req.params
    const appointment = await Appointment.findById(appointmentid)
    if (!appointment) {
        throw new apiError(404, "The appointment is not found.")
    }
    if (appointment.uniquecode !== uniquecode) {
        throw new apiError(400, "The given confirmation code is wrong or invalid")
    }
    appointment.uniquecode = ""
    appointment.status = "Completed"
    appointment.deleteafter = new Date(Date.now() + 48 * 60 * 60 * 1000)
    await appointment.save({ validateBeforeSave: false })


    return res.status(200).json(200, appointment, "Your appointment is verified successfully")
})

export { createAppointment, cancelappointment, updateappointment, getappointment, getallappointmentforpatient, getallappointmentfordoctor, getallappointmentforadmin, verifyappointment, checkavailability }