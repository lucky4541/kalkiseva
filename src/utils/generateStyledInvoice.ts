/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImageBase64 from "./logoBase64";

// -----------------------------------------------------------------------------
// INTERFACES
// -----------------------------------------------------------------------------
interface Address {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  email: string;
  phone: string;
  gstin?: string;
}

interface BookingDetails {
  booking_id: string;
  invoice_number: string;
  created?: string;
  puja_name: string;
  package_name: string;
  puja_date: string;
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
  temple_name?: string;
  billing_address?: Address;
  shipping_address?: Address;
}

// -----------------------------------------------------------------------------
// AMOUNT IN WORDS
// -----------------------------------------------------------------------------
const numberToWords = (num: number): string => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100)
      return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + inWords(n % 100) : "")
      );
    if (n < 100000)
      return (
        inWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + inWords(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        inWords(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + inWords(n % 100000) : "")
      );
    return "";
  };

  return inWords(num);
};

// -----------------------------------------------------------------------------
// MAIN PDF GENERATION
// -----------------------------------------------------------------------------
export const generateStyledInvoice = async (data: BookingDetails) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const purple = "#6B21A8";
  const green = "#22C55E";

  const cleanNumber = (value: string | number): number => {
    if (typeof value === "string") value = value.replace(/[^\d.]/g, "");
    const x = parseFloat(value.toString());
    return isNaN(x) ? 0 : x;
  };

  // ---------------- GST CALCULATION ----------------
  // Place of supply for prasad is the delivery (shipping) state; fall back to billing.
  // West Bengal -> CGST + SGST, any other state -> IGST
  const supplyState =
    data.shipping_address?.state?.trim() ? data.shipping_address.state : data.billing_address?.state;
  const isWestBengal =
    (supplyState || "").toLowerCase().replace(/[^a-z]/g, "") === "westbengal";

  const discount = cleanNumber(data.discount_amount);
  const totalPaid = cleanNumber(data.total_amount);
  const basePrice = discount + totalPaid;

  const cgstRate = 0.025;
  const sgstRate = 0.025;
  const igstRate = 0.05;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isWestBengal) {
    cgstAmount = +(totalPaid * cgstRate / (1 + igstRate)).toFixed(2);
    sgstAmount = +(totalPaid * sgstRate / (1 + igstRate)).toFixed(2);
  } else {
    igstAmount = +(totalPaid * igstRate / (1 + igstRate)).toFixed(2);
  }

  const subtotal = +(totalPaid - (cgstAmount + sgstAmount + igstAmount)).toFixed(2);
  const format = (n: number) => `Rs. ${n.toFixed(2)}`;

  // ---------------- PAGE FRAME ----------------
  doc.setDrawColor(purple);
  doc.setLineWidth(1);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

  // ---------------- WATERMARK ----------------
  doc.saveGraphicsState();
  (doc as any).setGState(new (doc as any).GState({ opacity: 0.08 }));
  doc.setFontSize(80);
  doc.setTextColor(purple);
  doc.text("PAID", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });
  doc.setFontSize(50);
  doc.text("KALKI SEVA", pageWidth / 2, pageHeight / 2 + 40, { align: "center" });
  doc.restoreGraphicsState();

  // ---------------- HEADER ----------------
  if (logoImageBase64) {
    doc.addImage(logoImageBase64, "PNG", 12, 12, 40, 16);
  }

  doc.setFont("courier", "bold").setFontSize(22).setTextColor(purple);
  doc.text("INVOICE", pageWidth - 12, 20, { align: "right" });

  doc.setFontSize(11).setFont("courier", "normal").setTextColor("#000");
  doc.text(`Invoice #: ${data.invoice_number}`, pageWidth - 12, 30, { align: "right" });
  doc.text(`Booking ID: ${data.booking_id}`, pageWidth - 12, 36, { align: "right" });

  const bookingDate = data.created
    ? new Date(data.created).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  doc.text(`Booking Date: ${bookingDate}`, pageWidth - 12, 42, { align: "right" });

  // ---------------- ADDRESS SECTION ----------------
  doc.setFont("courier", "bold").setFontSize(12);
  doc.text("From:", 12, 50);
  doc.text("Bill To:", pageWidth / 2 + 10, 50);

  doc.setFont("courier", "normal").setFontSize(10);

  doc.text("Kalki Seva", 12, 56);
  doc.text("GSTIN: 19GWWPK9262G1ZJ", 12, 61);
  doc.text("Email: support@kalkiseva.com", 12, 66);

  const b = data.billing_address;
  if (b) {
    let y2 = 56;
    const x = pageWidth / 2 + 10;

    doc.text(b.fullName, x, y2);
    doc.text(b.address, x, (y2 += 5));
    doc.text(`${b.city}, ${b.state}, ${b.pincode}`, x, (y2 += 5));
    doc.text(`Phone: ${b.phone}`, x, (y2 += 5));
    doc.text(`Email: ${b.email}`, x, (y2 += 5));
  }

  // ---------------- PUJA DETAILS TABLE ----------------
  autoTable(doc, {
    startY: 80,
    theme: "grid",
    pageBreak: "auto",
    styles: { font: "courier", fontSize: 10 },
    headStyles: { fillColor: purple, textColor: "#fff", fontStyle: "bold" },
    head: [["Puja Details", "Description"]],
    body: [
      ["Puja Name", data.puja_name],
      ["Package", data.package_name],
      ["Puja Date", new Date(data.puja_date).toLocaleDateString("en-IN")],
    ],
  });

  const yAfterTable = (doc as any).lastAutoTable.finalY + 12;


  // ---------------- MAIN AMOUNT TABLE ----------------
  autoTable(doc, {
    startY: yAfterTable,
    theme: "grid",
    pageBreak: "auto",
    margin: { top: 10 },
    styles: { font: "courier", fontSize: 10 },
    headStyles: { fillColor: green, textColor: "#fff", fontStyle: "bold" },
    head: [["Sl No", "Item", "HSN", "Description", "Amount"]],
    body: [
      ["1", "Puja Prasad (Sweets)", "170490", "Base Price", format(basePrice)],
      ["", "", "", "Discount", "-" + format(discount)],
      ["", "", "", "Subtotal", format(subtotal)],
      ...(isWestBengal
        ? [
            ["", "", "", "CGST (2.5%)", format(cgstAmount)],
            ["", "", "", "SGST (2.5%)", format(sgstAmount)],
          ]
        : [["", "", "", "IGST (5%)", format(igstAmount)]]),
      ["", "", "", { content: "Total Paid", styles: { fontStyle: "bold" } }, format(totalPaid)],
    ],
  });

  let finalY = (doc as any).lastAutoTable.finalY + 15;

  // If near bottom → go to new page
  if (finalY > pageHeight - 60) {
    doc.addPage();
    finalY = 20;
  }

  // ---------------- AMOUNT IN WORDS ----------------
  const words = numberToWords(Math.round(totalPaid)) + " Rupees Only";
  doc.setFont("courier", "bold").setFontSize(11);
  doc.text("Amount in Words:", 12, finalY);
  doc.setFont("courier", "normal").setFontSize(10);
  doc.text(words, 12, finalY + 5);


  // Calculate Prasad Validity (10 days from Puja Date)
