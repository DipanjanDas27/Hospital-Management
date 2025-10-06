import React, { useState } from "react";
import {
  Menu,
  Bell,
  LogOut,
  Users,
  Calendar,
  FileText,
  Clock,
  Settings,
  Search,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Calendar },
  { id: "mypatients", label: "My Patients", icon: Users },
  { id: "appointments", label: "Appointments", icon: Clock },
  { id: "prescriptions", label: "Prescriptions", icon: FileText },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "settings", label: "Settings", icon: Settings },
];

const stats = [
  { title: "My Patients", value: "312" },
  { title: "Today’s Appts", value: "12" },
  { title: "Pending Prescriptions", value: "5" },
  { title: "Upcoming Surgeries", value: "2" },
];

const recent = [
  { id: 1, name: "Riya Das", reason: "Fever & Cold", time: "Today, 10:30" },
  { id: 2, name: "Amit Kumar", reason: "Diabetes Follow-up", time: "Today, 09:15" },
  { id: 3, name: "Priya Sen", reason: "Chest Pain", time: "Yesterday, 18:40" },
  { id: 4, name: "Vikram Rao", reason: "Blood Test Review", time: "Yesterday, 16:00" },
];

export default function DoctorDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-[#123008] text-gray-100 transition-all duration-200 flex-shrink-0 flex flex-col`}
      >
        <div className="h-16 flex items-center px-4 gap-3 border-b border-white/6">
          <div
            className="w-9 h-9 rounded-md bg-[#195d14] flex items-center justify-center text-white text-sm font-bold"
            aria-hidden
          >
            D
          </div>
          <div className={`flex flex-col ${sidebarOpen ? "" : "hidden"}`}>
            <span className="text-sm font-semibold">NovaMed</span>
            <span className="text-xs text-gray-300">Doctor</span>
          </div>

          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="ml-auto text-gray-300 hover:text-white"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
        </div>

        <nav className="px-2 py-6 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`w-full flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-white/6 transition-colors ${
                  isActive ? "bg-white/8 ring-1 ring-white/10" : ""
                }`}
              >
                <Icon size={18} className="text-gray-200" />
                <span
                  className={`text-sm font-medium ${sidebarOpen ? "" : "hidden"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-[#195d14]">
              Doctor Dashboard
            </h2>

            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patients, records..."
                className="pl-9 pr-4 h-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#195d14]/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="relative p-2 rounded-md hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-[#195d14]" />
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Doctor Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">Dr. Smith</div>
                <div className="text-xs text-gray-500">dr.smith@novamed.com</div>
              </div>
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Doctor"
                className="w-9 h-9 rounded-full object-cover border border-gray-100"
              />
              <button
                onClick={() => alert("Logging out...")}
                className="text-gray-400 hover:text-gray-600"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between"
              >
                <div className="text-sm text-gray-500">{s.title}</div>
                <div className="mt-3 text-2xl font-bold text-[#195d14]">
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Section row */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent patients */}
            <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-md font-semibold text-[#195d14]">
                  Recent Consultations
                </h3>
                <div className="text-sm text-gray-500">Last 7 days</div>
              </div>

              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs text-gray-500 uppercase">
                    <tr>
                      <th className="py-3 pr-6">Patient</th>
                      <th className="py-3 pr-6">Reason</th>
                      <th className="py-3 pr-6">Time</th>
                      <th className="py-3 pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {recent.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                              {r.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <div>
                              <div className="font-medium">{r.name}</div>
                              <div className="text-xs text-gray-500">
                                ID: {2000 + r.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">{r.reason}</td>
                        <td className="py-4">{r.time}</td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <button
                              className="text-xs px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
                              onClick={() => alert(`View ${r.name}`)}
                            >
                              View
                            </button>
                            <button
                              className="text-xs px-3 py-1 rounded-md bg-[#195d14] text-white hover:opacity-90"
                              onClick={() => alert(`Write prescription for ${r.name}`)}
                            >
                              Prescribe
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick actions */}
            <aside className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="text-md font-semibold text-[#195d14] mb-3">
                Quick Actions
              </h4>
              <div className="space-y-3">
                <button className="w-full text-left py-2 px-3 rounded-md border border-gray-100 hover:bg-gray-50">
                  + Write Prescription
                </button>
                <button className="w-full text-left py-2 px-3 rounded-md border border-gray-100 hover:bg-gray-50">
                  + Schedule Surgery
                </button>
                <button className="w-full text-left py-2 px-3 rounded-md border border-gray-100 hover:bg-gray-50">
                  View Reports
                </button>

                <div className="mt-4 border-t pt-3">
                  <div className="text-xs text-gray-500 mb-2">
                    Contact Support
                  </div>
                  <div className="text-sm font-medium">help@novamed.com</div>
                  <div className="text-sm text-gray-500">+91 12345 67890</div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer className="h-14 bg-[#195d14] text-gray-200 flex items-center justify-between px-6">
          <div className="text-sm">
            © {new Date().getFullYear()} NovaMed Hospital
          </div>
          <div className="text-sm text-gray-300">Doctor Portal v1.0.0</div>
        </footer>
      </div>
    </div>
  );
}
