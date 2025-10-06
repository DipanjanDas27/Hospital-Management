import React from "react";
import { HeartPulse, Brain, Bone, Baby, Stethoscope } from "lucide-react";

const departments = [
  { id: 1, name: "Cardiology", icon: HeartPulse, desc: "Heart and vascular care." },
  { id: 2, name: "Neurology", icon: Brain, desc: "Brain and nervous system." },
  { id: 3, name: "Orthopedics", icon: Bone, desc: "Bones, joints, and muscles." },
  { id: 4, name: "Pediatrics", icon: Baby, desc: "Child healthcare." },
  { id: 5, name: "General Medicine", icon: Stethoscope, desc: "Primary care & checkups." },
];

export default function Departments() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-[#0a1a44] mb-4">Departments</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const Icon = dept.icon;
          return (
            <div
              key={dept.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-start"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#0a1a44]/10 text-[#0a1a44]">
                <Icon size={24} />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-[#0a1a44]">
                {dept.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{dept.desc}</p>
              <button className="mt-4 text-sm px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50">
                Explore
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