const pujaDateObj = new Date(data.puja_date);
const prasadExpiry = new Date(pujaDateObj);
prasadExpiry.setDate(pujaDateObj.getDate() + 10);

const prasadExpiryStr = prasadExpiry.toLocaleDateString("en-IN");
  // ---------------- TERMS & CONDITIONS ----------------
  finalY += 20;

  if (finalY > pageHeight - 70) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFont("courier", "bold").setFontSize(11);
  doc.text("Terms & Conditions", 12, finalY);

  doc.setFont("courier", "normal").setFontSize(9);

  const terms = [
    "- Booking once confirmed cannot be cancelled.",
    "- Puja timings may vary due to temple rituals.",
    "- Sankalp will be performed based on the received details of the Devotee(s).",
    "",
    "Refund & Cancellation Policy:",
    "- No refunds or cancellations are allowed after booking confirmation.",
    "",
    `Note: Prasad expiry date: ${prasadExpiryStr} (10 days from the Puja date)`,
  ];

  terms.forEach((line) => {
    finalY += 5;
    if (finalY > pageHeight - 20) {
      doc.addPage();
      finalY = 20;
    }
    doc.text(line, 12, finalY);
  });

  // ---------------- FOOTER ----------------
  doc.setFontSize(9).setTextColor("#444");
  doc.text(
    "This is a computer-generated invoice and does not require a signature.",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  doc.save(`KalkiSeva_Invoice_${data.booking_id}.pdf`);
};
