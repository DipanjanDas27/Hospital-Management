import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const {
    _id,
    doctorname,
    department,
    qualification,
    experience, 
    specialization,
    verificationdocument,
  } = doctor;

  const doctorid = _id;
  const {deptname}= useParams()

  const navigate = useNavigate();
  const handleSelectDoctor = (doctorid,deptname) => {
    if(deptname){
      navigate(`/departments/${deptname}/doctors/${doctorid}`);
    }else{
      navigate(`/doctors/${doctorid}`);
    }
  };

  return (
    <Card className="shadow-lg rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-200">
      <div className="flex items-center gap-4 p-4">
        <img
          src={
            verificationdocument
              ? verificationdocument.profilepicture
              : "https://res.cloudinary.com/demo/image/upload/v1699999999/default_doctor_avatar.png"
          }
          alt={doctorname}
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{doctorname}</h2>
          <p className="text-sm text-gray-700">{qualification}</p>
          <p className="text-sm text-gray-600">{department}</p>
          {specialization && (
            <p className="text-sm text-gray-500">{specialization}</p>
          )}
          <p className="text-sm text-gray-500">
            Experience: {experience} years
          </p>
        </div>
      </div>

      <CardContent className="p-4 pt-0">
        <Button
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={() => handleSelectDoctor(doctorid,deptname)}
        >
          Check Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;