import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "./logoutbutton";


function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Doctors", slug: "/doctors", active: true },
    { name: "Appointments", slug: "/appointments", active: isAuthenticated },
    { name: "Profile", slug: "/profile", active: isAuthenticated },
    { name: "Departments", slug: "/departments", active: isAuthenticated },
    { name: "Login", slug: "/login", active: !isAuthenticated },
    { name: "Register", slug: "/register", active: !isAuthenticated },
  ];

  return (
    <header className="py-3 shadow bg-gray-700 text-white">
      <nav className="flex items-center justify-between container mx-auto px-4">
        <Link to="/">
        
        </Link> 

        <ul className="flex gap-3 items-center">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="inline-block px-5 py-2 hover:bg-gray-600 rounded-full transition duration-200"
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}
          {isAuthenticated && (
            <li>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
