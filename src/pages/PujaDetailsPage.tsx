import { useState, useEffect } from "react";
import { format } from "date-fns"; // Import the format function from date-fns
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { KalkiSevaLoader } from "../components/Loader/KalkiSevaLoader";

//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import default styles
import templeIcon from "../assets/templeicon.png"; // Importing temple icon
import { Tab } from "@headlessui/react";
import { FaMapMarkerAlt } from "react-icons/fa"; // Corrected import for FaMapMarkerAlt
import { LoginModal } from "../components/Header/LoginModal"; // Import the LoginModal component
import AnimatedDatePicker from "../components/AnimatedDatePicker";
import { Helmet } from "react-helmet-async";

// Update the existing Heroicons import
import {
  StarIcon,
  ChevronRightIcon,
  HeartIcon,
  SparklesIcon,
  GiftIcon,
  UserGroupIcon,
  HomeIcon, // Add this
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import Skeleton from "react-loading-skeleton";

interface Package {
  package_id: string;
  package_name: string;
  puja_date: string;
  package_description: string;
  number_of_devotees: number;
  price: string;
  puja_speciality: string;
  packageFeatureItems: { feature: string }[];
}

interface Features {
  feature: string[];
}

interface Review {
  review_id: number;
  rating: number;
  review: string;
  uploads_url: string[];
  review_verified: boolean;
  verified_user: boolean;
  username: string;
  profile_pic_url?: string;
  puja_id: string;
  booking_id: string;
  userid: string;
  created?: string;
}

interface ReviewApiResponse {
  message: string;
  data: Review[];
}

interface Dates {
  puja_id: string;
  puja_date: string;
}

interface PujaImages {
  puja_images_url: string[]; // Array of image URLs
  puja_video_url: string[]; // Video URL (nullable)
}

interface PujaBenefitItem {
  benefit_heading: string;
  benefit_name: string;
}

interface PujaData {
  puja_id: string;
  puja_name: string;
  puja_special: string;
  puja_description: string;
  puja_category?: string; // <-- Add this line
  temple_name: string;
  temple_location: string;
  puja_thumbnail_url: string;
  temple_description: string;
  temple_image_url: string;
  pujaaPacks: Package[];
  reviews: Review[];
  uploads_url: string[];
  verified_user: boolean;
  pujaAvailableDates: Dates[];
  features: Features[];
  pujaReviews: Review[];
  pujaMedia: PujaImages[];
  pujaBenefitItems: PujaBenefitItem[]; // ✅ ADD THIS
  averageRating: number;
  totalReviews: number;
}

export const PujaDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [puja, setPuja] = useState<PujaData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [, setLoadingReviews] = useState(true);
  const [, setReviewsError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl] = useState<string | null>(null);
  const [showMessage] = useState(false); // State for showing message
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [pendingBooking, setPendingBooking] = useState<{
    puja: PujaData;
    date: Date;
    package: Package;
  } | null>(null);

  const [visibleReviews, setVisibleReviews] = useState(5); // Show 5 reviews initially
  const [isOpen, setIsOpen] = useState(false);

  const handleLoadMore = () => {
    setVisibleReviews((prev) => prev + 5); // Load 5 more
  };

  // UseEffect to simulate login check (You can use session/localStorage or API call for actual logic)
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    setIsLoggedIn(!!userToken); // Check if token exists to determine login state
  }, []);

 // this hook MUST be here
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const saved = localStorage.getItem("pendingBooking");
    if (saved) {
      const booking = JSON.parse(saved);
      setPendingBooking(booking);
    }
  }, []);

  const handleImageClick = (url: string) => {
    const allImages =
      puja?.pujaMedia.flatMap((media) => media.puja_images_url) || [];
    setPreviewImages(allImages);
    setCurrentIndex(allImages.indexOf(url));
    setIsModalOpen(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % previewImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "1. What is Kalki Seva?",
      answer:
        "Kalki Seva is a platform that provides personalized pujas and spiritual services to help individuals connect with the divine and attain peace, prosperity, and blessings in their lives.",
    },
    {
      question: "2. How can I book a puja?",
      answer:
        "To book a puja, simply visit our website, choose the puja you wish to perform, and select a date and time. You can also book an online puja to be performed remotely.",
    },
    {
      question: "3. What types of pujas do you offer?",
      answer:
        "We offer a wide variety of pujas, including personalized pujas, home pujas, Vedic pujas, online pujas, and Shanti pujas. Each puja is designed to bring peace, prosperity, and blessings to your life.",
    },
    {
      question: "4. Can I request a specific date for my puja?",
      answer:
        "Yes, you can choose a preferred date and time when booking your puja. We will try our best to accommodate your request, based on availability.",
    },
    {
      question: "5. How do I know if my puja has been successfully booked?",
      answer:
        "Once your puja is booked, you will receive a confirmation email with all the details. You can also check your booking status on your Kalki Seva account page.",
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on mount
  }, []);


  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [basic, packages, media, benefits, dates, reviewStats] =
          await Promise.all([
            fetch(`${BASE_URL}/puja/basic/${id}`).then((res) => res.json()),
            fetch(`${BASE_URL}/puja/packages/${id}`).then((res) => res.json()),
            fetch(`${BASE_URL}/puja/media/${id}`).then((res) => res.json()),
            fetch(`${BASE_URL}/puja/benefits/${id}`).then((res) => res.json()),
            fetch(`${BASE_URL}/puja/dates/${id}`).then((res) => res.json()),
            fetch(`${BASE_URL}/puja/review-stats/${id}`).then((res) =>
              res.json()
            ),
          ]);

        setPuja({
          ...basic.data,
          pujaaPacks: packages.data,
          pujaMedia: media.data,
          pujaBenefitItems: benefits.data,
          pujaAvailableDates: dates.data,
          pujaReviews: [], // actual reviews fetched in another hook
          averageRating: reviewStats?.data?.averageRating || 0,
          totalReviews: reviewStats?.data?.totalReviews || 0,
        });
      } catch (err) {
        console.error("Error fetching split puja data", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
  }, [id, BASE_URL]);

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        setLoadingReviews(true);

        const response = await fetch(
          `${BASE_URL}/reviews/getReviewsByPuja/${id}`
        );
        const data: ReviewApiResponse = await response.json();

        if (response.ok && data.message === "Reviews fetched successfully") {
          // ✅ Filter only review_verified === true
          const verifiedReviews = data.data.filter(
            (review) => review.review_verified === true
          );

          setReviews(verifiedReviews);
          setReviewsError(null);
        } else {
          setReviews([]);
          setReviewsError(data.message || "Failed to fetch reviews.");
        }
      } catch (error) {
        console.error("Error fetching Reviews data:", error);
        setReviewsError("An unexpected error occurred while fetching reviews.");
      } finally {
        setLoadingReviews(false);
      }
    };

    if (id) fetchReviewsData();
  }, [id, BASE_URL]);


  if (loading) return <KalkiSevaLoader />;

  if (!puja) return <div>Puja not found</div>;

  // Format date to YYYY-MM-DD string
  const formatDateString = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
  };




  

  // Make sure you're filtering packages based on the selectedDate
  // Filter packages based on the selected date
  // Filter packages based on selected date
  const filteredPackages = puja?.pujaaPacks?.filter((pkg) => {
    if (!selectedDate) return false;
    return pkg.puja_date === formatDateString(selectedDate);
  });

  // Removed duplicate declaration of isDateAvailable

  // const handleDateChange = (date: Date | null) => {
  //   if (date && !isDateAvailable(date)) {
  //     return; // Prevent setting an invalid date
  //   }

  //   // Keep the date in local time (no UTC conversion)
  //   setSelectedDate(date);
  // };
  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    if (!isDateAvailable(date)) return;

    // Always allow modal to open if date is same or different
    setSelectedDate(date);
    setSelectedPackage(null); // Clear any previous selection
    setIsPackageModalOpen(true);
  };

  // const customDayClassName = (date: Date) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const isToday =
  //     date.getDate() === today.getDate() &&
  //     date.getMonth() === today.getMonth() &&
  //     date.getFullYear() === today.getFullYear();

  //   const isAvailable = isDateAvailable(date);

  //   const now = new Date();
  //   const isTomorrow = date.getDate() === today.getDate() + 1;
  //   const isPastCutoff = isTomorrow && now.getHours() >= 18;

  //   if (isToday) {
  //     return "bg-yellow-300 text-gray-700 cursor-not-allowed font-semibold";
  //   }

  //   return isAvailable
  //     ? "bg-green-500 text-white"
  //     : isPastCutoff
  //     ? "bg-yellow-200 text-gray-500 line-through cursor-not-allowed"
  //     : "bg-red-500 text-white cursor-not-allowed";
  // };

  // const isDateAvailable = (date: Date): boolean => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const formattedDate = format(date, "yyyy-MM-dd");

  //   const isToday =
  //     date.getDate() === today.getDate() &&
  //     date.getMonth() === today.getMonth() &&
  //     date.getFullYear() === today.getFullYear();

  //   const isInList = puja?.pujaAvailableDates?.some(
  //     (pujaDate) => pujaDate.puja_date === formattedDate
  //   );

  //   const now = new Date();
  //   const isTomorrow =
  //     date.getDate() === today.getDate() + 1 &&
  //     date.getMonth() === today.getMonth() &&
  //     date.getFullYear() === today.getFullYear();

  //   const isPastCutoff = isTomorrow && now.getHours() >= 18;

  //   return !isToday && isInList && !isPastCutoff;
  // };
  //   const isDateAvailable = (date: Date): boolean => {
  //   const now = new Date();
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const targetDate = new Date(date);
  //   targetDate.setHours(0, 0, 0, 0); // Normalize time for comparison

  //   const formattedDate = format(targetDate, "yyyy-MM-dd");

  //   const isInList = puja?.pujaAvailableDates?.some(
  //     (pujaDate) => pujaDate.puja_date === formattedDate
  //   );

  //   const isPast = targetDate < today;
  //   const isToday =
  //     targetDate.getTime() === today.getTime();

  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   const isTomorrow = targetDate.getTime() === tomorrow.getTime();

  //   const isPastCutoff = isTomorrow && now.getHours() >= 18;

  //   // 🔒 Block past dates, today, and tomorrow after 6pm
  //   if (isPast || isToday || isPastCutoff) return false;

  //   return isInList;
  // };
  // const isDateAvailable = (date: Date): boolean => {
  //   const now = new Date();
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const targetDate = new Date(date);
  //   targetDate.setHours(0, 0, 0, 0);

  //   const formattedDate = format(targetDate, "yyyy-MM-dd");

  //   const isInList = puja?.pujaAvailableDates?.some(
  //     (pujaDate) => pujaDate.puja_date === formattedDate
  //   );

  //   const isPast = targetDate < today;
  //   const isToday = targetDate.getTime() === today.getTime();

  //   // Tomorrow cutoff at 6 PM
  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(today.getDate() + 1);

  //   const isTomorrow = targetDate.getTime() === tomorrow.getTime();
  //   const isPastCutoff = isTomorrow && now.getHours() >= 18;

  //   // ✅ Main condition
  //   if (isPast || isToday || isPastCutoff) return false;

  //   return isInList;
  // };

  // Update the isDateAvailable function with this corrected version

  // const customDayClassName = (date: Date) => {
  //   const now = new Date();
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const targetDate = new Date(date);
  //   targetDate.setHours(0, 0, 0, 0);

  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(today.getDate() + 1);

  //   const isToday = targetDate.getTime() === today.getTime();
  //   const isTomorrow = targetDate.getTime() === tomorrow.getTime();
  //   const isPastCutoff = isTomorrow && now.getHours() >= 18;
  //   const isAvailable = isDateAvailable(date);

  //   if (isToday) {
  //     return "bg-yellow-300 text-gray-700 cursor-not-allowed font-semibold";
  //   }

  //   if (isPastCutoff) {
  //     return "bg-yellow-200 text-gray-500 line-through cursor-not-allowed";
  //   }

  //   return isAvailable
  //     ? "bg-green-500 text-white"
  //     : "bg-red-500 text-white cursor-not-allowed";
  // };

  // Update the isDateAvailable function with this corrected version
  // const isDateAvailable = (date: Date): boolean => {
  //   const now = new Date();
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const targetDate = new Date(date);
  //   targetDate.setHours(0, 0, 0, 0);

  //   const formattedDate = format(targetDate, "yyyy-MM-dd");

  //   // Block past dates
  //   if (targetDate < today) return false;

  //   // Block today
  //   if (targetDate.getTime() === today.getTime()) return false;

  //   // Check if date is in DB available dates
  //   const isInList = puja?.pujaAvailableDates?.some(
  //     (pujaDate) => pujaDate.puja_date === formattedDate
  //   );

  //   // For tomorrow, apply time cutoff
  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(today.getDate() + 1);

  //   if (targetDate.getTime() === tomorrow.getTime()) {
  //     // Block tomorrow if current time is 6 PM (18:00) or later
  //     return now.getHours() < 18 && isInList;
  //   }

  //   // For dates beyond tomorrow, no time restriction
  //   return isInList || false;
  // };

  // Updated isDateAvailable function
  // const isDateAvailable = (date: Date): boolean => {
  //   const now = new Date();

  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const targetDate = new Date(date);
  //   targetDate.setHours(0, 0, 0, 0);

  //   const formattedDate = targetDate.toISOString().slice(0, 10); // → "2025-07-13"

  //   const isInList = puja?.pujaAvailableDates?.some(
  //     (pujaDate) => pujaDate.puja_date === formattedDate
  //   );

  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(today.getDate() + 1);

  //   if (targetDate < today) return false;
  //   if (targetDate.getTime() === today.getTime()) return false;
  //   if (targetDate.getTime() === tomorrow.getTime()) {
  //     return now.getHours() < 18 && isInList;
  //   }

  //   return !!isInList;
  // };

  const CUTOFF_HOUR = 18; // ⏰ Changeable (6PM)

  const isDateAvailable = (date: Date): boolean => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const formattedDate = format(targetDate, "yyyy-MM-dd"); // from date-fns

    const isInList = puja?.pujaAvailableDates?.some(
      (pujaDate) => pujaDate.puja_date === formattedDate
    );

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (targetDate < today) return false;
    if (targetDate.getTime() === today.getTime()) return false;
    if (targetDate.getTime() === tomorrow.getTime()) {
      return now.getHours() < CUTOFF_HOUR && isInList;
    }

    return !!isInList;
  };

  // Updated customDayClassName function
  // const customDayClassName = (date: Date) => {
  //   const now = new Date();

  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   const targetDate = new Date(date);
  //   targetDate.setHours(0, 0, 0, 0);

  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(today.getDate() + 1);

  //   const isToday = targetDate.getTime() === today.getTime();
  //   const isTomorrow = targetDate.getTime() === tomorrow.getTime();
  //   const isPastCutoff = isTomorrow && now.getHours() >= 18;
  //   const isAvailable = isDateAvailable(date);

  //   if (isToday) {
  //     return "bg-yellow-300 text-gray-700 cursor-not-allowed font-semibold";
  //   }

  //   if (isTomorrow && isPastCutoff) {
  //     return "bg-yellow-200 text-gray-500 line-through cursor-not-allowed";
  //   }

  //   return isAvailable
  //     ? "bg-green-500 text-white"
  //     : "bg-red-500 text-white cursor-not-allowed";
  // };

  const customDayClassName = (date: Date) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday = targetDate.getTime() === today.getTime();
    const isTomorrow = targetDate.getTime() === tomorrow.getTime();
    const isPastCutoff = isTomorrow && now.getHours() >= CUTOFF_HOUR;
    const isAvailable = isDateAvailable(date);

    if (isToday) {
      return 'bg-yellow-300 text-gray-700 cursor-not-allowed font-semibold" title="Today (Not Selectable)';
    }

    if (isPastCutoff) {
      return 'bg-yellow-200 text-gray-500 line-through cursor-not-allowed" title="Tomorrow cutoff passed (after 6PM)';
    }

    if (isAvailable) {
      return 'bg-green-500 text-white" title="Available for booking';
    }

    return 'bg-red-500 text-white cursor-not-allowed" title="Not Available';
  };

  // const isDateAvailable = (date: Date): boolean => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0); // Ensure only date comparison
  //   const formattedDate = format(date, "yyyy-MM-dd");

  //   return (
  //     date > today &&
  //     puja?.pujaAvailableDates?.some(
  //       (pujaDate) => pujaDate.puja_date === formattedDate
  //     )
  //   );
  // };

  // const customDayClassName = (date: Date) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const formattedDate = format(date, "yyyy-MM-dd");

  //   const isAvailable =
  //     date > today &&
  //     puja?.pujaAvailableDates?.some(
  //       (pujaDate) => pujaDate.puja_date === formattedDate
  //     );

  //   return isAvailable
  //     ? "bg-green-500 text-white"
  //     : "bg-gray-300 text-gray-500 cursor-not-allowed";
  // };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!puja) {
    return <div>Puja not found</div>;
  }

  // Calculate reviews summary
  // const totalReviews = puja?.pujaReviews?.length || 0;
  // const averageRating =
  //   puja?.pujaReviews && totalReviews > 0
  //     ? puja.pujaReviews.reduce((acc, review) => acc + review.rating, 0) /
  //       totalReviews
  //     : 0;

  const totalReviews = puja.totalReviews || 0;
  const averageRating = puja.averageRating || 0;

  // const handleBooking = () => {
  //   if (!selectedPackage) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Select a Package",
  //       text: "Please select a Puja package to proceed.",
  //     });
  //     return;
  //   }

  //   if (!selectedDate) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Select a Date",
  //       text: "Please select a Puja date before continuing.",
  //     });
  //     return;
  //   }

  //   if (!isLoggedIn) {
  //     setPendingBooking({
  //       puja,
  //       date: selectedDate,
  //       package: selectedPackage,
  //     });
  //     setIsLoginModalOpen(true);
  //     return;
  //   }

  //   navigate("/checkout", {
  //     state: {
  //       puja,
  //       date: selectedDate,
  //       package: selectedPackage,
  //     },
  //   });
  // };

  // Slick settings for auto slide

  // const handleBooking = async () => {
  //   if (!selectedPackage) {
  //     await Swal.fire({
  //       icon: "warning",
  //       title: "Select a Package",
  //       text: "Please select a Puja package to proceed.",
  //     });
  //     return;
  //   }

  //   if (!selectedDate) {
  //     await Swal.fire({
  //       icon: "warning",
  //       title: "Select a Date",
  //       text: "Please select a Puja date before continuing.",
  //     });
  //     return;
  //   }

  //   if (!isLoggedIn) {
  //     const result = await Swal.fire({
  //       title: "Login Required",
  //       text: "Please log in to continue booking your puja.",
  //       icon: "info",
  //       showCancelButton: true,
  //       confirmButtonText: "Login",
  //       cancelButtonText: "Cancel",
  //     });

  //     if (result.isConfirmed) {
  //       setPendingBooking({
  //         puja,
  //         date: selectedDate,
  //         package: selectedPackage,
  //       });
  //       setIsLoginModalOpen(true);
  //     }

  //     return;
  //   }

  //   navigate("/checkout", {
  //     state: {
  //       puja,
  //       date: selectedDate,
  //       package: selectedPackage,
  //     },
  //   });
  // };

