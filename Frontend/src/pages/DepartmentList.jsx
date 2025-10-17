import DepartmentCard from "../components/custom/DepartmentCard";

const departments = [
  { name: "Cardiology", description: "Heart and blood vessel specialists." },
  { name: "Neurology", description: "Brain, spinal cord, and nerve care." },
  { name: "Orthopedics", description: "Bone and muscle related treatments." },
  { name: "Pediatrics", description: "Child healthcare and development." },
];

export default function DepartmentList() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-[#0a1a44] mb-6 text-center">Departments</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((d, i) => (
          <DepartmentCard key={i} department={d} />
        ))}
      </div>
    </div>
  );
}
