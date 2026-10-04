import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TruckIcon, UserIcon, MapPinIcon } from "@heroicons/react/24/outline";
// import { toast } from 'react-toastify';  // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Required for styling
// import { ToastContainer } from 'react-toastify';
import Swal from "sweetalert2"; // Import SweetAlert2
import { format } from "date-fns";
import { load } from "@cashfreepayments/cashfree-js";
// import { load } from "@cashfreepayments/cashfree-sdk";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

interface DevoteeDetails {
  name: string;
  gothra: string;
  dateofbirth: string;
}

interface Address {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface PackageDetails {
  package_id: string;
  package_name: string;
  price: number;
  number_of_devotees?: number;
}

interface PujaDetails {
  puja_id: string;
  puja_name: string;
  temple_name: string;
}

interface LocationState {
  puja?: PujaDetails;
  date?: string;
  package?: PackageDetails;
}
interface Coupon {
  coupon_id: number;
  coupon_code: string;
  discount_amount: number;
  discount_type: "fixed" | "percentage";
  discount_percentage: number | null;
  maximum_discount_amount: number | null;
  description: string;
  expiration_date: string;
  usage_limit: number;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


// declare global {
//   interface Window {
//     Razorpay: unknown;
//   }
// }

// List of Indian states
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    puja,
    date,
    package: selectedPackage,
  } = (location.state as LocationState) || {};
  const [isCouponModalOpen, setIsCouponModalOpen] = useState<boolean>(false);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [discountType, setDiscountType] = useState<
    "fixed" | "percentage" | null
  >(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
   

  const [devotees, setDevotees] = useState<DevoteeDetails[]>([
    {
      name: "",
      gothra: "",
      dateofbirth: "",
    },
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on mount
  }, []);

  const handleAddDevotee = () => {
    if (devotees.length < (selectedPackage?.number_of_devotees || 1)) {
      setDevotees((prev) => [
        ...prev,
        { name: "", gothra: "", dateofbirth: "" },
      ]);
    }
  };

  function isInAppBrowser(): boolean {
    const ua = navigator.userAgent || navigator.vendor || "";
    return /(FB|Instagram|LinkedIn|Twitter|Snapchat|inapp|in-app)/i.test(ua);
  }

  const handleRemoveDevotee = (index: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove this devotee?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setDevotees((prevDevotees) =>
          prevDevotees.filter((_, i) => i !== index)
        );
        Swal.fire("Removed!", "Devotee has been removed.", "success");
      }
    });
  };

  const [billingAddress, setBillingAddress] = useState<Address>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [shippingAddress, setShippingAddress] = useState<Address>({
    ...billingAddress,
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState<string>("");

  // Removed unused isLoggedIn state

  // Fetch coupons from the API
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(`${BASE_URL}/coupons/coupons`);
        const data = await response.json();
        if (data.success) {
         setCoupons(
  data.coupons.map((coupon: Coupon) => ({
    coupon_id: coupon.coupon_id,
    coupon_code: coupon.coupon_code,
    discount_amount: Number(coupon.discount_amount),
    discount_type: coupon.discount_type,
    discount_percentage: coupon.discount_percentage,
    maximum_discount_amount: coupon.maximum_discount_amount,
    description: coupon.description,
    expiration_date: coupon.expiration_date,
    usage_limit: coupon.usage_limit,
    usage_count: coupon.usage_count,
    is_active: coupon.is_active,
    created_at: coupon.created_at,
    updated_at: coupon.updated_at,
  }))
);

        } else {
          console.error(data.message || "Error fetching coupons");
        }
      } catch {
        console.error("Failed to fetch coupons");
      }
    };

    fetchCoupons();
  }, [BASE_URL]);

  // Example subtotal (Replace with dynamic value)
 
  const subtotal = selectedPackage?.price || 0; // Get subtotal from selectedPackage price
  if (isNaN(subtotal)) {
    console.error("Invalid subtotal value", selectedPackage?.price);
  }

  // Apply coupon logic
  // const applyCoupon = (
  //   code: string,
  //   discount: number,
  //   type: "fixed" | "percentage"
  // ) => {
  //   const found = coupons.find((c) => c.code === code);

  //   if (!found) {
  //     alert("Coupon not found.");
  //     return;
  //   }

  //   const isExpired =
  //     found.expiration_date && new Date(found.expiration_date) < new Date();

  //   if (isExpired) {
  //     alert("This coupon has expired.");
  //     return;
  //   }

  //   // ✅ Valid coupon — apply it
  //   setCouponCode(code);
  //   setDiscountValue(discount);
  //   setDiscountType(type);
  //   setIsCouponModalOpen(false); // Close coupon modal after applying
  // };

