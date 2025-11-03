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
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UpdateAppointment = () => {
    const { appointmentid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { appointmentDetails, availability, loading } = useSelector(
        (state) => state.appointment
    );
    console.log("🔍 UpdateAppointment - appointmentid:", appointmentid);
    console.log("🔍 UpdateAppointment - Current URL:", window.location.pathname);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [currentViewMonth, setCurrentViewMonth] = useState(new Date());
    const [doctorId, setDoctorId] = useState(null);

    const { register, handleSubmit, reset } = useForm();

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
                medicalHistory: appointmentDetails.medicalHistory,
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
            toast.error("Select date and time first!");
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
            console.error("❌ Update error:", err);
        }
    };

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
                            <h2 className="text-xl font-semibold mb-2">Select New Date</h2>
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

                                    // ✅ Fix timezone issue
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
                            <h2 className="text-xl font-semibold mb-2">Update Appointment</h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Input
                                    label="Symptoms"
                                    placeholder="Enter your symptoms"
                                    {...register("symptoms", { required: true })}
                                />

                                <Input
                                    label="Medical History"
                                    placeholder="Enter brief medical history"
                                    {...register("medicalHistory")}
                                />

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
                                    {loading ? "Updating..." : "Update Appointment"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default UpdateAppointment;