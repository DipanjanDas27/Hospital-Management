import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllDoctors } from "@/services/adminApi";
import AdminDoctorCard from "@/components/custom/AdminDoctorCard"; 
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import {
  Loader2,
  Search,
  Stethoscope,
  AlertCircle,
  Filter,
  X,
  ArrowLeft,
} from "lucide-react";

const DoctorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { deptname } = useParams();

  const searchInputRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // 📌 ADMIN STATE
  const { doctors, loading, error } = useSelector((state) => state.admin);

  // 🔄 Fetch all doctors for ADMIN
  useEffect(() => {
    dispatch(adminGetAllDoctors());
  }, [dispatch]);

  // Autofocus search if not filtering by department
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
    searchInputRef.current?.focus();
  };

  // 🔍 FILTER DOCTORS BY DEPARTMENT + SEARCH
  const filteredDoctors = useMemo(() => {
    let result = doctors;

    if (deptname) {
      result = result.filter(
        (doc) => doc.department?.toLowerCase() === deptname.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      result = result.filter((doc) =>
        doc.doctorname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [doctors, deptname, searchQuery]);

  /* -------------------------------------------------------------------------- */
  /*                            LOADING / ERROR UI                              */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-white">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-700 font-medium">Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load doctors."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 lg:px-8">

        {/* 🔙 Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2 text-indigo-700 hover:text-indigo-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white mb-4">
            <Stethoscope className="w-3 h-3 mr-1" />
            {deptname ? `${deptname} Department` : "All Departments"}
          </Badge>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {deptname ? `${deptname} Specialists` : "All Registered Doctors"}
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse all doctors registered under NovaMed.
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search doctor by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 pr-10 h-12 shadow-sm text-base"
            />

            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Showing results for:{" "}
              <span className="font-semibold">{searchQuery}</span>
            </p>
          )}
        </div>

        {/* Count + Clear */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{filteredDoctors.length}</span>{" "}
              doctors found
            </p>
          </div>

          {searchQuery && (
            <Button variant="outline" size="sm" onClick={handleClearSearch}>
              Clear Search
            </Button>
          )}
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-xl shadow">
            <Stethoscope className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500 mb-6">
              Try a different search or remove filters.
            </p>
            {searchQuery && (
              <Button onClick={handleClearSearch}>View All Doctors</Button>
            )}
          </div>
        ) : (
          <div className="
            grid grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-6"
          >
            {filteredDoctors.map((doctor) => (
              <AdminDoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
