import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

const FormInput: React.FC<InputFieldProps> = ({ id, label, type, placeholder, registration, error }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        {...registration}
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default FormInput;
