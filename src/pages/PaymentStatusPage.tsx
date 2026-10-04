import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { KalkiSevaLoader } from "../components/Loader/KalkiSevaLoader";
import { Helmet } from "react-helmet-async";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PaymentStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyStatus = async () => {
      if (!orderId) return;

      try {
        interface Booking {
          booking_id: string;
          payment_status: string;
          // add other properties as needed
        }
        interface VerifyBookingStatusResponse {
          booking?: Booking;
        }
        const res = await axios.get<VerifyBookingStatusResponse>(`${BASE_URL}/payments/verify-booking-status/${orderId}`);
        const booking = res.data?.booking;

        if (booking?.payment_status?.toLowerCase() === "success") {
          navigate(`/booking-success/${booking.booking_id}`);
        } else {
          navigate(`/booking-failure/${booking?.booking_id ?? orderId}`, {
            state: { error: "Payment failed or was cancelled." },
          });
        }
      } catch (err) {
        console.error("Status check failed:", err);
        navigate(`/booking-failure/${orderId}`, {
          state: { error: "Something went wrong during payment verification." },
        });
      }
    };

    verifyStatus();
  }, [orderId, navigate]);

  return (
    <div className="text-center py-20">
      <Helmet>
  <title>Payment Status - Booking Confirmation | Kalki Seva</title>
  <meta
    name="description"
    content="Track the status of your payment and puja booking on Kalki Seva. Confirm successful payments or retry if needed."
  />
  <meta
    name="keywords"
    content="Payment Status, Puja Booking, Payment Confirmation, Kalki Seva"
  />
  <meta name="author" content="Kalki Seva Team" />
  <meta name="robots" content="noindex, nofollow" />
</Helmet>
      <KalkiSevaLoader />
      <p className="mt-4 text-gray-600">Verifying your payment, please wait...</p>
    </div>
  );
};
