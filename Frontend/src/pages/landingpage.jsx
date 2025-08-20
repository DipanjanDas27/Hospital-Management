import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Star,
  Shield,
  Users,
  Award,
  Stethoscope,
  Menu,
  X
} from 'lucide-react';

const NovaMedLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Exceptional care and professional staff. The doctors at NovaMed Hospital are truly dedicated to patient wellness.",
      date: "2 weeks ago"
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment: "State-of-the-art facilities and compassionate healthcare. I couldn't have asked for better treatment.",
      date: "1 month ago"
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      comment: "The entire team went above and beyond. From emergency care to follow-up, everything was handled perfectly.",
      date: "3 weeks ago"
    }
  ];

  const services = [
    {
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      title: "Cardiology",
      description: "Advanced heart care with cutting-edge technology"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Emergency Care",
      description: "24/7 emergency services with rapid response"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Family Medicine",
      description: "Comprehensive healthcare for all family members"
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-teal-600" />,
      title: "Specialist Care",
      description: "Expert specialists across multiple medical fields"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 48 48" 
                  className="drop-shadow-sm"
                >
                  {/* Professional Background */}
                  <rect 
                    x="2" 
                    y="2" 
                    width="44" 
                    height="44" 
                    fill="url(#logoGradient)" 
                    stroke="#1e40af" 
                    strokeWidth="1"
                    rx="4"
                  />
                  
                  {/* Modern Medical Cross - Refined */}
                  <rect x="21" y="14" width="6" height="20" fill="white" />
                  <rect x="14" y="21" width="20" height="6" fill="white" />
                  
                  {/* Professional Accent Lines */}
                  <rect x="36" y="12" width="8" height="2" fill="#60a5fa" opacity="0.8" />
                  <rect x="36" y="16" width="6" height="2" fill="#60a5fa" opacity="0.6" />
                  <rect x="36" y="20" width="4" height="2" fill="#60a5fa" opacity="0.4" />
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  NOVA<span className="text-blue-700 font-normal">MED</span>
                </h1>
                <p className="text-xs text-slate-600 font-semibold tracking-[0.1em] uppercase">Medical Center</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#services" className="text-slate-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="#about" className="text-slate-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-slate-700 hover:text-blue-600 transition-colors">Contact</a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600">
                Log In
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-slate-700">Home</a>
                <a href="#services" className="text-slate-700">Services</a>
                <a href="#about" className="text-slate-700">About</a>
                <a href="#contact" className="text-slate-700">Contact</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                  <Button variant="ghost" className="justify-start">Log In</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
                <Heart className="w-4 h-4 mr-2" />
                Trusted Healthcare
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                Your Health, Our
                <span className="text-blue-600 block">Priority</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                At NovaMed Hospital, we provide world-class healthcare services with compassion, 
                innovation, and excellence. Our dedicated team of medical professionals is committed 
                to delivering the best possible care for you and your family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Book Appointment
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300">
                  Emergency Care
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-blue-50 rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="NovaMed Hospital - Modern Healthcare Facility"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-slate-100 rounded-2xl flex items-center justify-center" style={{display: 'none'}}>
                  <div className="text-center">
                    <Heart className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Modern Healthcare Facility</p>
                    <p className="text-slate-500 text-sm mt-2">NovaMed Hospital Building</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <Shield className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <Stethoscope className="w-12 h-12 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Our Medical Services
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive healthcare services delivered by experienced professionals 
              using state-of-the-art medical technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">{service.title}</h3>
                  <p className="text-slate-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6">
                About NovaMed Hospital
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Located in the heart of the city, NovaMed Hospital has been serving our 
                community for over two decades. We are committed to providing exceptional 
                healthcare services with a patient-centered approach.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">123 Healthcare Avenue, Medical District, City 12345</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">info@novamedhosp.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">24/7 Emergency Services Available</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                <div className="text-slate-600">Years of Service</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-slate-600">Expert Doctors</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100K+</div>
                <div className="text-slate-600">Patients Served</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
                <div className="text-slate-600">Emergency Care</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Real experiences from patients who have received care at NovaMed Hospital.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic">"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">{review.name}</div>
                      <div className="text-sm text-slate-500">{review.date}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative w-12 h-12">
                  <svg 
                    width="48" 
                    height="48" 
                    viewBox="0 0 48 48" 
                    className="drop-shadow-sm"
                  >
                    {/* Professional Background */}
                    <rect 
                      x="2" 
                      y="2" 
                      width="44" 
                      height="44" 
                      fill="url(#footerGradient)" 
                      stroke="#3b82f6" 
                      strokeWidth="1"
                      rx="4"
                    />
                    
                    {/* Modern Medical Cross - Refined */}
                    <rect x="21" y="14" width="6" height="20" fill="white" />
                    <rect x="14" y="21" width="20" height="6" fill="white" />
                    
                    {/* Professional Accent Lines */}
                    <rect x="36" y="12" width="8" height="2" fill="#60a5fa" opacity="0.8" />
                    <rect x="36" y="16" width="6" height="2" fill="#60a5fa" opacity="0.6" />
                    <rect x="36" y="20" width="4" height="2" fill="#60a5fa" opacity="0.4" />
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e40af" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    NOVA<span className="text-blue-300 font-normal">MED</span>
                  </h1>
                  <p className="text-sm text-slate-300 font-semibold tracking-[0.1em] uppercase">Medical Center</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                Providing exceptional healthcare services with compassion, innovation, 
                and excellence. Your health and well-being are our top priorities.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white">
                  Facebook
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white">
                  Twitter
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white">
                  LinkedIn
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#services" className="block text-slate-300 hover:text-white transition-colors">Services</a>
                <a href="#about" className="block text-slate-300 hover:text-white transition-colors">About Us</a>
                <a href="#contact" className="block text-slate-300 hover:text-white transition-colors">Contact</a>
                <a href="#careers" className="block text-slate-300 hover:text-white transition-colors">Careers</a>
              </div>
            </div>

            {/* Staff Access - Professional Integration */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Professional Access</h3>
              <div className="space-y-3">
                <a href="#doctor-login" className="block text-slate-300 hover:text-white transition-colors">Doctor Login</a>
                <a href="#doctor-register" className="block text-slate-300 hover:text-white transition-colors">Doctor Registration</a>
                <a href="#admin-login" className="block text-slate-300 hover:text-white transition-colors">Admin Login</a>
                <a href="#admin-register" className="block text-slate-300 hover:text-white transition-colors">Admin Registration</a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                  <span className="text-slate-300">123 Healthcare Avenue<br />Medical District, City 12345</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">info@novamedhosp.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2025 NovaMed Hospital. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NovaMedLanding;