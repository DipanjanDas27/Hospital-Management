import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, Building2, FileText } from "lucide-react";

const actions = [
  { label: "All Appointments", icon: ClipboardList, path: "/admin/appointments" },
  { label: "Doctor Profiles", icon: Users, path: "/admin/doctors" },
  { label: "Departments", icon: Building2, path: "/admin/departments" },
  { label: "Prescriptions", icon: FileText, path: "/admin/prescriptions" },
];

const AdminQuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">
        {actions.map((action, i) => {
          const Icon = action.icon;

          return (
            <Button
              key={i}
              onClick={() => navigate(action.path)}
              className="h-auto flex flex-col items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-4 rounded-xl"
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AdminQuickActions;
