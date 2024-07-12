"use client";

import type React from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        closeButton: true,
        classNames: {
          success: "bg-green-500 text-white", // Custom class for success messages
          error: "bg-red-500 text-white", // Custom class for error messages
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
