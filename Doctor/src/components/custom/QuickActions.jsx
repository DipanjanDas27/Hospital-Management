import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  FileText, 
  BarChart3
} from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { 
      label: "All Appointments", 
      icon: Calendar, 
      path: "/appointments",
      color: "bg-teal-50 hover:bg-teal-100 text-teal-700"
    },
    { 
      label: "My profile", 
      icon: Users, 
      path: "/profile", 
      color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
    },
    { 
      label: "Medical Records", 
      icon: FileText, 
      path: "/prescriptions",
      color: "bg-cyan-50 hover:bg-cyan-100 text-cyan-700"
    },
    { 
      label: "Lab Reports", 
      icon: BarChart3, 
      path: "/labtests",
      color: "bg-orange-50 hover:bg-orange-100 text-orange-700"
    },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              onClick={() => navigate(action.path)}
              className={`h-auto flex-col gap-2 p-4 border-0 ${action.color}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default QuickActions;