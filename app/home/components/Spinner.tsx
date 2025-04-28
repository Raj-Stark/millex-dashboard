import React from "react";

export default function Spinner() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-24 h-24 border-4 border-l-red-600 rounded-full animate-spin"></div>
    </div>
  );
}
