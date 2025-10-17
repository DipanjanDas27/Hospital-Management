import { Link } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center gap-4">
       
        <div>
          <h4 className="text-lg font-semibold text-[#0a1a44]">Dipanjan Das</h4>
          <p className="text-sm text-gray-500">Cardiology</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-3">xyz</p>

      <div className="mt-4 flex justify-end">
        <Link
          className="px-4 py-2 bg-[#0a1a44] text-white rounded-lg text-sm hover:opacity-90"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
