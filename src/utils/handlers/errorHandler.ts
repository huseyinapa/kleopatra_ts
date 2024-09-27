// utils/errorHandler.ts

import { FieldErrors } from "react-hook-form";
// import toast from "react-hot-toast";

export const handleFormErrors = (errors: FieldErrors) => {
  Object.values(errors).forEach((error) => {
    if (error?.message) {
      // toast.error(error?.message);
    }
  });
};
