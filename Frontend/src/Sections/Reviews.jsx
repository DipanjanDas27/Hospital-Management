import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const reviews = [
  { 
    name: "John Doe", 
    text: "Great doctors, great staff, and excellent facilities. The level of care I received was outstanding. Highly recommended!", 
    rating: 5,
    role: "Patient"
  },
  { 
    name: "Priya Sharma", 
    text: "The appointment booking process was smooth and the staff were very supportive. From reception to discharge, everything was professional.", 
    rating: 5,
    role: "Patient"
  },
  { 
    name: "Arjun Mehta", 
    text: "Doctors listen patiently and give the best treatment. Felt very cared for throughout my stay. The medical expertise here is exceptional.", 
    rating: 5,
    role: "Patient"
  },
  { 
    name: "Fatima Khan", 
    text: "The environment is clean, hygienic, and welcoming. Staff members are courteous and the facilities are top-notch.", 
    rating: 5,
    role: "Patient"
  },
];

export default function Reviews() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-gray-600">
            Real experiences from real patients. Read about their journey with us 
            and how we've made a difference in their healthcare.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Quote Icon */}
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Quote className="w-5 h-5 text-blue-600" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed text-sm">
                    "{review.text}"
                  </p>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold text-sm">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {review.name}
                      </p>
                      <p className="text-xs text-gray-500">{review.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white rounded-2xl shadow-md">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">4.9/5</p>
            <p className="text-sm text-gray-600 mt-1">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">2,500+</p>
            <p className="text-sm text-gray-600 mt-1">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">98%</p>
            <p className="text-sm text-gray-600 mt-1">Satisfaction</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">15K+</p>
            <p className="text-sm text-gray-600 mt-1">Happy Patients</p>
          </div>
        </div>
      </div>
    </section>
  );
}