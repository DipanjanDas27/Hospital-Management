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
  User,
  ArrowRight,
  Award,
  Star
} from "lucide-react";

const DoctorCard = ({ doctor }) => {
  const {
    _id,
    doctorname,
    department,
    qualification,
    experience,
    specialization,
    verificationdocument,
  } = doctor;

  const doctorid = _id;
  const { deptname } = useParams();
  const navigate = useNavigate();

  const handleSelectDoctor = (doctorid, deptname) => {
    if (deptname) {
      navigate(`/departments/${deptname}/doctors/${doctorid}`);
    } else {
      navigate(`/doctors/${doctorid}`);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col bg-white">
      {/* Header with Avatar */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 p-6 pb-12">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
        
        <div className="relative flex flex-col items-center">
          <Avatar className="w-24 h-24 border-4 border-white shadow-xl mb-3 group-hover:scale-105 transition-transform duration-300">
            <AvatarImage
              src={verificationdocument?.profilepicture}
              alt={doctorname}
              className="object-cover"
            />
            <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
              {getInitials(doctorname)}
            </AvatarFallback>
          </Avatar>

          {/* Verified Badge */}
          <Badge className="bg-green-500 hover:bg-green-500 text-white gap-1 shadow-md">
            <Award className="w-3 h-3" />
            Verified
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex-1 p-6 -mt-6 relative">
        <div className="space-y-4">
          {/* Doctor Name */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              Dr. {doctorname}
            </h2>
            <p className="text-sm text-gray-500">{department}</p>
          </div>

          {/* Info Cards */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-blue-600" />
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
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Experience</p>
                <p className="text-sm font-semibold text-gray-900">
                  {experience}+ years
                </p>
              </div>
            </div>
          </div>

          {/* Rating (Optional - you can add this if you have ratings data) */}
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

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => handleSelectDoctor(doctorid, deptname)}
          className="w-full gap-2 group/btn"
        >
          View Profile
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;