import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAppointments } from "@/services/appointmentApi";
import AppointmentCard from "@/components/custom/AppointmentCard";
import { Loader2 } from "lucide-react";

const AllAppointments = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector(
    (state) => state.appointment
  );

  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-10">
        Failed to load appointments
      </div>
    );

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {appointments?.length > 0 ? (
        appointments.map((appt) => (
          <AppointmentCard key={appt._id} appointment={appt} />
        ))
      ) : (
        <p className="text-gray-600 text-center col-span-full">
          No appointments found.
        </p>
      )}
    </div>
  );
};

export default AllAppointments;
