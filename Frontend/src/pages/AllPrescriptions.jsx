import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllPrescriptions } from "@/services/prescriptionApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, 
  FileText, 
  AlertCircle,
  Pill,
  Calendar,
  User
} from "lucide-react";

const AllPrescriptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { prescriptions, loading, error } = useSelector(
    (state) => state.prescription
  );

  useEffect(() => {
    dispatch(getAllPrescriptions());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading prescriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load prescriptions</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <FileText className="w-3 h-3 mr-1" />
            My Prescriptions
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Prescriptions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View all your medical prescriptions and medications
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Total Prescriptions: <span className="font-semibold text-blue-600">{prescriptions?.length || 0}</span>
            </p>
          </div>
        </div>

        {/* Prescriptions Grid */}
        {prescriptions?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => (
              <Card key={prescription._id} className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/prescriptions/${prescription._id}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pill className="w-5 h-5 text-blue-600" />
                      Prescription
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      Dr. {prescription.doctordetails?.doctorname || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 font-medium">
                      {prescription.diagonosis || "No diagnosis"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Pill className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {prescription.medicines?.length || 0} Medicine(s)
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/prescriptions/${prescription._id}`);
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Prescriptions Yet
            </h3>
            <p className="text-gray-500 mb-6">
              You don't have any prescriptions yet. Prescriptions will appear here after your appointments are completed.
            </p>
            <Button onClick={() => navigate("/appointments")}>
              View Appointments
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPrescriptions;

