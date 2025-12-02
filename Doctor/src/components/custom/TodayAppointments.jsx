import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getTodayAppointments } from "@/services/appointmentApi";

const TodayAppointments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { todayappointments, loading, error } = useSelector(
    (state) => state.doctorAppointment
  );

  useEffect(() => {
    dispatch(getTodayAppointments());
  }, [dispatch]);

  if (loading) {
    return (
      <Card className="border-0 shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            Failed to Load Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.message || "Something went wrong while fetching appointments."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="w-6 h-6 text-teal-600" />
              Today's Appointments
            </CardTitle>
            <CardDescription className="mt-2">
              You have {todayappointments?.length || 0} appointments scheduled for today
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => navigate("/todayappointments")}>
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {todayappointments?.slice(0, 4).map((appointment, index) => (
          <div key={appointment._id}>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <Avatar className="w-12 h-12 border-2 border-teal-200">
                  <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                    {appointment.patientdetails?.patientname
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "P"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {appointment.patientdetails?.patientname || "Patient"}
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
                      {appointment.appointmenttime}
                    </span>
                    {appointment.type && (
                      <>
                        <span>•</span>
                        <span>{appointment.type}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="gap-2"
                onClick={() => navigate(`/appointments/${appointment._id}`)}
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {index < (todayappointments?.length || 0) - 1 && <Separator className="my-4" />}
          </div>
        ))}

        {(!todayappointments || todayappointments.length === 0) && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No appointments scheduled for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayAppointments;