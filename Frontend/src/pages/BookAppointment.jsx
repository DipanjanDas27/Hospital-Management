import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export default function BookAppointment() {
  const { register, handleSubmit, reset } = useForm();
  const [params] = useSearchParams();
  const doctor = params.get("doctor");
  const dept = params.get("dept");

  const onSubmit = (data) => {
    console.log("Booking:", data);
    alert("Appointment booked successfully!");
    reset();
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-[#0a1a44] mb-4 text-center">
        Book Appointment
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100 w-full max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Department</label>
            <input
              {...register("department")}
              defaultValue={dept || ""}
              readOnly
              className="w-full mt-1 p-2 border rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Doctor</label>
            <input
              {...register("doctor")}
              defaultValue={doctor || ""}
              readOnly
              className="w-full mt-1 p-2 border rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Patient Name</label>
            <input
              {...register("name", { required: true })}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date & Time</label>
            <input
              type="datetime-local"
              {...register("datetime", { required: true })}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#0a1a44] text-white rounded-lg hover:opacity-90"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
}
