import { Button } from "@/components/ui/button";
import React from "react";
import { IoIosSend } from "react-icons/io";
import { FaShareAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const InfoSection = ({ trip }) => {
  // Function to share trip details
  const handleShare = async () => {
    const tripDetails = `🌍 Destination: ${trip?.userSelection?.location?.label}
📅 Duration: ${trip?.userSelection?.noOfDays} Days
💵 Budget: ${trip?.userSelection?.budget}
🧍 Travelers: ${trip?.userSelection?.traveler}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Trip Details",
          text: tripDetails,
          url: window.location.href, 
        });
      } catch (error) {
        console.error("Sharing failed", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(tripDetails + `\n🔗 ${window.location.href}`);
        alert("Trip details copied to clipboard! Share it manually.");
      } catch (error) {
        console.error("Copy failed", error);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }} 
      className="bg-white shadow-md rounded-xl p-5"
    >
      {/* Destination Image with Fade Animation */}
      <motion.img 
        src="/trip.jpg" 
        alt="Trip" 
        className="h-[340px] w-full object-cover rounded-xl"
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      />

      {/* Info Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2, duration: 0.5 }} 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5"
      >
        <div>
          {/* Destination Title */}
          <h2 className="font-bold text-2xl sm:text-3xl">{trip?.userSelection?.location?.label}</h2>

          {/* Trip Details */}
          <div className="flex flex-wrap gap-3 my-3">
            <motion.h2 
              className="p-2 px-4 bg-gray-200 rounded-full text-gray-700 text-sm md:text-md"
              whileHover={{ scale: 1.1 }} 
              transition={{ type: "spring", stiffness: 200 }}
            >
              📅 {trip?.userSelection?.noOfDays} Days
            </motion.h2>
            <motion.h2 
              className="p-2 px-4 bg-gray-200 rounded-full text-gray-700 text-sm md:text-md"
              whileHover={{ scale: 1.1 }} 
              transition={{ type: "spring", stiffness: 200 }}
            >
              💵 {trip?.userSelection?.budget} Budget
            </motion.h2>
            <motion.h2 
              className="p-2 px-4 bg-gray-200 rounded-full text-gray-700 text-sm md:text-md"
              whileHover={{ scale: 1.1 }} 
              transition={{ type: "spring", stiffness: 200 }}
            >
              🧍 Travelers: {trip?.userSelection?.traveler}
            </motion.h2>
          </div>
        </div>

        {/* Buttons (Send & Share) */}
        <div className="flex gap-3 mt-3 sm:mt-0">

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }} 
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              onClick={handleShare}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              <FaShareAlt className="text-lg" /> Share
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InfoSection;
