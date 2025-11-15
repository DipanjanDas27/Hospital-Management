import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfileDetails } from "@/services/patientApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Mail, Phone, Calendar, Edit, Lock, Building2 } from "lucide-react";

const PatientProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, loading } = useSelector((state) => state.patient || {});

  useEffect(() => {
    dispatch(getProfileDetails());
  }, [dispatch]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2 flex items-center gap-2">
                  <User className="w-8 h-8 text-blue-600" />
                  Profile Information
                </CardTitle>
                <p className="text-gray-500">
                  View and manage your personal information
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b">
              <div className="relative">
                <img
                  src={profile.profilepicture || "/placeholder-user.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.patientname}
                </h2>
                <Badge variant="secondary" className="mb-2">
                  {profile.patientusername}
                </Badge>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 mt-2">
                  <Mail className="w-4 h-4" />
                  <p className="text-sm">{profile.email}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="font-semibold text-gray-900">{profile.phonenumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Age</p>
                    <p className="font-semibold text-gray-900">{profile.age} years</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Sex</p>
                    <p className="font-semibold text-gray-900">{profile.sex}</p>
                  </div>
                </div>

                {profile.guardianName && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Guardian Name</p>
                      <p className="font-semibold text-gray-900">{profile.guardianName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => navigate("/profile/updateprofile")}
                className="flex-1 gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>

              <Button
                onClick={() => navigate("/update-password")}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientProfile;
