import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import FormInput from "../../components/FormInput";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    const { name, email, password } = data;
    try {
      await registerUser({ name, email, password });
      alert("Registration successful! Please log in.");
      navigate("/");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-700">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            id="name"
            label="Name"
            type="text"
            placeholder="Your Name"
            registration={register("name", { required: "Name is required" })}
            error={errors.name}
          />
          <FormInput
            id="email"
            label="Email"
            type="email"
            placeholder="Your Email"
            registration={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
            error={errors.email}
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="Your Password"
            registration={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password}
          />
          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            registration={register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
            error={errors.confirmPassword}
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-500">
          Already have an account? <a href="/" className="text-blue-500 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
