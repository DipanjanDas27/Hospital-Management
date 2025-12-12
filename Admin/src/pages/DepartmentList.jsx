import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { adminGetAllDepartments } from "@/services/adminApi";
import { useNavigate } from "react-router-dom";

import AdminDepartmentCard from "@/components/custom/AdminDepartmentCard";
import { Loader2, Building2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

function AdminDepartmentList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { departments, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(adminGetAllDepartments());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-white">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-700 font-medium">Loading departments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error?.message || "Failed to load departments."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
          >
            <Building2 className="w-3 h-3 mr-1" />
            Departments
          </Badge>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hospital Departments
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore all medical departments managed under NovaMed Administration.
          </p>

          <p className="text-sm text-gray-500 mt-3">
            Total Departments:{" "}
            <span className="font-semibold text-indigo-700">{departments?.length || 0}</span>
          </p>
        </div>

        {/* Department Grid */}
        {departments?.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No departments available.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <AdminDepartmentCard
                key={dept._id}
                dept={dept}
                onClick={() =>
                  navigate(`/departments/${dept.deptname.toLowerCase()}/doctors`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDepartmentList;
