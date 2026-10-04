import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from 'react-slick';
import { Download, X } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


import axios from "axios";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  User,
  BadgePercent,
  Star,
  XCircle,
  Loader2,
  Package,
  Truck,
  Upload,
} from "lucide-react";
import Swal from "sweetalert2";
import { KalkiSevaLoader } from "../components/Loader/KalkiSevaLoader";
import { AnimatePresence, motion } from "framer-motion";

interface Address {
  fullName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  email: string;
  phone: string;
}

interface Review {
  review_id: number;
  rating: number;
  review: string;
  uploads_url: string[];
  verified_user: boolean;
  created_at: string;
  booking_id: string;
}

interface BookingDetailsProps {
  booking_id: string;
  userid: string;
  puja_id: string;
  full_name: string;
  package_name: string;
  temple_name: string;
  puja_thumbnail_url: string;
  amount: string;
  discount_amount: string;
  total_amount: string;
  payment_method: string;
  payment_type: string,
  payment_reference: string;
  payment_status: string;
  booking_status: string;
  special_instructions: string;
  devotee_names: string[];
  devotee_gothra: string[];
  devotee_date_of_birth: string[];
  shipping_address: Address;
  billing_address: Address;
  puja_date: string;
  coupon_code: string;
  puja_status: string;
  puja_name: string;
  reviews: Review[];
  review_status: boolean;
  completed_image_url_path?: string; // Add this property
  completed_video_url_path?: string; // Add this property
  assigned_agents?: {
    agent_details: {
      agent_name: string;
      phone_number: string;
    };
    task_status: string;
  }[]; // Add this property
  tracking_id?: string; // Add this property
  tracking_url?: string; // Add this property
}

export default function BookingDetails() {
  const { bookingId } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [booking, setBooking] = useState<BookingDetailsProps | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewFiles, setReviewFiles] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
const [previewType, setPreviewType] = useState<'image' | 'video' | ''>('');

const mediaItems: { type: 'image' | 'video'; url: string }[] = [];

if (booking?.completed_image_url_path) {
  mediaItems.push({
    type: 'image',
    url: booking.completed_image_url_path,
  });
}

if (booking?.completed_video_url_path) {
  mediaItems.push({
    type: 'video',
    url: booking.completed_video_url_path,
  });
}

