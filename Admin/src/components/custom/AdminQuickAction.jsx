import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, Building2, FileText, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { adminCreateDepartment } from "@/services/adminApi";

const actions = [
  { label: "All Appointments", icon: ClipboardList, path: "/appointments" },
  { label: "Doctor Profiles", icon: Users, path: "/doctors" },
  { label: "Departments", icon: Building2, path: "/departments" },
  { label: "My Profile", icon: FileText, path: "/profile" },
];

const AdminQuickActions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.admin);

  const [open, setOpen] = useState(false);
  const [deptname, setDeptname] = useState("");
  const [description, setDescription] = useState("");

  // Submit handler
  const handleCreate = async () => {
    if (!deptname.trim()) return;

    const res = await dispatch(
      adminCreateDepartment({ deptname, description })
    );

    if (res.meta.requestStatus === "fulfilled") {
      setDeptname("");
      setDescription("");
      setOpen(false);
    }
  };

  return (
    <>
      {/* MAIN QUICK ACTIONS CARD */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>

          {/* Create Department Button */}
          <Button
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Department
          </Button>
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

      {/* CREATE DEPARTMENT MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Create New Department
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department Name</label>
              <Input
                placeholder="e.g. Cardiology"
                value={deptname}
                onChange={(e) => setDeptname(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Short description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleCreate}
              disabled={loading || !deptname.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminQuickActions;
