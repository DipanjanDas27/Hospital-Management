import Input from '../components/ui/input'
import { Button } from "@/components/ui/button"
import {Link} from "react-router-dom"

function PatientSignup() {
  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-2xl font-semibold text-center text-blue-800 mb-2">
            Patient Sign Up
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Please enter your details to create a patient account.
          </p>

          <form className="space-y-4">
            <Input type="text" placeholder="Enter your name " label="Name" />
            <Input type="text" placeholder="Enter your username " label="Username" />
            <Input type="email" placeholder="Enter your email " label="Email" />
            <Input type="password" placeholder="Create a password " label="Password" />
            <Input type="text" placeholder="Enter your phone number " label="Phone Number" />
            <Input type="text" placeholder="Sex" label="Sex" />
            <Input type="text" placeholder="Age " label="Age" />
            <label htmlFor="guardian" className="inline-block mx-8 mb-1 pl-1">
              Guardian Name
            </label>
            <Input type="text" placeholder="Guardian Name" id="guardian" />

            <div className="flex justify-center pt-4">
              <Button type="submit" className="w-full max-w-sm bg-blue-600 text-white hover:bg-blue-700">
                Submit
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
           <Link to="/login" className="text-blue-600 hover:underline font-medium">Log in here</Link>

          </p>
        </div>
      </div>


    </>
  )
}

export default PatientSignup