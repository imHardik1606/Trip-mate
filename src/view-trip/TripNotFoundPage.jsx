import React from "react";

function TripNotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 text-center">
      {/* Illustration */}
      <img
        src="/404-error.svg"
        alt="Trip Not Found"
        className="w-64 md:w-80 mb-6"
      />

      {/* Message */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Oops! Trip Not Found
      </h2>
      <p className="text-lg text-gray-600 max-w-md">
        Looks like the trip you're looking for doesn't exist. You can explore
        other amazing trips instead!
      </p>
      {/* Button */}
      <button
        onClick={() => navigate("/create-trip")}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-300"
      >
        Explore Trips
      </button>
    </div>
  );
}

export default TripNotFoundPage;
