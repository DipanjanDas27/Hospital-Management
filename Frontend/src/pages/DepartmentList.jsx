import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllDepartments } from "@/services/patientApi";
import { useNavigate } from "react-router-dom";
import DepartmentCard from "../components/custom/DepartmentCard";
import { Loader2, Building2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

function DepartmentList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { departments, loading, error } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getAllDepartments());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading departments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Building2 className="w-3 h-3 mr-1" />
            Medical Departments
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Departments
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our specialized medical departments with expert doctors and 
            state-of-the-art facilities dedicated to your health and wellbeing.
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Total Departments: <span className="font-semibold text-blue-600">{departments?.length || 0}</span>
            </p>
          </div>
        </div>

        {/* Departments Grid */}
        {departments?.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No departments available at the moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <DepartmentCard
                key={dept._id}
                name={dept.deptname}
                description={dept.description}
                onClick={() => navigate(`/departments/${dept.deptname}/doctors`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DepartmentList;