// ✅ Slider Settings
const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on mount
}, []);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/booking/get-booking/${bookingId}`
        );
        const responseData = res.data;
        if (responseData && typeof responseData === "object") {
          setBooking(responseData as BookingDetailsProps);
        }
      } catch (error) {
        console.error("Failed to fetch booking details", error);
      }
    };

    fetchBooking();
  }, [BASE_URL, bookingId]);


  const submitReview = async () => {
    if (reviewComment.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Please share your experience",
        text: "The review comment cannot be empty.",
        confirmButtonColor: "#6366f1",
      });
      return;
    }
  
    try {
      setIsSubmittingReview(true);
  
      // 🔁 Construct FormData for multipart/form-data
      const formData = new FormData();
      formData.append("puja_id", booking?.puja_id || "");
      formData.append("booking_id", booking?.booking_id || "");
      formData.append("userid", booking?.userid || "");
      formData.append("rating", reviewRating.toString());
      formData.append("review", reviewComment);
      formData.append("verified_user", "true");
  
      // ✅ Append files as uploads_url
      reviewFiles.forEach((file) => {
        formData.append("uploads_url", file); // field name must match backend field
      });
  
      // ✅ Send as multipart/form-data
      await axios.post(`${BASE_URL}/reviews/submitReview`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // ✅ Refresh booking data after submission
      const res = await axios.get(
        `${BASE_URL}/booking/get-booking/${bookingId}`
      );
      const updatedData = res.data;
  
      if (updatedData && typeof updatedData === "object") {
        setBooking(updatedData as BookingDetailsProps);
      }
  
      Swal.fire({
        icon: "success",
        title: "Review Submitted!",
        confirmButtonColor: "#6366f1",
      });
  
      // ✅ Reset review form state
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewComment("");
      setReviewFiles([]);
    } catch (error) {
      console.error("Review submission failed:", error);
      Swal.fire({
        icon: "error",
        title: "Submission failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };
  

  if (!booking) {
    return (
      <div className="text-center py-10">
        {" "}
        <KalkiSevaLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 shadow-2xl rounded-3xl p-8">
        {/* Header Section */}
       

<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: true }}
  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
>
  {/* Left: Puja Name and Status */}
  <div className="w-full md:w-auto">
    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center md:text-left">
      {booking.puja_name}
      <span className="ml-2 text-sm font-medium text-gray-500">
        #{booking.booking_id}
      </span>
    </h1>

    <div className="flex items-center justify-center md:justify-start gap-2 mt-2 flex-wrap">
      <strong className="text-sm">Puja Status:</strong>

      {booking.puja_status === "completed" && (
  <span className="flex items-center bg-green-50 text-green-600 font-semibold text-sm px-3 py-1 rounded-full">
    <CheckCircle className="w-4 h-4 mr-1" />
    Completed
  </span>
)}

{booking.puja_status === "cancelled" && (
  <span className="flex items-center bg-red-50 text-red-600 font-semibold text-sm px-3 py-1 rounded-full">
    <XCircle className="w-4 h-4 mr-1" />
    Cancelled
  </span>
)}

{booking.puja_status === "pending" && (
  <span className="flex items-center bg-yellow-50 text-yellow-600 font-semibold text-sm px-3 py-1 rounded-full">
    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
    Pending
  </span>
)}

{booking.puja_status === "started" && (
  <span className="flex items-center bg-blue-50 text-blue-600 font-semibold text-sm px-3 py-1 rounded-full">
    <Loader2 className="w-4 h-4 mr-1" />
    Started
  </span>
)}

    </div>
  </div>

  {/* Right: Buttons */}
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.9, ease: "easeOut" }}
    viewport={{ once: true }}
    className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center justify-center md:justify-end"
  >
    {booking.puja_status === "completed" && !booking.review_status && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowReviewModal(true)}
        className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
      >
        <Upload className="w-4 h-4 mr-2" />
        Submit Review
      </motion.button>
    )}

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(-1)}
      className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow-md"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </motion.button>
  </motion.div>
</motion.div>


        {/* Main Content Grid */}
       

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
  }}
  className="grid md:grid-cols-2 gap-10"
>
  {/* Left Column */}
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    }}
    className="space-y-6"
  >
    {/* Puja Details Card */}
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold mb-3 text-purple-700 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-purple-700" />
        Puja Details
      </h2>
      <img
        src={booking.puja_thumbnail_url}
        alt="Puja Thumbnail"
        className="rounded-xl w-full h-52 object-cover mb-4"
      />
      <div className="space-y-2">
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-700" />
          <strong>Temple:</strong> {booking.temple_name}
        </p>
        <p className="flex items-center gap-2">
          <Package className="w-4 h-4 text-purple-700" />
          <strong>Package:</strong> {booking.package_name}
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-700" />
          <strong>Date:</strong>{" "}
          {new Date(booking.puja_date).toLocaleDateString("en-IN", {
            dateStyle: "full",
          })}
        </p>
        {booking.special_instructions && (
          <div className="mt-2 text-purple-800 bg-purple-50 p-3 rounded-lg border border-purple-200">
            <strong>Instructions:</strong> {booking.special_instructions}
          </div>
        )}
      </div>
    </div>

    {/* Payment Summary Card */}
   <div className="bg-white p-6 rounded-2xl shadow-lg">
  <h2 className="text-lg font-semibold mb-3 text-purple-700 flex items-center">
    <CreditCard className="w-5 h-5 mr-2 text-purple-700" />
    Payment Summary
  </h2>

  <div className="space-y-2">

    {/* PAYMENT STATUS ALWAYS SHOWN */}
    <div className="flex items-center gap-2">
      <strong>Payment Status:</strong>

      {booking.payment_status === "SUCCESS" && (
        <span className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          <CheckCircle className="w-4 h-4 mr-1" />
          Success
        </span>
      )}

      {booking.payment_status === "pending" && (
        <span className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
          Pending
        </span>
      )}

      {booking.payment_status === "failed" && (
        <span className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
          <XCircle className="w-4 h-4 mr-1" />
          Failed
        </span>
      )}
    </div>

    {/* SHOW ONLY IF PAYMENT SUCCESS */}
    {booking.payment_status === "SUCCESS" && (
      <>
        <p>
          <strong>Payment Type:</strong> {booking.payment_type?.toUpperCase()}
        </p>

        <p>
          <strong>Reference:</strong> {booking.payment_reference}
        </p>

        <p>
          <strong>Puja Price:</strong> ₹
          {Number(booking.total_amount) + Number(booking.discount_amount)}
        </p>

        {booking.discount_amount !== "0.00" && (
          <p className="flex items-center text-blue-600">
            <BadgePercent className="w-4 h-4 mr-1 text-purple-700" />
            <strong>Discount:</strong> ₹{booking.discount_amount}
          </p>
        )}

        <div className="pt-4 mt-4 border-t">
          <p className="text-xl font-bold text-green-600 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-700" />
            Total Paid: ₹{booking.total_amount}
          </p>
        </div>
      </>
    )}
  </div>
</div>

  </motion.div>

  {/* Right Column */}
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    }}
    className="space-y-6"
  >
    {/* Devotee Information Card */}
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-semibold mb-3 text-purple-700 flex items-center">
        <User className="w-5 h-5 mr-2 text-purple-700" />
        Devotee Information
      </h2>
      <div className="space-y-3">
        {booking.devotee_names.map((name, index) => (
          <div key={index} className="bg-purple-50 p-3 rounded-xl">
            <p className="font-medium text-gray-800">{name}</p>
            <p className="text-sm text-gray-600">
              Gothra: {booking.devotee_gothra[index]}
            </p>
            <p className="text-sm text-gray-600">
              DOB: {new Date(booking.devotee_date_of_birth[index]).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Address Section */}
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-3 text-purple-700 flex items-center">
          <Truck className="w-5 h-5 mr-2 text-purple-700" />
          Shipping Address
        </h2>
        <div className="space-y-1">
          <p>{booking.shipping_address.fullName}</p>
          <p>{booking.shipping_address.address}</p>
          <p>
            {booking.shipping_address.city}, {booking.shipping_address.state}
          </p>
          <p>
            {booking.shipping_address.country} - {booking.shipping_address.pincode}
          </p>
          <p>Email: {booking.shipping_address.email}</p>
          <p>Phone: {booking.shipping_address.phone}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-3 text-purple-700 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-purple-700" />
          Billing Address
        </h2>
        <div className="space-y-1">
          <p>{booking.billing_address.fullName}</p>
          <p>{booking.billing_address.address}</p>
          <p>
            {booking.billing_address.city}, {booking.billing_address.state}
          </p>
          <p>
            {booking.billing_address.country} - {booking.billing_address.pincode}
          </p>
          <p>Email: {booking.billing_address.email}</p>
          <p>Phone: {booking.billing_address.phone}</p>
        </div>
      </div>
    </div>

    {/* Assigned Agent Section */}
    {(booking.assigned_agents ?? []).length > 0 && (
      <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
        <h2 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <User className="w-5 h-5 mr-2 text-purple-700" />
          Assigned Agent Details
        </h2>
        {(booking.assigned_agents ?? []).map((agent, index) => (
          <div key={index} className="border rounded-xl p-4 mb-3">
            <p><strong>Agent Name:</strong> {agent.agent_details.agent_name}</p>
            <p><strong>Phone:</strong> {agent.agent_details.phone_number}</p>
            <p><strong>Task Status:</strong> {agent.task_status === "assigned" ? "Assigned" : "Not Assigned"}</p>

          </div>
        ))}
      </div>
    )}
  </motion.div>
</motion.div>

<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="bg-white p-6 rounded-2xl shadow-lg mt-6"
>
  <h2 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
    <CheckCircle className="w-5 h-5 mr-2 text-purple-700" />
    Booking Status Timeline
  </h2>

  <ul className="list-disc ml-6 space-y-3 text-gray-700">
  <li className="flex items-center gap-2">
   
      Booking Status:
   
    <span className="text-gray-800">
    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
      {booking.booking_status
        ? booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)
        : "-"}
    </span>
    </span>
  </li>
  <li className="flex items-center gap-2">
    
      Puja Status:
    
    <span className="text-gray-800">
    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">
      {booking.puja_status
        ? booking.puja_status.charAt(0).toUpperCase() + booking.puja_status.slice(1)
        : "-"}
    </span>
    </span>
  </li>
  {/* <li className="flex items-center gap-2">
    
      Assignment Status:
   
    <span className="text-gray-800">
    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
      {booking.assigned_agents?.[0]?.task_status
        ? booking.assigned_agents[0].task_status.charAt(0).toUpperCase() + booking.assigned_agents[0].task_status.slice(1)
        : "Not Assigned"}
    </span>
    </span>
  </li> */}
</ul>


</motion.div>


{booking && mediaItems.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="bg-white p-6 rounded-2xl shadow-lg mt-6"
  >
    <h2 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
      <Upload className="w-5 h-5 mr-2 text-purple-700" />
      Puja Completion Media
    </h2>

    <Slider {...settings}>
      {mediaItems.map((item, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative px-4"
        >
          <div
            className="cursor-pointer"
            onClick={() => {
              setPreviewUrl(item.url);
              setPreviewType(item.type);
            }}
          >
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={`media-${index}`}
                className="w-full h-72 object-cover rounded-xl border hover:shadow-2xl transition"
              />
            ) : (
              <video
                className="w-full h-72 object-cover rounded-xl border hover:shadow-2xl transition"
                muted
              >
                <source src={item.url} type="video/mp4" />
              </video>
            )}
          </div>

          <a
            href={item.url}
            download
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            <Download className="w-5 h-5 text-purple-700" />
          </a>
        </motion.div>
      ))}
    </Slider>
  </motion.div>
)}


        {/* ✅ Tracking Information */}
     

{(booking.tracking_id || booking.tracking_url) && (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="bg-white p-6 rounded-2xl shadow-lg mt-6"
  >
    <h2 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
      <Truck className="w-5 h-5 mr-2 text-purple-700" />
      Tracking Information
    </h2>

    <div className="space-y-2 text-gray-700">
      <p>
        <strong>Tracking ID:</strong> {booking.tracking_id || "Not Provided"}
      </p>
      <p>
        <strong>Tracking Link:</strong>{" "}
        {booking.tracking_url ? (
          <a
            href={booking.tracking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline break-all"
          >
            {booking.tracking_url}
          </a>
        ) : (
          "Not Provided"
        )}
      </p>
    </div>
  </motion.div>
)}





{previewUrl && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative max-w-4xl w-full p-4"
    >
      <button
        onClick={() => setPreviewUrl("")}
        className="absolute top-4 right-4 bg-white text-purple-700 hover:text-purple-900 rounded-full p-2 shadow-lg transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="bg-white p-4 rounded-2xl shadow-2xl max-h-[90vh] overflow-auto">
        {previewType === "image" ? (
          <motion.img
            src={previewUrl}
            alt="Preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full rounded-xl"
          />
        ) : (
          <motion.video
            src={previewUrl}
            controls
            autoPlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-[70vh] rounded-xl"
          />
        )}
      </div>
    </motion.div>
  </motion.div>
)}


        {/* Custom Review Modal */}
       

<AnimatePresence>
{showReviewModal && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl overflow-y-auto max-h-[90vh]"
    >
      {/* Top Heading */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Submit Your Review</h2>
        <motion.button
          whileHover={{ rotate: 90 }}
          onClick={() => setShowReviewModal(false)}
          className="text-purple-600 hover:text-purple-800"
        >
          <XCircle className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Review Form */}
      <div className="space-y-6">
        
        {/* Star Rating */}
        <div className="flex items-center gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <motion.div whileHover={{ scale: 1.2 }} key={rating}>
              <Star
                onClick={() => setReviewRating(rating)}
                className={`w-10 h-10 cursor-pointer ${
                  rating <= reviewRating
                    ? "text-amber-500 fill-amber-500"
                    : "text-gray-300"
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Textarea */}
        <motion.textarea
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full p-4 border rounded-lg h-32 focus:ring-2 focus:ring-indigo-300 transition"
        />

        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center"
        >
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-purple-600" />
            <span className="text-gray-600">
              Upload photos/videos (max 5 files)
            </span>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                setReviewFiles((prev) => [...prev, ...files.slice(0, 5)]);
              }}
              className="hidden"
              accept="image/*,video/*"
            />
          </label>

          {/* Uploaded previews */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {reviewFiles.map((file, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                {file.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded shadow-md"
                  />
                ) : (
                  <video
                    className="w-20 h-20 rounded shadow-md"
                    muted
                  >
                    <source src={URL.createObjectURL(file)} />
                  </video>
                )}
                <button
                  onClick={() =>
                    setReviewFiles(reviewFiles.filter((_, idx) => idx !== i))
                  }
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={submitReview}
          disabled={isSubmittingReview || reviewRating === 0}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 w-full flex items-center justify-center gap-2 transition-all shadow-md"
        >
          {isSubmittingReview ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Submit Review
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
)}
</AnimatePresence>

      </div>
    </div>
  );
}