//   const handleBooking = async () => {
//   if (!selectedPackage) {
//     await Swal.fire({
//       icon: "warning",
//       title: "Select a Package",
//       text: "Please select a Puja package to proceed.",
//     });
//     return;
//   }

//   if (!selectedDate) {
//     await Swal.fire({
//       icon: "warning",
//       title: "Select a Date",
//       text: "Please select a Puja date before continuing.",
//     });
//     return;
//   }

//   if (!isLoggedIn) {
//     const result = await Swal.fire({
//       title: "Login Required",
//       text: "Please log in to continue booking your puja.",
//       icon: "info",
//       showCancelButton: true,
//       confirmButtonText: "Login",
//       cancelButtonText: "Cancel",
//     });

//     if (result.isConfirmed) {
//       // Save booking for after login
//       setPendingBooking({
//         puja,
//         date: selectedDate,
//         package: selectedPackage,
//       });

//       setIsLoginModalOpen(true);
//     }
//     return;
//   }

//   // Already logged in → go to checkout
//   navigate("/checkout", {
//     state: {
//       puja,
//       date: selectedDate,
//       package: selectedPackage,
//     },
//   });
// };
const handleBooking = async () => {
  // 🛑 No Package Selected
  if (!selectedPackage) {
    await Swal.fire({
      icon: "warning",
      title: "Select a Package",
      text: "Please select a Puja package to proceed.",
    });
    return;
  }

  // 🛑 No Date Selected
  if (!selectedDate) {
    await Swal.fire({
      icon: "warning",
      title: "Select a Date",
      text: "Please select a Puja date before continuing.",
    });
    return;
  }

  // 🟡 User NOT Logged In → Ask Login
  if (!isLoggedIn) {
    const result = await Swal.fire({
      title: "Login Required",
      text: "Please log in to continue booking your puja.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const bookingData = {
        puja,
        date: selectedDate,
        package: selectedPackage,
      };

      // Save to state
      setPendingBooking(bookingData);

      // Save to localStorage (so it persists even after refresh)
      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      // Open login modal
      setIsLoginModalOpen(true);
    }

    return;
  }

  // 🟢 User Logged In → Go to Checkout
  navigate("/checkout", {
    state: {
      puja,
      date: selectedDate,
      package: selectedPackage,
    },
  });
};


  // Combine all image URLs into a flat array
  const allImages =
    puja?.pujaMedia?.flatMap((media) =>
      (media.puja_images_url || []).filter((url) =>
        /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(url)
      )
    ) || [];

  const sliderSettings = {
    autoplay: allImages.length > 1,
    infinite: allImages.length > 1,
    dots: allImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* <Helmet>
        <title>Kalki Seva | {puja.puja_name}</title>
        <meta name="description" content={`Book ${puja.puja_name} at ${puja.temple_name} with trusted Vedic rituals.`} />
        <meta property="og:title" content={`${puja.puja_name} | Kalki Seva`} />
        <meta property="og:description" content={`Book ${puja.puja_name} at ${puja.temple_name} via Kalki Seva.`} />
        <meta property="og:url" content={`https://www.kalkiseva.com/puja/${puja.puja_id}`} />
        <meta name="twitter:title" content={`${puja.puja_name} | Kalki Seva`} />
        <meta name="twitter:description" content={`Experience divine rituals like ${puja.puja_name} through Kalki Seva`} />
      </Helmet> */}

      {puja?.puja_name && (
  <Helmet key={puja.puja_id}>
    <title>{puja.puja_name} - Kalki Seva | Book Online</title>

    <meta
      name="description"
      content={
        puja.puja_description ||
        "Book powerful Vedic rituals and temple services online through Kalki Seva."
      }
    />

    <meta
      name="keywords"
      content={`${puja.puja_name}, ${puja.puja_category || "Vedic Puja"}, Hindu Rituals, Kalki Seva, Online Puja Booking`}
    />

    <meta property="og:title" content={`${puja.puja_name} - Kalki Seva`} />
    <meta property="og:image" content={puja.puja_thumbnail_url || "/default-og-image.png"} />
    <meta property="og:url" content={`https://www.kalkiseva.com/pujas/${puja.puja_id}`} />
  </Helmet>
)}


      {/* Navigation Breadcrumbs */}

      <motion.nav
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.3 }} // 🌀 Animate when scrolling UP and DOWN
        className="flex items-center px-6 py-4 mb-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
      >
        <div className="flex items-center space-x-2 text-sm font-medium text-white">
          {/* 🏠 Home */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 hover:text-purple-200 transition-all duration-300"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="hover:underline decoration-2 underline-offset-4">
              Home
            </span>
          </motion.a>

          <ChevronRightIcon className="w-4 h-4 text-purple-200 transform -rotate-90 scale-75" />

          {/* 🛕 Pujas */}
          <motion.a
            href="/pujas"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 hover:text-purple-200 transition-all duration-300"
          >
            <span className="hover:underline decoration-2 underline-offset-4">
              Pujas
            </span>
          </motion.a>

          <ChevronRightIcon className="w-4 h-4 text-purple-200 transform -rotate-90 scale-75" />

          {/* 🕉 Current Puja Name */}
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-purple-50 font-bold truncate max-w-[200px] md:max-w-none"
          >
            {puja.puja_name}
          </motion.span>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10 px-4 sm:px-6 lg:px-8">
        {/* 🖼 Image Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
          className="space-y-4"
        >
          {loading ? (
            <Skeleton height={320} borderRadius={16} />
          ) : allImages.length > 1 ? (
            <Slider {...sliderSettings}>
              {allImages.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="aspect-[3/2] w-full overflow-hidden rounded-xl flex justify-center items-center"
                >
                  <img
                    src={image}
                    alt={`Puja image ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </motion.div>
              ))}
            </Slider>
          ) : (
            <div className="aspect-[3/2] w-full overflow-hidden rounded-xl flex justify-center items-center">
              <img
                src={allImages[0]}
                alt={puja?.puja_name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          )}
        </motion.div>

        {/* 📋 Puja Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false, amount: 0.3 }}
          className="space-y-6 text-gray-800"
        >
          {/* 🔖 Speciality Top Badge */}
          {loading ? (
            <Skeleton width={120} height={24} />
          ) : (
            <div className="flex justify-between items-center">
              <span className="bg-primary/10 text-primary font-semibold px-4 py-1 rounded-full text-xs sm:text-sm uppercase tracking-wider">
                {puja.puja_special}
              </span>
            </div>
          )}

          {/* 🕉 Puja Title */}
          {loading ? (
            <Skeleton height={36} width="80%" />
          ) : (
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {puja.puja_name}
            </h1>
          )}

          {/* 🛕 Temple Info */}
          {loading ? (
            <Skeleton height={20} width="60%" />
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={templeIcon} alt="Temple" className="w-5 h-5" />
                <p className="text-base font-medium">{puja.temple_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-purple-600 w-4 h-4" />
                <p className="text-sm text-gray-500">{puja.temple_location}</p>
              </div>
            </div>
          )}

          {/* 📃 Description */}
          {loading ? (
            <Skeleton count={3} />
          ) : (
            <>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: false }}
                className={`text-gray-600 text-base sm:text-lg leading-relaxed mt-2 transition-all duration-300 ${
                  isExpanded ? "" : "line-clamp-2"
                }`}
              >
                {puja.puja_description || "No description available."}
              </motion.p>
              {puja.puja_description && puja.puja_description.length > 120 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary font-medium mt-2 text-sm hover:underline"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </>
          )}

          {/* ⭐ Rating */}
          {loading ? (
            <Skeleton width={100} height={20} />
          ) : (
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center text-yellow-500 text-lg font-semibold">
                <StarIcon className="h-5 w-5" />
                <span className="ml-1">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-500">
                ({totalReviews} reviews)
              </span>
            </div>
          )}

          {/* 📅 Date Picker */}
          {loading && <Skeleton width="100%" height={40} />}

          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose Date
            </label>
            <div className="w-full sm:w-64">
              <AnimatedDatePicker
                selected={selectedDate ?? undefined}
                onChange={handleDateChange}
                filterDate={isDateAvailable}
                minDate={new Date()}
                dayClassName={customDayClassName}
              />
            </div>
          </div>

          {!loading && puja?.pujaAvailableDates?.length === 0 && (
            <p className="text-red-500 text-sm mt-4">No available dates</p>
          )}

          {/* Selected Package */}
          {selectedPackage && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md text-gray-800 flex justify-between items-center">
              <p className="font-medium">
                Selected Package:{" "}
                <span className="text-primary">
                  {selectedPackage.package_name}
                </span>
              </p>
              <button
                onClick={() => {
                  setSelectedPackage(null); // ❌ Clear selected package
                  setSelectedDate(null); // 🔁 Refresh DatePicker
                }}
                className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-600 hover:bg-red-200 rounded"
              >
                Remove
              </button>
            </div>
          )}

          {/* 🛒 CTA Button */}
          {selectedDate && selectedPackage && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
              className="mt-8"
            >
              <button
                onClick={handleBooking}
                className="w-full py-3 bg-primary text-white text-lg font-medium rounded-lg hover:bg-primary/90 transition"
              >
                Proceed to Checkout
              </button>
              {showMessage && !isLoggedIn && (
                <p className="text-sm text-red-500 mt-4">
                  Please log in or register to book your puja.
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12 overflow-x-auto scrollbar-hide ">
        <Tab.Group>
          <div className="overflow-x-auto max-w-full scrollbar-hide px-4 mb-4">
            <Tab.List className="flex space-x-4 w-max">
              {[
                "Description",
                "Temple Details",
                // "Puja Process",
                "Benefits",
                "Reviews",
                "Media",
                "FAQ",
              ].map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    `whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition duration-200 outline-none border-none ring-0 focus:ring-0 focus:outline-none ${
                      selected
                        ? "bg-primary text-white shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
          </div>

          <Tab.Panels className="mt-8">
            <Tab.Panel>
              <div className="prose max-w-none mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="text-lg md:text-xl text-gray-700 leading-relaxed tracking-wide space-y-3">
  {puja.puja_description
    ?.split(/\r?\n\r?\n/) // split by double newlines (paragraphs)
    .filter((para) => para.trim() !== "") // remove empty lines
    .map((para, index) => (
      <p key={index} className="whitespace-pre-line">
        {para.trim()}
      </p>
    ))}
</div>

                </motion.div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
                {/* State for image modal */}

                {/* 🖼 Temple Image */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="w-full"
                >
                  <div
                    className="overflow-hidden rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-500 cursor-pointer"
                    onClick={() => setIsOpen(true)} // Open modal when clicked
                  >
                    <img
                      src={puja.temple_image_url}
                      alt={puja.temple_name}
                      className="w-full h-64 md:h-80 object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </motion.div>

                {/* 📄 Temple Details */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col justify-center"
                >
                  <h3 className="text-3xl font-extrabold text-primary mb-4 leading-tight">
                    {puja.temple_name}
                  </h3>
                  <p className="text-gray-500 text-lg mb-6">
                    📍 {puja.temple_location}
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {puja.temple_description}
                  </p>
                </motion.div>
              </div>

              {/* Image Preview Modal */}
              {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="relative max-w-3xl w-full">
                    <button
                      className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <img
                      src={puja.temple_image_url}
                      alt={puja.temple_name}
                      className="w-full rounded-2xl object-contain"
                    />
                  </div>
                </div>
              )}
            </Tab.Panel>

            {/* <Tab.Panel>
              <div className="prose max-w-none">
                <p className="text-3xl font-bold text-primary mb-8">
                  Puja Process
                </p>

                
                <div className="step-card bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-xl transform transition-transform duration-500 hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl shadow-md">
                      1
                    </div>
                    <h4 className="text-2xl font-semibold">
                      Preparation and Setup
                    </h4>
                  </div>
                  <p className="text-lg">
                    The puja begins with a sacred preparation of the space. A
                    clean area is chosen, and all the required items for the
                    ritual are arranged. This step symbolizes creating a pure
                    environment for divine blessings.
                  </p>
                </div>
               
                <div className="step-card bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-xl transform transition-transform duration-500 hover:scale-105 mt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl shadow-md">
                      2
                    </div>
                    <h4 className="text-2xl font-semibold">
                      Invocation of Deity
                    </h4>
                  </div>
                  <p className="text-lg">
                    The priest invokes the deity with sacred chants, inviting
                    divine energy into the space. This is the most crucial part
                    of the puja, as it establishes the connection between the
                    devotee and the deity.
                  </p>
                </div>

               
                <div className="step-card bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-xl transform transition-transform duration-500 hover:scale-105 mt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl shadow-md">
                      3
                    </div>
                    <h4 className="text-2xl font-semibold">Offering Prayers</h4>
                  </div>
                  <p className="text-lg">
                    The devotee offers prayers, flowers, and other items to the
                    deity while chanting specific mantras. This phase
                    strengthens the bond with the divine and ensures the
                    spiritual benefit of the puja.
                  </p>
                </div>

                
                <div className="step-card bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-xl transform transition-transform duration-500 hover:scale-105 mt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl shadow-md">
                      4
                    </div>
                    <h4 className="text-2xl font-semibold">
                      Concluding the Puja
                    </h4>
                  </div>
                  <p className="text-lg">
                    After offering prayers, the priest concludes the puja with a
                    final prayer, invoking blessings of prosperity and peace.
                    Aarti is performed to express gratitude to the deity.
                  </p>
                </div>
              </div>
            </Tab.Panel> */}

            <Tab.Panel>
              <div className="prose max-w-none mb-16">
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-3xl font-extrabold text-center text-primary mb-12"
                >
                  Benefits of Performing This Puja
                </motion.p>

                <div className="grid gap-10 md:grid-cols-2">
                  {puja.pujaBenefitItems && puja.pujaBenefitItems.length > 0 ? (
                    puja.pujaBenefitItems.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 group overflow-hidden"
                      >
                        {/* Soft glow dot */}
                        <div className="absolute top-6 right-6 w-4 h-4 bg-primary/30 rounded-full blur-md"></div>

                        <div className="flex items-center gap-5 mb-6">
                          {/* Number inside circle with gradient */}
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-2xl font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                            {index + 1}
                          </div>

                          {/* Benefit Heading */}
                          <h4 className="text-2xl font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
                            {benefit.benefit_heading || "Benefit"}
                          </h4>
                        </div>

                        {/* Benefit Description */}
                        <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                          {benefit.benefit_name ||
                            "This benefit provides spiritual value."}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-lg">
                      No benefits listed for this puja.
                    </p>
                  )}
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-10 mb-16">
                {/* 📝 Reviews Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-md border border-gray-200"
                >
                  <h3 className="text-3xl font-extrabold text-primary mb-6 text-center">
                    Customer Reviews
                  </h3>

                  <div className="flex flex-col md:flex-row gap-10">
                    {/* ⭐ Average Rating */}
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary mb-2">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center relative mb-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="relative w-7 h-7">
                            <StarIconOutline className="w-full h-full text-gray-300" />
                            <div
                              className="absolute top-0 left-0 h-full overflow-hidden"
                              style={{
                                width: `${
                                  Math.min(Math.max(averageRating - i, 0), 1) *
                                  100
                                }%`,
                              }}
                            >
                              <StarIconSolid className="w-full h-full text-yellow-400 absolute top-0 left-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-600">{totalReviews} reviews</p>
                    </div>

                    {/* 📊 Rating Distribution */}
                    <div className="flex-1 space-y-4">
                     {[5, 4, 3, 2, 1].map((star) => {
  const count =
    reviews?.filter(
      (r) => Math.round(Number(r.rating)) === star
    ).length || 0;

  const percentage =
    totalReviews > 0
      ? (count / totalReviews) * 100
      : 0;

  return (
    <div key={star} className="flex items-center gap-4">
      <div className="flex items-center w-16">
        <span className="w-6 text-right">{star}</span>
        <StarIconSolid className="h-5 w-5 text-yellow-400 ml-1" />
      </div>

      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
          className="h-full bg-primary rounded-full"
        />
      </div>

      <span className="w-10 text-right text-gray-600">
        {count}
      </span>
    </div>
  );
})}
                    </div>
                  </div>
                </motion.div>

                {/* 📄 Reviews List */}
                <div className="space-y-8">
                  {(reviews || []).map((review) => (
                    <motion.div
                      key={review.review_id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-500"
                    >
                      <div className="flex items-start gap-4">
                        {/* 🧑 User Avatar */}
                        <div className="flex-shrink-0">
                          {review.profile_pic_url ? (
                            <img
                              src={review.profile_pic_url}
                              alt={review.username || "User"}
                              className="h-12 w-12 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-medium text-primary">
                                {review.username?.charAt(0).toUpperCase() ||
                                  "U"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 📝 Review Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-800">
                              {review.username || "Anonymous User"}
                            </h4>
                            {review.verified_user && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Verified
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="relative w-5 h-5">
                                  <StarIconOutline className="w-full h-full text-gray-300" />
                                  <div
                                    className="absolute top-0 left-0 h-full overflow-hidden"
                                    style={{
                                      width: `${
                                        Math.min(
                                          Math.max(review.rating - i, 0),
                                          1
                                        ) * 100
                                      }%`,
                                    }}
                                  >
                                    <StarIconSolid className="w-full h-full text-yellow-400 absolute top-0 left-0" />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <span className="text-sm text-gray-500">
                              {review.created
                                ? format(
                                    new Date(review.created),
                                    "MMM dd, yyyy"
                                  )
                                : ""}
                            </span>
                          </div>

                          <p className="text-gray-700 mb-4">{review.review}</p>

                          {/* 📸 Review Media */}
                          {review.uploads_url?.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                              {review.uploads_url.map((url, index) => {
                                const isImage = /\.(jpg|jpeg|png|gif)$/i.test(
                                  url
                                );
                                const isVideo = /\.(mp4|mov|avi)$/i.test(url);

                                return (
                                  <div
                                    key={index}
                                    className="relative group overflow-hidden rounded-lg shadow-md"
                                  >
                                    {isImage && (
                                      <img
                                        src={url}
                                        alt={`Review media ${index + 1}`}
                                        className="h-24 w-24 object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                                      />
                                    )}
                                    {isVideo && (
                                      <video
                                        className="h-24 w-24 object-cover rounded-lg cursor-pointer"
                                        controls
                                      >
                                        <source src={url} type="video/mp4" />
                                      </video>
                                    )}
                                    {isVideo && (
                                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <svg
                                          className="h-8 w-8 text-white"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 🔵 Load More Button */}
                {visibleReviews < reviews.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-8"
                  >
                    <button
                      onClick={handleLoadMore}
                      className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-500"
                    >
                      Load More Reviews
                    </button>
                  </motion.div>
                )}
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-10 mb-16">
                {/* Section Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold text-primary text-center"
                >
                  Media Gallery
                </motion.h3>

                {/* Image Section */}
                {puja.pujaMedia?.some(
                  (media) => media.puja_images_url.length > 0
                ) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="text-xl font-semibold mb-4">Images</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {puja?.pujaMedia?.flatMap((media, index) =>
                        media.puja_images_url?.map((imageUrl, i) => (
                          <motion.img
                            key={`${index}-${i}`}
                            src={imageUrl}
                            alt={`Puja image ${index}-${i}`}
                            className="w-full h-[220px] object-cover rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-500 cursor-pointer"
                            onClick={() => handleImageClick(imageUrl)}
                            whileHover={{ scale: 1.05 }}
                          />
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Video Section */}
                {puja.pujaMedia?.some((media) => media.puja_video_url) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="text-xl font-semibold mt-10 mb-4">Videos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {puja?.pujaMedia
                        ?.filter((media) => media.puja_video_url?.length > 0)
                        .map((media, index) => (
                          <motion.video
                            key={index}
                            src={media.puja_video_url[0]}
                            controls
                            className="w-full h-[260px] object-cover rounded-xl shadow-md hover:shadow-lg transition-all duration-500"
                            whileHover={{ scale: 1.02 }}
                          />
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* No Media Fallback */}
                {!puja.pujaMedia?.length && (
                  <p className="text-gray-500 text-center">
                    No media available for this puja.
                  </p>
                )}

                {/* Full-Screen Image Preview Modal */}
                {isModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="relative max-w-5xl w-full">
                      {/* Close Button */}
                      <button
                        className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 transition"
                        onClick={closeModal}
                      >
                        <X className="h-6 w-6" />
                      </button>

                      {/* Prev Button */}
                      <button
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 transition"
                        onClick={handlePrev}
                      >
                        <ChevronLeft className="h-8 w-8" />
                      </button>

                      {/* Next Button */}
                      <button
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/40 rounded-full p-2 hover:bg-black/70 transition"
                        onClick={handleNext}
                      >
                        <ChevronRight className="h-8 w-8" />
                      </button>

                      {/* Image Preview */}
                      <img
                        src={previewImages[currentIndex]}
                        alt="Preview"
                        className="w-full rounded-2xl object-contain max-h-[90vh]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="prose max-w-none mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold text-primary mb-8 text-center"
                >
                  Frequently Asked Questions
                </motion.h2>

                {/* FAQs List */}
                <div className="space-y-6">
                  {faqData.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-xl border shadow-md hover:shadow-lg p-6 transition-all cursor-pointer"
                      onClick={() => toggleFaq(index)}
                    >
                      {/* Question */}
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h4>
                        <motion.div
                          animate={{ rotate: activeFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-primary" />
                        </motion.div>
                      </div>

                      {/* Answer */}
                      <AnimatePresence>
                        {activeFaq === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden mt-3"
                          >
                            <p className="text-gray-600">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Spiritual Benefits Section */}

      <section className="mt-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }} // 🔥 Animate when scrolling UP and DOWN
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Spiritual Significance
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: HeartIcon,
              title: "Divine Connection",
              description:
                "Establish a deep spiritual connection through sacred rituals",
            },
            {
              icon: SparklesIcon,
              title: "Positive Energy",
              description: "Invite positive vibrations into your life",
            },
            {
              icon: GiftIcon,
              title: "Divine Blessings",
              description: "Receive blessings for prosperity and peace",
            },
            {
              icon: UserGroupIcon,
              title: "Family Harmony",
              description: "Promote peace within family relationships",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: false, amount: 0.3 }} // 🔥 Animate every time it scrolls into view
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <item.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2 group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Service-Based Devotional Section */}
      <section className="mt-16 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }} // ✨ Scroll Up + Down Animation
          className="bg-gradient-to-r from-primary to-secondary rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
        >
          <div className="p-8 text-white">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
              className="text-3xl font-bold mb-6 text-center"
            >
              Divine Pujas and Spiritual Services from Kalki Seva
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false }}
              className="mb-6 text-center text-lg"
            >
              At Kalki Seva, we are dedicated to offering you the most sacred
              and transformative pujas. Each puja is performed with devotion to
              invoke divine blessings and ensure your spiritual well-being.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: false }}
              className="space-y-4 mb-8"
            >
              {[
                "Personalized Pujas – Tailored to your spiritual needs and requirements",
                "Home Pujas – Bring peace, prosperity, and harmony to your home",
                "Online Pujas – Access spiritual blessings from anywhere in the world",
                "Vedic Pujas – Ancient rituals performed with utmost devotion and accuracy",
                "Shanti Pujas – To restore peace and eliminate obstacles from your life",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <StarIcon className="h-6 w-6 text-yellow-400 mt-1" />
                  <span className="group-hover:text-yellow-100 transition-colors duration-300 text-base leading-relaxed">
                    {item}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: false }}
              className="mb-8 text-center text-lg"
            >
              Kalki Seva provides holistic devotional services that go beyond
              ritualistic practices. With our expert priests and personalized
              approach, we aim to enhance your connection to the divine,
              fostering peace, prosperity, and blessings for you and your loved
              ones.
            </motion.p>

            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to="/pujas">
                  <button className="px-8 py-3 bg-white text-primary rounded-full shadow-md hover:bg-gray-100 transition-all">
                    Book Your Puja Now
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
   {isLoginModalOpen && (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.4 }}
    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
  >
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
      onLoginSuccess={() => {
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);

        // Wait for state update (important!)
        setTimeout(() => {
          let booking = pendingBooking;

          // If state lost, use localStorage
          if (!booking) {
            const saved = localStorage.getItem("pendingBooking");
            if (saved) booking = JSON.parse(saved);
          }

          // No booking → stop
          if (!booking) return;

          // Go to checkout
          navigate("/checkout", {
            state: {
              puja: booking.puja,
              date: booking.date,
              package: booking.package,
            },
          });

          // Cleanup
          setPendingBooking(null);
          localStorage.removeItem("pendingBooking");
        }, 150);
      }}
    />
  </motion.div>
)}


      {isImageModalOpen && selectedImageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-3xl w-full px-4"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white text-2xl z-10 hover:scale-110 transition-transform"
              onClick={() => setIsImageModalOpen(false)}
            >
              &times;
            </button>

            {/* Image */}
            <img
              src={selectedImageUrl}
              alt="Preview"
              className="w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}

      {isPackageModalOpen && selectedDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                setIsPackageModalOpen(false);
                if (!selectedPackage) {
                  setSelectedDate(null); // ✅ Reset the DatePicker
                }
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl hover:scale-110 transition-transform"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-6 text-center text-primary">
              Select a Package
            </h3>

            {filteredPackages?.length > 0 ? (
              <div className="space-y-6">
                {filteredPackages.map((pkg) => (
                  <motion.div
                    key={pkg.package_id}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-all shadow-md"
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setIsPackageModalOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-bold text-lg">
                          {pkg.package_name}
                        </h4>
                        <p className="text-sm text-gray-500 italic">
                          {pkg.puja_speciality}
                        </p>
                      </div>
                      <span className="text-primary font-bold text-xl">
                        ₹{pkg.price}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {pkg.package_description}
                    </p>

                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
                      {pkg.packageFeatureItems?.map((featureItem, idx) => (
                        <li key={idx}>{featureItem.feature}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No packages available for this date.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
