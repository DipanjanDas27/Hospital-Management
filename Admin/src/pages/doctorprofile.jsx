import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  adminGetDoctorDetails
} from "@/services/adminApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  GraduationCap,
  Briefcase,
  Stethoscope,
  Award,
  Clock,
  FileText,
  ArrowLeft,
  Users
} from "lucide-react";

const AdminDoctorProfile = () => {
  const { doctorid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctorDetails, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(adminGetDoctorDetails(doctorid));
  }, [doctorid, dispatch]);

  if (loading || !doctorDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  const profile = doctorDetails;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2 text-indigo-700 hover:text-indigo-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header Card */}
        <Card className="shadow-xl border-0 overflow-hidden mb-10">
          <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

              <div className="relative">
                <img
                  src={profile.verificationdocument?.profilepicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-xl"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-1">
                  Dr. {profile.doctorname}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                  <Badge className="bg-white/20 text-white border-0">
                    <Building2 className="w-3 h-3 mr-1" />
                    {profile.department}
                  </Badge>

                  <Badge className="bg-white/20 text-white border-0">
                    <User className="w-3 h-3 mr-1" />
                    {profile.doctorusername}
                  </Badge>

                  <Badge className="bg-white/20 text-white border-0">
                    <Stethoscope className="w-3 h-3 mr-1" />
                    {profile.specialization || "General"}
                  </Badge>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <Mail className="w-4 h-4 text-indigo-100" />
                  <p className="text-sm">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Experience & Qualification */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Professional Stats
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <Briefcase className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-indigo-700">
                    {profile.experience}+
                  </p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-purple-700">
                    {profile.qualification}
                  </p>
                  <p className="text-sm text-gray-600">Qualification</p>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Documents
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {["aadhar", "medicaldegree", "medicallicense"].map((doc) => (
                  profile.verificationdocument?.[doc] && (
                    <a
                      key={doc}
                      href={profile.verificationdocument[doc]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <p className="font-medium text-gray-900 capitalize">
                        {doc.replace(/([A-Z])/g, " $1")}
                      </p>
                      <p className="text-xs text-indigo-600">View Document →</p>
                    </a>
                  )
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Info */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-6 h-6 text-indigo-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">

                  {/* Phone */}
                  <InfoCard
                    icon={Phone}
                    title="Phone Number"
                    value={profile.phonenumber}
                  />

                  {/* Age */}
                  <InfoCard
                    icon={Calendar}
                    title="Age"
                    value={`${profile.age} years`}
                  />

                  {/* Gender */}
                  <InfoCard
                    icon={User}
                    title="Gender"
                    value={profile.sex}
                  />

                  {/* Email */}
                  <InfoCard
                    icon={Mail}
                    title="Email"
                    value={profile.email}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Info */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-indigo-600" />
                  Professional Details
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">

                  <InfoCard
                    icon={Building2}
                    title="Department"
                    value={profile.department}
                  />

                  <InfoCard
                    icon={GraduationCap}
                    title="Qualification"
                    value={profile.qualification}
                  />

                  <InfoCard
                    icon={Briefcase}
                    title="Experience"
                    value={`${profile.experience}+ years`}
                  />
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

/* Small Reusable Info Card Component */
const InfoCard = ({ icon: Icon, title, value }) => (
  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
    <Icon className="w-5 h-5 text-indigo-600 mt-0.5" />
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default AdminDoctorProfile;
