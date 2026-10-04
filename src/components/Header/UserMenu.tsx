import React, { useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  UserIcon as UserIconOutline,
  BookmarkIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import defaultUserImage from "../../assets/usericons.png";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const menuItemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05 },
  }),
};

const UserMenu = ({
  userName,
  userProfilePic,
  onLogout,
}: {
  userName: string;
  userProfilePic: string;
  onLogout: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        as={motion.button}
        whileTap={{ scale: 0.92 }}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm"
      >
        <motion.div whileTap={{ scale: 0.95 }} className="flex items-center gap-2">
          <motion.img
            whileHover={{ scale: 1.15, rotate: 5 }}
            src={userProfilePic || defaultUserImage}
            alt="Profile Pic"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-purple-400"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-700 dark:text-gray-200 font-semibold"
          >
            {userName}
          </motion.span>
        </motion.div>
      </Menu.Button>

      <AnimatePresence>
        <Transition
          as={React.Fragment}
          enter="transition transform duration-300 ease-out"
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100 scale-100"
          leave="transition transform duration-200 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-90"
        >
          <Menu.Items
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute bottom-full mb-3 right-0 z-20 w-[260px] md:w-64 origin-bottom-right md:origin-top-right rounded-2xl bg-white dark:bg-gray-900/90 backdrop-blur-md shadow-2xl ring-1 ring-black/10 dark:ring-white/10 focus:outline-none overflow-hidden md:bottom-auto md:top-full md:mt-3"
          >
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Signed in as
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {userName}
              </p>
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1 } },
              }}
              className="py-2"
            >
              {[
                {
                  text: "My Profile",
                  icon: UserIconOutline,
                  action: () => navigate("/profile"),
                },
                {
                  text: "My Bookings",
                  icon: BookmarkIcon,
                  action: () => navigate("/bookings"),
                },
                {
                  text: "Help & Support",
                  icon: QuestionMarkCircleIcon,
                  action: () => navigate("/help"),
                },
              ].map((item, index) => (
                <Menu.Item key={index}>
                  {({ active, close }) => (
                    <motion.button
                      custom={index}
                      variants={menuItemVariants}
                      onClick={() => {
                        item.action();
                        close();
                      }}
                      className={`${
                        active ? "bg-gray-100 dark:bg-gray-800" : ""
                      } flex items-center px-5 py-3 text-sm text-gray-700 dark:text-gray-300 w-full transition-all`}
                    >
                      <item.icon className="h-5 w-5 mr-3 text-purple-500" />
                      {item.text}
                    </motion.button>
                  )}
                </Menu.Item>
              ))}

              <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

              <Menu.Item>
                {({ active, close }) => (
                  <motion.button
                    custom={3}
                    variants={menuItemVariants}
                    onClick={() => {
                      onLogout();
                      close();
                    }}
                    className={`${
                      active ? "bg-red-50 dark:bg-red-900" : ""
                    } flex w-full items-center px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-all`}
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-purple-500" />
                    Sign out
                  </motion.button>
                )}
              </Menu.Item>
            </motion.div>
          </Menu.Items>
        </Transition>
      </AnimatePresence>
    </Menu>
  );
};

const UserMenuContainer: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [userProfilePic, setUserProfilePic] = useState(defaultUserImage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // 🔹 If no token → redirect immediately
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      // ✅ Decode JWT token
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(atob(base64));
      const expiry = decodedPayload.exp * 1000;

      // 🔹 If token expired → logout
      if (Date.now() > expiry) {
        alert("Your session has expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/session-expired";
        return;
      }

      // 🔹 Auto logout when token expires
      const timeout = expiry - Date.now();
      const timer = setTimeout(() => {
        alert("Your session has expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      }, timeout);

      // ✅ Fetch user profile
      const fetchProfile = async () => {
        try {
          const res = await axios.get(
            `${BASE_URL}/userdetails/getUserDetailsById`,
            {
              params: { userid: userId },
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const user = (
            res.data as { user: { username?: string; profile_pic_url?: string } }
          ).user;

          setUserName(user.username || "User");
          setUserProfilePic(user.profile_pic_url || defaultUserImage);
        } catch (err) {
          console.error("Failed to load user profile:", err);
          setUserName("User");
          setUserProfilePic(defaultUserImage);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();

      // 🔹 Handle profile updates between tabs
      const handleStorageUpdate = () => {
        setUserName(localStorage.getItem("username") || "User");
        setUserProfilePic(
          localStorage.getItem("userProfilePic") || defaultUserImage
        );
      };

      window.addEventListener("userProfileUpdated", handleStorageUpdate);
      window.addEventListener("storage", handleStorageUpdate);

      // ✅ Cleanup
      return () => {
        clearTimeout(timer);
        window.removeEventListener("userProfileUpdated", handleStorageUpdate);
        window.removeEventListener("storage", handleStorageUpdate);
      };
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.clear();
      window.location.href = "/";
    }
  }, []);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/";
    }, 800);
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-12">
          <motion.div
            className="w-6 h-6 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>
      ) : (
        <UserMenu
          userName={userName}
          userProfilePic={userProfilePic}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default UserMenuContainer;
