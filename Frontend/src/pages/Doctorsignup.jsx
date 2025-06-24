import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function DoctorSignupForm() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center text-blue-800 mb-2">
          Doctor Registration
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Welcome Doctor! Please enter your personal details to continue.
        </p>

        <form className="space-y-4">
          <Input type="text" placeholder="Enter your full name" label="Doctor Name" />
          <Input type="text" placeholder="Choose a username" label="Username" />
          <Input type="email" placeholder="Enter your email" label="Email" />
          <Input type="password" placeholder="Create a password" label="Password" />
          <Input type="text" placeholder="Enter your phone number" label="Phone Number" />
          <Input type="text" placeholder="Sex" label="Sex" />
          <Input type="text" placeholder="Age" label="Age" />

          <div className="flex justify-center pt-4">
            <Button
              type="button"
              className="w-full max-w-sm bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate("/doctor-career")}
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
