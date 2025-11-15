import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Building2,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

const AppointmentCard = ({ appointment }) => {
  const navigate = useNavigate();
  const { _id, doctordetails, appointmentdate, appointmenttime, status } = appointment;

  // Status configuration
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    const configs = {
      confirmed: {
        icon: CheckCircle2,
        className: "bg-green-100 text-green-700 border-green-200",
        label: "Confirmed"
      },
      pending: {
        icon: Clock,
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        label: "Pending"
      },
      cancelled: {
        icon: XCircle,
        className: "bg-red-100 text-red-700 border-red-200",
        label: "Cancelled"
      },
      completed: {
        icon: CheckCircle2,
        className: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Completed"
      },
    };

    return configs[statusLower] || configs.pending;
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  // Format date
  const formattedDate = new Date(appointmentdate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col bg-white">
      {/* Status Header Bar */}
      <div className={`h-2 ${statusConfig.className.includes('green') ? 'bg-green-500' : statusConfig.className.includes('yellow') ? 'bg-yellow-500' : statusConfig.className.includes('red') ? 'bg-red-500' : 'bg-blue-500'}`} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
              Dr. {doctordetails.doctorname}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>{doctordetails.department}</span>
            </div>
          </div>
          <Badge className={`${statusConfig.className} gap-1 border`}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 pt-4 pb-4 space-y-3">
        {/* Date */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Appointment Date</p>
            <p className="text-sm font-semibold text-gray-900">{formattedDate}</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Time Slot</p>
            <p className="text-sm font-semibold text-gray-900">{appointmenttime}</p>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="pt-4">
        <Button
          onClick={() => navigate(`/appointments/${_id}`)}
          className="w-full gap-2 group/btn"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentCard;