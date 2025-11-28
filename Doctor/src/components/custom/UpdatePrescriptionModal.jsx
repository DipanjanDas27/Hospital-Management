import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card } from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";

const UpdatePrescriptionModal = ({
  open,
  setOpen,
  prescriptionDetails,
  onSubmitUpdate
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      diagnosis: "",
      medicines: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines"
  });

  // Prefill form when data loads
  useEffect(() => {
    if (prescriptionDetails) {
      reset({
        diagnosis: prescriptionDetails.diagonosis,
        medicines: prescriptionDetails.medicines
      });
    }
  }, [prescriptionDetails, reset]);

  const onSubmit = (data) => {
    onSubmitUpdate({
      diagonosis: data.diagnosis,
      medicines: data.medicines
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
    max-w-2xl 
    max-h-[90vh] 
    overflow-y-auto
    bg-white                
    rounded-xl 
    shadow-2xl             
    border border-teal-200 
  "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-teal-700">
            Update Prescription
          </DialogTitle>

          {/* Mandatory to fix console warning */}
          <DialogDescription className="sr-only">
            Edit prescription details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Diagnosis */}
          <div>
            <label className="text-sm font-medium">Diagnosis</label>
            <Input
              className="mt-2"
              {...register("diagnosis", { required: "Diagnosis is required" })}
            />
            {errors.diagnosis && (
              <p className="text-red-600 text-sm">
                {errors.diagnosis.message}
              </p>
            )}
          </div>

          {/* Medicines */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-medium">Medicines</p>
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  append({
                    medicinename: "",
                    dosage: "",
                    frequency: "",
                    duration: ""
                  })
                }
              >
                Add Medicine
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 border space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Medicine name"
                    {...register(`medicines.${index}.medicinename`, {
                      required: "Required"
                    })}
                  />
                  <Input
                    placeholder="Dosage"
                    {...register(`medicines.${index}.dosage`, {
                      required: "Required"
                    })}
                  />
                  <Input
                    placeholder="Frequency"
                    {...register(`medicines.${index}.frequency`, {
                      required: "Required"
                    })}
                  />
                  <Input
                    placeholder="Duration"
                    {...register(`medicines.${index}.duration`, {
                      required: "Required"
                    })}
                  />
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePrescriptionModal;
