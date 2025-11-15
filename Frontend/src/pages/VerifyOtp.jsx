import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { verifyForgotPasswordOtp, verifyOtpForUpdate, sendForgotPasswordOtp, sendOtpForUpdate } from "../services/patientApi";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import  Input  from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, ArrowLeft, AlertCircle, Clock, Mail } from "lucide-react";

function VerifyOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const isUpdate = location.state?.isUpdate || false;

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!email) {
      navigate(isAuthenticated ? "/update-password" : "/forgot-password");
    }
  }, [email, navigate, isAuthenticated]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const submitHandler = async (data) => {
    try {
      // Use different API based on flow type
      const action = isUpdate
        ? verifyOtpForUpdate(data)
        : verifyForgotPasswordOtp(data);

      const result = await dispatch(action);

      if (result.meta?.requestStatus === "fulfilled") {
        navigate("/reset-password", {
          state: { isUpdate }
        });
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const resendOtpHandler = async () => {
    try {
      setResendLoading(true);

      const action = isUpdate
        ? sendOtpForUpdate({ email })
        : sendForgotPasswordOtp({ email });

      const result = await dispatch(action);

      if (result.meta?.requestStatus === "fulfilled") {
        setTimer(120);
        setCanResend(false);
      }
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    } finally {
      setResendLoading(false);
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
                  OTP Verification
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Verify OTP
              </CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  We've sent a verification code to
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-600">{email}</p>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <p className="text-xs text-orange-600 font-medium">
                    OTP is valid for 2 minutes
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter 6-Digit OTP
                  </label>
                  <Input
                    type="text"
                    placeholder="000000"
                    maxLength="6"
                    className="text-center text-2xl tracking-widest font-semibold"
                    {...register("otp", {
                      required: "OTP is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "OTP must be 6 digits",
                      },
                    })}
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error.message || "Invalid OTP"}</AlertDescription>
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
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

                <div className="space-y-3 pt-4 border-t">
                  {!canResend ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Resend OTP in{" "}
                        <span className="font-semibold text-blue-600">{formatTime(timer)}</span>
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resendOtpHandler}
                      disabled={resendLoading}
                      className="w-full"
                    >
                      {resendLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Resend OTP
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate(isUpdate ? "/update-password" : "/forgot-password")}
                    className="w-full gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {isUpdate ? "Back" : "Change Email"}
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

export default VerifyOtp;
