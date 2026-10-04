/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, ArrowRight, X } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { load } from '@cashfreepayments/cashfree-js';
import { Helmet } from "react-helmet-async";
import { generateStyledInvoice } from "../../utils/generateStyledInvoice";





interface Review {
  rating: number;
  review: string;
  uploads_url: string;
  verified_user: boolean;
}

interface BookingData {
  booking_id: string;
   invoice_number: string;
  created?: string;
  username: string;
  puja_name: string;
  temple_name: string;
  package_name: string;
  amount: string;
  discount_amount: string;
  total_amount: string;
  payment_method: string;
  booking_status: string;
  special_instructions: string;
  puja_date: string;
  coupon_code: string;
  puja_status: string;
  reviews: Review[];
  devotee_names: string[];
  devotee_gothra: string[];
  devotee_date_of_birth: string[];
  shipping_address: {
    city: string;
    email: string;
    phone: string;
    state: string;
    address: string;
    country: string;
    pincode: string;
    fullName: string;
    landmark: string;
  };
  billing_address: {
    city: string;
    email: string;
    phone: string;
    state: string;
    address: string;
    country: string;
    pincode: string;
    fullName: string;
    landmark: string;
  };
  is_shipping_address_same_as_billing: boolean;
  payment_reference: string | null;
  completed_image_url_path: string | null;
  completed_video_url_path: string | null;
  payment_status: string;
  payment_type: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  error?: {
    description: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: any) => {
      open: () => void;
      on: (
        event: string,
        callback: (response: RazorpayResponse) => void
      ) => void;
    };
  }
}


export default function Bookings() {
  const [bookingData, setBookingData] = useState<BookingData[]>([]); // Store an array of bookings
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const [, setNoBookingsMessage] = useState("");
  const [tabRenderKey, setTabRenderKey] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "completed" | "cancelled"
  >("upcoming"); // Default active tab
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const [retryingBookingId, setRetryingBookingId] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

  const fetchBookings = async () => {
  try {
    const response = await axios.get<BookingData[]>(
      `${BASE_URL}/booking/get-user-bookings/${userId}`
    );

    const sortedData = response.data.sort((a, b) => {
      return new Date(b.puja_date).getTime() - new Date(a.puja_date).getTime();
    });

    setBookingData(sortedData);
    setNoBookingsMessage(
      sortedData.length === 0 ? "No bookings available" : ""
    );
  } catch (err) {
    setError("Error fetching booking history");
  } finally {
    setLoading(false);
  }
};



    fetchBookings();
  }, [BASE_URL]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);
  
  interface RetryCashfreeResponse {
    success: boolean;
    payment_session_id: string;
    booking_id: string;
  }
  
