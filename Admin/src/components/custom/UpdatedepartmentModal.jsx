import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { adminUpdateDepartment } from "@/services/adminApi";

function UpdateDepartmentModal({ open, onClose, dept }) {
  const dispatch = useDispatch();

  const [deptname, setDeptname] = useState(dept.deptname);
  const [description, setDescription] = useState(dept.description);

  const handleUpdate = async () => {
    await dispatch(
      adminUpdateDepartment({
        id: dept._id,
        payload: { deptname, description },
      })
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <div>
            <Label>Department Name</Label>
            <Input value={deptname} onChange={(e) => setDeptname(e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
              onClick={handleUpdate}
            >
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateDepartmentModal;
