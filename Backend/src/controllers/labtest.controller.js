import { asyncHandler } from "../utils/asynchandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import Labtest from "../models/labtest.model.js";
import { Prescription } from "../models/prescription.model.js";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";

// CREATE - Create a new lab test
export const createlabtest = asyncHandler(async (req, res) => {
    const { prescription_id, patient_id, tests, attachments } = req.body;

    // Validate required fields
    if (!prescription_id || !patient_id || !tests || !Array.isArray(tests) || tests.length === 0) {
        throw new apiError(400, "Prescription ID, Patient ID, and tests are required");
    }

    // Validate tests array structure
    for (const test of tests) {
        if (!test.test_name) {
            throw new apiError(400, "Each test must have a test_name");
        }
        if (test.parameters && !Array.isArray(test.parameters)) {
            throw new apiError(400, "Parameters must be an array");
        }
        if (test.status && !["ordered", "processing", "completed"].includes(test.status)) {
            throw new apiError(400, "Test status must be one of: ordered, processing, completed");
        }
    }

    // Check authorization (doctor should create lab tests)
    if (!req.doctor) {
        throw new apiError(401, "Unauthorized doctor request");
    }

    // Verify prescription exists
    const prescription = await Prescription.findById(prescription_id);
    if (!prescription) {
        throw new apiError(404, "Prescription not found");
    }

    // Verify patient exists
    const patient = await Patient.findById(patient_id);
    if (!patient) {
        throw new apiError(404, "Patient not found");
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
        throw new apiError(404, "Doctor not found");
    }

    // Check if lab test already exists for this prescription
    const existingLabtest = await Labtest.findOne({ prescription_id });
    if (existingLabtest) {
        throw new apiError(409, "Lab test already exists for this prescription");
    }

    // Create lab test
    const labtest = await Labtest.create({
        prescription_id,
        patient_id,
        doctor_id: req.doctor._id,
        tests,
        overall_status: "ordered",
        attachments: attachments || [],
    });

    if (!labtest) {
        throw new apiError(500, "Lab test creation failed");
    }

    // Update prescription with labtest reference
    await Prescription.findByIdAndUpdate(
        prescription_id,
        { $set: { labtest: labtest._id } },
        { new: true }
    );

    const createdLabtest = await Labtest.findById(labtest._id)
        .populate("prescription_id")
        .populate("patient_id")
        .populate("doctor_id")
        .populate("verified_by");

    return res.status(201).json(
        new apiResponse(201, createdLabtest, "Lab test created successfully")
    );
});

// READ - Get a single lab test by ID
export const getlabtest = asyncHandler(async (req, res) => {
    const { labtestid } = req.params;

    // Check authorization
    if (!req.patient && !req.doctor && !req.admin) {
        throw new apiError(401, "Unauthorized request");
    }

    const labtest = await Labtest.findById(labtestid)
        .populate("prescription_id")
        .populate("patient_id")
        .populate("doctor_id")
        .populate("verified_by");

    if (!labtest) {
        throw new apiError(404, "Lab test not found");
    }

    // If patient, verify they own this lab test
    if (req.patient && labtest.patient_id._id.toString() !== req.patient._id.toString()) {
        throw new apiError(403, "You don't have access to this lab test");
    }

    // If doctor, verify they created or verified this lab test
    if (req.doctor && 
        labtest.doctor_id._id.toString() !== req.doctor._id.toString() && 
        (!labtest.verified_by || labtest.verified_by._id.toString() !== req.doctor._id.toString())) {
        throw new apiError(403, "You don't have access to this lab test");
    }

    return res.status(200).json(
        new apiResponse(200, labtest, "Lab test fetched successfully")
    );
});

// READ - Get all lab tests for a patient
export const getalllabtestsforpatient = asyncHandler(async (req, res) => {
    if (!req.patient) {
        throw new apiError(401, "Unauthorized patient request");
    }

    const labtests = await Labtest.find({ patient_id: req.patient._id })
        .populate("prescription_id")
        .populate("patient_id")
        .populate("doctor_id")
        .populate("verified_by")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, labtests, "All lab tests fetched successfully")
    );
});

