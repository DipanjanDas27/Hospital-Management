import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginPatient } from "../services/patientApi";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import  Input  from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Heart, Mail, Lock, ArrowRight, AlertCircle, Stethoscope } from "lucide-react";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginHandler = async (data) => {
    try {
      const result = await dispatch(loginPatient(data));

      if (result.meta?.requestStatus === "fulfilled") {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                NOVA<span className="text-blue-700 font-normal">MED</span>
              </h1>
              <p className="text-sm text-slate-600 font-semibold tracking-wider">MEDICAL CENTER</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
                Welcome Back to Your Health Portal
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Access your medical records, schedule appointments, and manage your healthcare journey all in one place.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 bg-white/50 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Secure Access</h3>
                  <p className="text-slate-600 text-sm">Your health data is protected with enterprise-grade security</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/50 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">24/7 Availability</h3>
                  <p className="text-slate-600 text-sm">Access your medical information anytime, anywhere</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white/50 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Comprehensive Care</h3>
                  <p className="text-slate-600 text-sm">Manage appointments, prescriptions, and health records</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center justify-center lg:hidden mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-slate-800">
                Patient Login
              </CardTitle>
              <CardDescription className="text-center text-slate-600">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(loginHandler)} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email or Username
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className={`pl-10 h-11 ${
                        errors.email 
                          ? "border-red-500 focus-visible:ring-red-500" 
                          : "border-slate-300 focus-visible:ring-blue-600"
                      }`}
                      {...register("email", { required: "Email or Username is required" })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 h-11 ${
                        errors.password 
                          ? "border-red-500 focus-visible:ring-red-500" 
                          : "border-slate-300 focus-visible:ring-blue-600"
                      }`}
                      {...register("password", { required: "Password is required" })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </Button>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      {error.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20 transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Login
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center pt-4 border-t border-slate-200">
                  <p className="text-slate-600 text-sm">
                    Don't have an account?{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
                      onClick={() => navigate("/register")}
                    >
                      Sign Up
                    </Button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;