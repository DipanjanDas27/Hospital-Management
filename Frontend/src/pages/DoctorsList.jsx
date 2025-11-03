import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctors, getdoctorbydepartment, } from "../services/patientApi";
import DoctorCard from "@/components/custom/doctorCard";
import { useParams } from "react-router-dom";
const DoctorList = () => {
  const dispatch = useDispatch();
  const { deptname } = useParams()
  const { doctors, loading, error } = useSelector((state) => state.patient);

  useEffect(() => {
    if (deptname) {
      dispatch(getdoctorbydepartment(deptname));
    } else {
      dispatch(getAllDoctors());
    }
  }, [dispatch, deptname]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-[#0a1a44] font-medium">
        Loading doctors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        {error || "Failed to load doctors."}
      </div>
    );
  }

  return (
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-[#0a1a44] mb-6 text-center">
        Available Doctors
      </h1>

      {doctors?.length === 0 ? (
        <p className="text-center text-gray-500">No doctors available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              department={deptname}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
