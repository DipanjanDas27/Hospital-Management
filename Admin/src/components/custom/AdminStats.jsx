import React from "react";
import { Users, Calendar, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Total Doctors",
    value: 42,
    icon: Users,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Pending Appointments",
    value: 18,
    icon: Calendar,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Active Departments",
    value: 9,
    icon: ShieldCheck,
    color: "bg-slate-100 text-slate-700",
  },
];

const AdminStats = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card
            key={i}
            className="border-0 shadow-md hover:shadow-lg transition rounded-xl"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;
