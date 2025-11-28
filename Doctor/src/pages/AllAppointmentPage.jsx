import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, ArrowLeft, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  getAllAppointments,
  getTodayAppointments
} from "@/services/appointmentApi";
import { getPrescriptionByAppointment } from "@/services/prescriptionApi";

const AllAppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 

  const isTodayPage = location.pathname === "/todayappointments";

  const { appointments, todayappointments, loading, error } = useSelector(
    (state) => state.doctorAppointment
  );

  // Determine which dataset to display
  const data = isTodayPage ? todayappointments : appointments;

  useEffect(() => {
    if (isTodayPage) {
      dispatch(getTodayAppointments());
    } else {
      dispatch(getAllAppointments());
    }
  }, [dispatch, isTodayPage]);
  
  const title = isTodayPage
    ? "Today's Appointments"
    : "All Appointments";

  const description = isTodayPage
    ? `You have ${data?.length || 0} appointments scheduled for today`
    : `Showing all past and upcoming appointments`;

  const getPatientName = (a) =>
    a?.patientdetails?.patientname ||
    a?.patientname ||
    "Unknown Patient";

  // Normalize initials safely
  const getInitials = (name) =>
    name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase() || "NA";

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load appointments. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50 py-8">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Calendar className="w-7 h-7 text-teal-600" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {data?.map((appointment, index) => {
              const name = getPatientName(appointment);
              return (
                <div key={appointment._id}>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">

                    {/* Avatar */}
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="w-12 h-12 border-2 border-teal-200">
                        <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                          {getInitials(name)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {name}
                          </h4>

                          <Badge
                            variant={
                              appointment.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {appointment.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.appointmenttime || "N/A"}
                          </span>
                          <span>•</span>
                          <span>{appointment.appointmenttype || "Appointment"}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="gap-2"
                      onClick={() => navigate(`/appointments/${appointment._id}`)}>
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    {}
                    <Button size="sm" variant="ghost" className="gap-2"
                      onClick={() => navigate(`/prescriptions/${appointment._id}/prescriptiondetails`)}>
                      View Prescription
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {index < data.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              );
            })}

            {data?.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No appointments available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllAppointmentsPage;
