const reviews = [
  { name: "John Doe", text: "Great doctors, great staff, and excellent facilities. Highly recommended!" },
  { name: "Priya Sharma", text: "The appointment booking process was smooth and the staff were very supportive." },
  { name: "Arjun Mehta", text: "Doctors listen patiently and give the best treatment. Felt very cared for." },
  { name: "Fatima Khan", text: "The environment is clean, hygienic, and welcoming." },
];

export default function Reviews() {
  return (
    <section className="px-8 py-16">
      <h3 className="text-2xl font-bold mb-6">Patient Reviews</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div key={i} className="bg-white shadow-md rounded-2xl p-6">
            <p className="text-gray-700 italic mb-4">“{r.text}”</p>
            <h4 className="font-semibold text-blue-600">— {r.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
