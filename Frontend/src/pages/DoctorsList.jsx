import React from "react";
import { User, Phone, Mail, Stethoscope } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Arjun Mehta",
    specialty: "Cardiologist",
    phone: "+91 98765 43210",
    email: "arjun.mehta@novamed.com",
  },
  {
    id: 2,
    name: "Dr. Priya Nair",
    specialty: "Neurologist",
    phone: "+91 99887 66554",
    email: "priya.nair@novamed.com",
  },
  {
    id: 3,
    name: "Dr. Kunal Sharma",
    specialty: "Orthopedic Surgeon",
    phone: "+91 91234 56789",
    email: "kunal.sharma@novamed.com",
  },
];

export default function DoctorsList() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-[#0a1a44] mb-4">Doctors</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="text-gray-500" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-[#0a1a44]">{doc.name}</h3>
                <p className="text-sm text-gray-500">{doc.specialty}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={14} /> {doc.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} /> {doc.email}
              </div>
            </div>

            <button className="mt-4 w-full text-sm py-2 px-3 rounded-md bg-[#0a1a44] text-white hover:opacity-90">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
