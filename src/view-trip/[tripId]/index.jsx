import { db } from "@/service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InfoSection from "../components/InfoSection";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";
import { toast } from "sonner";
import TripNotFoundPage from "../TripNotFoundPage";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { travelFacts } from "@/constants/options";

const Viewtrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    setLoading(true);
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTrip(docSnap.data());
      setNotFound(false);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  // ✅ Show toast **only once** after fetching trip data
  useEffect(() => {
    if (!loading) {
      if (trip) {
        toast.success("Trip found successfully!");
      } else if (notFound) {
        toast.error("Sorry, No trip found!");
      }
    }
  }, [loading, trip, notFound]);

  // 🔄 Change travel fact every 3 seconds while loading
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setFactIndex((prevIndex) => (prevIndex + 1) % travelFacts.length);
      }, 1700);
      return () => clearInterval(interval);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-gray-800 bg-gray-100">
        <AiOutlineLoading3Quarters className="h-16 w-16 animate-spin text-blue-600 mb-4 sm:h-20 sm:w-20" />
        <p className="text-xl font-bold text-center sm:text-2xl md:text-3xl">
          Loading your trip details...
        </p>
        <p className="mt-2 text-sm text-center text-gray-600 italic sm:text-lg md:text-xl">
          "{travelFacts[factIndex]}"
        </p>
      </div>
    );
  }

  if (notFound) {
    return <TripNotFoundPage />;
  }

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      <InfoSection trip={trip} />
      <Hotels trip={trip} />
      <PlacesToVisit trip={trip} />
    </div>
  );
};

export default Viewtrip;
