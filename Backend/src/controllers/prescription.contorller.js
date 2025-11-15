import { asyncHandler } from "../utils/asynchandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import { Prescription } from "../models/prescription.model.js"
import { Appointment } from "../models/appointment.model.js"

// CREATE - Create a new prescription
export const createprescription = asyncHandler(async (req, res) => {
    const { appointmentid } = req.params;
    const { diagonosis, medicines, labtest } = req.body;

    // Validate required fields
    if (!diagonosis || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
        throw new apiError(400, "Diagnosis and medicines are required");
    }

    // Validate medicines array structure
    for (const medicine of medicines) {
        if (!medicine.medicinename || !medicine.dosage || !medicine.frequency || !medicine.duration) {
            throw new apiError(400, "Each medicine must have medicinename, dosage, frequency, and duration");
        }
    }

    // Check if user is authorized (doctor should create prescriptions)
    if (!req.doctor) {
        throw new apiError(401, "Unauthorized doctor request");
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentid);
    if (!appointment) {
        throw new apiError(404, "Appointment not found");
    }

    // Check if appointment is completed
    if (appointment.status !== "Completed") {
        throw new apiError(400, "Prescription can only be created for completed appointments");
    }

    // Check if prescription already exists for this appointment
    const existingPrescription = await Prescription.findOne({ appointmentid });
    if (existingPrescription) {
        throw new apiError(409, "Prescription already exists for this appointment");
    }

    // Create prescription
    const prescription = await Prescription.create({
        appointmentid,
        doctordetails: appointment.doctordetails,
        patientdetails: appointment.patientdetails,
        diagonosis,
        medicines,
        labtest: labtest || null
    });

    if (!prescription) {
        throw new apiError(500, "Prescription creation failed");
    }

    const createdPrescription = await Prescription.findById(prescription._id)
        .populate("appointmentid")
        .populate("labtest");

    return res.status(201).json(
        new apiResponse(201, createdPrescription, "Prescription created successfully")
    );
});

// READ - Get a single prescription by ID
export const getprescription = asyncHandler(async (req, res) => {
    const { prescriptionid } = req.params;

    // Check authorization
    if (!req.patient && !req.doctor && !req.admin) {
        throw new apiError(401, "Unauthorized request");
    }

    const prescription = await Prescription.findById(prescriptionid)
        .populate("appointmentid")
        .populate("labtest");

    if (!prescription) {
        throw new apiError(404, "Prescription not found");
    }

    // If patient, verify they own this prescription
    if (req.patient && prescription.patientdetails.patientusername !== req.patient.patientusername) {
        throw new apiError(403, "You don't have access to this prescription");
    }

    // If doctor, verify they created this prescription
    if (req.doctor && prescription.doctordetails.doctorusername !== req.doctor.doctorusername) {
        throw new apiError(403, "You don't have access to this prescription");
    }

    return res.status(200).json(
        new apiResponse(200, prescription, "Prescription fetched successfully")
    );
});

// READ - Get all prescriptions for a patient
export const getallprescriptionsforpatient = asyncHandler(async (req, res) => {
    if (!req.patient) {
        throw new apiError(401, "Unauthorized patient request");
    }

    const patientusername = req.patient.patientusername;
    const prescriptions = await Prescription.find({
        "patientdetails.patientusername": patientusername
    })
        .populate("appointmentid")
        .populate("labtest")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, prescriptions, "All prescriptions fetched successfully")
    );
});

// READ - Get all prescriptions for a doctor
export const getallprescriptionsfordoctor = asyncHandler(async (req, res) => {
    if (!req.doctor) {
        throw new apiError(401, "Unauthorized doctor request");
    }

    const doctorusername = req.doctor.doctorusername;
    const prescriptions = await Prescription.find({
        "doctordetails.doctorusername": doctorusername
    })
        .populate("appointmentid")
        .populate("labtest")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, prescriptions, "All prescriptions fetched successfully")
    );
});

