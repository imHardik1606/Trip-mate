import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from "@/constants/options";
import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/service/AIModal";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);
  const [dataPopUp, setDataPopUp] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: (err) => console.log(err),
  });

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (formData?.noOfDays > 30) {
      setOpen(true);
      return;
    }

    if (
      !formData?.location ||
      !formData?.budget ||
      !formData?.traveler ||
      !formData?.noOfDays
    ) {
      setDataPopUp(true);
      return;
    }

    //setting loading state
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);

    // console.log(FINAL_PROMPT);

    const result = await chatSession.sendMessage(FINAL_PROMPT);

    // console.log(result?.response?.text());
    setLoading(false);
    SaveAiTrip(result?.response?.text());
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    // getting user info from localstorage
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();

    // Add a new document in collection
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId,
    });

    setLoading(false);

    //navigating to view trip page
    navigate('/view-trip/'+docId)
  };

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
        // console.log(res);
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        onGenerateTrip();
      });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🏕️🌴
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder={"Ex.3"}
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>
      </div>

      <div className="my-10">
        <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
        <div className="grid gap-5 mt-5 grid-cols-2 text-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover: shadow-lg
                ${
                  formData?.budget == item.title && "shadow-lg border-red-400"
                }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10">
        <h2 className="text-xl my-3 font-medium">
          Who do you plan on traveling with on your next adventure?
        </h2>
        <div className="grid gap-5 mt-5 grid-cols-2 text-center sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("traveler", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover: shadow-lg
                ${
                  formData?.traveler == item.people &&
                  "shadow-lg border-red-400"
                }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button disabled={loading}  onClick={onGenerateTrip} className="p-6 text-xl">
          {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin"/> :
          "Generate Trip"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogTitle>Warning</DialogTitle>
          <DialogDescription>
            No. of days cannot be more than 30 days.
          </DialogDescription>
          <Button onClick={() => setOpen(false)} className="w-full mt-4">
            OK
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={dataPopUp} onOpenChange={setDataPopUp}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogTitle>Warning</DialogTitle>
          <DialogDescription>
            Please Fill all the form fields.
          </DialogDescription>
          <Button onClick={() => setDataPopUp(false)} className="w-full mt-4">
            OK
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogTitle></DialogTitle>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" className="text-center" />
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button
                onClick={login}
                className="w-full mt-5 flex gap-4 items-center"
              >
                <FcGoogle className="h-7 w-7" /> Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
