import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, AlertTriangle } from "lucide-react";

const AppointmentCancelModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Cancel Appointment?
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-900 text-sm">
            <strong>Please note:</strong> Cancelling may affect your appointment history and doctor's schedule.
          </AlertDescription>
        </Alert>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            No, Keep It
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            className="w-full sm:w-auto gap-2"
          >
            <XCircle className="w-4 h-4" />
            Yes, Cancel Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentCancelModal;