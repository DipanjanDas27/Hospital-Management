import { useSearchParams } from "react-router-dom";
import DoctorCard from "../components/custom/DoctorCard";

const allDoctors = [
  { id: 1, name: "Dr. S. Mehta", department: "Cardiology", photo: "/doctor1.jpg", bio: "Expert in heart and vascular care." },
  { id: 2, name: "Dr. R. Das", department: "Neurology", photo: "/doctor2.jpg", bio: "Specialist in brain disorders." },
  { id: 3, name: "Dr. A. Sharma", department: "Pediatrics", photo: "/doctor3.jpg", bio: "Child health expert." },
  { id: 4, name: "Dr. N. Roy", department: "Orthopedics", photo: "/doctor4.jpg", bio: "Bone and joint care specialist." },
];

export default function Doctors() {
  const [params] = useSearchParams();
  const dept = params.get("dept");

  const filteredDoctors = dept
    ? allDoctors.filter((doc) => doc.department === dept)
    : allDoctors;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-[#0a1a44] mb-6 text-center">
        {dept ? `${dept} Doctors` : "All Doctors"}
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  );
}
