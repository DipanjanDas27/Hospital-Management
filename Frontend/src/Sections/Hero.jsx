import { Phone, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="grid md:grid-cols-2 gap-8 px-8 py-16 items-center">
      <div>
        <h2 className="text-4xl font-bold mb-4">Welcome to NovaMed Hospital</h2>
        <p className="text-gray-600 mb-6">Providing the best healthcare for you and your family.</p>

        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <span>1234 Main St, City, State</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Phone className="w-5 h-5 text-blue-600" />
          <span>(123) 436-7880</span>
        </div>
      </div>

      <img
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
        alt="Hospital"
        className="rounded-2xl shadow-lg"
      />
    </section>
  );
}
