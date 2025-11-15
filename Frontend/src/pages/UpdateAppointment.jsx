import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast, { Toaster } from "react-hot-toast";
import {
  getAppointmentDetails,
  updateAppointment,
  checkAvailability,
} from "@/services/appointmentApi";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Edit
} from "lucide-react";

const UpdateAppointment = () => {
  const { appointmentid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { appointmentDetails, availability, loading } = useSelector(
    (state) => state.appointment
  );
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());
  const [doctorId, setDoctorId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchAvailability = (date) => {
    if (doctorId) {
      dispatch(
        checkAvailability({
          doctorid: doctorId,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        })
      );
    }
  };

  useEffect(() => {
    dispatch(getAppointmentDetails(appointmentid));
  }, [dispatch, appointmentid]);

  useEffect(() => {
    if (appointmentDetails) {
      reset({
        symptoms: appointmentDetails.symptoms,
        medicalHistory: appointmentDetails.medicalhistory,
      });

      const docId = appointmentDetails.doctordetails._id;
      setDoctorId(docId);

      const now = new Date();
      dispatch(
        checkAvailability({
          doctorid: docId,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        })
      );
    }
  }, [appointmentDetails, dispatch, reset]);

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentViewMonth(activeStartDate);
    fetchAvailability(activeStartDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const selectedDateStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : null;

  const dayAvailability = availability?.find((a) => a.date === selectedDateStr);
  const slotTimes = dayAvailability?.availableTimes || [];

  const onSubmit = async (data) => {
    if (!selectedDateStr || !selectedTime) {
      toast.error("Please select both date and time!");
      return;
    }

    const payload = {
      appointmentdate: selectedDateStr,
      appointmenttime: selectedTime,
      symptoms: data.symptoms,
      medicalHistory: data.medicalHistory,
    };

    try {
      const res = await dispatch(updateAppointment({ appointmentid, payload }));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Appointment updated successfully!");
        navigate(`/appointments/${appointmentid}`);
      } else {
        toast.error(res.payload?.message || "Update failed");
      }
    } catch (err) {
      toast.error(err.message || "Error updating appointment");
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (loading && !appointmentDetails) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading appointment details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Edit className="w-3 h-3 mr-1" />
            Update Appointment
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Reschedule Your Appointment
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a new date and time slot for your appointment
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                Select New Date
              </CardTitle>
              <CardDescription>
                Choose an available date to reschedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="appointment-calendar">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  onActiveStartDateChange={handleActiveStartDateChange}
                  tileDisabled={({ date }) => {
                    const dateOnly = new Date(date);
                    dateOnly.setHours(0, 0, 0, 0);
                    if (dateOnly < today) return true;
                    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    const available = availability?.find((a) => a.date === dateStr);
                    return !available?.isAvailable;
                  }}
                  minDate={today}
                  className="w-full border-0 rounded-lg"
                />
              </div>
              {selectedDate && (
                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    New date: <strong>{selectedDate.toLocaleDateString()}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Update Details
              </CardTitle>
              <CardDescription>
                Modify your appointment information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="symptoms" className="text-base font-medium">
                    Symptoms *
                  </Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms..."
                    rows={4}
                    {...register("symptoms", { 
                      required: "Symptoms are required",
                      minLength: {
                        value: 10,
                        message: "Please provide more details (min 10 characters)"
                      }
                    })}
                    className={errors.symptoms ? "border-red-500" : ""}
                  />
                  {errors.symptoms && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.symptoms.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalHistory" className="text-base font-medium">
                    Medical History
                  </Label>
                  <Textarea
                    id="medicalHistory"
                    placeholder="Any medical history..."
                    rows={3}
                    {...register("medicalHistory")}
                  />
                </div>

                <Separator />

                {selectedDateStr && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-lg">
                        Available Time Slots
                      </h3>
                    </div>

                    {slotTimes.length > 0 ? (
                      <>
                        <div className="grid grid-cols-3 gap-3">
                          {slotTimes.map((slot) => (
                            <Button
                              key={slot}
                              variant={selectedTime === slot ? "default" : "outline"}
                              onClick={() => setSelectedTime(slot)}
                              type="button"
                              className={`h-12 ${selectedTime === slot ? "ring-2 ring-blue-600 ring-offset-2" : ""}`}
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                        {selectedTime && (
                          <Alert className="bg-green-50 border-green-200">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-900">
                              New time: <strong>{selectedTime}</strong>
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          No available slots for this date.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {!selectedDateStr && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-900">
                      Please select a new date to view available slots
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading || !selectedDateStr || !selectedTime}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Update Appointment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .appointment-calendar :global(.react-calendar) {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        .appointment-calendar :global(.react-calendar__tile--active) {
          background: #2563eb;
          color: white;
        }
        .appointment-calendar :global(.react-calendar__tile:disabled) {
          background-color: #f3f4f6;
          color: #9ca3af;
        }
        .appointment-calendar :global(.react-calendar__tile:enabled:hover) {
          background-color: #dbeafe;
        }
      `}</style>
    </div>
  );
};

export default UpdateAppointment;