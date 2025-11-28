import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Trash2, Calendar } from "lucide-react";

const ShiftManagement = ({ shifts, onChange }) => {
  const [currentShift, setCurrentShift] = useState({
    day: "",
    starttime: "",
    endtime: "",
    patientslot: 30
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const addShift = () => {
    if (currentShift.day && currentShift.starttime && currentShift.endtime) {
      onChange([...shifts, currentShift]);
      setCurrentShift({ day: "", starttime: "", endtime: "", patientslot: 30 });
    }
  };

  const removeShift = (index) => {
    onChange(shifts.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          Availability Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Shift */}
        <div className="p-4 bg-teal-50 rounded-lg space-y-4">
          <p className="font-semibold text-gray-900">Add New Schedule</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Day *</Label>
              <Select
                value={currentShift.day}
                onValueChange={(value) => setCurrentShift({ ...currentShift, day: value })}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {days.map((day) => (
                    <SelectItem 
                      key={day} 
                      value={day}
                      className="hover:bg-teal-50"
                    >
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Patient Slots *</Label>
              <Input
                type="number"
                min="1"
                value={currentShift.patientslot}
                onChange={(e) => setCurrentShift({ ...currentShift, patientslot: parseInt(e.target.value) })}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Start Time *</Label>
              <Input
                type="time"
                value={currentShift.starttime}
                onChange={(e) => setCurrentShift({ ...currentShift, starttime: e.target.value })}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label>End Time *</Label>
              <Input
                type="time"
                value={currentShift.endtime}
                onChange={(e) => setCurrentShift({ ...currentShift, endtime: e.target.value })}
                className="bg-white"
              />
            </div>
          </div>

          <Button 
            type="button"
            onClick={addShift}
            className="w-full gap-2 bg-linear-to-r from-teal-600 to-emerald-600"
            disabled={!currentShift.day || !currentShift.starttime || !currentShift.endtime}
          >
            <Plus className="w-4 h-4" />
            Add Schedule
          </Button>
        </div>

        {/* Display Added Shifts */}
        {shifts.length > 0 && (
          <div className="space-y-3">
            <p className="font-semibold text-gray-900">Current Schedule ({shifts.length})</p>
            {shifts.map((shift, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-teal-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{shift.day}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {shift.starttime} - {shift.endtime}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {shift.patientslot} slots
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeShift(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {shifts.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No schedules added yet. Add your availability above.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ShiftManagement;