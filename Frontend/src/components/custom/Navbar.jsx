import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
        <h1 className="font-bold text-xl text-blue-700">NovaMed</h1>
      </div>

      {/* Links */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li><a href="#home" className="hover:text-blue-600">Home</a></li>
        <li><a href="#departments" className="hover:text-blue-600">Departments</a></li>
        <li><a href="#services" className="hover:text-blue-600">Services</a></li>
        <li><a href="#doctors" className="hover:text-blue-600">Doctors</a></li>
      </ul>

      {/* Buttons */}
      <div className="flex gap-4">
        <a href="#login" className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50">
          Login
        </a>
        <a href="#signup" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
          Sign Up
        </a>
      </div>

      <Menu className="md:hidden" />
    </nav>
  );
}
