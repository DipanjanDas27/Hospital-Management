import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getPrescription } from "@/services/prescriptionApi";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  User,
  Building2,
  FileText,
  Pill,
  Calendar,
  Clock,
  Stethoscope
} from "lucide-react";

const PrescriptionDetails = () => {
  const { prescriptionid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { prescription, loading, error } = useSelector(
    (state) => state.prescription
  );

  useEffect(() => {
    dispatch(getPrescription(prescriptionid));
  }, [dispatch, prescriptionid]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading prescription details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || "Failed to load prescription"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!prescription) return null;

  const { 
    doctordetails, 
    diagonosis, 
    medicines,
    createdAt
  } = prescription;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/prescriptions")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Prescriptions
        </Button>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2 flex items-center gap-2">
                  <Pill className="w-8 h-8 text-blue-600" />
                  Prescription Details
                </CardTitle>
                <p className="text-gray-500">
                  View your prescription and medication information
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {new Date(createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Doctor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Doctor Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Doctor Name</p>
                    <p className="font-semibold text-gray-900">
                      Dr. {doctordetails?.doctorname || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Department</p>
                    <p className="font-semibold text-gray-900">
                      {doctordetails?.department || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Diagnosis */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Diagnosis
              </h3>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-900 font-medium">{diagonosis || "No diagnosis provided"}</p>
              </div>
            </div>

            <Separator />

            {/* Medicines */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                Medications ({medicines?.length || 0})
              </h3>
              <div className="space-y-3">
                {medicines && medicines.length > 0 ? (
                  medicines.map((medicine, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4 text-blue-600" />
                            <h4 className="font-semibold text-lg text-gray-900">
                              {medicine.medicinename}
                            </h4>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3 ml-6">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Dosage</p>
                              <p className="text-gray-900 font-medium">{medicine.dosage}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Frequency</p>
                              <p className="text-gray-900 font-medium">{medicine.frequency}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Duration</p>
                              <p className="text-gray-900 font-medium">{medicine.duration}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>No medications prescribed</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrescriptionDetails;