const handleRetryPayment = async (bookingId: string) => {
  try {
    setRetryingBookingId(bookingId);

    const res = await axios.post<RetryCashfreeResponse>(
      `${BASE_URL}/payments/retry-cashfree-payment`,
      { booking_id: bookingId }
    );

    const sessionId = res.data?.payment_session_id;
    if (!sessionId || !sessionId.startsWith("session_")) {
      throw new Error("Invalid payment_session_id received");
    }

    Swal.fire({
      title: "Redirecting to Payment",
      text: "Please complete your payment securely.",
      icon: "info",
      timer: 2000,
      showConfirmButton: false,
    });

    // ✅ Load the SDK and call checkout
    const cashfree = await load({
      mode: "production", // or "sandbox" for testing
    });

    cashfree.checkout({
      paymentSessionId: sessionId,
      redirectTarget: "_self", // "_blank" | "popup" are also valid
    });

  } catch (err: any) {
    console.error("Retry Payment Error:", err);
    Swal.fire("Error", "Failed to retry payment. Please try again.", "error");
  } finally {
    setRetryingBookingId(null);
  }
};

  
  
  
  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  // Filter bookings based on the active tab
  // Filter bookings by tab
  const filteredBookings = bookingData.filter((b) => {
    const status = b.puja_status.toLowerCase();
    if (activeTab === "upcoming") return status === "pending" || status === "started";
    if (activeTab === "completed") return status === "completed";
    if (activeTab === "cancelled") return status === "cancelled";
    return true;
  });
  

  const capitalizeFirstLetter = (str?: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Function to return status color
  const getStatusColor = (status?: string) => {
    const statusValue = status?.toLowerCase() || "";
    switch (statusValue) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Updated handleRetryPayment function
  // const handleRetryPayment = async (booking: BookingData) => {
  //   const amount = parseFloat(booking.total_amount);
  //   if (isNaN(amount) || amount <= 0) {
  //     Swal.fire('Error', 'Invalid payment amount', 'error');
  //     return;
  //   }

  //   const options = {
  //     key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //     amount: amount * 100,
  //     currency: 'INR',
  //     name: 'Kalki Seva',
  //     description: `${booking.puja_name} - ${booking.package_name}`,
  //     prefill: {
  //       name: booking.billing_address?.fullName || '',
  //       email: booking.billing_address?.email || '',
  //       contact: booking.billing_address?.phone || '',
  //     },
  //     theme: { color: '#4f46e5' },
  //     handler: async (response: RazorpayResponse) => {
  //       try {
  //         const updateResponse = await axios.post<{ success: boolean }>(
  //           `${BASE_URL}/booking/update-payment-status`,
  //           {
  //             booking_id: booking.booking_id,
  //             payment_status: 'success',
  //             payment_type: 'Razorpay',
  //             payment_reference: response.razorpay_payment_id,
  //           }
  //         );

  //         if (updateResponse.data.success) {
  //           setBookingData(prev => prev.map(b =>
  //             b.booking_id === booking.booking_id ?
  //             { ...b, payment_status: 'success' } : b
  //           ));
  //           Swal.fire('Success', 'Payment completed successfully', 'success');
  //         }
  //       } catch {
  //         Swal.fire('Error', 'Failed to update payment status', 'error');
  //       }
  //     }
  //   };

  //   const rzp = new window.Razorpay(options);
  //   rzp.on('payment.failed', (response: RazorpayResponse) => {
  //     Swal.fire('Failed', response.error?.description || 'Payment failed', 'error');
  //   });
  //   rzp.open();
  // };
const isInvoiceDownloadable = (pujaDate: string): boolean => {
  const puja = new Date(pujaDate);
  const today = new Date();
  const diffInDays = Math.floor((today.getTime() - puja.getTime()) / (1000 * 60 * 60 * 24));
  return diffInDays <= 30;
};



// const handleDownloadInvoice = async (bookingId: string) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/invoices/download/${bookingId}`, {
//       responseType: 'blob', // important for downloading files
//     });

//     const blob = new Blob([response.data as BlobPart], { type: 'application/pdf' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `Invoice-${bookingId}.pdf`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (error) {
//     console.error("Error downloading invoice:", error);
//     Swal.fire("Error", "Unable to download invoice at the moment.", "error");
//   }
// };


const downloadInvoice = async (booking_id: string) => {
  try {
    const { data } = await axios.get<BookingData>(`${BASE_URL}/booking/invoice/${booking_id}`);
    // Map BookingData to BookingDetails by adding phone_number and booking_email
    const bookingDetails = {
      ...data,
      phone_number: data.billing_address?.phone || "",
      booking_email: data.billing_address?.email || "",
    };
    await generateStyledInvoice(bookingDetails);
  } catch (error) {
    console.error("Failed to download invoice:", error);
    alert("Could not download invoice. Please try again later.");
  }
};

  const bookingCounts = {
  upcoming: bookingData.filter(b => ['pending', 'started'].includes(b.puja_status.toLowerCase())).length,
  completed: bookingData.filter(b => b.puja_status.toLowerCase() === 'completed').length,
  cancelled: bookingData.filter(b => b.puja_status.toLowerCase() === 'cancelled').length,
};


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
  <title>My Bookings - View Your Puja History | Kalki Seva</title>
  <meta
    name="description"
    content="View your completed, upcoming, or cancelled puja bookings with Kalki Seva. Track and manage your spiritual services in one place."
  />
  <meta
    name="keywords"
    content="My Bookings, Puja History, Booking Management, Puja Services, Kalki Seva Dashboard"
  />
  <meta name="author" content="Kalki Seva Team" />
  <meta name="robots" content="noindex, nofollow" />
</Helmet>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <Calendar className="mr-3 h-8 w-8 text-blue-600" />
              My Bookings
            </h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
             <nav className="flex space-x-8">
  {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
    
    <button
      key={tab}
      onClick={() => {
        setActiveTab(tab);
        setTabRenderKey((prev) => prev + 1); // ✅ re-render bookings on tab change
      }}
      className={`pb-4 px-1 border-b-2 font-semibold text-sm transition-all ${
        activeTab === tab
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
       {tab.charAt(0).toUpperCase() + tab.slice(1)} ({bookingCounts[tab]})
    </button>
  ))}
</nav>

            </div>

            {/* Bookings */}
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="border rounded-xl p-6 bg-gradient-to-r from-blue-50/50 to-white space-y-4"
                  >
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-300 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBookings.length > 0 ? (
              <motion.div
              key={tabRenderKey}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.15 },
                  },
                }}
                className="space-y-6"
              >
                {filteredBookings.map((booking) =>
                  booking.puja_name && booking.booking_id ? (
                    <motion.div
                      key={booking.booking_id}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="border rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative bg-gradient-to-r from-blue-50/50 to-white"
                    >
                      <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 rounded-l-xl"></div>

                      {/* Booking Card */}
                      <div className="ml-4 flex flex-col sm:flex-row justify-between items-start gap-6">
                        <div className="flex-1 w-full">
                          {/* Booking ID */}
                          <div className="text-sm text-gray-400 mb-2">
                            #{booking.booking_id}
                          </div>

                          {/* Puja Name */}
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {booking.puja_name}
                          </h3>

                          {/* Payment Info */}
                          {booking.payment_status === "SUCCESS" && (
  <div className="bg-blue-50/60 p-4 rounded-lg mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-700 font-semibold">Total Paid</span>
      <span className="text-lg font-bold text-blue-700">
        ₹ {parseFloat(booking.total_amount).toLocaleString("en-IN")}
      </span>
    </div>

    {(booking.discount_amount !== "0.00" || booking.coupon_code) && (
      <div className="mt-2 text-sm text-green-700">
        {booking.coupon_code && (
          <div>
            Coupon Applied: <span className="font-semibold">{booking.coupon_code}</span>
          </div>
        )}
        {booking.discount_amount !== "0.00" && (
          <div>
            Discount: ₹ {parseFloat(booking.discount_amount).toLocaleString("en-IN")}
          </div>
        )}
      </div>
    )}
  </div>
)}


                          {/* Status Badges */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                booking.puja_status
                              )}`}
                            >
                              Puja Status:{" "}
                              {capitalizeFirstLetter(booking.puja_status)}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                booking.payment_status
                              )}`}
                            >
                              Payment Status:{" "}
                              {capitalizeFirstLetter(
                                booking.payment_status || "Not Paid"
                              )}
                            </span>
                          </div>

                          {/* Other Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                              {new Date(booking.puja_date).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="mr-2 h-5 w-5 text-red-500" />
                              {booking.temple_name}
                            </div>
                          </div>

                          {/* View Details */}
                          <div className="mt-6">
                            <button
                              onClick={() =>
                                navigate(`/booking/${booking.booking_id}`)
                              }
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                            >
                              View Full Details
                              <ArrowRight className="h-5 w-5" />
                            </button>
                          </div>
                      {booking.payment_status === "SUCCESS" && isInvoiceDownloadable(booking.puja_date) && (
  <button
    onClick={() => downloadInvoice(booking.booking_id)}
    className="flex items-center gap-2 mt-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
  >
    Download Invoice
    <ArrowRight className="h-5 w-5" />
  </button>
)}



                          {booking.payment_status === "pending" && (
  <button
    onClick={() => handleRetryPayment(booking.booking_id)}
    disabled={retryingBookingId === booking.booking_id}
    className="flex items-center gap-2 mt-4 text-red-600 hover:text-red-800 font-semibold transition-colors disabled:opacity-50"
  >
    {retryingBookingId === booking.booking_id ? (
      <>
        <svg
          className="animate-spin h-5 w-5 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        Retrying...
      </>
    ) : (
      <>
        Retry Payment
        <ArrowRight className="h-5 w-5" />
      </>
    )}
  </button>
)}


                        </div>
                      </div>
                    </motion.div>
                  ) : null
                )}
              </motion.div>
            ) : (
              // No Bookings Available
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 text-lg">
                  {activeTab === "upcoming" &&
                    "There are no upcoming bookings."}
                  {activeTab === "completed" &&
                    "There are no completed bookings."}
                  {activeTab === "cancelled" &&
                    "There are no cancelled bookings."}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                  {activeTab !== "upcoming" && (
                    <button
                      onClick={() => setActiveTab("upcoming")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      View Upcoming Bookings
                    </button>
                  )}
                  {activeTab !== "completed" && (
                    <button
                      onClick={() => setActiveTab("completed")}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      View Completed Bookings
                    </button>
                  )}
                  {activeTab !== "cancelled" && (
                    <button
                      onClick={() => setActiveTab("cancelled")}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      View Cancelled Bookings
                    </button>
                  )}
                </div>

                <p className="text-gray-500 text-sm mt-4">
                  Or explore our other services.
                </p>
                <button
                  onClick={() => (window.location.href = "/pujas")}
                  className="mt-4 bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition"
                >
                  Book a Puja Now
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Detailed Modal */}
      {selectedBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg"
          >
            <div className="p-8">
              {/* Top Heading */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedBooking.puja_name}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    #{selectedBooking.booking_id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Booking Content */}
              <motion.div
              key={tabRenderKey}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.2 },
                  },
                }}
                className="space-y-8"
              >
                {/* Booking & Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Booking Summary */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                  >
                    <div className="bg-blue-50/50 p-6 rounded-xl shadow-sm space-y-4">
                      <h3 className="font-semibold text-lg text-blue-700 mb-2">
                        Booking Summary
                      </h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Status</dt>
                          <dd className="font-semibold text-blue-800">
                            {selectedBooking.puja_status
                              .charAt(0)
                              .toUpperCase() +
                              selectedBooking.puja_status.slice(1)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Package</dt>
                          <dd className="text-gray-900">
                            {selectedBooking.package_name}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Temple</dt>
                          <dd className="text-gray-900">
                            {selectedBooking.temple_name}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Puja Date</dt>
                          <dd className="text-gray-900">
                            {new Date(
                              selectedBooking.puja_date
                            ).toLocaleDateString("en-IN", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </dd>
                        </div>
                        {selectedBooking.special_instructions && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Instructions</dt>
                            <dd className="text-gray-800">
                              {selectedBooking.special_instructions}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </motion.div>

                  {/* Payment Details */}
                {selectedBooking.payment_status === "SUCCESS" && (
  <motion.div
    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
  >
    <div className="bg-green-50/50 p-6 rounded-xl shadow-sm space-y-4">
      <h3 className="font-semibold text-lg text-green-700 mb-2">
        Payment Details
      </h3>

      <dl className="space-y-2">
        <div className="flex justify-between">
          <dt className="text-gray-600">Amount</dt>
          <dd className="text-gray-900 font-semibold">
            ₹{parseFloat(selectedBooking.amount).toLocaleString("en-IN")}
          </dd>
        </div>

        {selectedBooking.discount_amount !== "0.00" && (
          <div className="flex justify-between">
            <dt className="text-gray-600">Discount</dt>
            <dd className="text-green-700 font-semibold">
              -₹{parseFloat(selectedBooking.discount_amount).toLocaleString("en-IN")}
            </dd>
          </div>
        )}

        <div className="flex justify-between border-t pt-2">
          <dt className="text-gray-800 font-semibold">Total Paid</dt>
          <dd className="text-gray-900 font-bold">
            ₹{parseFloat(selectedBooking.total_amount).toLocaleString("en-IN")}
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-gray-600">Payment Method</dt>
          <dd className="text-gray-900">{selectedBooking.payment_method}</dd>
        </div>
      </dl>
    </div>
  </motion.div>
)}

                </div>

                {/* Devotee Details */}
                <motion.div
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                >
                  <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">
                      Devotee Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedBooking.devotee_names.map((devotee, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg shadow space-y-1"
                        >
                          <p className="font-semibold text-gray-900">
                            {devotee}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedBooking.devotee_gothra[index]}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedBooking.devotee_date_of_birth[index]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Shipping Address */}
                {selectedBooking.shipping_address && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                  >
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                      <h3 className="font-semibold text-lg mb-4 text-gray-800">
                        Shipping Address
                      </h3>
                      <address className="not-italic space-y-1 text-gray-600">
                        <p>{selectedBooking.shipping_address.fullName}</p>
                        <p>{selectedBooking.shipping_address.address}</p>
                        <p>
                          {selectedBooking.shipping_address.city},{" "}
                          {selectedBooking.shipping_address.state}
                        </p>
                        <p>
                          {selectedBooking.shipping_address.country} -{" "}
                          {selectedBooking.shipping_address.pincode}
                        </p>
                        <p>Phone: {selectedBooking.shipping_address.phone}</p>
                        <p>Email: {selectedBooking.shipping_address.email}</p>
                      </address>
                    </div>
                  </motion.div>
                )}

                {/* Billing Address */}
                {selectedBooking.billing_address && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                  >
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                      <h3 className="font-semibold text-lg mb-4 text-gray-800">
                        Billing Address
                      </h3>
                      <address className="not-italic space-y-1 text-gray-600">
                        <p>{selectedBooking.billing_address.fullName}</p>
                        <p>{selectedBooking.billing_address.address}</p>
                        <p>
                          {selectedBooking.billing_address.city},{" "}
                          {selectedBooking.billing_address.state}
                        </p>
                        <p>
                          {selectedBooking.billing_address.country} -{" "}
                          {selectedBooking.billing_address.pincode}
                        </p>
                        <p>Phone: {selectedBooking.billing_address.phone}</p>
                        <p>Email: {selectedBooking.billing_address.email}</p>
                      </address>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
