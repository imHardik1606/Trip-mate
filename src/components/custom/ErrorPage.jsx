import { Link } from "react-router-dom";
import { Plane, MapPin, Compass } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100 text-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md">
        <h1 className="text-4xl font-bold text-blue-600">404</h1>
        <h2 className="text-xl font-semibold mt-2">Page Not Found</h2>
        <p className="text-gray-600 mt-2">Oops! It looks like you're lost.</p>

        <div className="flex space-x-4 justify-center mt-4 text-blue-500">
          <Plane size={32} />
          <MapPin size={32} />
          <Compass size={32} />
        </div>

        <Link
          to="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:scale-105 hover:text-white transition-all shadow-lg"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
