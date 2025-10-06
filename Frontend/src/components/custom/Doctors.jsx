const doctors = [
  { name: "Dr. Sarah Smith", spec: "Cardiologist", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Dr. James Johnson", spec: "Neurologist", img: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Dr. Emily Taylor", spec: "Pediatrician", img: "https://randomuser.me/api/portraits/women/46.jpg" },
  { name: "Dr. David Brown", spec: "Orthopedic Surgeon", img: "https://randomuser.me/api/portraits/men/47.jpg" },
];

export default function Doctors() {
  return (
    <section id="doctors" className="px-8 py-16 bg-gray-50">
      <h3 className="text-2xl font-bold mb-6">Meet Our Doctors</h3>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {doctors.map((doc, i) => (
          <div key={i} className="min-w-[220px] bg-white shadow-md rounded-2xl p-4 text-center">
            <img src={doc.img} alt={doc.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h4 className="font-semibold">{doc.name}</h4>
            <p className="text-sm text-gray-500">{doc.spec}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

