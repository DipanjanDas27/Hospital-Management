import React, { useState } from "react";
import { CalendarDays, Clock, User, Stethoscope } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookAppointment() {
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [doctor, setDoctor] = useState("");
  const [patient, setPatient] = useState("");

  // Example available slots (these should come from your backend in real flow)
  const slots = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"];

  const handleBooking = async () => {
    if (!patient || !doctor || !date || !selectedSlot) {
      alert("Please fill all fields!");
      return;
    }

    // 🔗 Integrate with your backend API here
    // Example:
    // await fetch(`${import.meta.env.VITE_API_URL}/appointments`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ patient, doctor, date, slot: selectedSlot }),
    // });

    alert(`Appointment booked for ${patient} with ${doctor} on ${date.toDateString()} at ${selectedSlot}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-[#0a1a44] mb-4 flex items-center gap-2">
        <CalendarDays size={20} /> Book Appointment
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-3xl">
        {/* Patient Name */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User size={16} /> Patient Name
          </label>
          <input
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            placeholder="Enter patient full name"
            className="mt-1 w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1a44]/30"
          />
        </div>

        {/* Doctor Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Stethoscope size={16} /> Select Doctor
          </label>
          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="mt-1 w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1a44]/30"
          >
            <option value="">Choose a doctor</option>
            <option value="Dr. Arjun Mehta">Dr. Arjun Mehta (Cardiology)</option>
            <option value="Dr. Priya Nair">Dr. Priya Nair (Neurology)</option>
            <option value="Dr. Kunal Sharma">Dr. Kunal Sharma (Orthopedics)</option>
          </select>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CalendarDays size={16} /> Select Date
          </label>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            minDate={new Date()}
            className="mt-1 w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a1a44]/30"
          />
        </div>

        {/* Time Slot Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Clock size={16} /> Select Time Slot
          </label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 px-3 rounded-md border transition-colors text-sm ${
                  selectedSlot === slot
                    ? "bg-[#0a1a44] text-white border-[#0a1a44]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleBooking}
          className="w-full py-2 px-4 rounded-md bg-[#0a1a44] text-white font-medium hover:opacity-90"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}
