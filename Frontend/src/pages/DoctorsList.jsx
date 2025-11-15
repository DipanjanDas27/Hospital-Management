import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctors, getdoctorbydepartment } from "../services/patientApi";
import DoctorCard from "@/components/custom/doctorCard";
import { useParams, useSearchParams } from "react-router-dom";
import Input  from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Search, 
  Stethoscope, 
  AlertCircle,
  Filter,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DoctorList = () => {
  const dispatch = useDispatch();
  const { deptname } = useParams();
  const { doctors, loading, error } = useSelector((state) => state.patient);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (deptname) {
      dispatch(getdoctorbydepartment(deptname));
    } else {
      dispatch(getAllDoctors());
    }
  }, [dispatch, deptname]);

  useEffect(() => {
    if (searchInputRef.current && !deptname) {
      searchInputRef.current.focus();
    }
  }, [deptname]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchParams(value ? { search: value } : {});
  };

  const handleClearSearch = () => {
    setSearchParams({});
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return doctors;
    return doctors.filter((doc) =>
      doc.doctorname?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, doctors]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Failed to load doctors."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Stethoscope className="w-3 h-3 mr-1" />
            {deptname ? `${deptname} Department` : "All Departments"}
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {deptname ? `${deptname} Specialists` : "Our Expert Doctors"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {deptname
              ? `Meet our specialized doctors in ${deptname} with years of experience and expertise.`
              : "Browse our comprehensive list of qualified medical professionals across all departments."}
          </p>
        </div>

        {/* Search Section - Always Centered */}
        <div className="max-w-2xl flex justify-center mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search doctor by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 pr-10 h-12 text-base shadow-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Showing results for: <span className="font-semibold text-gray-700">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredDoctors?.length || 0}</span> {filteredDoctors?.length === 1 ? "doctor" : "doctors"} found
            </p>
          </div>
          {searchQuery && (
            <Button variant="outline" size="sm" onClick={handleClearSearch}>
              Clear Search
            </Button>
          )}
        </div>

        {/* Doctors Grid */}
        {filteredDoctors?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : "No doctors available in this department at the moment."}
            </p>
            {searchQuery && (
              <Button onClick={handleClearSearch}>
                View All Doctors
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} department={deptname} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;