const applyCoupon = (coupon: Coupon) => {
  if (!coupon) {
    alert("Coupon not found.");
    return;
  }

  const isExpired =
    coupon.expiration_date &&
    new Date(coupon.expiration_date) < new Date();

  if (isExpired) {
    alert("This coupon has expired.");
    return;
  }

  const pujaPrice = Number(selectedPackage?.price) || 0;

  let finalDiscount = 0;

  // -----------------------------
  // FIXED DISCOUNT
  // -----------------------------
  if (coupon.discount_type === "fixed") {
    const maxLimit = coupon.maximum_discount_amount
      ? Number(coupon.maximum_discount_amount)
      : Number(coupon.discount_amount);

    finalDiscount = Math.min(
      Number(coupon.discount_amount),
      maxLimit
    );

    setDiscountType("fixed");
  }

  // -----------------------------
  // PERCENT DISCOUNT
  // -----------------------------
  if (coupon.discount_type === "percentage") {
    const percentValue =
      (pujaPrice * Number(coupon.discount_percentage)) / 100;

    finalDiscount = coupon.maximum_discount_amount
      ? Math.min(percentValue, Number(coupon.maximum_discount_amount))
      : percentValue;

    setDiscountType("percentage");
  }

  // --------------------------------
  // NEVER ALLOW FREE ORDER
  // --------------------------------
  finalDiscount = Math.min(finalDiscount, pujaPrice - 1);

  // --------------------------------
  // SAVE FINAL DISCOUNT (not %)
  // --------------------------------
  setDiscountValue(Number(finalDiscount.toFixed(2)));

  setCouponCode(coupon.coupon_code);
  setIsCouponModalOpen(false);
};




  // // Calculate Discount Amount
  // let discountAmount = 0;
  // if (discountType === "percentage") {
  //   discountAmount = (subtotal * discountValue) / 100;
  // } else if (discountType === "fixed") {
  //   discountAmount = discountValue;
  // }

  // // Ensure discount doesn't exceed subtotal
  // discountAmount = Math.min(discountAmount, subtotal); // cap the discount
  // const discountedAmount = Math.max(subtotal - discountAmount, 1); // never allow 0 or negative total

  
  // // Recalculate GST on discounted amount
  // const gstAmount = (discountedAmount * 5) / 105;
  // const baseAmount = (discountedAmount * 100) / 105;

  // // Update final total
  // const total = discountedAmount;

const pujaPrice = Number(selectedPackage?.price) || 0;

let discountAmount = 0;

discountAmount = discountValue;

if (discountType === "fixed") {
  discountAmount = discountValue;
}

discountAmount = Math.min(discountAmount, pujaPrice - 1);


// Final amount after discount (GST already included in puja price)
const totalAfterDiscount = +(pujaPrice - discountAmount).toFixed(2);

// GST (5%) already included — extract only for display
const gstRate = 5;
const gstAmount = +(totalAfterDiscount * gstRate / (100 + gstRate)).toFixed(2);

// For states
// Place of supply = delivery state (billing state when shipping is the same)
const supplyState = sameAsBilling ? billingAddress.state : shippingAddress.state;
const isWestBengal = (supplyState || "").toLowerCase().replace(/[^a-z]/g, "") === "westbengal";
const cgst = isWestBengal ? +(gstAmount / 2).toFixed(2) : 0;
const sgst = isWestBengal ? +(gstAmount / 2).toFixed(2) : 0;
const igst = !isWestBengal ? gstAmount : 0;

// This is what the user pays
const totalToBePaid = totalAfterDiscount;

// Subtotal = Price WITHOUT GST (for display only)
const subtotalWithoutGST = +(totalToBePaid - gstAmount).toFixed(2);


