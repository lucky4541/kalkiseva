import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  profile_pic_url: string | null;
  gender?: string; // Added gender property
}

interface UpdateProfileResponse {
  data?: {
    username?: string;
    profile_pic_url?: string;
  };
}

interface UserAddress {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface UserApiResponse {
  success: boolean;
  message: string;
  user: {
    userid: string;
    username: string;
    phonenumber: string;
    email: string | null;
    address: UserAddress | null;
    profile_pic_url: string | null;
    gender?: string | null;
  };
}

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    language: "English",
    notifications: {
      email: true,
      sms: true,
      whatsapp: false,
    },
    profile_pic_url: null,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("User is not logged in.");
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserApiResponse>(
          `${BASE_URL}/userdetails/getUserDetailsById`,
          {
            params: { userid: userId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data.user;

        // 🛠️ Parse address if it's a JSON string
        let address = {
          address: "",
          city: "",
          state: "",
          pincode: "",
        };

        try {
          if (typeof user.address === "string") {
            address = JSON.parse(user.address);
          } else if (user.address) {
            // In case it's already an object (optional fallback)
            address = user.address as UserAddress;
          }
        } catch (err) {
          console.warn("Failed to parse address JSON:", err);
        }

        // 🎯 Set profile state
        setProfile({
          name: user.username || "",
          email: user.email || "",
          phone: user.phonenumber || "",
          address: address.address || "",
          city: address.city || "",
          state: address.state || "",
          pincode: address.pincode || "",
          language: "English",
          notifications: {
            email: true,
            sms: true,
            whatsapp: false,
          },
          profile_pic_url: user.profile_pic_url || null,
          gender: user.gender || "",
        });
      } catch (error: unknown) {
        let errorMessage = "Something went wrong";

        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: { error?: string } } })
            .response === "object"
        ) {
          errorMessage =
            (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error ?? "Something went wrong";
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        Swal.fire("Error", errorMessage, "error");
      }
    };

    fetchUserData();
  }, [BASE_URL, navigate]);

  useEffect(() => {
    if (showCamera) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showCamera]);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      setShowCamera(true);

      // 👇 Delay setting srcObject until after camera modal is visible
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100); // small delay to ensure video element is mounted
    } catch {
      Swal.fire("Error", "Unable to access camera", "error");
    }
  };

  const closeCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const file = new File([blob], "captured.png", { type: "image/png" });
          setSelectedImage(file);

          const reader = new FileReader();
          reader.onloadend = () => {
            setProfile((prev) => ({
              ...prev,
              profile_pic_url: reader.result as string,
            }));
          };
          reader.readAsDataURL(file);
          closeCamera();
        }
      }, "image/png");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profile_pic_url: reader.result as string,
        }));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleInputChange = (
    field: keyof UserProfile,
    value: string | boolean
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleSave = async () => {
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     const token = localStorage.getItem("token");

  //     if (!userId || !token) {
  //       Swal.fire("Unauthorized", "User not logged in", "warning");
  //       navigate("/login");
  //       return;
  //     }

  //     if (!profile.name || !profile.email || !profile.phone) {
  //       Swal.fire("Missing Info", "Please fill out all required fields.", "warning");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("username", profile.name);
  //     formData.append("email", profile.email);
  //     formData.append("gender", profile.gender || "");
  //     formData.append("phonenumber", profile.phone);

  //     const addressObject = {
  //       address: profile.address,
  //       city: profile.city,
  //       state: profile.state,
  //       pincode: profile.pincode,
  //     };
  //     formData.append("address", JSON.stringify(addressObject));

  //     if (selectedImage) {
  //       formData.append("profile_pic_url", selectedImage);
  //     }

  //     const response = await axios.put(
  //       `${BASE_URL}/userdetails/update-profile/${userId}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       Swal.fire("Success", "Profile updated successfully!", "success");
  //       setIsEditing(false);
  //     } else {
  //       Swal.fire("Error", "Failed to update profile", "error");
  //     }
  //   } catch (error: unknown) {
  //     let errorMessage = "Something went wrong";

  //     if (
  //       typeof error === "object" &&
  //       error !== null &&
  //       "response" in error &&
  //       typeof (error as { response?: { data?: { error?: string } } }).response === "object"
  //     ) {
  //       errorMessage =
  //         (error as { response?: { data?: { error?: string } } }).response?.data?.error ??
  //         "Something went wrong";
  //     } else if (error instanceof Error) {
  //       errorMessage = error.message;
  //     }

  //     Swal.fire("Error", errorMessage, "error");
  //   }

  // };

  // const handleSave = async () => {
  //   try {
  //     const userId = localStorage.getItem("userId");
  //     const token = localStorage.getItem("token");

  //     if (!userId || !token) {
  //       Swal.fire("Unauthorized", "User not logged in", "warning");
  //       navigate("/login");
  //       return;
  //     }

  //     if (!profile.name || !profile.email || !profile.phone) {
  //       Swal.fire("Missing Info", "Please fill out all required fields.", "warning");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("username", profile.name);
  //     formData.append("email", profile.email);
  //     formData.append("gender", profile.gender || "");
  //     formData.append("phonenumber", profile.phone);

  //     const addressObject = {
  //       address: profile.address,
  //       city: profile.city,
  //       state: profile.state,
  //       pincode: profile.pincode,
  //     };
  //     formData.append("address", JSON.stringify(addressObject));

  //     if (selectedImage) {
  //       formData.append("profile_pic_url", selectedImage);
  //     }

  //     const response = await axios.put(
  //       `${BASE_URL}/userdetails/update-profile/${userId}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       const updatedName = response.data?.data?.username || profile.name;
  //       const updatedProfilePic = response.data?.data?.profile_pic_url;

  //       // ✅ Update localStorage
  //       localStorage.setItem("username", updatedName);
  //       if (updatedProfilePic) {
  //         localStorage.setItem("userProfilePic", updatedProfilePic);
  //       }

  //       // ✅ Dispatch custom event for UI update
  //       window.dispatchEvent(new Event("userProfileUpdated"));

  //       Swal.fire("Success", "Profile updated successfully!", "success").then(() => {
  //         setIsEditing(false); // exit edit mode
  //         // Do not reload, UI will update automatically from event
  //       });
  //     } else {
  //       Swal.fire("Error", "Failed to update profile", "error");
  //     }
  //   } catch (error: unknown) {
  //     let errorMessage = "Something went wrong";

  //     if (
  //       typeof error === "object" &&
  //       error !== null &&
  //       "response" in error &&
  //       typeof (error as { response?: { data?: { error?: string } } }).response === "object"
  //     ) {
  //       errorMessage =
  //         (error as { response?: { data?: { error?: string } } }).response?.data?.error ??
  //         "Something went wrong";
  //     } else if (error instanceof Error) {
  //       errorMessage = error.message;
  //     }

  //     Swal.fire("Error", errorMessage, "error");
  //   }
  // };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        Swal.fire("Unauthorized", "User not logged in", "warning");
        navigate("/login");
        return;
      }

      if (!profile.name || !profile.email || !profile.phone) {
        Swal.fire(
          "Missing Info",
          "Please fill out all required fields.",
          "warning"
        );
        return;
      }

      const formData = new FormData();
      formData.append("username", profile.name);
      formData.append("email", profile.email);
      formData.append("gender", profile.gender || "");
      formData.append("phonenumber", profile.phone);

      const addressObject = {
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
      };
      formData.append("address", JSON.stringify(addressObject));

      if (selectedImage) {
        formData.append("profile_pic_url", selectedImage);
      }

      const response = await axios.put<UpdateProfileResponse>(
        `${BASE_URL}/userdetails/update-profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedName = response.data?.data?.username || profile.name;
      const updatedProfilePic = response.data?.data?.profile_pic_url;

      // ✅ Update localStorage
      localStorage.setItem("username", updatedName);
      if (updatedProfilePic) {
        localStorage.setItem("userProfilePic", updatedProfilePic);
      }

      // ✅ Dispatch custom event to notify header or UserMenu
      window.dispatchEvent(new Event("userProfileUpdated"));

      Swal.fire("Success", "Profile updated successfully!", "success").then(
        () => {
          setIsEditing(false);
        }
      );
    } catch (error: unknown) {
      let errorMessage = "Something went wrong";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { error?: string } } })
          .response === "object"
      ) {
        errorMessage =
          (error as { response?: { data?: { error?: string } } }).response?.data
            ?.error ?? "Something went wrong";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Swal.fire("Error", errorMessage, "error");
    }
  };

  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
  <title>My Profile - Manage Your Account | Kalki Seva</title>
  <meta
    name="description"
    content="Manage your personal information, view your puja bookings, and update your profile on Kalki Seva."
  />
  <meta
    name="keywords"
    content="User Profile, My Account, Kalki Seva Profile, Puja Bookings, Edit Profile"
  />
  <meta name="author" content="Kalki Seva Team" />
  <meta name="robots" content="noindex, nofollow" />
</Helmet>
    <div className="max-w-6xl mx-auto px-4 py-12 flex-grow">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          {isEditing ? (
            <>
              <CheckIcon className="h-5 w-5" />
              Save Changes
            </>
          ) : (
            <>
              <PencilIcon className="h-5 w-5" />
              Edit Profile
            </>
          )}
        </button>
      </motion.div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
        >
          {/* Banner */}
          <div className="relative h-32 bg-gradient-to-r from-primary to-secondary">
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                {/* Profile Photo */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-28 h-28 rounded-full bg-white p-1 shadow-md"
                >
                  <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {profile.profile_pic_url ? (
                      <img
                        src={profile.profile_pic_url}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <UserIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </motion.div>

                {/* Upload Button */}
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <button className="relative bg-primary p-1.5 rounded-full text-white hover:bg-primary/90">
                      <CameraIcon className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </button>

                    {/* Open Camera Button */}
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={openCamera}
                        className="text-sm text-primary underline hover:text-primary/80"
                      >
                        Or take a photo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="pt-20 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className={labelClasses}>Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={inputClasses}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={inputClasses}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={inputClasses}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <label className={labelClasses}>Address</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={inputClasses}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>City</label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={inputClasses}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>State</label>
                    <input
                      type="text"
                      value={profile.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={inputClasses}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>PIN Code</label>
                  <input
                    type="text"
                    value={profile.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className={inputClasses}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative"
            >
              <h2 className="text-xl font-bold mb-6">Capture Photo</h2>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 rounded-lg bg-black object-cover"
              />
              <canvas ref={canvasRef} hidden />
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={capturePhoto}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Capture
                </button>
                <button
                  onClick={closeCamera}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>

  );
};
