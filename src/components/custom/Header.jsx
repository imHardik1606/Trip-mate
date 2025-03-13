import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { Link, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // Hide button on a specific route (e.g., "/my-trips")
  const hideButtonOnRoutes = ["/my-trips"];
  const shouldHideButton = hideButtonOnRoutes.includes(location.pathname);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: () => alert("Google login failed, please try again!"),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: `application/json`,
          },
        }
      )
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        window.location.reload();
      });
  };

  return (
    <header className="p-3 shadow-sm flex justify-between items-center bg-white sticky w-full top-0 left-0 z-50 md:px-10">
      {/* Logo & Branding */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="TripMate Logo" className="h-8 md:h-10" />
        <span className="text-xl font-bold text-red-600 md:text-2xl">
          TripMate
        </span>
      </Link>

      {/* Buttons & User Profile */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-5">
            {!shouldHideButton ? (
              <Link to="/my-trips">
                <Button variant="outline" className="rounded-full px-4 py-2">
                  My Trips
                </Button>
              </Link>
            ) : (
              <Link to="/create-trip">
                <Button variant="outline" className="rounded-full px-4 py-2">
                  + Create New Trip
                </Button>
              </Link>
            )}

            {/* Profile Popover */}
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture || "/userFallback.jpg"}
                  className="h-10 w-10 rounded-full border-2 border-gray-300 cursor-pointer hover:shadow-lg"
                />
              </PopoverTrigger>
              <PopoverContent className="p-3 text-center w-40">
                <h2 className="font-semibold text-gray-700">{user?.name}</h2>
                <button
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="text-red-500 mt-2 text-sm font-medium cursor-pointer hover:underline"
                >
                  Logout
                </button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button
            onClick={() => setOpenDialog(true)}
            className="px-5 py-2 rounded-lg"
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Sign-In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="p-6 rounded-lg text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Welcome to TripMate!
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-600">
            Sign in securely with Google to access your trips.
          </DialogDescription>
          <div className="mt-6">
            <Button
              onClick={login}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              <FcGoogle className="h-6 w-6" />
              Sign In with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Header;
