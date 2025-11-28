import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registerDoctor } from "@/services/doctorApi";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Phone,
  GraduationCap,
  Briefcase,
  Building2,
  Upload,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const DoctorRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [verificationDoc, setVerificationDoc] = useState(null);
  const [shifts, setShifts] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleFileChange = (e) => {
    setVerificationDoc(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    if (!verificationDoc) {
      toast.error("Please upload verification document");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    formData.append("verificationDocument", verificationDoc);
    formData.append("shift", JSON.stringify(shifts));


    try {
      const res = await dispatch(registerDoctor(formData));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(res.payload?.message || "Registration failed!");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-cyan-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-teal-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">NovaMed</h1>
          </div>
          <p className="text-gray-600">Register as a Medical Professional</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              Doctor Registration
            </CardTitle>
            <CardDescription className="text-center">
              Join our network of healthcare professionals
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="doctorname" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Full Name *
                  </Label>
                  <Input
                    id="doctorname"
                    placeholder="Dr. John Smith"
                    {...register("doctorname", {
                      required: "Name is required",
                    })}
                    className={errors.doctorname ? "border-red-500" : ""}
                  />
                  {errors.doctorname && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.doctorname.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phonenumber" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phonenumber"
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register("phonenumber", {
                      required: "Phone number is required",
                    })}
                    className={errors.phonenumber ? "border-red-500" : ""}
                  />
                  {errors.phonenumber && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phonenumber.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">
                    <Building2 className="w-4 h-4 text-gray-500 inline mr-2" />
                    Department *
                  </Label>
                  <Select onValueChange={(value) => setValue("department", value)}>
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
                  <input
                    type="hidden"
                    {...register("department", { required: "Department is required" })}
                  />
                  {errors.department && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.department.message}
                    </p>
                  )}
                </div>

                {/* Qualification */}
                <div className="space-y-2">
                  <Label htmlFor="qualification" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    Qualification *
                  </Label>
                  <Input
                    id="qualification"
                    placeholder="MBBS, MD"
                    {...register("qualification", {
                      required: "Qualification is required",
                    })}
                    className={errors.qualification ? "border-red-500" : ""}
                  />
                  {errors.qualification && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.qualification.message}
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    Experience (Years) *
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="5"
                    {...register("experience", {
                      required: "Experience is required",
                      min: { value: 0, message: "Experience cannot be negative" },
                    })}
                    className={errors.experience ? "border-red-500" : ""}
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                {/* Specialization */}
                <div className="space-y-2">
                  <Label htmlFor="specialization">
                    Specialization <span className="text-gray-400 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="specialization"
                    placeholder="e.g., Cardiac Surgery"
                    {...register("specialization")}
                  />
                </div>
                <ShiftManagement shifts={shifts} onChange={setShifts} />

              </div>
              

              {/* Verification Document Upload */}
              <div className="space-y-2 border-t pt-6">
                <Label className="text-base font-medium">
                  Verification Document *
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    id="verification-doc"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <label
                    htmlFor="verification-doc"
                    className="cursor-pointer text-sm text-gray-600 hover:text-teal-600"
                  >
                    {verificationDoc ? (
                      <span className="text-teal-600 font-medium">
                        ✓ {verificationDoc.name}
                      </span>
                    ) : (
                      "Click to upload medical license or certification"
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-medium bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Register
                  </>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Button
                    onClick={() => navigate("/login")}
                    className="text-teal-600 hover:text-teal-700 font-semibold hover:underline"
                  >
                    Login here
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorRegister;