import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Calendar, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButton";

const AdminDashboardHeader = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

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

  const initials = user?.adminname
    ? user.adminname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* LEFT — Admin Profile Display */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-white shadow-xl object-cover">
              <AvatarImage
                src={user?.profilepicture}
                alt={user?.adminname}
              />
              <AvatarFallback className="bg-indigo-700 text-white text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-indigo-100 text-sm mb-1">{getGreeting()},</p>

              <h1 className="text-3xl font-bold mb-2">
                {user?.adminname || "Admin User"}
              </h1>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                  <Shield className="w-3 h-3 mr-1" />
                  System Administrator
                </Badge>

                <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Verified Access
                </Badge>
              </div>
            </div>
          </div>

          {/* RIGHT — Auth Buttons + Date */}
          <div className="flex flex-col items-end gap-4">
            {/* AUTH BUTTONS */}
            <div className="flex gap-3">
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="secondary"
                    className="bg-white text-indigo-700 hover:bg-white/80"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>

                  <Button
                    variant="secondary"
                    className="bg-white text-indigo-700 hover:bg-white/80"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <LogoutButton />
              )}
            </div>

            {/* DATE CARD */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-white" />
                <div>
                  <p className="text-indigo-100 text-xs mb-1">Today's Date</p>
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

export default AdminDashboardHeader;
