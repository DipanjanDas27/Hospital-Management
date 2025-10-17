import { Link } from "react-router-dom";

export default function DepartmentCard({ department }) {
  return (
    <Link
      to={`/doctors?dept=${encodeURIComponent(department.name)}`}
      className="block bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-[#0a1a44]">{department.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{department.description}</p>
    </Link>
  );
}
