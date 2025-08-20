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

const parseTime = () => {
    const [h, m] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;

}
const formatTime = () => {
    return date.toTimeString().slice(0, 5);
}
const checkavailability = asyncHandler(async (req, res) => {
    const { doctorusername, month, year } = req.query;

    if (!doctorusername || !month || !year) {
        throw new apiError(400, "Some parameters are missing")
    }
    const doctor = await Doctor.findOne({ doctorusername: doctorUsername });
    if (!doctor) {
        throw new apiError(404, "Doctor not found")
    }

    const shiftSchedule = doctor.shift;
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    const bookedAppointments = await Appointment.find({
        "doctordetails.doctorusername": doctorusername,
        appointmentdate: {
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(year, month - 1, totalDaysInMonth),
        },
        status: { $in: ["Pending", "Confirmed"] }
    });

    const dateSlotMap = {};

    for (let day = 1; day <= totalDaysInMonth; day++) {
        const currentDate = new Date(year, month - 1, day);
        const weekday = currentDate.toLocaleDateString("en-US", { weekday: "long" });

        const applicableShifts = shiftSchedule.filter(
            (s) => s.day === weekday
        );

        if (applicableShifts.length === 0) continue;

        const dateStr = currentDate.toISOString().split("T")[0];
        dateSlotMap[dateStr] = {
            totaltimes: [],
        };

        for (const shift of applicableShifts) {
            const shiftStart = parseTime(shift.starttime);
            const shiftEnd = parseTime(shift.endtime);

            const slotInterval = (shiftEnd - shiftStart) / shift.patientslot;

            for (let i = 0; i < shift.patientslot; i++) {
                const slotTime = new Date(shiftStart + i * slotInterval);
                const slotStr = formatTime(slotTime);
                dateSlotMap[dateStr].totaltimes.push(slotStr)
            }
        }
    }
    for (const appt of bookedAppointments) {
        const apptDate = new Date(appt.appointmentdate).toISOString().split("T")[0];
        if (dateSlotMap[apptDate]) {
            dateSlotMap[apptDate].bookedTimes.pop(appt.appointmenttime);
        }
    }
    const availabilityArray = Object.entries(dateSlotMap).map(
        ([date, { bookedTimes }]) => ({
            date,
            availableSlots: bookedTimes.length,
            isAvailable: bookedTimes.length !== 0,
        })
    );

    return res.status(200).json(new apiResponse(200, availabilityArray, "Available slots are fetched successfully "));
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
    const doctor = await Doctor.findById(doctorid).select("doctorusername doctorname specialization department qualification experience")
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
    let medicalhistory
    if (req.body.medicalhistory) {
        medicalhistory = req.body.medicalhistory
    }
    const existedappointment = await Appointment.findOne({
        $and: [{ appointmenttime }, { appointmentdate }, { doctordetails: doctor }]
    })

    if (existedappointment) {
        throw new apiError(400, "Slot is already booked for that date")
    }
    const uniquecode = generateOtp()
    const createdappointment = await Appointment.create({
        patientdetails: patient,
        doctordetails: doctor,
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
    const { password } = req.body
    if (!password) {
        throw new apiError(400, "Password is required")
    }
    if (!req.patient) {
        throw new apiError(401, "Unauthorized patient request");
    }
    const ispasswordvalid = await req.patient.ispasswordcorrect(password)
    if (!ispasswordvalid) {
        throw new apiError(400, "Password is invalid")
    }
    const cancelledappointment = await Appointment.findByIdAndUpdate(
        appointmentid,
        {
            $set: {
                status: "Cancelled"
            }
        },
        { new: true }
    ).select("appointmenttime appointmentdate doctordetails")

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

    return res.status(200).json(new apiResponse(200, {
        appointmentId: cancelledappointment._id,
        doctorname,
        appointmenttime: cancelledappointment.appointmenttime,
        appointmentdate: cancelledappointment.appointmentdate,
    }, "the appointment is cancelled successfully"))
})

const updateappointment = asyncHandler(async (req, res) => {
    const { appointmenttime, appointmentdate, doctorid } = req.body
    const { appointmentid } = req.params
    if (!req.patient) {
        throw new apiError(401, "Unauthorized patient request");
    }
    const doctor = await Doctor.findById(doctorid).select(" doctorusername doctorname specialization department qualification experience")
    if (!doctor) {
        throw new apiError(404, "Doctor not found")
    }
    const existedappointment = await Appointment.findOne({
        $and: [{ appointmenttime }, { appointmentdate }, { doctordetails: doctor }]
    })
    if (existedappointment) {
        throw new apiError(400, "The slot is already booked")
    }
    const updatedappointment = await Appointment.findByIdAndUpdate(
        appointmentid,
        {
            $set: {
                appointmenttime,
                appointmentdate,
                doctordetails
            }
        },
        { new: true }
    )
    if (!updatedappointment) {
        throw new apiError(400, "The appointment update failed")
    }
    const doctorName = updatedappointment.doctordetails.doctorname
    const doctorUsername = updatedappointment.doctordetails.doctorusername
    const appointmentDate = updatedappointment.appointmentdate
    const appointmentTime = updatedappointment.appointmenttime
    const appointmentId = updatedappointment._id

    emitAppointmentUpdated(global.io, {
        appointmentId,
        doctorUsername,
        patientUsername: req.patient?.patientusername,
        appointmentDate,
        appointmentTime
    })

    notifyUsers(global.io, {
        patientUsername: req.patient?.patientusername,
        messageForPatient: {
            type: "appointment",
            action: "updated",
            message: `Your appointment has been updated. New updated slot- ${appointmentDate} at ${appointmentDate}`
        },
        notifyAdmin: true,
        messageForAdmin: {
            type: "appointment",
            action: "updated",
            message: `patinet-${req.patient?.patientusername} updated their appointment.New booking slot is - ${appointmentDate} at ${appointmentTime}`
        }
    })
    await sendMail({
        to: req.patient?.email,
        subject: "your appointment has been updated",
        html: appointmentupdation(req.patient?.patientname, doctorName, appointmentDate, appointmentTime)
    })
    return res.status(200)
        .json(new apiResponse(200, updatedappointment, "Appointment updated successfully"))
})

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
    const appointments = await Appointment.find("patientdetails.patientusername" === patientusername).select("doctordetails appointmenttime appointmentdate")

    return res.status(200).json(new apiResponse(200, appointments, "All appointments fetched successfully"))
})
const getallappointmentfordoctor = asyncHandler(async (req, res) => {
    if (!req.doctor) {
        throw new apiError(401, "Unauthorized doctor request");
    }
    const doctorusername = req.doctor?.doctorusername
    const appointments = await Appointment.find("doctordetails.doctorusername" === doctorusername).select("patientdetails appointmenttime appointmentdate")

    return res.status(200).json(new apiResponse(200, appointments, "All appointments fetched successfully"))
})
const getallappointmentforadmin = asyncHandler(async (req, res) => {
    if (!req.admin) {
        throw new apiError(401, "Unauthorized admin request");
    }
    const appointments = await Appointment.find().select("patientdetails doctordetails appointmenttime appointmentdate")

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