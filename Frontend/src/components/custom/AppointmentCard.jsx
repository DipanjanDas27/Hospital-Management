import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AppointmentCard = ({ appointment }) => {
  const navigate = useNavigate();
  const { _id, doctordetails, appointmentdate, appointmenttime, status } = appointment;

  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {doctordetails.doctorname} ({doctordetails.department})
        </h3>
        <p className="text-sm text-gray-600">
          Date: {new Date(appointmentdate).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600">Time: {appointmenttime}</p>
        <p
          className={`text-sm font-medium ${
            status === "Confirmed"
              ? "text-green-600"
              : status === "Pending"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          Status: {status}
        </p>

        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/appointments/${_id}`)}
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card> 
  );
};

export default AppointmentCard;