// READ - Get all prescriptions (for admin)
export const getallprescriptions = asyncHandler(async (req, res) => {
    if (!req.admin) {
        throw new apiError(401, "Unauthorized admin request");
    }

    const prescriptions = await Prescription.find()
        .populate("appointmentid")
        .populate("labtest")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, prescriptions, "All prescriptions fetched successfully")
    );
});

// READ - Get prescription by appointment ID
export const getprescriptionbyappointment = asyncHandler(async (req, res) => {
    const { appointmentid } = req.params;

    // Check authorization
    if (!req.patient && !req.doctor && !req.admin) {
        throw new apiError(401, "Unauthorized request");
    }

    const prescription = await Prescription.findOne({ appointmentid })
        .populate("appointmentid")
        .populate("labtest");

    if (!prescription) {
        throw new apiError(404, "Prescription not found for this appointment");
    }

    // If patient, verify they own this prescription
    if (req.patient && prescription.patientdetails.patientusername !== req.patient.patientusername) {
        throw new apiError(403, "You don't have access to this prescription");
    }

    // If doctor, verify they created this prescription
    if (req.doctor && prescription.doctordetails.doctorusername !== req.doctor.doctorusername) {
        throw new apiError(403, "You don't have access to this prescription");
    }

    return res.status(200).json(
        new apiResponse(200, prescription, "Prescription fetched successfully")
    );
});

// UPDATE - Update a prescription
export const updateprescription = asyncHandler(async (req, res) => {
    const { prescriptionid } = req.params;
    const { diagonosis, medicines, labtest } = req.body;

    // Check authorization
    if (!req.doctor && !req.admin) {
        throw new apiError(401, "Unauthorized request");
    }

    const prescription = await Prescription.findById(prescriptionid);
    if (!prescription) {
        throw new apiError(404, "Prescription not found");
    }

    // If doctor, verify they created this prescription
    if (req.doctor && prescription.doctordetails.doctorusername !== req.doctor.doctorusername) {
        throw new apiError(403, "You don't have permission to update this prescription");
    }

    // Validate medicines if provided
    if (medicines) {
        if (!Array.isArray(medicines) || medicines.length === 0) {
            throw new apiError(400, "Medicines must be a non-empty array");
        }
        for (const medicine of medicines) {
            if (!medicine.medicinename || !medicine.dosage || !medicine.frequency || !medicine.duration) {
                throw new apiError(400, "Each medicine must have medicinename, dosage, frequency, and duration");
            }
        }
    }

    // Build update object
    const updates = {};
    if (diagonosis) updates.diagonosis = diagonosis;
    if (medicines) updates.medicines = medicines;
    if (labtest !== undefined) updates.labtest = labtest || null;

    if (Object.keys(updates).length === 0) {
        throw new apiError(400, "At least one field is required to update");
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
        prescriptionid,
        { $set: updates },
        { new: true }
    )
        .populate("appointmentid")
        .populate("labtest");

    if (!updatedPrescription) {
        throw new apiError(500, "Prescription update failed");
    }

    return res.status(200).json(
        new apiResponse(200, updatedPrescription, "Prescription updated successfully")
    );
});

// DELETE - Delete a prescription
export const deleteprescription = asyncHandler(async (req, res) => {
    const { prescriptionid } = req.params;

    // Check authorization
    if (!req.doctor && !req.admin) {
        throw new apiError(401, "Unauthorized request");
    }

    const prescription = await Prescription.findById(prescriptionid);
    if (!prescription) {
        throw new apiError(404, "Prescription not found");
    }

    // If doctor, verify they created this prescription
    if (req.doctor && prescription.doctordetails.doctorusername !== req.doctor.doctorusername) {
        throw new apiError(403, "You don't have permission to delete this prescription");
    }

    await Prescription.findByIdAndDelete(prescriptionid);

    return res.status(200).json(
        new apiResponse(200, {}, "Prescription deleted successfully")
    );
});
