import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import {
  getAppointmentDetails,
  verifyappointment
} from "@/services/appointmentApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
  Loader2,
  Calendar,
  Clock,
  User,
  FileText,
  Activity,
  ArrowLeft,
  XCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getPrescriptionByAppointment } from "@/services/prescriptionApi";

const AppointmentDetails = () => {
  const { appointmentid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { appointmentDetails, verificationstatus, loading, error } = useSelector(
    (state) => state.doctorAppointment
  );
  const { prescriptionDetails } = useSelector(
    (state) => state.prescription
  );

  // Modal state
  const [open, setOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    dispatch(getAppointmentDetails(appointmentid));
  }, [dispatch, appointmentid]);

  useEffect(() => {
    dispatch(getPrescriptionByAppointment(appointmentid));
  }, [dispatch, appointmentid]);

  const handleVerify = () => {
    if (!verifyCode.trim()) {
      return setVerifyError("Verification code is required");
    }

    setVerifyError("");

    dispatch(
      verifyappointment({
        appointmentid,
        code: verifyCode,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setOpen(false);
        toast.success("Appointment verified successfully!");
      } else {
        setVerifyError(
          res.payload?.message || "Invalid verification code"
        );
      }
    })
  };
  const getStatusBadge = (status) => {
    const config = {
      Pending: {
        color: "bg-yellow-100 text-yellow-700",
        icon: Clock,
      },
      Confirmed: {
        color: "bg-green-100 text-green-700",
        icon: CheckCircle2,
      },
      Cancelled: {
        color: "bg-red-100 text-red-700",
        icon: XCircle,
      },
      Completed: {
        color: "bg-blue-100 text-blue-700",
        icon: CheckCircle2,
      },
    };

    const Info = config[status] || config.Pending;
    const Icon = Info.icon;

    return (
      <Badge className={`${Info.color} gap-1 border-none`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!appointmentDetails) return null;

  const {
    doctordetails,
    symptoms,
    medicalhistory,
    appointmentdate,
    appointmenttime,
    status,
  } = appointmentDetails;

  const isToday =
    new Date(appointmentdate).toDateString() === new Date().toDateString();

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50 py-12">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/appointments")}
          className="mb-6 gap-2 text-teal-700 hover:text-teal-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Appointments
        </Button>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4 pb-0">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Appointment Details
                </CardTitle>
                <p className="text-gray-500 mt-1">
                  Full information about this appointment
                </p>
              </div>
              {getStatusBadge(status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-10 py-8">

            {/* Doctor Info */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                <User className="w-5 h-5 text-teal-600" />
                Doctor Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-teal-50">
                  <p className="text-sm text-gray-500 mb-1">Doctor Name</p>
                  <p className="font-semibold text-gray-900">
                    Dr. {doctordetails.doctorname}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl shadow-sm border border-teal-50">
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="font-semibold text-gray-900">
                    {doctordetails.department}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Schedule */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Schedule
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50 rounded-xl shadow-sm">
                  <p className="text-sm text-teal-700 mb-1">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(appointmentdate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="p-4 bg-teal-50 rounded-xl shadow-sm">
                  <p className="text-sm text-teal-700 mb-1">Time</p>
                  <p className="font-semibold text-gray-900">
                    {appointmenttime}
                  </p>
                </div>
              </div>
            </section>
 
            <Separator />

            {/* Medical Details */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                Medical Information
              </h3>

              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-1">
                  <Activity className="w-5 h-5 text-gray-600 mt-0.5" />
                  <p className="text-sm text-gray-500">Symptoms</p>
                </div>
                <p className="text-gray-900 ml-8">{symptoms}</p>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-1">
                  <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                  <p className="text-sm text-gray-500">Medical History</p>
                </div>
                <p className="text-gray-900 ml-8">
                  {medicalhistory || "No medical history provided"}
                </p>
              </div>
            </section>

            <Separator />

            {isToday && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  className="flex-1 gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={() =>
                    navigate(`/prescription/${appointmentid}/createprescription`)
                  }
                  disabled={prescriptionDetails}
                >
                  {prescriptionDetails ? "Prescription Created" : "Create Prescription"}
                </Button>

                {/* Verify Button → Open Modal */}
                <Button
                  className={`flex-1 gap-2 border ${verificationstatus
                    ? "bg-green-100 text-green-700 border-green-200 cursor-not-allowed"
                    : "bg-white text-teal-700 border-teal-300 hover:bg-teal-50"
                    }`}
                  onClick={() => setOpen(true)}
                  disabled={status === "Completed"}
                >
                  {status === "Completed" ? "Verified" : "Verify Appointment"}
                </Button>
              </div>
            )}

            {/* Verification MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="max-w-sm bg-white shadow-xl border border-teal-200">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    Enter Verification Code
                  </DialogTitle>

                  <DialogDescription className="text-sm text-gray-600">
                    A unique verification code is required to verify this appointment.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                  <Input
                    placeholder="Enter unique code"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    className="border-teal-300 focus:border-teal-500"
                  />

                  {verifyError && (
                    <p className="text-red-600 text-sm">{verifyError}</p>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>

                  <Button
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => handleVerify()}
                  >
                    Verify
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>


          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentDetails;
