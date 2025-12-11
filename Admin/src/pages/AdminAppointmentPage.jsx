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
import {
  Calendar,
  Clock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  adminGetAllAppointments,
  adminGetTodayAppointments,
} from "@/services/adminApi";

const AdminAppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isTodayPage = location.pathname === "/todayappointments";

  const {
    allAppointments,
    todayAppointments,
    loading,
    error,
  } = useSelector((state) => state.admin);

  const data = isTodayPage ? todayAppointments : allAppointments;

  useEffect(() => {
    if (isTodayPage) dispatch(adminGetTodayAppointments());
    else dispatch(adminGetAllAppointments());
  }, [dispatch, isTodayPage]);

  const title = isTodayPage
    ? "Today's Appointments"
    : "All Appointments";

  const description = isTodayPage
    ? `You have ${data?.length || 0} appointments for today`
    : `Viewing all appointments across all dates`;

  const getName = (a) =>
    a?.patientdetails?.patientname ||
    a?.patientname ||
    "Unknown Patient";

  const getInitials = (name) =>
    name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase() || "NA";

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-3" />
        <p className="text-gray-600 font-medium">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Failed to load appointments. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2 text-indigo-700 hover:text-indigo-900"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Appointments Card */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Calendar className="w-7 h-7 text-indigo-600" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {data?.map((appointment, index) => {
              const name = getName(appointment);

              return (
                <div key={appointment._id}>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                    
                    {/* Avatar + Patient info */}
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="w-12 h-12 border-2 border-indigo-200">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">
                          {getInitials(name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900">{name}</h4>

                          <Badge
                            variant={
                              appointment.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs capitalize"
                          >
                            {appointment.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {appointment.appointmenttime}
                          </span>
                          <span>•</span>
                          <span>{appointment.appointmenttype || "Appointment"}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Details */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 text-indigo-600 hover:text-indigo-800"
                      onClick={() => navigate(`/admin/appointments/${appointment._id}`)}
                    >
                      View Details <ArrowRight className="w-4 h-4" />
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

export default AdminAppointmentsPage;
