/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import failedAnimation from "../assets/paymentfailure.json";
import { KalkiSevaLoader } from "../components/Loader/KalkiSevaLoader";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Address {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
  email: string;
  phone: string;
  fullName: string;
}

interface BookingDetails {
  booking_id: string;
  userid: string;
  puja_id: string;
  puja_name: string;
  package_name: string;
  amount: string;
  discount_amount: string;
  total_amount: string;
  special_instructions?: string;
  coupon_code?: string;
  payment_status: string;
  payment_type?: string;
  phone_number: string;
  booking_email: string;
  full_name?: string;
  username?: string;
  temple_name?: string;
  puja_date: string;
  billing_address?: Address;
  shipping_address?: Address;
}

export const BookingFailurePage = () => {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const error = state?.error;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    fetch(`${BASE_URL}/booking/get-booking/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
  console.log("✅ Booking fetched:", data);
  if (data?.booking_id) {
    setBooking(data); // ✅ Use data directly
  } else {
    Swal.fire("Error", "Booking not found.", "error");
  }
})

      .catch((err) => {
        console.error("❌ Booking fetch error:", err);
        Swal.fire("Error", "Failed to load booking details.", "error");
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleRetryPayment = async () => {
    if (!booking) return;

    try {
      const res = await axios.post<{ payment_session_id: string }>(
        `${BASE_URL}/payments/retry-cashfree-payment`,
        { booking_id: booking.booking_id }
      );
      const { payment_session_id } = res.data;
      if (!payment_session_id || !payment_session_id.startsWith("session_")) {
        throw new Error("Invalid or missing session ID");
      }

      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({ mode: "production" }); // use "sandbox" for testing

      const isInApp =
        /(FB|Instagram|LinkedIn|Twitter|Snapchat|inapp|in-app)/i.test(
          navigator.userAgent
        );
      const redirectTarget = isInApp ? "popup" : "_self";

      await cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget,
      });
    } catch (err: any) {
      console.error("❌ Retry Payment Error:", err);
      Swal.fire(
        "Retry Failed",
        err?.response?.data?.error || err.message,
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        <KalkiSevaLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-100 via-white to-red-50 flex items-center justify-center px-4 py-10">
      <Helmet>
        <title>Booking Failed - Kalki Seva</title>
        <meta
          name="description"
          content="Your puja booking could not be completed due to a payment failure or technical issue. Please try again or contact Kalki Seva support for assistance."
        />
        <meta
          name="keywords"
          content="Booking Failed, Payment Failure, Puja Booking Issue, Retry Payment, Kalki Seva Support"
        />
        <meta name="author" content="Kalki Seva Team" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-40 h-40 mb-5">
            <Lottie animationData={failedAnimation} loop autoplay />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-red-600 mb-3">
            Oops! Payment Failed
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            {error ||
              "We couldn't process your payment. Please try again or contact support for assistance."}
          </p>
        </div>

        {booking && (
          <div className="bg-red-50 border border-red-200 p-5 rounded-xl mb-6">
            <h2 className="text-lg font-semibold text-red-800 mb-3">
              Booking Summary
            </h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700">
              <li>
                <strong>Booking ID:</strong> {booking.booking_id}
              </li>
              <li>
                <strong>Puja:</strong> {booking.puja_name}
              </li>
              <li>
                <strong>Package:</strong> {booking.package_name}
              </li>
              <li>
                <strong>Amount:</strong> ₹{booking.total_amount}
              </li>
              <li>
  <strong>Status:</strong>{" "}
  {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
</li>

              <li>
                <strong>Email:</strong> {booking.booking_email}
              </li>
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleRetryPayment}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Retry Payment
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
