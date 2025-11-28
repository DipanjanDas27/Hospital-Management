import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
  getPrescriptionDetails,
  updatePrescription,
  deletePrescription,
  getPrescriptionByAppointment,
} from "@/services/prescriptionApi";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Loader2,
  ArrowLeft,
  Pill,
  User,
  AlertCircle,
  Stethoscope,
  Building2,
  Trash2,
  Edit
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

import UpdatePrescriptionModal from "@/components/custom/UpdatePrescriptionModal";


const PrescriptionDetails = () => {
  const { prescriptionid } = useParams();
  const { appointmentid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { prescriptionDetails, loading, error } = useSelector(
    (state) => state.prescription
  );

  // fetch data
  console.log(error)
  useEffect(() => {
    if (appointmentid) {
      dispatch(getPrescriptionByAppointment(appointmentid))
    } else {
      dispatch(getPrescriptionDetails(prescriptionid));
    }
  }, [dispatch, appointmentid ,prescriptionid]);

  // Handle Update Submit
  const handleUpdateSubmit = (data) => {
    dispatch(
      updatePrescription({
        prescriptionId: prescriptionid,
        payload: data
      })
    )
      .unwrap()
      .then(() => {
        setEditOpen(false);
      });
  };

  // Handle Delete
  const handleDelete = () => {
    dispatch(deletePrescription(prescriptionid))
      .unwrap()
      .then(() => {
        setDeleteOpen(false);
        navigate("/prescriptions");
      });
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading prescription details...</p>
      </div>
    );
  }

  // ERROR UI
  if (error || !prescriptionDetails) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "No prescription details found."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!prescriptionDetails) return null;

  const { doctordetails, diagonosis, medicines, createdAt } =
    prescriptionDetails;


  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50 py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* BACK BUTTON */}
        <Button
          variant="ghost"
          onClick={() => navigate("/prescriptions")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* DETAILS CARD */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl flex items-center gap-2 text-gray-900">
                  <Pill className="w-7 h-7 text-teal-600" />
                  Prescription Details
                </CardTitle>
                <p className="text-gray-500">Review prescription information</p>
              </div>
              <Badge className="bg-teal-100 text-teal-700">
                {new Date(createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-10 py-8">

            {/* Doctor Info */}
            <section>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                Doctor Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Doctor Name</p>
                  <p className="font-semibold">Dr. {doctordetails.doctorname}</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 text-sm">Department</p>
                  <p className="font-semibold">{doctordetails.department}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Diagnosis */}
            <section>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                Diagnosis
              </h3>

              <div className="p-4 bg-teal-50 rounded-lg mt-3">
                <p className="font-medium">{diagonosis}</p>
              </div>
            </section>

            <Separator />

            {/* Medicines */}
            <section>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Pill className="w-5 h-5 text-teal-600" />
                Medicines ({medicines.length})
              </h3>

              <div className="space-y-4">
                {medicines.map((m, idx) => (
                  <Card key={idx} className="border">
                    <CardContent className="pt-5">
                      <p className="font-semibold text-lg">{m.medicinename}</p>
                      <div className="grid md:grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-500">Dosage</p>
                          <p className="font-medium">{m.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Frequency</p>
                          <p className="font-medium">{m.frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">{m.duration}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Separator />

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white gap-2"
                onClick={() => setEditOpen(true)}
              >
                <Edit className="w-4 h-4" />
                Update Prescription
              </Button>

              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Prescription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UPDATE MODAL */}
      <UpdatePrescriptionModal
        open={editOpen}
        setOpen={setEditOpen}
        prescriptionDetails={prescriptionDetails}
        onSubmitUpdate={handleUpdateSubmit}
      />

      {/* DELETE CONFIRMATION */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent
          className="
    max-w-md 
    bg-white              
    shadow-2xl 
    border border-red-200  
  "
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-700">
              Confirm Delete
            </DialogTitle>

            {/* Fix shadcn warning */}
            <DialogDescription className="sr-only">
              Confirm deletion of this prescription
            </DialogDescription>
          </DialogHeader>

          <p className="text-gray-700 mt-2">
            Are you sure you want to delete this prescription?
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default PrescriptionDetails;
