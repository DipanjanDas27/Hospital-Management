import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { getAppointments } from "@/services/adminApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

const AppointmentDetails = () => {
  const { appointmentid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { appointmentDetails, loading, error } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if (appointmentid) {
      dispatch(getAppointments(appointmentid));
    }
  }, [dispatch, appointmentid]);

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
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load appointment"}
          </AlertDescription>
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

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2 text-indigo-700 hover:text-indigo-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
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
                <User className="w-5 h-5 text-indigo-600" />
                Doctor Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-indigo-50">
                  <p className="text-sm text-gray-500 mb-1">Doctor Name</p>
                  <p className="font-semibold text-gray-900">
                    Dr. {doctordetails?.doctorname || "N/A"}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl shadow-sm border border-indigo-50">
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="font-semibold text-gray-900">
                    {doctordetails?.department || "N/A"}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Schedule */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Schedule
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-xl shadow-sm">
                  <p className="text-sm text-indigo-700 mb-1">Date</p>
                  <p className="font-semibold text-gray-900">
                    {appointmentdate
                      ? new Date(appointmentdate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-xl shadow-sm">
                  <p className="text-sm text-indigo-700 mb-1">Time</p>
                  <p className="font-semibold text-gray-900">{appointmenttime || "N/A"}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Medical Details */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Medical Information
              </h3>

              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-1">
                  <Activity className="w-5 h-5 text-gray-600 mt-0.5" />
                  <p className="text-sm text-gray-500">Symptoms</p>
                </div>
                <p className="text-gray-900 ml-8">{symptoms || "N/A"}</p>
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

            {/* Note: Verify / Prescription actions removed as requested */}

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentDetails;
