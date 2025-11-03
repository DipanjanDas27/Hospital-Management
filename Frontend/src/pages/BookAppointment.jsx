import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast, { Toaster } from "react-hot-toast";

import { checkAvailability, createAppointment } from "@/services/appointmentApi";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BookAppointment = () => {
  const { doctorid } = useParams();
  const dispatch = useDispatch();

  const { availability, loading, error } = useSelector(
    (state) => state.appointment
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date()); // ✅ Track currently viewed month

  // ✅ Fetch availability for a specific month
  const fetchAvailability = (date) => {
    dispatch(
      checkAvailability({
        doctorid,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      })
    );
  };

  // --- Fetch availability on mount ---
  useEffect(() => {
    fetchAvailability(new Date());
  }, [dispatch, doctorid]);

  // ✅ Handle month navigation in calendar
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentViewMonth(activeStartDate);
    fetchAvailability(activeStartDate);
  };

  // --- Handle date selection ---
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Clear selected time when date changes
  };

  // Fix timezone issue - use local date
  const selectedDateStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : null;

  const dayAvailability = availability?.find(
    (a) => a.date === selectedDateStr
  );
  
  const slotTimes = dayAvailability?.availableTimes || [];

  const onSubmit = async (data) => {
    if (!selectedDateStr || !selectedTime) {
      toast.error("Select a date and time first!");
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
        
        // Reset form and selections
        reset();
        setSelectedTime("");
        
        // Refresh availability for the current view month
        fetchAvailability(currentViewMonth);
      } else {
        toast.error(res.payload?.message || "Failed to book appointment");
      }
    } catch (err) {
      toast.error(err.message || "Error while booking appointment");
    }
  };

  // ✅ Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row gap-6 p-4">
        {/* Calendar Section */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Select Date</h2>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                onActiveStartDateChange={handleActiveStartDateChange} // ✅ Detect month navigation
                tileDisabled={({ date }) => {
                  // ✅ Disable past dates
                  const dateOnly = new Date(date);
                  dateOnly.setHours(0, 0, 0, 0);
                  
                  if (dateOnly < today) {
                    return true; // Disable past dates
                  }

                  // ✅ Check availability
                  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  const available = availability?.find((a) => a.date === dateStr);
                  
                  return !available?.isAvailable; // Disable if not available
                }}
                minDate={today} // ✅ Prevent selecting dates before today
              />
            </CardContent>
          </Card>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-2/3">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-semibold mb-2">Book Appointment</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  placeholder="Enter your symptoms"
                  {...register("symptoms", { required: true })}
                />
                {errors.symptoms && (
                  <p className="text-red-500 text-sm">Symptoms required</p>
                )}

                <Input
                  placeholder="Enter brief medical history"
                  {...register("medicalHistory")}
                />

                {/* Slot Selector */}
                {selectedDateStr && (
                  <>
                    <h3 className="font-medium mt-4 mb-2">
                      Available Time Slots
                    </h3>
                    {slotTimes.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {slotTimes.map((slot) => (
                          <Button
                            key={slot}
                            variant={
                              selectedTime === slot ? "default" : "outline"
                            }
                            onClick={() => setSelectedTime(slot)}
                            type="button"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No available slots for this date
                      </p>
                    )}
                  </>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full"
                >
                  {loading ? "Booking..." : "Book Appointment"}
                </Button>
              </form>

              {error && (
                <p className="text-red-500 text-sm mt-2">
                  Error: {error.message || error}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;