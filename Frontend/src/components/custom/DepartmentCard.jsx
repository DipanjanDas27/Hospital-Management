import React from "react";
import { Card, CardContent } from "@/components/ui/card";

function DepartmentCard({ name, description, onClick }) {

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer rounded-2xl p-4 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 bg-white"
    >
      <CardContent className="flex flex-col items-center justify-center gap-3">
        <h3 className="text-lg font-semibold text-[#0a1a44] capitalize">
          {name}
        </h3>
        <p className="text-gray-600 text-center text-sm">
          {description || "Explore doctors in this department."}
        </p>
      </CardContent>
    </Card>
  );
}

export default DepartmentCard;

