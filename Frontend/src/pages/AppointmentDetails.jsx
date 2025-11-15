import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getAppointmentDetails, cancelAppointment } from "@/services/appointmentApi";
import AppointmentCancelModal from "@/components/custom/AppointmentCancelModal";
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
  Loader2,
  Calendar,
  Clock,
  User,
  Building2,
  FileText,
  Activity,
  Edit,
  XCircle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const AppointmentDetails = () => {
  const { appointmentid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const { appointmentDetails, loading, error } = useSelector(
    (state) => state.appointment
  );


  const fetchappointment = () => {
    dispatch(getAppointmentDetails(appointmentid));
  };

  useEffect(() => {
    fetchappointment();
  }, [dispatch, appointmentid]);

  const handleCancelConfirm = async () => {
    try {
      await dispatch(cancelAppointment(appointmentid)).unwrap();
      fetchappointment();
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to cancel appointment. Try again.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { variant: "secondary", icon: Clock, color: "text-yellow-600 bg-yellow-100" },
      Confirmed: { variant: "default", icon: CheckCircle2, color: "text-green-600 bg-green-100" },
      Cancelled: { variant: "destructive", icon: XCircle, color: "text-red-600 bg-red-100" },
      Completed: { variant: "outline", icon: CheckCircle2, color: "text-blue-600 bg-blue-100" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
    status 
  } = appointmentDetails;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/appointments")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Appointments
        </Button>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">
                  Appointment Details
                </CardTitle>
                <p className="text-gray-500">
                  View and manage your appointment information
                </p>
              </div>
              {getStatusBadge(status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Doctor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Doctor Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Doctor Name</p>
                    <p className="font-semibold text-gray-900">
                      Dr. {doctordetails.doctorname}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Department</p>
                    <p className="font-semibold text-gray-900">
                      {doctordetails.department}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Appointment Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Schedule
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-600 mb-1">Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(appointmentdate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-600 mb-1">Time</p>
                    <p className="font-semibold text-gray-900">{appointmenttime}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Medical Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Medical Information
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-2">
                    <Activity className="w-5 h-5 text-gray-600 mt-0.5" />
                    <p className="text-sm text-gray-500">Symptoms</p>
                  </div>
                  <p className="text-gray-900 ml-8">{symptoms}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-2">
                    <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                    <p className="text-sm text-gray-500">Medical History</p>
                  </div>
                  <p className="text-gray-900 ml-8">
                    {medicalhistory || "No medical history provided"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                className="flex-1 gap-2"
                onClick={() =>
                  navigate(`/appointments/updateAppointment/${appointmentid}`)
                }
                disabled={status === "Cancelled" || status === "Completed"}
              >
                <Edit className="w-4 h-4" />
                Update Appointment
              </Button>

              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={() => setOpenModal(true)}
                disabled={status === "Cancelled" || status === "Completed"}
              >
                <XCircle className="w-4 h-4" />
                {status === "Cancelled" ? "Already Cancelled" : "Cancel Appointment"}
              </Button>
            </div>

            {(status === "Cancelled" || status === "Completed") && (
              <Alert className="bg-gray-50 border-gray-200">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                <AlertDescription className="text-gray-600">
                  This appointment cannot be modified as it is {status}.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <AppointmentCancelModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
};

export default AppointmentDetails;