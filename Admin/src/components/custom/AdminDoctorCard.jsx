import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";

import {
  GraduationCap,
  Briefcase,
  Stethoscope,
  Award,
  ArrowRight,
  Star
} from "lucide-react";

const AdminDoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const { deptname } = useParams();

  const {
    _id,
    doctorname,
    department,
    qualification,
    experience,
    specialization,
    verificationdocument,
  } = doctor;

  // Initials for fallback avatar
  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // 🧭 CONDITIONAL NAVIGATION (Admin → Doctor Profile)
  const handleViewProfile = () => {
    if (deptname) {
      navigate(`/departments/${deptname}/doctors/${_id}`);
    } else {
      navigate(`/doctors/${_id}`);
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col bg-white">

      {/* Header */}
      <div className="relative bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 pb-12">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>

        <div className="relative flex flex-col items-center">
          <Avatar className="w-24 h-24 border-4 border-white shadow-xl mb-3 group-hover:scale-105 transition-transform duration-300">
            <AvatarImage
              src={verificationdocument?.profilepicture}
              alt={doctorname}
              className="object-cover"
            />
            <AvatarFallback className="bg-white text-indigo-600 text-xl font-bold">
              {getInitials(doctorname)}
            </AvatarFallback>
          </Avatar>

          <Badge className="bg-green-500 hover:bg-green-500 text-white gap-1 shadow-md">
            <Award className="w-3 h-3" />
            Verified
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex-1 p-6 -mt-6 relative">
        <div className="space-y-4">

          {/* Name */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
              Dr. {doctorname}
            </h2>
            <p className="text-sm text-gray-500 capitalize">{department}</p>
          </div>

          {/* Info Cards */}
          <div className="space-y-2">

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Qualification</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {qualification}
                </p>
              </div>
            </div>

            {specialization && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Specialization</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {specialization}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-pink-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Experience</p>
                <p className="text-sm font-semibold text-gray-900">
                  {experience}+ years
                </p>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 pt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 ml-1">(4.0)</span>
          </div>
        </div>
      </CardContent>

      {/* View Profile Button */}
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleViewProfile}
          className="w-full gap-2 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90"
        >
          View Profile
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminDoctorCard;
