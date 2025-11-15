import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentPatient } from "@/services/patientApi";
import {
  Menu,
  Home,
  Stethoscope,
  Calendar,
  User,
  Building2,
  ChevronDown,
  LogOut,
  Pill,
  FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LogoutBtn from "./logoutbutton";

function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const isInitialized = useSelector((state) => state.auth.isInitialized);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
      dispatch(getCurrentPatient());
  }, [dispatch]);

  const navItems = [
    { name: "Home", slug: "/", active: true, icon: Home },
    { name: "Doctors", slug: "/doctors", active: true, icon: Stethoscope },
    { name: "Appointments", slug: "/appointments", active: isAuthenticated, icon: Calendar },
    { name: "Departments", slug: "/departments", active: true, icon: Building2 },
  ];

  const isActivePath = (slug) => {
    if (slug === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(slug);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">NovaMed</h1>
              <p className="text-xs text-gray-500 -mt-1">Healthcare Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <Button
                    variant={isActivePath(item.slug) ? "secondary" : "ghost"}
                    onClick={() => navigate(item.slug)}
                    className={`gap-2 ${isActivePath(item.slug)
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : ""
                      }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </li>
              ) : null
            )}
          </ul>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-3 px-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">
                        <img className="w-32 h-10 rounded-full border object-cover"
                          src={user?.profilepicture} alt="U" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.patientname || "User"}
                      </p>
                      <p className="text-xs text-gray-500">Patient</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/prescriptions")}>
                    <Pill className="w-4 h-4 mr-2" />
                    My Prescriptions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/labtests")}>
                    <FlaskConical className="w-4 h-4 mr-2" />
                    My Lab Tests
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <div className="w-full">
                      <LogoutBtn />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  NovaMed
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {/* Mobile Navigation */}
                <div className="space-y-1">
                  {navItems.map((item) =>
                    item.active ? (
                      <Button
                        key={item.name}
                        variant={isActivePath(item.slug) ? "secondary" : "ghost"}
                        onClick={() => {
                          navigate(item.slug);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full justify-start gap-3 ${isActivePath(item.slug)
                          ? "bg-blue-50 text-blue-700"
                          : ""
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Button>
                    ) : null
                  )}
                </div>

                {/* Mobile Auth Section */}
                <div className="pt-4 border-t space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.fullName || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          navigate("/profile");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="w-5 h-5" />
                        My Profile
                      </Button>
                      <LogoutBtn className="w-full" />
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          navigate("/login");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => {
                          navigate("/register");
                          setMobileMenuOpen(false);
                        }}
                      >
                        Register
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default Header;