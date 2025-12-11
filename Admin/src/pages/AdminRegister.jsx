import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ShiftManagement from "./ShiftManagement";
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
  const [shifts, setShifts] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // Validate required documents
    if (
      !watch("aadhar") ||
      !watch("medicallicense") ||
      !watch("medicaldegree") ||
      !watch("profilepicture")
    ) {
      toast.error("Please upload all required documents");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    formData.append("aadhar", watch("aadhar")[0]);
    formData.append("medicallicense", watch("medicallicense")[0]);
    formData.append("medicaldegree", watch("medicaldegree")[0]);
    formData.append("profilepicture", watch("profilepicture")[0]);

    formData.append("shift", JSON.stringify(shifts));

    try {
      const res = await dispatch(registerDoctor(formData));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Registration successful!");
        navigate("/");
      } else {
        toast.error(res.payload?.message || "Registration failed!");
      }
    } catch (err) {
      console.error(err);
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
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">Doctor Registration</CardTitle>
            <CardDescription>Join our healthcare network</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error?.message}</AlertDescription>
                </Alert>
              )}

              {/* All Input Fields */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Full Name */}
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Dr. Arjun Rao"
                    {...register("doctorname", { required: "Name required" })}
                    className={errors.doctorname ? "border-red-500" : ""}
                  />
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label>Username *</Label>
                  <Input
                    placeholder="arjun_rao"
                    {...register("doctorusername", {
                      required: "Username required",
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: "Only letters, numbers & _ allowed"
                      }
                    })}
                    className={errors.doctorusername ? "border-red-500" : ""}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="doctor@email.com"
                    {...register("email", { required: "Email required" })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    placeholder="9876543210"
                    {...register("phonenumber", { required: "Phone required" })}
                    className={errors.phonenumber ? "border-red-500" : ""}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: "Password required" })}
                    className={errors.password ? "border-red-500" : ""}
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label>Age *</Label>
                  <Input
                    type="number"
                    placeholder="38"
                    {...register("age", { required: "Age required" })}
                    className={errors.age ? "border-red-500" : ""}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>Sex *</Label>
                  <Select onValueChange={(v) => setValue("sex", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" className="bg-white" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male" className="hover:bg-teal-50">Male</SelectItem>
                      <SelectItem value="Female" className="hover:bg-teal-50">Female</SelectItem>
                      <SelectItem value="Other" className="hover:bg-teal-50">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register("sex", { required: "Sex required" })} />
                </div>

                {/* Qualification */}
                <div className="space-y-2">
                  <Label>Qualification *</Label>
                  <Input
                    placeholder="MBBS, MD"
                    {...register("qualification", { required: "Required" })}
                    className={errors.qualification ? "border-red-500" : ""}
                  />
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label>Experience *</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    {...register("experience", { required: "Required" })}
                    className={errors.experience ? "border-red-500" : ""}
                  />
                </div>

                {/* Department */}
                <div className="space-y-2"> <Label htmlFor="department"> <Building2 className="w-4 h-4 text-gray-500 inline mr-2" /> Department * </Label> <Select onValueChange={(value) => setValue("department", value)}> <SelectTrigger className="bg-white border-gray-300"> <SelectValue placeholder="Select department" /> </SelectTrigger> <SelectContent className="bg-white">
                  <SelectItem value="General Medicine" className="hover:bg-teal-50">General Medicine</SelectItem>
                  <SelectItem value="Cardiology" className="hover:bg-teal-50">Cardiology</SelectItem> <SelectItem value="Neurology" className="hover:bg-teal-50">Neurology</SelectItem> <SelectItem value="Orthopedics" className="hover:bg-teal-50">Orthopedics</SelectItem> <SelectItem value="Pediatrics" className="hover:bg-teal-50">Pediatrics</SelectItem> <SelectItem value="Dermatology" className="hover:bg-teal-50">Dermatology</SelectItem> <SelectItem value="Gynecology" className="hover:bg-teal-50">Gynecology</SelectItem>
                  <SelectItem value="Ophthalmology" className="hover:bg-teal-50">Ophthalmology</SelectItem>
                  <SelectItem value="ENT" className="hover:bg-teal-50">ENT</SelectItem>
                  <SelectItem value="Psychiatry" className="hover:bg-teal-50">Psychiatry</SelectItem>
                  <SelectItem value="Gastroenterology" className="hover:bg-teal-50">Gastroenterology</SelectItem>
                  <SelectItem value="Urology" className="hover:bg-teal-50">Urology</SelectItem>
                  <SelectItem value="Pulmonology" className="hover:bg-teal-50">Pulmonology</SelectItem>
                </SelectContent>
                </Select>
                  <input type="hidden"
                    {...register("department", { required: "Department is required" })} />
                  {errors.department &&
                    (<p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.department.message}
                    </p>)}
                </div>

                {/* Specialization */}
                <div className="space-y-2">
                  <Label>Specialization (Optional)</Label>
                  <Input placeholder="e.g., Stroke Specialist" {...register("specialization")} />
                </div>

                {/* Shift Management */}
                <ShiftManagement shifts={shifts} onChange={setShifts} />

              </div>

              {/* FILE UPLOAD SECTION */}
              <div className="space-y-6 border-t pt-6">

                {/* Aadhar */}
                <UploadBox
                  id="aadhar-doc"
                  label="Aadhar Card *"
                  file={watch("aadhar")}
                  onChange={(e) => setValue("aadhar", e.target.files)}
                />

                {/* Medical License */}
                <UploadBox
                  id="license-doc"
                  label="Medical License *"
                  file={watch("medicallicense")}
                  onChange={(e) => setValue("medicallicense", e.target.files)}
                />

                {/* Medical Certificate */}
                <UploadBox
                  id="certificate-doc"
                  label="Medical Certificate *"
                  file={watch("medicaldegree")}
                  onChange={(e) => setValue("medicaldegree", e.target.files)}
                />

                {/* Profile Picture */}
                <UploadBox
                  id="profile-pic"
                  label="Profile Picture *"
                  file={watch("profilepicture")}
                  onChange={(e) => setValue("profilepicture", e.target.files)}
                />

              </div>


              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-linear-to-r from-teal-600 to-emerald-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Register
                  </>
                )}
              </Button>
            </form>
            <div className="text-center pt-6 border-t mt-6">
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
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          For medical professionals only. Unauthorized access is prohibited.
        </p>
      </div>
    </div >
  );
};

// Reusable Upload Box
const UploadBox = ({ id, label, file, onChange }) => (
  <div className="space-y-2">
    <Label className="text-base font-medium">{label}</Label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <input type="file" id={id} className="hidden" onChange={onChange} />
      <label htmlFor={id} className="cursor-pointer text-sm text-gray-600 hover:text-teal-600">
        {file ? (
          <span className="text-teal-600 font-medium">✓ {file[0].name}</span>
        ) : (
          "Click to upload"
        )}
      </label>
      <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (Max 5MB)</p>
    </div>
  </div>
);

export default DoctorRegister;
