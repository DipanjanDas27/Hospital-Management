// UpdateProfile.jsx - Doctor Profile Update with Medical Theme
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import ShiftManagement from "./ShiftManagement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  User,
  Edit,
  Upload,
  AlertCircle,
  ArrowLeft,
  FileText,
  GraduationCap,
  Briefcase,
  Building2,
  Phone,
  Mail,
  Calendar,
  Stethoscope,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getDoctorProfile,
  updateDoctorDocuments,
  updateDoctorProfile,
  updateDoctorProfilePic,
} from "@/services/doctorApi";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading, error } = useSelector((state) => state.doctor || {});

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [medicalDegree, setMedicalDegree] = useState(null);
  const [medicalLicense, setMedicalLicense] = useState(null);
  const [shifts, setShifts] = useState([]);


  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchProfile = () => {
    dispatch(getDoctorProfile());
  };

  useEffect(() => {
    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        doctorname: profile.doctorname,
        email: profile.email,
        phonenumber: profile.phonenumber,
        age: profile.age,
        sex: profile.sex,
        experience: profile.experience,
        qualification: profile.qualification,
        specialization: profile.specialization,
        department: profile.department,
      });
      setShifts(profile.shift || []);
      setProfilePicPreview(profile.verificationdocument?.profilepicture);
    }
  }, [profile, reset]);

  useEffect(() => {
    if (profilePicFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(profilePicFile);
    }
  }, [profilePicFile]);

  const onSubmit = async (data) => {
    const submitData = { ...data, shift: shifts };
    try {
      const res = await dispatch(updateDoctorProfile(submitData));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Profile updated successfully!");
        fetchProfile();
      } else {
        toast.error(res.payload?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("❌ Update Error:", err);
      toast.error("Something went wrong!");
    }
  };

  const onPictureSubmit = async () => {
    if (!profilePicFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("profilepicture", profilePicFile);

    try {
      const res = await dispatch(updateDoctorProfilePic(formData));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Profile picture updated successfully!");
        fetchProfile();
        setProfilePicFile(null);
      } else {
        toast.error(res.payload?.message || "Failed to update profile picture");
      }
    } catch (error) {
      toast.error("Something went wrong while updating profile picture!");
    }
  };

  const onDocumentSubmit = async () => {
    if (!medicalDegree && !medicalLicense) {
      toast.error("Please select at least one document");
      return;
    }

    const formData = new FormData();
    if (medicalDegree) formData.append("medicaldegree", medicalDegree);
    if (medicalLicense) formData.append("medicallicense", medicalLicense);

    try {
      const res = await dispatch(updateDoctorDocuments(formData));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Documents updated successfully!");
        fetchProfile();
        setMedicalDegree(null);
        setMedicalLicense(null);
      } else {
        toast.error(res.payload?.message || "Failed to update documents");
      }
    } catch (error) {
      toast.error("Something went wrong while updating documents!");
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/profile")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Edit className="w-3 h-3 mr-1" />
              Update Profile
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Edit Your Profile
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Keep your professional information up to date
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Picture & Documents */}
            <div className="space-y-6">
              {/* Profile Picture Card */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-600" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img
                        src={profilePicPreview || "/placeholder-user.png"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-teal-100 object-cover shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-teal-600 rounded-full p-2 shadow-md">
                        <Stethoscope className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="w-full space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePicFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                      />
                      {profilePicFile && (
                        <Button
                          type="button"
                          onClick={onPictureSubmit}
                          disabled={loading}
                          className="w-full gap-2 bg-linear-to-r from-teal-600 to-emerald-600"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          Upload Picture
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Upload Card */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-600" />
                    Update Documents
                  </CardTitle>
                  <CardDescription>
                    Upload medical license and degree certificates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Medical Degree */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Medical Degree</Label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setMedicalDegree(e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {medicalDegree && (
                      <p className="text-xs text-teal-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {medicalDegree.name}
                      </p>
                    )}
                  </div>

                  {/* Medical License */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Medical License</Label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setMedicalLicense(e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {medicalLicense && (
                      <p className="text-xs text-teal-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {medicalLicense.name}
                      </p>
                    )}
                  </div>

                  {(medicalDegree || medicalLicense) && (
                    <Button
                      type="button"
                      onClick={onDocumentSubmit}
                      disabled={loading}
                      className="w-full gap-2 bg-linear-to-r from-teal-600 to-emerald-600"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Upload Documents
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Profile Information */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Edit className="w-6 h-6 text-teal-600" />
                    Professional Information
                  </CardTitle>
                  <CardDescription>
                    Update your professional details and contact information
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-teal-600" />
                        Personal Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="doctorname">Full Name *</Label>
                          <Input
                            id="doctorname"
                            {...register("doctorname", { required: "Name is required" })}
                            className={errors.doctorname ? "border-red-500" : ""}
                          />
                          {errors.doctorname && (
                            <p className="text-red-500 text-xs">{errors.doctorname.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-1">
                            <Mail className="w-4 h-4 text-gray-500" />
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            className={errors.email ? "border-red-500" : ""}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs">{errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phonenumber" className="flex items-center gap-1">
                            <Phone className="w-4 h-4 text-gray-500" />
                            Phone Number *
                          </Label>
                          <Input
                            id="phonenumber"
                            type="tel"
                            {...register("phonenumber", { required: "Phone is required" })}
                            className={errors.phonenumber ? "border-red-500" : ""}
                          />
                          {errors.phonenumber && (
                            <p className="text-red-500 text-xs">{errors.phonenumber.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age" className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            Age
                          </Label>
                          <Input
                            id="age"
                            type="number"
                            {...register("age")}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="sex">Gender</Label>
                          <Select onValueChange={(value) => setValue("sex", value)} defaultValue={profile?.sex}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Professional Information Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-teal-600" />
                        Professional Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department" className="flex items-center gap-1">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            Department *
                          </Label>
                          <Select
                            onValueChange={(value) => setValue("department", value)}
                            defaultValue={profile?.department}
                          >
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="Cardiology" className="hover:bg-teal-50">Cardiology</SelectItem>
                              <SelectItem value="Neurology" className="hover:bg-teal-50">Neurology</SelectItem>
                              <SelectItem value="Orthopedics" className="hover:bg-teal-50">Orthopedics</SelectItem>
                              <SelectItem value="Pediatrics" className="hover:bg-teal-50">Pediatrics</SelectItem>
                              <SelectItem value="Dermatology" className="hover:bg-teal-50">Dermatology</SelectItem>
                              <SelectItem value="General" className="hover:bg-teal-50">General Medicine</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="qualification" className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4 text-gray-500" />
                            Qualification *
                          </Label>
                          <Input
                            id="qualification"
                            placeholder="MBBS, MD"
                            {...register("qualification", { required: "Qualification is required" })}
                            className={errors.qualification ? "border-red-500" : ""}
                          />
                          {errors.qualification && (
                            <p className="text-red-500 text-xs">{errors.qualification.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience" className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            Experience (Years) *
                          </Label>
                          <Input
                            id="experience"
                            type="number"
                            {...register("experience", { required: "Experience is required" })}
                            className={errors.experience ? "border-red-500" : ""}
                          />
                          {errors.experience && (
                            <p className="text-red-500 text-xs">{errors.experience.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="specialization">Specialization</Label>
                          <Input
                            id="specialization"
                            placeholder="e.g., Cardiac Surgery"
                            {...register("specialization")}
                          />
                        </div>
                        <ShiftManagement shifts={shifts} onChange={setShifts} />
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {error.message || "Error updating profile"}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 gap-2 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Update Profile
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/doctor/profile")}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;