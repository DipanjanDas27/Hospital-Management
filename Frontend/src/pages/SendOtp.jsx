import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordOtp, sendOtpForUpdate, getCurrentPatient } from "../services/patientApi";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import  Input  from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, ArrowLeft, AlertCircle, Shield } from "lucide-react";

function SendOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  // Fetch current user on mount to restore state after refresh
  useEffect(() => {
    if (!isInitialized) {
      dispatch(getCurrentPatient());
    }
  }, [dispatch, isInitialized]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: isAuthenticated ? user?.email : ""
    }
  });

  // Show loading while initializing user state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const submitHandler = async (data) => {
    try {
      // Use email from form if not authenticated, or from user object if authenticated
      const email = isAuthenticated ? user?.email : data.email;
      
      if (!email) {
        console.error("Email is required");
        return;
      }

      // Use different API based on authentication status
      const action = isAuthenticated 
        ? sendOtpForUpdate({ email }) 
        : sendForgotPasswordOtp({ email });
      
      const result = await dispatch(action);
      
      if (result.meta?.requestStatus === "fulfilled") {
        // Navigate immediately with the email and flow type
        navigate("/verify-otp", { 
          state: { 
            email: email,
            isUpdate: isAuthenticated
          },
          replace: true // Replace history to prevent back button issues
        });
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-4 text-center">
              <div className="flex justify-center mb-2">
                <Badge variant="secondary" className="gap-2">
                  <Shield className="w-4 h-4" />
                  {isAuthenticated ? "Update Password" : "Password Recovery"}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                {isAuthenticated ? "Update Password" : "Forgot Password?"}
              </CardTitle>
              <p className="text-gray-600">
                {isAuthenticated 
                  ? `We'll send an OTP to ${user?.email} to verify it's you`
                  : "Enter your email address and we'll send you an OTP to reset your password"
                }
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                {/* Show email input only if user is NOT authenticated */}
                {!isAuthenticated && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                )}

                {/* Show email display for authenticated users */}
                {isAuthenticated && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-gray-600">OTP will be sent to:</p>
                    </div>
                    <p className="font-semibold text-blue-900">{user?.email}</p>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error.message || "Failed to send OTP"}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
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

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
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
}

export default SendOtp;