// READ - Get all lab tests for a doctor
export const getalllabtestsfordoctor = asyncHandler(async (req, res) => {
    if (!req.doctor) {
        throw new apiError(401, "Unauthorized doctor request");
    }

    const labtests = await Labtest.find({ doctor_id: req.doctor._id })
        .populate("prescription_id")
        .populate("patient_id")
        .populate("doctor_id")
        .populate("verified_by")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, labtests, "All lab tests fetched successfully")
    );
});

// READ - Get all lab tests (for admin)
export const getalllabtests = asyncHandler(async (req, res) => {
    if (!req.admin) {
        throw new apiError(401, "Unauthorized admin request");
    }

    const labtests = await Labtest.find()
        .populate("prescription_id")
        .populate("patient_id")
        .populate("doctor_id")
        .populate("verified_by")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(200, labtests, "All lab tests fetched successfully")
    );
});

// READ - Get lab test by prescription ID
export const getlabtestbyprescription = asyncHandler(async (req, res) => {
    const { prescriptionid } = req.params;

    // Check authorization
    if (!req.patient && !req.doctor && !req.admin) {
        throw new apiError(401, "Unauthorized request");
    }

    const labtest = await Labtest.findOne({ prescription_id: prescriptionid })
        .populate("prescription_id")
        .populate("patient_id")
        .populate("doctor_id")
        .populate("verified_by");

    if (!labtest) {
        throw new apiError(404, "Lab test not found for this prescription");
    }

    // If patient, verify they own this lab test
    if (req.patient && labtest.patient_id._id.toString() !== req.patient._id.toString()) {
        throw new apiError(403, "You don't have access to this lab test");
    }

    // If doctor, verify they created or verified this lab test
    if (req.doctor && 
        labtest.doctor_id._id.toString() !== req.doctor._id.toString() && 
        (!labtest.verified_by || labtest.verified_by._id.toString() !== req.doctor._id.toString())) {
        throw new apiError(403, "You don't have access to this lab test");
    }

    return res.status(200).json(
        new apiResponse(200, labtest, "Lab test fetched successfully")
    );
});

// UPDATE - Update a lab test
export const updatelabtest = asyncHandler(async (req, res) => {
    const { labtestid } = req.params;
    const { tests, overall_status, report_date, attachments } = req.body;

    // Check authorization
    if (!req.doctor && !req.admin) {
        throw new apiError(401, "Unauthorized request");
    }

    const labtest = await Labtest.findById(labtestid);
    if (!labtest) {
        throw new apiError(404, "Lab test not found");
    }

    // If doctor, verify they created this lab test
    if (req.doctor && labtest.doctor_id.toString() !== req.doctor._id.toString()) {
        throw new apiError(403, "You don't have permission to update this lab test");
    }

    // Validate tests if provided
    if (tests) {
        if (!Array.isArray(tests) || tests.length === 0) {
            throw new apiError(400, "Tests must be a non-empty array");
        }
        for (const test of tests) {
            if (!test.test_name) {
                throw new apiError(400, "Each test must have a test_name");
            }
            if (test.status && !["ordered", "processing", "completed"].includes(test.status)) {
                throw new apiError(400, "Test status must be one of: ordered, processing, completed");
            }
        }
    }

    // Validate overall_status if provided
    if (overall_status && !["ordered", "processing", "completed"].includes(overall_status)) {
        throw new apiError(400, "Overall status must be one of: ordered, processing, completed");
    }

    // Build update object
    const updates = {};
    if (tests) updates.tests = tests;
    if (overall_status) updates.overall_status = overall_status;
    if (report_date !== undefined) updates.report_date = report_date ? new Date(report_date) : null;
    if (attachments !== undefined) updates.attachments = attachments;

    if (Object.keys(updates).length === 0) {
        throw new apiError(400, "At least one field is required to update");
    }

    const updatedLabtest = await Labtest.findByIdAndUpdate(
        labtestid,
        { $set: updates },
        { new: true }
    )
        .populate("prescription_id")
        .populate("patient_id")
        .populate("doctor_id")
        .populate("verified_by");

    if (!updatedLabtest) {
        throw new apiError(500, "Lab test update failed");
    }

    return res.status(200).json(
        new apiResponse(200, updatedLabtest, "Lab test updated successfully")
    );
});

