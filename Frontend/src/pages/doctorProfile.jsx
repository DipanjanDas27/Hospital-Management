import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorProfile } from "@/services/patientApi";


function DoctorProfile() {
  const { doctorid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctorProfile, loading, error } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getDoctorProfile(doctorid));
  }, [dispatch, doctorid]);

  if (loading) return <p>Loading doctor profile...</p>;
  if (error) return <p>{error}</p>;
  if (!doctorProfile) return <p>No doctor found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={doctorProfile.verificationdocument.profilepicture || "/default-profile.png"}
          alt={doctorProfile.doctorname}
          className="w-48 h-48 object-cover rounded-full border-2 border-[#0a1a44]"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#0a1a44]">
            {doctorProfile.doctorname}
          </h1>
          <p className="text-gray-700 mt-2">
            <strong>Department:</strong> {doctorProfile.department}
          </p>
          <p className="text-gray-700">
            <strong>Specialization:</strong> {doctorProfile.specialization || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Experience:</strong> {doctorProfile.experience} years
          </p>
          <p className="text-gray-700">
            <strong>Qualification:</strong> {doctorProfile.qualification}
          </p>
          <p className="text-gray-700">
            <strong>email:</strong> {doctorProfile.email}
          </p>
           <p className="text-gray-700">
            <strong>contact no:</strong> {doctorProfile.phonenumber}
          </p>
          <button
            onClick={() => navigate(`/appointments/book-appointment/${doctorProfile._id}`)}
            className="mt-4 px-6 py-2 rounded-xl bg-[#0a1a44] text-white font-semibold hover:bg-[#162c70] transition"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
