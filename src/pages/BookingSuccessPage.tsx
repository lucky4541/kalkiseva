import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { KalkiSevaLoader } from "../components/Loader/KalkiSevaLoader";
import { Helmet } from "react-helmet-async";
import { generateStyledInvoice } from "../utils/generateStyledInvoice";
import { DownloadIcon, HomeIcon } from "lucide-react";

// import logo from "../assets/kalkisevalogo.png"; // Adjust path to your logo

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
  invoice_number: string; // Add this field
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
  created_formatted?: string; // Formatted date string
}

export const BookingSuccessPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

useEffect(() => {
  if (!bookingId) return;

  const fetchBooking = async () => {
    try {
      const res = await axios.get<BookingDetails>(
        `${BASE_URL}/booking/get-booking/${bookingId}`
      );

      if (res.data && res.data.booking_id) {
        setBookingDetails(res.data);
        // Auto-generate PDF
        // await generatePDF(res.data);
      } else {
        setBookingDetails(null);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      setBookingDetails(null);
    } finally {
      setLoading(false);
    }
  };

  fetchBooking();
}, [BASE_URL, bookingId]);
  // const generatePDF = async () => {
  //   if (!bookingDetails) return;

  //   const doc = new jsPDF();

  //   // Logo
  //   const logoImage = await fetch(logo).then(res => res.blob()).then(blob => {
  //     return new Promise<string>((resolve) => {
  //       const reader = new FileReader();
  //       reader.onload = () => resolve(reader.result as string);
  //       reader.readAsDataURL(blob);
  //     });
  //   });

  //   doc.addImage(logoImage, "PNG", 10, 10, 40, 15);

  //   doc.setFontSize(16);
  //   doc.text("Kalki Seva - Invoice", 60, 20);
  //   doc.setFontSize(11);
  //   doc.text(`Invoice #: ${bookingDetails.booking_id}`, 140, 20);
  //   doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 140, 26);

  //   // Company info
  //   doc.setFontSize(10);
  //   doc.text("Kalki Seva Private Limited", 10, 35);
  //   doc.text("123 Spiritual Street, Mumbai, India", 10, 40);
  //   doc.text("GSTIN: 27AABCU9603R1ZP", 10, 45);
  //   doc.text("Email: support@kalkiseva.com", 10, 50);

  //   // Billing Info
  //   const billing = bookingDetails.billing_address;
  //   if (billing) {
  //     doc.setFontSize(11);
  //     doc.text("Bill To:", 10, 60);
  //     doc.setFontSize(10);
  //     doc.text(billing.fullName, 10, 65);
  //     doc.text(billing.address, 10, 70);
  //     doc.text(`${billing.city}, ${billing.state}, ${billing.pincode}`, 10, 75);
  //     doc.text(`Phone: ${billing.phone}`, 10, 80);
  //     doc.text(`Email: ${billing.email}`, 10, 85);
  //   }

  //   autoTable(doc, {
  //     startY: 95,
  //     head: [["Item", "Details"]],
  //     body: [
  //       ["Puja Name", bookingDetails.puja_name],
  //       ["Temple", bookingDetails.temple_name || "N/A"],
  //       ["Package", bookingDetails.package_name],
  //       ["Puja Date", new Date(bookingDetails.puja_date).toLocaleDateString("en-IN")],
  //       ["Amount", `₹${bookingDetails.amount}`],
  //       ["Discount", `₹${bookingDetails.discount_amount}`],
  //       ["Total Paid", `₹${bookingDetails.total_amount}`],
  //       ["Payment Status", bookingDetails.payment_status],
  //       ["Payment Type", bookingDetails.payment_type || "N/A"],
  //       ["Coupon Code", bookingDetails.coupon_code || "N/A"],
  //       ["Instructions", bookingDetails.special_instructions || "None"],
  //     ],
  //   });

  //   doc.setFontSize(10);
  //   doc.text("This is a computer-generated invoice and does not require a signature.", 10, doc.internal.pageSize.height - 10);

  //   doc.save(`Invoice_${bookingDetails.booking_id}.pdf`);
  // };

const generatePDF = async () => {
  try {
    // console.log("generatePDF called");
    if (!bookingDetails) {
      alert("Booking details not available");
      return;
    }

    // console.log("Booking Details:", bookingDetails);
    await generateStyledInvoice(bookingDetails);
  } catch (err) {
    console.error("PDF generation error:", err);
  }
};
const isInvoiceDownloadAllowed = (() => {
  if (!bookingDetails?.created_formatted) return false;

  const bookingDate = new Date(bookingDetails.created_formatted);
  const today = new Date();

  const diffInMs = today.getTime() - bookingDate.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays <= 30;
})();





  if (loading) {
    return <div className="text-center py-20 text-gray-600"><KalkiSevaLoader /></div>;
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Helmet>
  <title>Booking Confirmed - Kalki Seva</title>
  <meta
    name="description"
    content="Your puja booking was successful! Thank you for choosing Kalki Seva. You will receive a confirmation email and further details shortly."
  />
  <meta
    name="keywords"
    content="Puja Booking Success, Temple Booking Confirmed, Kalki Seva Booking, Booking Confirmation"
  />
  <meta name="author" content="Kalki Seva Team" />
  <meta name="robots" content="noindex, nofollow" />
</Helmet>
        <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 w-full max-w-lg text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn’t find a booking with ID <strong>{bookingId}</strong>. It may have failed or expired.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate('/profile')} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              View My Bookings
            </button>
            <button onClick={() => navigate('/')} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6 text-sm">Your puja booking has been successfully confirmed.</p>

<div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8 shadow">
  {/* Header with Icon */}
  <div className="flex items-center gap-2 mb-4">
    
    <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
  </div>

  {/* Booking Info Table */}
  <div className="overflow-x-auto mb-6">
    <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <tbody>
        <TableRow label="Booking ID" value={bookingDetails.booking_id} />
        <TableRow label="Full Name" value={bookingDetails.full_name || "N/A"} />
        <TableRow label="Puja Name" value={bookingDetails.puja_name} />
        <TableRow label="Temple Name" value={bookingDetails.temple_name || "N/A"} />
        <TableRow label="Puja Date" value={new Date(bookingDetails.puja_date).toLocaleDateString("en-IN")} />
        <TableRow label="Puja Instructions" value={bookingDetails.special_instructions || "None"} />
        <TableRow label="Booking Date" value={bookingDetails.created_formatted || "N/A"} />

        <TableRow
          label="Payment Status"
          value={
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                bookingDetails.payment_status === 'SUCCESS'
                  ? 'bg-green-100 text-green-700'
                  : bookingDetails.payment_status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {bookingDetails.payment_status}
            </span>
          }
        />
      </tbody>
    </table>
  </div>

  {/* Billing Address */}
  {bookingDetails.billing_address && (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <HomeIcon className="w-5 h-5 text-indigo-500" />
        Billing Address
      </h3>
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
        <strong>{bookingDetails.billing_address.fullName}</strong><br />
        {bookingDetails.billing_address.address}, {bookingDetails.billing_address.landmark && bookingDetails.billing_address.landmark + ', '}
        {bookingDetails.billing_address.city}, {bookingDetails.billing_address.state} - {bookingDetails.billing_address.pincode}<br />
        {bookingDetails.billing_address.country}<br />
        Phone: {bookingDetails.billing_address.phone}<br />
        Email: {bookingDetails.billing_address.email}
      </p>
    </div>
  )}

  {/* Actions */}
 <div className="flex flex-wrap justify-center gap-4">
  {isInvoiceDownloadAllowed && (
    <button
      onClick={generatePDF}
      className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      <DownloadIcon className="w-4 h-4" />
      Download Invoice
    </button>
  )}

  <button onClick={() => navigate('/bookings')} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
    View My Bookings
  </button>
  <button onClick={() => navigate('/')} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
    Go to Home
  </button>
</div>


  {/* Thank You Note */}
  <div className="text-center text-sm text-gray-500 mt-6">
    🙏 Thank you for booking with <span className="font-semibold text-indigo-600">Kalki Seva</span>. You will receive confirmation and prasad details shortly.
  </div>
</div>

        </div>
      </div>
    </div>
  );
}
const TableRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <tr className="even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150">
    <td className="px-4 py-3 font-medium text-gray-600 w-1/3">{label}</td>
    <td className="px-4 py-3 text-gray-800">{value}</td>
  </tr>
);





// const DetailRow = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex justify-between">
//     <span className="text-gray-600 font-medium">{label}</span>
//     <span className="text-gray-800">{value}</span>
//   </div>
// );
