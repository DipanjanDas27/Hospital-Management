import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  adminUpdatePassword,
  adminForgotUpdatePassword,
} from "@/services/adminApi";

import { useNavigate, useLocation } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import {
  Loader2,
  Lock,
  ArrowLeft,
  AlertCircle,
  Shield,
} from "lucide-react";

const AdminResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isUpdate = location.state?.isUpdate || false;

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.admin
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  /* ----------------------- PROTECT update flow ----------------------- */
  useEffect(() => {
    if (isUpdate && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isUpdate, isAuthenticated, navigate]);

  /* ----------------------- SUBMIT HANDLER ---------------------------- */
  const submitHandler = async (data) => {
    const payload = isUpdate
      ? {
          oldpassword: data.oldPassword,
          newpassword: data.newPassword,
        }
      : {
          newpassword: data.newPassword,
        };

    const action = isUpdate
      ? adminUpdatePassword(payload)
      : adminForgotUpdatePassword(payload);

    const result = await dispatch(action);

    if (result.meta.requestStatus === "fulfilled") {
      const message = isUpdate
        ? "Password updated successfully!"
        : "Password reset successfully! Please login again.";

      const destination = isUpdate ? "/admin/profile" : "/admin/login";

      navigate(destination, {
        state: { message },
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <Badge className="bg-indigo-600 text-white gap-2 px-3 py-1 mx-auto">
              <Shield className="w-4 h-4" />
              {isUpdate ? "Update Password" : "Reset Password"}
            </Badge>

            <CardTitle className="text-3xl font-bold text-gray-900">
              {isUpdate ? "Update Password" : "Reset Password"}
            </CardTitle>

            <p className="text-gray-600 text-sm">
              {isUpdate
                ? "Enter your current and new password to update it."
                : "Create a new password for your admin account."}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">

              {/* Old password for Update flow */}
              {isUpdate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      className="pl-10"
                      {...register("oldPassword", {
                        required: "Current password is required",
                      })}
                    />
                  </div>
                  {errors.oldPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.oldPassword.message}
                    </p>
                  )}
                </div>
              )}

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    className="pl-10"
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    className="pl-10"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    {error.message ||
                      `Failed to ${isUpdate ? "update" : "reset"} password`}
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
                    {isUpdate ? "Updating..." : "Resetting..."}
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    {isUpdate ? "Update Password" : "Reset Password"}
                  </>
                )}
              </Button>

              {/* Back Button for update flow */}
              {isUpdate && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/admin/profile")}
                  className="w-full gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminResetPassword;
