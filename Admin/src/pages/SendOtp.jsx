import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  adminGetProfile,
  adminForgotPasswordSendOtp,
  adminSendUpdatePasswordOtp,
} from "@/services/adminApi";

import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import {
  Loader2,
  Mail,
  ArrowLeft,
  AlertCircle,
  Shield,
} from "lucide-react";

const AdminSendOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { admin, isAuthenticated, loading, error } = useSelector(
    (state) => state.admin
  );

  
  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(adminGetProfile());
  }, [dispatch, isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: isAuthenticated ? admin?.email : "",
    },
  });

  const submitHandler = async (data) => {
    try {
      const email = isAuthenticated ? admin?.email : data.email;

      if (!email) return;

      const action = isAuthenticated
        ? adminSendUpdatePasswordOtp()
        : adminForgotPasswordSendOtp({ email });

      const result = await dispatch(action);

      if (result.meta.requestStatus === "fulfilled") {
        navigate("/admin/verify-otp", {
          state: {
            email,
            isUpdate: isAuthenticated,
          },
        });
      }
    } catch (err) {
      console.error("OTP send failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-4 text-center">
              <Badge className="bg-indigo-600 text-white gap-2 mx-auto py-1 px-3">
                <Shield className="w-4 h-4" />
                {isAuthenticated ? "Update Password" : "Admin Password Recovery"}
              </Badge>

              <CardTitle className="text-3xl font-bold text-gray-900">
                {isAuthenticated ? "Update Password" : "Forgot Password?"}
              </CardTitle>

              <p className="text-gray-600">
                {isAuthenticated
                  ? `We will send an OTP to ${admin?.email} to verify it's you`
                  : "Enter your email and we’ll send an OTP to reset your password"}
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                {/* Email input when NOT logged in */}
                {!isAuthenticated && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Enter your admin email"
                        className="pl-10"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value:
                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </div>

                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                )}

                {/* If authenticated, show email preview */}
                {isAuthenticated && (
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-indigo-700" />
                      <p className="text-sm text-gray-700">OTP will be sent to:</p>
                    </div>
                    <p className="font-semibold text-indigo-900">
                      {admin?.email}
                    </p>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      {error.message || "Failed to send OTP"}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send OTP
                    </>
                  )}
                </Button>

                {/* Back Button */}
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      navigate(isAuthenticated ? "/admin/profile" : "/admin/login")
                    }
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {isAuthenticated ? "Back to Profile" : "Back to Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSendOtp;
