import { useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  UserIcon,
  GlobeAltIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { LoginModal } from "./LoginModal";
import UserMenu from "./UserMenu";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/kalkisevalogo.png";

const languages = [
  { name: "English", code: "en" },
  { name: "Hindi", code: "hi" },
  { name: "Bengali", code: "bn" },
  { name: "Telugu", code: "te" },
  { name: "Tamil", code: "ta" },
  { name: "Kannada", code: "kn" },
  { name: "Malayalam", code: "ml" },
];

const moreSubmenu = [
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacypolicy" },
  { name: "Refund Policy", href: "/refundpolicy" },
  { name: "Shipping Policy", href: "/shippingpolicy" },
  { name: "Contact Us", href: "/contact" },
  { name: "About Us", href: "/about-us" },
];

function getCookieDomain() {
  const hostname = window.location.hostname;

  // Localhost → no domain
  if (
    hostname === "localhost" ||
    hostname.startsWith("127.") ||
    hostname.startsWith("192.")
  ) {
    return "";
  }

  // Main domain → allow all subdomains
  if (hostname.includes("kalkiseva.com")) {
    return "; domain=kalkiseva.com";
  }

  // AWS domain, CloudFront, EC2 IP, etc.
  return `; domain=${hostname}`;
}


export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const location = useLocation();

  useEffect(() => {
    const cookie = document.cookie.split("; ").find((c) => c.startsWith("googtrans="));
    if (cookie) {
      const parts = cookie.split("=")[1].split("/");
      const targetLang = parts[2];
      setSelectedLanguage(targetLang || "en");
    }

    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("userProfileUpdated", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("userProfileUpdated", checkLoginStatus);
    };
  }, []);
  
useEffect(() => {
  const cookie = document.cookie.split("; ").find((c) => c.startsWith("googtrans="));
  if (!cookie) {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname.startsWith("127.") || hostname.startsWith("192.");
    const cookieDomain = isLocalhost ? "" : "; domain=.kalkiseva.com";

    document.cookie = `googtrans=/en/en; path=/${cookieDomain}`;
  }

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  checkLoginStatus();

  window.addEventListener("storage", checkLoginStatus);
  window.addEventListener("userProfileUpdated", checkLoginStatus);

  return () => {
    window.removeEventListener("storage", checkLoginStatus);
    window.removeEventListener("userProfileUpdated", checkLoginStatus);
  };
}, []);

const handleLanguageChange = (langCode: string) => {
  const cookieValue = `/en/${langCode}`;
  const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 

  const cookieDomain = getCookieDomain();

  // DELETE old cookies first
  document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${cookieDomain}`;
  document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `googtrans=; domain=kalkiseva.com; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  // SET new cookie
  document.cookie = `googtrans=${cookieValue}; path=/; expires=${expiryDate.toUTCString()}${cookieDomain}`;

  // Reload UI
  window.location.reload();
};





  const isActive = (path: string) => location.pathname === path;

  const linkClasses = (path: string) =>
    `px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
      isActive(path) ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300"
    }`;

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <Link to="/">
                <img className="h-12 w-auto" src={logo} alt="Kalki Seva" />
              </Link>
            </motion.div>

            {/* Center Menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden md:flex flex-1 justify-center space-x-4"
            >
              <Link to="/" className={linkClasses("/")}>Home</Link>
              <Link to="/pujas" className={linkClasses("/pujas")}>Pujas</Link>
              <Link to="/panchangam" className={linkClasses("/panchangam")}>Panchangam</Link>

              {/* More dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  moreSubmenu.some((item) => isActive(item.href)) ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300"
                }`}>
                  More
                  <ChevronDownIcon className="ml-1 h-5 w-5" />
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 scale-90"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-90"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10">
                    <div className="py-1">
                      {moreSubmenu.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <Link to={item.href}
                              className={`block px-4 py-2 text-sm ${
                                active ? "bg-gray-100 dark:bg-gray-700" : ""
                              } ${isActive(item.href) ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300"}`}
                            >
                              {item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </motion.div>

            {/* Right Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="hidden md:flex items-center space-x-3"
            >
              {/* Language Switcher */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <GlobeAltIcon className="h-5 w-5 mr-1" />
                  {languages.find((lang) => lang.code === selectedLanguage)?.name}
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 scale-90"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-90"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10">
                    <div className="py-1">
                      {languages.map((lang) => (
                        <Menu.Item key={lang.code}>
                          {({ active }) => (
                            <button onClick={() => handleLanguageChange(lang.code)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                active ? "bg-gray-100 dark:bg-gray-700" : ""
                              } ${selectedLanguage === lang.code ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300"}`}
                            >
                              {lang.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Download App Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="relative flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download App
                <span className="absolute -top-1 right-1 bg-yellow-400 text-black text-[9px] font-semibold px-1 py-[1px] rounded-full">
                  Coming Soon
                </span>
              </motion.button>

              {/* Login or User */}
              {isLoggedIn ? (
                <UserMenu />
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Login
                </motion.button>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="md:hidden bg-white dark:bg-gray-900 overflow-hidden"
            >
               <Transition
          show={isMenuOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                  isActive("/") ? "text-primary font-medium" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/pujas"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                  isActive("/pujas") ? "text-primary font-medium" : ""
                }`}
              >
                Pujas
              </Link>
              <Link
                to="/panchangam"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md hover:bg-gray-100 ${
                  isActive("/panchangam") ? "text-primary font-medium" : ""
                }`}
              >
                Panchangam
              </Link>

              <div className="px-3 py-2">
                <Menu as="div" className="w-full">
                  <Menu.Button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100">
                    More
                    <ChevronDownIcon className="h-5 w-5" />
                  </Menu.Button>
                  <Menu.Items className="px-4">
                    {moreSubmenu.map((item) => (
                      <Menu.Item key={item.name}>
                        <Link
                          onClick={() => setIsMenuOpen(false)}
                          to={item.href}
                          className={`block py-2 text-sm ${
                            location.pathname === item.href
                              ? "text-primary font-medium"
                              : ""
                          }`}
                        >
                          {item.name}
                        </Link>
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Menu>
              </div>

              <div className="px-3 py-2">
                <Menu as="div" className="w-full">
                  <Menu.Button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100">
                    Language
                    <ChevronDownIcon className="h-5 w-5" />
                  </Menu.Button>
                  <Menu.Items className="px-4">
                    {languages.map((lang) => (
                      <Menu.Item key={lang.code}>
                        <button
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`block w-full text-left py-2 text-sm ${
                            selectedLanguage === lang.code
                              ? "text-primary font-medium"
                              : ""
                          }`}
                        >
                          {lang.name}
                        </button>
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Menu>
              </div>

              <div className="px-3 py-2">
                {isLoggedIn ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full flex items-center justify-center px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary/10"
                  >
                    <UserIcon className="h-5 w-5 mr-2" />
                    Login
                  </button>
                )}
              </div>

              <div className="px-3 py-2">
                <button className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 relative">
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Download App
                  <span className="absolute -top-1.5 right-1 bg-yellow-400 text-black text-[9px] font-semibold px-1.5 py-[1px] rounded-full shadow-sm leading-none">
                    Coming Soon
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </>
  );
};
