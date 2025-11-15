import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { getProfileDetails, updateProfile, updateProfilePic } from "@/services/patientApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Edit, Upload, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile, loading, error } = useSelector((state) => state.patient || {});
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const { register, handleSubmit, reset } = useForm();

    const fetchprofile = () => {
        dispatch(getProfileDetails())
    }
    
    useEffect(() => {
        fetchprofile()
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            reset({
                patientname: profile.patientname,
                patientusername: profile.patientusername,
                email: profile.email,
                phonenumber: profile.phonenumber,
                age: profile.age,
                sex: profile.sex,
                guardianName: profile.guardianName || "",
            });
            setPreview(profile.profilepicture);
        }
    }, [profile, reset]);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, [file]);

    const onSubmit = async (data) => {
        try {
            const res = await dispatch(updateProfile(data));
            if (res.meta.requestStatus === "fulfilled") {
                toast.success("Profile updated successfully!");
                fetchprofile()
            } else {
                toast.error("Failed to update profile");
            }
        } catch (err) {
            console.error("❌ Update Error:", err);
            toast.error("Something went wrong!");
        }
    };
    
    const onPictureSubmit = async () => {
        if (!file) {
            toast.error("Please select a file");
            return;
        }
        
        const pictureformdata = new FormData();
        pictureformdata.append("profilepicture", file);
        try {
            const respic = await dispatch(updateProfilePic(pictureformdata));
            if (respic.meta.requestStatus === "fulfilled") {
                toast.success("Profile picture updated successfully!");
                fetchprofile()
                setFile(null);
            } else {
                toast.error("Failed to update profile picture");
            }
        } catch (error) {
            toast.error("Something went wrong while updating profile picture!");
        }
    }
    
    if (loading || !profile)
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
                <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/profile")}
                        className="mb-6 gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Profile
                    </Button>

                    <Card className="shadow-xl border-0">
                        <CardHeader className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="gap-2">
                                    <Edit className="w-4 h-4" />
                                    Update Profile
                                </Badge>
                            </div>
                            <CardTitle className="text-3xl font-bold text-gray-900">
                                Edit Profile Information
                            </CardTitle>
                            <p className="text-gray-500">
                                Update your personal information and profile picture
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Profile Picture Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Profile Picture
                                </h3>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className="relative">
                                        <img
                                            src={preview || profile.profilepicture || "/placeholder-user.png"}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover shadow-lg"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-md">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full sm:w-auto">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload New Picture
                                        </label>
                                        <div className="flex gap-3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFile(e.target.files[0])}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            {file && (
                                                <Button
                                                    type="button"
                                                    onClick={onPictureSubmit}
                                                    disabled={loading}
                                                    className="gap-2"
                                                >
                                                    {loading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Upload className="w-4 h-4" />
                                                    )}
                                                    Upload
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Profile Information Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                    <Edit className="w-5 h-5 text-blue-600" />
                                    Personal Information
                                </h3>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input label="Full Name" {...register("patientname")} />
                                    <Input label="Username" {...register("patientusername")} disabled />
                                    <Input label="Email" type="email" {...register("email")} />
                                    <Input label="Phone Number" type="tel" {...register("phonenumber")} />
                                    <Input label="Age" type="number" {...register("age")} />
                                    <Input label="Sex" {...register("sex")} />
                                </div>
                                
                                <Input label="Guardian Name" {...register("guardianName")} />

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {error.message || "Error updating profile"}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Update Profile
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate("/profile")}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default UpdateProfile;
