import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
