import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Stethoscope, 
  Phone, 
  Mail, 
  MapPin, 
  Clock
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: "Home", path: "/" },
      { name: "Find Doctors", path: "/doctors" },
      { name: "Departments", path: "/departments" },
      { name: "Appointments", path: "/appointments" },
    ],
    services: [
      { name: "Emergency Care", path: "/services/emergency" },
      { name: "Cardiology", path: "/departments" },
      { name: "Orthopedics", path: "/departments" },
      { name: "Pediatrics", path: "/departments" },
    ],
    resources: [
      { name: "About Us", path: "/about" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Contact Us", path: "/contact" },
    ],
  };

  const contactInfo = [
    { icon: Phone, text: "+91 1800-123-4567", label: "24/7 Helpline" },
    { icon: Mail, text: "support@novamed.com", label: "Email Support" },
    { icon: MapPin, text: "123 Healthcare Ave, Medical District", label: "Visit Us" },
    { icon: Clock, text: "Open 24/7 for Emergencies", label: "Emergency Services" },
  ];


  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">NovaMed</h2>
                <p className="text-sm text-gray-400">Healthcare Platform</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your trusted partner in healthcare. We provide comprehensive medical services 
              with state-of-the-art facilities and experienced healthcare professionals 
              dedicated to your wellbeing.
            </p>
            
            {/* Social Links */}
          
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8">
          <Separator className="col-span-full bg-gray-700" />
          {contactInfo.map((contact, index) => (
            <div key={index} className="flex items-start gap-3 mt-8">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <contact.icon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{contact.label}</p>
                <p className="text-sm text-gray-300">{contact.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-gray-800" />
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} NovaMed Hospital. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/sitemap"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}