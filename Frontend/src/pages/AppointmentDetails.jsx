import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getAppointmentDetails, cancelAppointment } from "@/services/appointmentApi";
import AppointmentCancelModal from "@/components/custom/AppointmentCancelModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AppointmentDetails = () => {
  const { appointmentid } = useParams();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
   console.log("📍 AppointmentDetails - appointmentid:", appointmentid);
  console.log("📍 Current URL:", window.location.pathname);


  const { appointmentDetails, loading, error } = useSelector(
    (state) => state.appointment
  );

  useEffect(() => {
    dispatch(getAppointmentDetails(appointmentid));
  }, [dispatch, appointmentid]);

  const handleCancelConfirm = async () => {
    try {
      await dispatch(cancelAppointment(appointmentid)).unwrap();
      alert("Appointment cancelled successfully!");
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to cancel appointment. Try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  if (error)
    return <p className="text-red-600 text-center mt-10">{error}</p>;

  if (!appointmentDetails) return null;

  const { doctordetails, symptoms, medicalhistory, appointmentdate, appointmenttime, status } =
    appointmentDetails;

  return (
    <div className="flex justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-4 space-y-3">
          <h2 className="text-2xl font-semibold text-center">Appointment Details</h2>
          <p><b>Doctor:</b> {doctordetails.doctorname}</p>
          <p><b>Department:</b> {doctordetails.department}</p>
          <p><b>Date:</b> {new Date(appointmentdate).toLocaleDateString()}</p>
          <p><b>Time:</b> {appointmenttime}</p>
          <p><b>Symptoms:</b> {symptoms}</p>
          <p><b>Medical History:</b> {medicalhistory || "N/A"}</p>
          <p><b>Status:</b> {status}</p>

          <Button
            className="w-full"
            onClick={() => navigate(`/appointments/updateAppointment/${appointmentid}`)}
          >
            Update Appointment
          </Button>

          <Button
            className="w-full"
            onClick={() => setOpenModal(true)}
            disabled={status === "cancelled"}
          >
            {status === "cancelled" ? "Cancelled" : "Cancel Appointment"}
          </Button>
        </CardContent>
      </Card>

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