// UPDATE - Update test results (for lab technicians/doctors)
export const updatetestresults = asyncHandler(async (req, res) => {
    const { labtestid } = req.params;
    const { test_index, parameters, result_summary, remarks, status } = req.body;

    // Check authorization
    if (!req.doctor && !req.admin) {
        throw new apiError(401, "Unauthorized request");
    }

    const labtest = await Labtest.findById(labtestid);
    if (!labtest) {
        throw new apiError(404, "Lab test not found");
    }

    if (test_index === undefined || test_index < 0 || test_index >= labtest.tests.length) {
        throw new apiError(400, "Invalid test index");
    }

    // Validate status if provided
    if (status && !["ordered", "processing", "completed"].includes(status)) {
        throw new apiError(400, "Test status must be one of: ordered, processing, completed");
    }

    // Update the specific test
    const test = labtest.tests[test_index];
    if (parameters !== undefined) test.parameters = parameters;
    if (result_summary !== undefined) test.result_summary = result_summary;
    if (remarks !== undefined) test.remarks = remarks;
    if (status !== undefined) test.status = status;

    // Update overall_status if all tests are completed
    const allTestsCompleted = labtest.tests.every(t => t.status === "completed");
    if (allTestsCompleted && labtest.overall_status !== "completed") {
        labtest.overall_status = "completed";
        labtest.report_date = new Date();
    }

    await labtest.save();

    const updatedLabtest = await Labtest.findById(labtestid)
        .populate("prescription_id")
        .populate("patient_id")
        .populate("doctor_id")
        .populate("verified_by");

    return res.status(200).json(
        new apiResponse(200, updatedLabtest, "Test results updated successfully")
    );
});

// UPDATE - Verify lab test (for doctors)
export const verifylabtest = asyncHandler(async (req, res) => {
    const { labtestid } = req.params;

    // Check authorization
    if (!req.doctor) {
        throw new apiError(401, "Unauthorized doctor request");
    }

    const labtest = await Labtest.findById(labtestid);
    if (!labtest) {
        throw new apiError(404, "Lab test not found");
    }

    // Check if lab test is completed
    if (labtest.overall_status !== "completed") {
        throw new apiError(400, "Lab test must be completed before verification");
    }

    // Update verification
    labtest.verified_by = req.doctor._id;
    labtest.verified_at = new Date();
    await labtest.save();

    const verifiedLabtest = await Labtest.findById(labtestid)
        .populate("prescription_id")
        .populate("patient_id")
        .populate("doctor_id")
        .populate("verified_by");

    return res.status(200).json(
        new apiResponse(200, verifiedLabtest, "Lab test verified successfully")
    );
});

// DELETE - Delete a lab test
export const deletelabtest = asyncHandler(async (req, res) => {
    const { labtestid } = req.params;

    // Check authorization
    if (!req.doctor && !req.admin) {
        throw new apiError(401, "Unauthorized request");
    }

    const labtest = await Labtest.findById(labtestid);
    if (!labtest) {
        throw new apiError(404, "Lab test not found");
    }

    // If doctor, verify they created this lab test
    if (req.doctor && labtest.doctor_id.toString() !== req.doctor._id.toString()) {
        throw new apiError(403, "You don't have permission to delete this lab test");
    }

    // Remove labtest reference from prescription
    await Prescription.findByIdAndUpdate(
        labtest.prescription_id,
        { $unset: { labtest: 1 } },
        { new: true }
    );

    await Labtest.findByIdAndDelete(labtestid);

    return res.status(200).json(
        new apiResponse(200, {}, "Lab test deleted successfully")
    );
});

