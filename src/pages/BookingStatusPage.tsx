import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import failedAnimation from "../assets/paymentfailure.json";
import { KalkiSevaLoader } from "../components/Loader/KalkiSevaLoader";
import logo from "../assets/kalkisevalogo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  gstin?: string;
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

export const BookingStatusPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [status, setStatus] = useState<"success" | "failed" | "error" | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const checkStatusAndFetch = async () => {
      try {
        const bookingRes = await axios.get<BookingDetails>(`${BASE_URL}/bookings/get-booking/${bookingId}`);
        const bookingData = bookingRes.data;
        setBooking(bookingData);

        if (bookingData.payment_status === "success") {
          setStatus("success");
        } else {
          setStatus("failed"); // treat both pending and failed as failure for UI
        }
      } catch (err) {
        console.error("Verification Failed:", err);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    checkStatusAndFetch();
  }, [bookingId]);

  const generatePDF = async () => {
    if (!booking) return;

    const doc = new jsPDF();
    const logoImage = await fetch(logo).then(res => res.blob()).then(blob => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    });

    doc.addImage(logoImage, "PNG", 10, 10, 40, 15);
    doc.setFontSize(16);
    doc.text("Kalki Seva - Invoice", 60, 20);
    doc.setFontSize(11);
    doc.text(`Invoice #: ${booking.booking_id}`, 140, 20);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 140, 26);

    doc.setFontSize(10);
    doc.text("Kalki Seva Private Limited", 10, 35);
    doc.text("123 Spiritual Street, Mumbai, India", 10, 40);
    doc.text("GSTIN: 27AABCU9603R1ZP", 10, 45);
    doc.text("Email: support@kalkiseva.com", 10, 50);

    const billing = booking.billing_address;
    if (billing) {
      doc.setFontSize(11);
      doc.text("Bill To:", 10, 60);
      doc.setFontSize(10);
      doc.text(billing.fullName, 10, 65);
      doc.text(billing.address, 10, 70);
      doc.text(`${billing.city}, ${billing.state}, ${billing.pincode}`, 10, 75);
      doc.text(`Phone: ${billing.phone}`, 10, 80);
      doc.text(`Email: ${billing.email}`, 10, 85);
    }

    autoTable(doc, {
      startY: 95,
      head: [["Item", "Details"]],
      body: [
        ["Puja Name", booking.puja_name],
        ["Temple", booking.temple_name || "N/A"],
        ["Package", booking.package_name],
        ["Puja Date", new Date(booking.puja_date).toLocaleDateString("en-IN")],
        ["Amount", `₹${booking.amount}`],
        ["Discount", `₹${booking.discount_amount}`],
        ["Total Paid", `₹${booking.total_amount}`],
        ["Payment Status", booking.payment_status],
        ["Payment Type", booking.payment_type || "N/A"],
        ["Coupon Code", booking.coupon_code || "N/A"],
        ["Instructions", booking.special_instructions || "None"],
      ],
    });

    doc.setFontSize(10);
    doc.text("This is a computer-generated invoice and does not require a signature.", 10, doc.internal.pageSize.height - 10);
    doc.save(`Invoice_${booking.booking_id}.pdf`);
  };

  if (loading) return <div className="text-center py-20 text-gray-600"><KalkiSevaLoader /></div>;

  if (status === "error" || !booking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-gray-600">We couldn't find any booking with ID <strong>{bookingId}</strong>.</p>
          <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-primary text-white rounded-md">Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        {status === "success" ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-green-600">Booking Confirmed</h2>
            <p className="text-sm mb-4 text-gray-600">Thank you! Your payment was successful.</p>
            <div className="text-left text-sm space-y-2 mb-6">
              <DetailRow label="Booking ID" value={booking.booking_id} />
              <DetailRow label="Puja" value={booking.puja_name} />
              <DetailRow label="Date" value={new Date(booking.puja_date).toLocaleDateString("en-IN")} />
              <DetailRow label="Package" value={booking.package_name} />
              <DetailRow label="Total Paid" value={`₹${booking.total_amount}`} />
              <DetailRow label="Payment Type" value={booking.payment_type || "N/A"} />
            </div>
            <button onClick={generatePDF} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Download Invoice
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Lottie animationData={failedAnimation} loop autoplay className="w-32 h-32 mx-auto" />
            <h2 className="text-xl font-bold mb-2 text-red-600">Payment Failed</h2>
            <p className="text-sm mb-4 text-gray-600">We couldn't confirm your payment. Please try again.</p>
            <div className="text-left text-sm space-y-2 mb-6">
              <DetailRow label="Booking ID" value={booking.booking_id} />
              <DetailRow label="Puja" value={booking.puja_name} />
              <DetailRow label="Package" value={booking.package_name} />
              <DetailRow label="Amount" value={`₹${booking.total_amount}`} />
              <DetailRow label="Payment Status" value={booking.payment_status} />
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigate("/")} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-800">{value}</span>
  </div>
);
