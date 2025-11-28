import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast,{Toaster} from "react-hot-toast";

import { createPrescription } from "@/services/prescriptionApi";
import { getAppointmentDetails } from "@/services/appointmentApi";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import {
  Loader2,
  ArrowLeft,
  PlusCircle,
  Trash2,
  FileText,
  ClipboardList,
  Pill,
  TestTube2
} from "lucide-react";

const CreatePrescription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointmentid } = useParams();

  const { appointmentDetails, loading, error } = useSelector(
    (state) => state.doctorAppointment
  );

  useEffect(() => {
    dispatch(getAppointmentDetails(appointmentid));
  }, [dispatch, appointmentid]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      diagonosis: "",
      medicines: [
        { medicinename: "", dosage: "", frequency: "", duration: "" }
      ],
      labtest: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const onSubmit = async (data) => {
    const result = await dispatch(
      createPrescription({ appointmentid, payload: data })
    );

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Prescription created successfully!");
    }
  };

  if (loading || !appointmentDetails) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading appointment details...</p>
      </div>
    );
  }

  if (appointmentDetails.status !== "Completed") {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-6">
        <Alert variant="destructive" className="max-w-lg">
          <AlertDescription>
            Prescription can only be created for <strong>completed</strong> appointments.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50 py-12">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/appointments/${appointmentid}`)}
          className="mb-6 gap-2 text-teal-700 hover:text-teal-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <ClipboardList className="w-7 h-7 text-teal-600" />
              Create Prescription
            </CardTitle>
            <p className="text-gray-500">
              Fill in diagnosis, medicines, and optional lab tests for the patient.
            </p>
          </CardHeader>

          <CardContent className="space-y-10 py-6">

            {/* DIAGNOSIS SECTION */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                Diagnosis
              </h3>

              <Textarea
                placeholder="Enter diagnosis here..."
                className="bg-white"
                {...register("diagonosis", { required: "Diagnosis is required" })}
              />
              {errors.diagonosis && (
                <p className="text-red-500 text-sm">{errors.diagonosis.message}</p>
              )}
            </section>

            <Separator />

            {/* MEDICINES SECTION */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                Medicines
              </h3>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-white rounded-xl shadow border border-gray-100 space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    
                    <Input
                      placeholder="Medicine name"
                      {...register(`medicines.${index}.medicinename`, {
                        required: "Medicine name required",
                      })}
                    />
                    <Input
                      placeholder="Dosage (e.g. 500mg)"
                      {...register(`medicines.${index}.dosage`, {
                        required: "Dosage required",
                      })}
                    />
                    <Input
                      placeholder="Frequency (e.g. Twice a day)"
                      {...register(`medicines.${index}.frequency`, {
                        required: "Frequency required",
                      })}
                    />
                    <Input
                      placeholder="Duration (e.g. 5 days)"
                      {...register(`medicines.${index}.duration`, {
                        required: "Duration required",
                      })}
                    />
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                className="gap-2"
                onClick={() =>
                  append({
                    medicinename: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                  })
                }
              >
                <PlusCircle className="w-4 h-4" />
                Add Medicine
              </Button>
            </section>

            <Separator />

            {/* LAB TEST SECTION */}
            <section className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TestTube2 className="w-5 h-5 text-teal-600" />
                Lab Test (Optional)
              </h3>

              <Input
                placeholder="Enter lab test name (optional)"
                className="bg-white"
                {...register("labtest")}
              />
            </section>

            <Separator />

            {/* SUBMIT BUTTON */}
            <Button
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg gap-2"
            >
              <ClipboardList className="w-5 h-5" />
              Create Prescription
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePrescription;
