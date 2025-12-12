import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  adminForgotVerifyOtp,
  adminSendUpdatePasswordOtp,
  adminForgotPasswordSendOtp,
  adminVerifyUpdatePasswordOtp,
} from "@/services/adminApi";

import { useNavigate, useLocation } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import {
  Loader2,
  Shield,
  ArrowLeft,
  AlertCircle,
  Clock,
  Mail,
} from "lucide-react";

const AdminVerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const isUpdate = location.state?.isUpdate || false;

  const { loading, error } = useSelector((state) => state.admin);

  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  /* ------------------------- Redirect if email missing ------------------------- */
  useEffect(() => {
    if (!email) {
      navigate(isUpdate ? "/admin/update-password" : "/admin/forgot-password");
    }
  }, [email, navigate, isUpdate]);

  /* ------------------------- OTP Countdown Timer ------------------------- */
  useEffect(() => {
    if (timer > 0) {
      const i = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(i);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  
  const submitHandler = async (data) => {
    const action = isUpdate
      ? adminVerifyUpdatePasswordOtp(data)
      : adminForgotVerifyOtp(data);

    const result = await dispatch(action);

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/admin/reset-password", { state: { isUpdate } });
    }
  };

  
  const resendOtpHandler = async () => {
    setResendLoading(true);

    const action = isUpdate
      ? adminSendUpdatePasswordOtp()
      : adminForgotPasswordSendOtp({ email });

    const result = await dispatch(action);

    if (result.meta.requestStatus === "fulfilled") {
      setTimer(120);
      setCanResend(false);
    }

    setResendLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <Badge className="bg-indigo-600 text-white gap-2 mx-auto px-3 py-1">
              <Shield className="w-4 h-4" />
              OTP Verification
            </Badge>

            <CardTitle className="text-3xl font-bold text-gray-900">
              Verify OTP
            </CardTitle>

            <div className="space-y-1">
              <p className="text-gray-600 text-sm">OTP sent to</p>
              <div className="flex items-center justify-center gap-1">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-indigo-700">{email}</span>
              </div>

              <div className="flex items-center justify-center gap-2 mt-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <p className="text-xs text-orange-600 font-medium">Valid for 2 minutes</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Enter 6-digit OTP</label>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: { value: /^[0-9]{6}$/, message: "Must be 6 digits" },
                  })}
                  className="text-center text-2xl tracking-widest font-semibold"
                />
                {errors.otp && <p className="text-red-500 text-xs">{errors.otp.message}</p>}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    {error.message || "Invalid OTP"}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              {/* Resend Timer & Button */}
              <div className="pt-4 border-t space-y-3 text-center">
                {!canResend ? (
                  <p className="text-sm text-gray-600">
                    Resend OTP in{" "}
                    <span className="font-semibold text-indigo-700">
                      {formatTime(timer)}
                    </span>
                  </p>
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
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" /> Resend OTP
                      </>
                    )}
                  </Button>
                )}

                {/* Back Button */}
                <Button
                  variant="ghost"
                  onClick={() =>
                    navigate(isUpdate ? "/admin/update-password" : "/admin/forgot-password")
                  }
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
  );
};

export default AdminVerifyOtp;