// For readability, you may want:
const baseAmount = subtotalWithoutGST;
const total = totalToBePaid;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialInstructions(event.target.value);
  };

  const handleDevoteeChange = (
    index: number,
    field: keyof DevoteeDetails,
    value: string
  ) => {
    setDevotees((prevDevotees) => {
      const updatedDevotees = [...prevDevotees];
      updatedDevotees[index] = { ...updatedDevotees[index], [field]: value };
      return updatedDevotees;
    });
  };

  const handleBillingChange = (field: keyof Address, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
    if (sameAsBilling) {
      setShippingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleShippingChange = (field: keyof Address, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("User is logged in:", !!token);
    console.log("User ID from localStorage:", userId);
  }, []);

 

  const cashfreeRef = useRef<Awaited<ReturnType<typeof load>> | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const sdk = await load({ mode: "production" }); // ✅ Change here
        cashfreeRef.current = sdk;
        console.log("✅ Cashfree SDK loaded in LIVE mode");
      } catch (err) {
        console.error("❌ SDK load error:", err);
      }
    };
    init();
  }, []);

  // const handlePayment = async () => {
  //   const isLoggedIn = localStorage.getItem("token");
  //   const userId = localStorage.getItem("userId");

  //   if (!isLoggedIn || !userId) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Login Required",
  //       text: "Please login to continue with the booking.",
  //     });
  //   }

  //   const phonePattern = /^[6-9]\d{9}$/;
  //   if (!phonePattern.test(billingAddress.phone)) {
  //     return Swal.fire({ icon: "error", title: "Invalid Phone Number", text: "Please enter a valid 10-digit Indian phone number." });
  //   }

  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailPattern.test(billingAddress.email)) {
  //     return Swal.fire({ icon: "error", title: "Invalid Email", text: "Please enter a valid email address." });
  //   }

  //   if (!devotees?.length || devotees.some((d) => !d.name || !d.gothra || !d.dateofbirth)) {
  //     return Swal.fire({ icon: "error", title: "Devotee Details Missing", text: "Please fill all devotee details." });
  //   }

  //   if (!selectedPackage) {
  //     return Swal.fire({ icon: "error", title: "Select Package", text: "Please select a puja package." });
  //   }

  //   const formattedDate = date ? formatDate(new Date(date)) : "";
  //   if (!date || !isValidDate(formattedDate)) {
  //     return Swal.fire({ icon: "error", title: "Invalid Date", text: "Please enter a valid puja date." });
  //   }

  //   if (!billingAddress.fullName || !billingAddress.phone || !billingAddress.email) {
  //     return Swal.fire({ icon: "error", title: "Billing Info Incomplete", text: "Please provide name, phone, and email in billing address." });
  //   }

  //   if (!puja || !puja.puja_id || !puja.puja_name) {
  //     return Swal.fire({ icon: "error", title: "Missing Puja Info", text: "Puja details are incomplete." });
  //   }

  //   if (!total || total <= 0) {
  //     return Swal.fire({ icon: "error", title: "Invalid Amount", text: "Please check the amount." });
  //   }

  //   try {
  //     const res = await axios.post(`${BASE_URL}/payments/generate-cashfree-token`, {
  //       puja_id: puja.puja_id,
  //       package_id: selectedPackage.package_id,
  //       devotee_names: devotees.map((d) => d.name),
  //       devotee_gothra: devotees.map((d) => d.gothra),
  //       devotee_date_of_birth: devotees.map((d) => d.dateofbirth),
  //       special_instructions: specialInstructions,
  //       amount: total,
  //       discount_amount: discountAmount,
  //       coupon_code: couponCode,
  //       total_amount: total,
  //       shipping_address: shippingAddress,
  //       billing_address: billingAddress,
  //       is_shipping_address_same_as_billing: sameAsBilling,
  //       payment_method: "Cashfree",
  //       userid: userId,
  //       puja_date: formattedDate,
  //       puja_name: puja.puja_name,
  //       package_name: selectedPackage.package_name,
  //     });

  //     const { payment_session_id } = res.data as { payment_session_id: string };

  //     if (!payment_session_id || !payment_session_id.startsWith("session_")) {
  //       throw new Error("Invalid payment session ID received from backend.");
  //     }

  //     const redirectTarget = isInAppBrowser() ? "popup" : "-self"; // ✅ Correct value

  //     console.log("🌐 User Agent:", navigator.userAgent);
  //     console.log("📲 In-App Browser Detected:", isInAppBrowser());
  //     console.log("➡️ Redirect Target:", redirectTarget);

  //     // ✅ Ensure Cashfree SDK is loaded
  //     if (!cashfreeRef.current) {
  //       Swal.fire({ icon: "error", title: "Payment Error", text: "Cashfree SDK not initialized. Please try again later." });
  //       return;
  //     }

  //     const result: { error?: { message: string }; paymentDetails?: { paymentMessage: string }; redirect?: boolean } = await cashfreeRef.current.checkout({
  //       paymentSessionId: payment_session_id,
  //       redirectTarget: redirectTarget,
  //     });

  //     if (result?.error) {
  //       console.error("❌ Payment Error:", result.error);
  //       return Swal.fire({
  //         icon: "error",
  //         title: "Payment Failed",
  //         text: result.error.message || "Something went wrong. Please try again.",
  //       });
  //     }

  //     if (result?.paymentDetails) {
  //       console.log("✅ Payment Completed:", result.paymentDetails);
  //       return Swal.fire({
  //         icon: "success",
  //         title: "Payment Completed",
  //         text: result.paymentDetails.paymentMessage || "Booking completed successfully!",
  //       });
  //     }

  //     if (result?.redirect) {
  //       console.log("↪️ Payment is redirecting...");
  //     }

  //   } catch (err: unknown) {
  //     const errorMessage = err instanceof Error ? err.message : "Unknown error";
  //     console.error("❌ SDK Payment Error:", err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Payment Failed",
  //       text: errorMessage,
  //     });
  //   }
  // };

  // const handlePayment = async () => {
  //   const isLoggedIn = localStorage.getItem("token");
  //   const userId = localStorage.getItem("userId");

  //   if (!isLoggedIn || !userId) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Login Required",
  //       text: "Please login to continue with the booking.",
  //     });
  //   }

  //   const phonePattern = /^[6-9]\d{9}$/;
  //   if (!phonePattern.test(billingAddress.phone)) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Invalid Phone Number",
  //       text: "Please enter a valid 10-digit Indian phone number.",
  //     });
  //   }

  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailPattern.test(billingAddress.email)) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Invalid Email",
  //       text: "Please enter a valid email address.",
  //     });
  //   }

  //   if (!devotees?.length || devotees.some((d) => !d.name || !d.gothra || !d.dateofbirth)) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Devotee Details Missing",
  //       text: "Please fill all devotee details.",
  //     });
  //   }

  //   if (!selectedPackage) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Select Package",
  //       text: "Please select a puja package.",
  //     });
  //   }

  //   const formattedDate = date ? formatDate(new Date(date)) : "";
  //   if (!date || !isValidDate(formattedDate)) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Invalid Date",
  //       text: "Please enter a valid puja date.",
  //     });
  //   }

  //   if (!billingAddress.fullName || !billingAddress.phone || !billingAddress.email) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Billing Info Incomplete",
  //       text: "Please provide name, phone, and email in billing address.",
  //     });
  //   }

  //   if (!puja || !puja.puja_id || !puja.puja_name) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Missing Puja Info",
  //       text: "Puja details are incomplete.",
  //     });
  //   }

  //   if (!total || total <= 0) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Invalid Amount",
  //       text: "Please check the amount.",
  //     });
  //   }

  //   try {
  //     const res = await axios.post(`${BASE_URL}/payments/generate-cashfree-token`, {
  //       puja_id: puja.puja_id,
  //       package_id: selectedPackage.package_id,
  //       devotee_names: devotees.map((d) => d.name),
  //       devotee_gothra: devotees.map((d) => d.gothra),
  //       devotee_date_of_birth: devotees.map((d) => d.dateofbirth),
  //       special_instructions: specialInstructions,
  //       amount: total,
  //       discount_amount: discountAmount,
  //       coupon_code: couponCode,
  //       total_amount: total,
  //       shipping_address: shippingAddress,
  //       billing_address: billingAddress,
  //       is_shipping_address_same_as_billing: sameAsBilling,
  //       payment_method: "Cashfree",
  //       userid: userId,
  //       puja_date: formattedDate,
  //       puja_name: puja.puja_name,
  //       package_name: selectedPackage.package_name,
  //     });

  //     const { payment_session_id, booking_id } = res.data as {
  //       payment_session_id: string;
  //       booking_id: string;
  //     };

  //     if (!payment_session_id || !payment_session_id.startsWith("session_")) {
  //       throw new Error("Invalid payment session ID received from backend.");
  //     }

  //     const redirectTarget = isInAppBrowser() ? "popup" : "_self";

  //     if (!cashfreeRef.current) {
  //       return Swal.fire({
  //         icon: "error",
  //         title: "Payment Error",
  //         text: "Cashfree SDK not initialized. Please try again later.",
  //       });
  //     }

  //     type CashfreeResult = {
  //       error?: { message: string };
  //       paymentDetails?: { paymentMessage: string };
  //       redirect?: boolean;
  //     };

  //     const result = (await cashfreeRef.current.checkout({
  //       paymentSessionId: payment_session_id,
  //       redirectTarget,
  //     })) as CashfreeResult;

  //     if (result?.error) {
  //       console.error("❌ Payment Error:", result.error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Payment Failed",
  //         text: result.error.message || "Something went wrong. Please try again.",
  //       });
  //       return navigate(`/booking/failure/${booking_id}`);
  //     }

  //     if (result?.paymentDetails) {
  //       console.log("✅ Payment Completed:", result.paymentDetails);
  //       Swal.fire({
  //         icon: "success",
  //         title: "Payment Completed",
  //         text: result.paymentDetails.paymentMessage || "Booking completed successfully!",
  //       });
  //       return navigate(`/booking-success/${booking_id}`);
  //     }

  //     if (result?.redirect) {
  //       console.log("↪️ Payment is redirecting...");
  //     }

  //   } catch (err: unknown) {
  //     const errorMessage = err instanceof Error ? err.message : "Unknown error";
  //     console.error("❌ SDK Payment Error:", err);

  //     Swal.fire({
  //       icon: "error",
  //       title: "Payment Failed",
  //       text: errorMessage,
  //     });

  //     return navigate("/booking/failure/unknown");
  //   }
  // };

  const handlePayment = async () => {
    const isLoggedIn = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!isLoggedIn || !userId) {
      return Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login to continue with the booking.",
      });
    }

    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(billingAddress.phone)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid 10-digit Indian phone number.",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(billingAddress.email)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
    }

    if (
      !devotees?.length ||
      devotees.some((d) => !d.name || !d.gothra)
    ) {
      return Swal.fire({
        icon: "error",
        title: "Devotee Details Missing",
        text: "Please fill the name and gotra of every devotee.",
      });
    }

    if (!selectedPackage) {
      return Swal.fire({
        icon: "error",
        title: "Select Package",
        text: "Please select a puja package.",
      });
    }

    const formattedDate = date ? formatDate(new Date(date)) : "";
    if (!date || !isValidDate(formattedDate)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "Please enter a valid puja date.",
      });
    }

    if (
      !billingAddress.fullName ||
      !billingAddress.phone ||
      !billingAddress.email
    ) {
      return Swal.fire({
        icon: "error",
        title: "Billing Info Incomplete",
        text: "Please provide name, phone, and email in billing address.",
      });
    }

    if (!puja || !puja.puja_id || !puja.puja_name) {
      return Swal.fire({
        icon: "error",
        title: "Missing Puja Info",
        text: "Puja details are incomplete.",
      });
    }

    if (!total || total <= 0) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: "Please check the amount.",
      });
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/payments/generate-cashfree-token`,
        {
          puja_id: puja.puja_id,
          package_id: selectedPackage.package_id,
          devotee_names: devotees.map((d) => d.name),
          devotee_gothra: devotees.map((d) => d.gothra),
          devotee_date_of_birth: devotees.map((d) => d.dateofbirth),
          special_instructions: specialInstructions,
          amount: Number(baseAmount.toFixed(2)),
          gst_amount: Number(gstAmount.toFixed(2)),
          discount_amount: Number(discountAmount.toFixed(2)),
          total_amount: Number(total.toFixed(2)),
          coupon_code: couponCode,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          is_shipping_address_same_as_billing: sameAsBilling,
          payment_method: "Cashfree",
          userid: userId,
          puja_date: formattedDate,
          puja_name: puja.puja_name,
          package_name: selectedPackage.package_name,
        }
      );

      const { payment_session_id } = res.data as {
        payment_session_id: string;
      };

      if (!payment_session_id || !payment_session_id.startsWith("session_")) {
        throw new Error("Invalid payment session ID received from backend.");
      }

      // ✅ Cashfree SDK loaded?
      if (!cashfreeRef.current) {
        return Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: "Cashfree SDK not initialized. Please try again later.",
        });
      }

      const redirectTarget: "popup" | "_self" = isInAppBrowser()
        ? "popup"
        : "_self";

      // ✅ Redirect handled inside return_url (set from backend)
      await cashfreeRef.current.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget,
      });

      // We don't get result in popup mode. Use return_url to redirect back to:
      // 👉 /booking-success/:bookingId
      // 👉 /booking/failure/:bookingId
      // So no need to manually navigate here!
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";

      console.error("❌ Payment Error:", err);

      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: errorMessage,
      });

      // Optionally redirect to failure page if error occurs before SDK
      return navigate("/booking-failure/bookingId");
    }
  };

  const isValidDate = (date: string): boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary";

  if (!puja || !date || !selectedPackage) {
    return (
      <div className="text-red-500 text-center mt-6">
        Invalid checkout session
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Checkout - Complete Your Puja Booking | Kalki Seva</title>
        <meta
          name="description"
          content="Securely complete your puja booking on Kalki Seva. Choose your package, review your details, and proceed to payment. Your spiritual journey begins here."
        />
        <meta
          name="keywords"
          content="Checkout, Puja Booking, Secure Payment, Temple Services, Kalki Seva"
        />
        <meta name="author" content="Kalki Seva Team" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      {/* <ToastContainer /> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Devotee Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <UserIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Devotee Details</h2>
            </div>

            {devotees.map((devotee, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Devotee {index + 1}</h3>
                  {/* ✅ Only show Remove if more than one and not the first one */}
                  {devotees.length > 1 && index !== 0 && (
                    <button
                      onClick={() => handleRemoveDevotee(index)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClasses}>Name *</label>
                    <input
                      type="text"
                      value={devotee.name}
                      onChange={(e) =>
                        handleDevoteeChange(index, "name", e.target.value)
                      }
                      className={inputClasses}
                      placeholder="Enter devotee name"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Gotra *</label>
                    <input
                      type="text"
                      value={devotee.gothra}
                      onChange={(e) =>
                        handleDevoteeChange(index, "gothra", e.target.value)
                      }
                      className={inputClasses}
                      placeholder="Enter Gotra"
                      required
                    />
                    {/* Devotees who don't know their gotra traditionally use Kashyap */}
                    <label className="flex items-center gap-2 mt-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={devotee.gothra === "Kashyap"}
                        onChange={(e) =>
                          handleDevoteeChange(index, "gothra", e.target.checked ? "Kashyap" : "")
                        }
                      />
                      I don't know my Gotra (use "Kashyap")
                    </label>
                  </div>
                    <div className="max-w-[180px]">
  <label className={labelClasses}>Date Of Birth (optional)</label>

  <input
    type="date"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
    max={new Date().toISOString().split("T")[0]}
    value={
      devotee.dateofbirth
        ? devotee.dateofbirth.split("/").reverse().join("-")
        : ""
    }
    onChange={(e) => {
      const iso = e.target.value;
      if (!iso) return handleDevoteeChange(index, "dateofbirth", "");
      const [y, m, d] = iso.split("-");
      handleDevoteeChange(index, "dateofbirth", `${d}/${m}/${y}`);
    }}
  />
</div>
                </div>
              </div>
            ))}

            {/* Add More Devotee Button */}
            {devotees.length < (selectedPackage?.number_of_devotees || 1) && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddDevotee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Add More Devotee
                </button>
              </div>
            )}
          </div>
          {/* Billing Address */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <MapPinIcon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Billing Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClasses}>Full Name *</label>
                <input
                  type="text"
                  value={billingAddress.fullName}
                  onChange={(e) =>
                    handleBillingChange("fullName", e.target.value)
                  }
                  className={inputClasses}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Phone Number *</label>
                <input
                  type="tel"
                  value={billingAddress.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow only numbers and max 10 digits
                    if (/^\d{0,10}$/.test(val)) {
                      handleBillingChange("phone", val);
                    }
                  }}
                  className={inputClasses}
                  placeholder="Enter phone number"
                  required
                  pattern="\d{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>
              <div>
                <label className={labelClasses}>Email Address *</label>
                <input
                  type="email"
                  value={billingAddress.email}
                  onChange={(e) => handleBillingChange("email", e.target.value)}
                  className={inputClasses}
                  placeholder="Enter email address"
                  required
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  title="Please enter a valid email address"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>Address *</label>
                <input
                  type="text"
                  value={billingAddress.address}
                  onChange={(e) =>
                    handleBillingChange("address", e.target.value)
                  }
                  className={inputClasses}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>Landmark</label>
                <input
                  type="text"
                  value={billingAddress.landmark}
                  onChange={(e) =>
                    handleBillingChange("landmark", e.target.value)
                  }
                  className={inputClasses}
                  placeholder="Enter landmark (optional)"
                />
              </div>
              <div>
                <label className={labelClasses}>City *</label>
                <input
                  type="text"
                  value={billingAddress.city}
                  onChange={(e) => handleBillingChange("city", e.target.value)}
                  className={inputClasses}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Billing State *</label>
                <select
                  value={billingAddress.state}
                  onChange={(e) => handleBillingChange("state", e.target.value)}
                  className={inputClasses}
                  required
                >
                  <option value="">Select State</option>
                  {indianStates.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>PIN Code *</label>
                <input
                  type="text"
                  value={billingAddress.pincode}
                  onChange={(e) =>
                    handleBillingChange("pincode", e.target.value)
                  }
                  className={inputClasses}
                  placeholder="Enter PIN code"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Country</label>
                <input
                  type="text"
                  value={billingAddress.country}
                  onChange={(e) =>
                    handleBillingChange("country", e.target.value)
                  }
                  className={inputClasses}
                  readOnly
                />
              </div>
            </div>
          </div>
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TruckIcon className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Same as billing
                </span>
              </label>
            </div>

            {!sameAsBilling && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClasses}>Full Name *</label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      handleShippingChange("fullName", e.target.value)
                    }
                    className={inputClasses}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className={labelClasses}>Phone Number *</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      handleShippingChange("phone", e.target.value)
                    }
                    className={inputClasses}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <label className={labelClasses}>Email Address *</label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) =>
                      handleShippingChange("email", e.target.value)
                    }
                    className={inputClasses}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClasses}>Address *</label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      handleShippingChange("address", e.target.value)
                    }
                    className={inputClasses}
                    placeholder="Enter street address"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClasses}>Landmark</label>
                  <input
                    type="text"
                    value={shippingAddress.landmark}
                    onChange={(e) =>
                      handleShippingChange("landmark", e.target.value)
                    }
                    className={inputClasses}
                    placeholder="Enter landmark (optional)"
                  />
                </div>
                <div>
                  <label className={labelClasses}>City *</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      handleShippingChange("city", e.target.value)
                    }
                    className={inputClasses}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label className={labelClasses}>Shipping State *</label>
                  <select
                    value={shippingAddress.state}
                    onChange={(e) =>
                      handleShippingChange("state", e.target.value)
                    }
                    className={inputClasses}
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>PIN Code *</label>
                  <input
                    type="text"
                    value={shippingAddress.pincode}
                    onChange={(e) =>
                      handleShippingChange("pincode", e.target.value)
                    }
                    className={inputClasses}
                    placeholder="Enter PIN code"
                    required
                  />
                </div>
                <div>
                  <label className={labelClasses}>Country</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      handleShippingChange("country", e.target.value)
                    }
                    className={inputClasses}
                    readOnly
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Puja Name</span>
                <span className="font-medium">{puja.puja_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Puja Date</span>
                <span className="font-medium">
                  {new Date(date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Package</span>
                <span className="font-medium">
                  {selectedPackage.package_name}
                </span>
              </div>
               <div className="flex justify-between">
                <span className="text-gray-600">Puja Price</span>
                <span className="font-medium">
                 ₹ {selectedPackage.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Allowed Devotees</span>
                <span className="font-medium">
                  {selectedPackage?.number_of_devotees || 1}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {devotees.length === 1
                    ? "Selected Devotee"
                    : "Selected Devotees"}
                </span>
                <span className="font-medium">{devotees.length}</span>
              </div>

              <div>
                <label
                  htmlFor="specialInstructions"
                  className="block text-gray-600"
                >
                  Special Instructions (if any)
                </label>
                <input
                  id="specialInstructions"
                  type="text"
                  value={specialInstructions}
                  onChange={handleChange}
                  placeholder="Marriage anniversary, Birthday, and more"
                  className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={couponCode}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Enter coupon code"
                />
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
                  Apply
                </button>
              </div>
              {/* View Coupons Button - Below Apply Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="text-primary hover:underline hover:text-primary/80 transition"
                >
                  View Coupons
                </button>
              </div>

<div className="space-y-2">
  {/* 1. Puja Price */}
  <div className="flex justify-between">
    <span className="text-gray-600">Puja Price</span>
    <span className="font-medium">₹{pujaPrice.toFixed(2)}</span>
  </div>




  {/* 2. Discount */}
  {discountAmount > 0 && (
    <div className="flex justify-between text-red-500">
      <span className="text-gray-600">Discount</span>
      <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
    </div>
  )}
    {/* 1.1 Subtotal (before discount and GST) */}
<div className="flex justify-between">
  <span className="text-gray-600">Subtotal</span>
  <span className="font-medium">
    ₹{(pujaPrice - discountAmount - (cgst + sgst + igst)).toFixed(2)}
  </span>
</div>

  {/* 3. GST */}
  {isWestBengal ? (
    <>
      <div className="flex justify-between">
        <span className="text-gray-600">
          CGST (2.5%) <small className="text-xs text-gray-500">(included in Puja Price)</small>
        </span>
        <span className="font-medium">₹{cgst.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">
          SGST (2.5%) <small className="text-xs text-gray-500">(included in Puja Price)</small>
        </span>
        <span className="font-medium">₹{sgst.toFixed(2)}</span>
      </div>
    </>
  ) : (
    <div className="flex justify-between">
      <span className="text-gray-600">
        IGST (5%) <small className="text-xs text-gray-500">(included in Puja Price)</small>
      </span>
      <span className="font-medium">₹{igst.toFixed(2)}</span>
    </div>
  )}

  {/* 5. Total */}
  <div className="flex justify-between text-lg font-semibold">
    <span>Total to be Paid</span>
    <span>₹{totalToBePaid.toFixed(2)}</span>
  </div>
</div>



              <button
                onClick={handlePayment}
                className="w-full py-3 mt-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Proceed to Payment
              </button>
              {/* Coupon Modal (Popup) */}
              {/* {isCouponModalOpen && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    onClick={() => setIsCouponModalOpen(false)}
  >
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-80 relative transform transition-all scale-95 hover:scale-100"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-bold text-center mb-4">
        Available Coupons 🎉
      </h2>

      {coupons.filter(
        (coupon) =>
          !coupon.expiration_date ||
          new Date(coupon.expiration_date) >= new Date()
      ).length === 0 ? (
        <p className="text-center text-gray-600">
          No valid coupons available at the moment.
        </p>
      ) : (
        <ul className="space-y-4 max-h-60 overflow-y-auto">
          {coupons
            .filter(
              (coupon) =>
                !coupon.expiration_date ||
                new Date(coupon.expiration_date) >= new Date()
            )
            .map((coupon) => (
              <li
                key={coupon.coupon_id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-blue-50 flex flex-col gap-2"
                onClick={() => applyCoupon(coupon)}
              >
                <span className="font-medium text-gray-800">
                  {coupon.coupon_code}
                </span>

                <p className="text-gray-600">{coupon.description}</p>

                <div className="text-sm text-gray-500">
                  Offer Expires:{" "}
                  {coupon.expiration_date
                    ? format(new Date(coupon.expiration_date), "MM/dd/yyyy")
                    : "Invalid date"}
                </div>
              </li>
            ))}
        </ul>
      )}

      <button
        onClick={() => setIsCouponModalOpen(false)}
        className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Close
      </button>
    </div>
  </div>
)} */}
{isCouponModalOpen && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
    onClick={() => setIsCouponModalOpen(false)}
  >
    <motion.div
      initial={{ scale: 0.7, opacity: 0, rotateX: -20 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 12,
      }}
      className="bg-white rounded-2xl shadow-2xl w-96 p-6 relative border border-purple-300"
      onClick={(e) => e.stopPropagation()}
      style={{
        boxShadow:
          "0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.3)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Header */}
      <motion.h2
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-extrabold text-center mb-4 
                   bg-gradient-to-r from-purple-600 to-purple-400 
                   text-transparent bg-clip-text"
      >
        🎉 Exclusive Offers for You
      </motion.h2>

      {coupons.filter(c => !c.expiration_date || new Date(c.expiration_date) >= new Date()).length === 0 ? (
        <p className="text-center text-gray-600">No valid coupons available right now.</p>
      ) : (
        <ul className="space-y-4 max-h-72 overflow-y-auto pr-2">
          {coupons
            .filter(c => !c.expiration_date || new Date(c.expiration_date) >= new Date())
            .map((coupon, i) => (
              <motion.li
                key={coupon.coupon_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                whileHover={{
                  scale: 1.05,
                  rotateX: 5,
                  rotateY: 5,
                  boxShadow:
                    "0 0 18px rgba(147, 51, 234, 0.6), 0 0 25px rgba(168, 85, 247, 0.5)",
                }}
                className="p-4 rounded-xl border border-purple-300 bg-purple-50 
                           cursor-pointer transition-all duration-200"
                onClick={() => applyCoupon(coupon)}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-purple-800">
                    {coupon.coupon_code}
                  </span>

                  <span className="text-xs bg-purple-700 text-white px-2 py-1 rounded-full shadow-sm">
                    {coupon.discount_type === "percentage"
                      ? `Up to ${coupon.discount_percentage}% OFF`
                      : `Up to ₹${coupon.discount_amount} OFF`}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mt-1">{coupon.description}</p>

                <p className="text-sm text-gray-500 mt-2">
                  Expires:{" "}
                  <span className="font-medium text-purple-700">
                    {coupon.expiration_date
                      ? format(new Date(coupon.expiration_date), "dd MMM yyyy")
                      : "N/A"}
                  </span>
                </p>
              </motion.li>
            ))}
        </ul>
      )}

      {/* Close Button */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        whileHover={{
          scale: 1.03,
          boxShadow:
            "0 0 15px rgba(168, 85, 247, 0.6), 0 0 25px rgba(147, 51, 234, 0.5)",
        }}
        className="mt-6 w-full py-2 bg-gradient-to-r from-purple-600 
                   to-purple-500 text-white font-semibold rounded-lg 
                   shadow-lg transition-all"
        onClick={() => setIsCouponModalOpen(false)}
      >
        Close
      </motion.button>
    </motion.div>
  </motion.div>
)}




            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
