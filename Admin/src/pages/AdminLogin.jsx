import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { adminLogin } from "@/services/adminApi";
import {
  Loader2,
  Shield,
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.admin
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const res = await dispatch(adminLogin(data));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Login Successful!");
      navigate("/");
    } else {
      toast.error(res.payload?.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      
      {/* BACK BUTTON */}
      <Button
        variant="ghost"
        className="absolute top-4 left-4 text-indigo-700 hover:text-indigo-900"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">Secure Login</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center">
              Access the administration dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* ERROR ALERT */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error?.message || "Login failed. Try again."}
                  </AlertDescription>
                </Alert>
              )}

              {/* EMAIL */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Username / Email
                </Label>
                <Input
                  placeholder="admin@example.com"
                  {...register("email", { required: "Email or username required" })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...register("password", { required: "Password is required" })}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* ADMIN SECRET */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  Admin Secret Key
                </Label>
                <Input
                  type="password"
                  placeholder="Enter Admin Secret"
                  {...register("adminsecret", { required: "Admin secret required" })}
                  className={errors.adminsecret ? "border-red-500" : ""}
                />
                {errors.adminsecret && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.adminsecret.message}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          Authorized Access Only. All actions are monitored.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
