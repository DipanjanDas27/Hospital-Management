import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

import { Alert, AlertDescription } from "@/components/ui/alert";
import { adminRegister } from "@/services/adminApi";

import {
  Loader2,
  Upload,
  Shield,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const AdminRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Submit handler
  const onSubmit = async (data) => {
    if (
      !watch("aadhar") ||
      !watch("adminId") ||
      !watch("profilepicture") ||
      !watch("appointmentletter")
    ) {
      toast.error("Please upload all required documents");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    // Append files
    formData.append("aadhar", watch("aadhar")[0]);
    formData.append("adminId", watch("adminId")[0]);
    formData.append("profilepicture", watch("profilepicture")[0]);
    formData.append("appointmentletter", watch("appointmentletter")[0]);

    try {
      const res = await dispatch(adminRegister(formData));

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Admin Registered Successfully!");
        navigate("/admin/login");
      } else {
        toast.error(res.payload?.message || "Registration failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-14 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">NovaMed Admin Portal</h1>
          </div>
          <p className="text-gray-600">Register as an administrator</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
            <CardDescription>Authorized Personal Only</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error?.message}</AlertDescription>
                </Alert>
              )}

              {/* ADMIN INPUT FIELDS */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Full Name */}
                <FormBox
                  label="Full Name *"
                  placeholder="Admin Name"
                  register={register("adminname", { required: "Name required" })}
                  error={errors.adminname}
                />

                {/* Username */}
                <FormBox
                  label="Username *"
                  placeholder="admin_001"
                  register={register("adminusername", {
                    required: "Username required",
                  })}
                  error={errors.adminusername}
                />

                {/* Email */}
                <FormBox
                  label="Email *"
                  placeholder="admin@novamed.com"
                  type="email"
                  register={register("email", { required: "Email required" })}
                  error={errors.email}
                />

                {/* Phone Number */}
                <FormBox
                  label="Phone Number *"
                  placeholder="9876543210"
                  register={register("phonenumber", { required: "Phone required" })}
                  error={errors.phonenumber}
                />

                {/* Password */}
                <FormBox
                  label="Password *"
                  type="password"
                  placeholder="Password"
                  register={register("password", { required: "Password required" })}
                  error={errors.password}
                />

                {/* Admin Secret */}
                <FormBox
                  label="Admin Secret Key *"
                  type="password"
                  placeholder="Enter secret key"
                  register={register("adminsecret", { required: "Admin secret required" })}
                  error={errors.adminsecret}
                />
              </div>

              {/* DOCUMENT UPLOAD SECTION */}
              <div className="space-y-6 border-t pt-6">

                <UploadBox
                  id="aadhar-doc"
                  label="Aadhar Card *"
                  file={watch("aadhar")}
                  onChange={(e) => register("aadhar", {})(e)}
                />

                <UploadBox
                  id="adminid-doc"
                  label="Admin ID Card *"
                  file={watch("adminId")}
                  onChange={(e) => register("adminId", {})(e)}
                />

                <UploadBox
                  id="pic-doc"
                  label="Profile Picture *"
                  file={watch("profilepicture")}
                  onChange={(e) => register("profilepicture", {})(e)}
                />

                <UploadBox
                  id="appointment-doc"
                  label="Appointment Letter *"
                  file={watch("appointmentletter")}
                  onChange={(e) => register("appointmentletter", {})(e)}
                />

              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Register Admin
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-6 border-t mt-6">
              <p className="text-sm text-gray-600">
                Already an admin?{" "}
                <Button
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                  variant="ghost"
                >
                  Login
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          Authorized NovaMed administrators only.
        </p>
      </div>
    </div>
  );
};

// Reusable Input Box
const FormBox = ({ label, placeholder, type = "text", register, error }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input
      type={type}
      placeholder={placeholder}
      {...register}
      className={error ? "border-red-500" : ""}
    />
    {error && (
      <p className="text-red-500 text-xs flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error.message}
      </p>
    )}
  </div>
);

// Reusable Upload Box
const UploadBox = ({ id, label, file, onChange }) => (
  <div className="space-y-2">
    <Label className="text-base font-medium">{label}</Label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <input type="file" id={id} className="hidden" onChange={onChange} />
      <label htmlFor={id} className="cursor-pointer text-sm text-gray-600 hover:text-indigo-600">
        {file ? (
          <span className="text-indigo-600 font-medium">✓ {file[0].name}</span>
        ) : (
          "Click to upload"
        )}
      </label>
      <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG (Max 5MB)</p>
    </div>
  </div>
);

export default AdminRegister;
