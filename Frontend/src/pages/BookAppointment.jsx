import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast, { Toaster } from "react-hot-toast";
import { checkAvailability, createAppointment } from "@/services/appointmentApi";
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
  Stethoscope
} from "lucide-react";

const BookAppointment = () => {
  const { doctorid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { availability, loading, error } = useSelector((state) => state.appointment);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());

  const fetchAvailability = (date) => {
    dispatch(
      checkAvailability({
        doctorid,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      })
    );
  };

  useEffect(() => {
    fetchAvailability(new Date());
  }, [dispatch, doctorid]);

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
      symptoms: data.symptoms,
      medicalhistory: data.medicalHistory || "",
      appointmentdate: selectedDateStr,
      appointmenttime: selectedTime,
    };

    try {
      const res = await dispatch(createAppointment({ doctorId: doctorid, payload }));

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Appointment booked successfully!");
        reset();
        setSelectedTime("");
        setSelectedDate(null);
        fetchAvailability(currentViewMonth);
      } else {
        toast.error(res.payload?.message || "Failed to book appointment");
      }
    } catch (err) {
      toast.error(err.message || "Error while booking appointment");
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Stethoscope className="w-3 h-3 mr-1" />
            Book Appointment
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Schedule Your Visit
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select your preferred date and time slot to book an appointment with your doctor
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <Card className="shadow-lg border-0 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                Select Date
              </CardTitle>
              <CardDescription>
                Choose an available date for your appointment
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
                    Selected: <strong>{selectedDate.toLocaleDateString()}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Appointment Details
              </CardTitle>
              <CardDescription>
                Fill in your details and select a time slot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Symptoms */}
                <div className="space-y-2">
                  <Label htmlFor="symptoms" className="text-base font-medium">
                    Symptoms *
                  </Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms in detail..."
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

                {/* Medical History */}
                <div className="space-y-2">
                  <Label htmlFor="medicalHistory" className="text-base font-medium">
                    Medical History <span className="text-gray-400 text-sm">(Optional)</span>
                  </Label>
                  <Textarea
                    id="medicalHistory"
                    placeholder="Any previous medical conditions, allergies, medications..."
                    rows={3}
                    {...register("medicalHistory")}
                  />
                </div>

                <Separator />

                {/* Time Slot Selection */}
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
                              Time selected: <strong>{selectedTime}</strong>
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          No available slots for this date. Please select another date.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {!selectedDateStr && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-900">
                      Please select a date first to view available time slots
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error.message || error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !selectedDateStr || !selectedTime}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Confirm Appointment
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
        .appointment-calendar :global(.react-calendar__tile--active:hover) {
          background: #1d4ed8;
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

export default BookAppointment;

