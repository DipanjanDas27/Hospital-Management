import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resetForgottenPassword, updatePassword } from "../services/patientApi";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import  Input  from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, ArrowLeft, AlertCircle, Shield } from "lucide-react";

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isUpdate = location.state?.isUpdate || false;
  
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("newPassword");

  // Redirect if trying to access update flow without authentication
  useEffect(() => {
    if (isUpdate && !isAuthenticated) {
      navigate("/login");
    }
  }, [isUpdate, isAuthenticated, navigate]);

  const submitHandler = async (data) => {
    try {
      // Prepare payload based on flow type
      const payload = isUpdate 
        ? { 
            oldpassword: data.oldPassword, 
            newpassword: data.newPassword 
          }
        : { 
            newpassword: data.newPassword 
          };

      // Use different API based on flow type
      const action = isUpdate 
        ? updatePassword(payload) 
        : resetForgottenPassword(payload);
      
      const result = await dispatch(action);
      
      if (result.meta?.requestStatus === "fulfilled") {
        const message = isUpdate 
          ? "Password updated successfully!"
          : "Password reset successful! Please login with your new password.";
        
        const destination = isUpdate ? "/profile" : "/login";
        
        navigate(destination, { 
          state: { message }
        });
      }
    } catch (error) {
      console.error("Password operation failed:", error);
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
                  {isUpdate ? "Update Password" : "Reset Password"}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                {isUpdate ? "Update Password" : "Reset Password"}
              </CardTitle>
              <p className="text-gray-600">
                {isUpdate 
                  ? "Change your current password"
                  : "Create a new password for your account"
                }
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                {/* Show old password field only for update flow */}
                {isUpdate && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                      <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                    <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="pl-10"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error.message || `Failed to ${isUpdate ? "update" : "reset"} password`}
                    </AlertDescription>
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
                      {isUpdate ? "Updating" : "Resetting"} Password...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      {isUpdate ? "Update" : "Reset"} Password
                    </>
                  )}
                </Button>

                {isUpdate && (
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate("/profile")}
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
