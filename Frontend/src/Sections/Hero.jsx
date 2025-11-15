import { Phone, MapPin, ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
                24/7 Emergency Services Available
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  NovaMed
                </span>{" "}
                Hospital
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Providing world-class healthcare services for you and your family. 
                Experience compassionate care with state-of-the-art medical facilities 
                and highly qualified healthcare professionals.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Visit Us</p>
                  <p className="text-sm text-gray-900">1234 Main St, City, State</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Call Us</p>
                  <p className="text-sm text-gray-900">(123) 436-7880</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-blue-600">50+</p>
                <p className="text-sm text-gray-600">Expert Doctors</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">15K+</p>
                <p className="text-sm text-gray-600">Happy Patients</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">20+</p>
                <p className="text-sm text-gray-600">Departments</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30" />
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-20" />
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
                alt="Modern Hospital Facility"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
