import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  Award, 
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const DashboardHeader = ({ profile, isAuthenticated }) => {
  const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="bg-linear-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white shadow-lg">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Left — Doctor Profile */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-white shadow-xl Objecr-cover">
              <AvatarImage
                src={profile?.verificationdocument?.profilepicture}
                alt={profile?.doctorname}
              />
              <AvatarFallback className="bg-teal-700 text-white text-2xl font-bold">
                {profile?.doctorname?.charAt(0) || "D"}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-teal-100 text-sm mb-1">{getGreeting()},</p>
              <h1 className="text-3xl font-bold mb-2">
                Dr. {profile?.doctorname || "Doctor"}
              </h1>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                  <Stethoscope className="w-3 h-3 mr-1" />
                  {profile?.department || "General"}
                </Badge>

                <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                  <Award className="w-3 h-3 mr-1" />
                  {profile?.experience || "5"}+ Years
                </Badge>
              </div>
            </div>
          </div>

          {/* Right — Buttons + Date */}
          <div className="flex flex-col items-end gap-4">

            {/* 🔸 AUTH BUTTONS */}
            <div className="flex gap-3">
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="secondary"
                    className="bg-white text-teal-700 hover:bg-white/80"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>

                  <Button
                    variant="secondary"
                    className="bg-white text-teal-700 hover:bg-white/80"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <LogoutButton/>
              )}
            </div>

            {/* 🔸 DATE CARD */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-white" />
                <div>
                  <p className="text-teal-100 text-xs mb-1">Today's Date</p>
                  <p className="font-semibold text-white">{currentDate}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
