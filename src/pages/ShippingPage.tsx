import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export const ShippingPage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
        <Helmet>
        <title>Shipping Policy - Kalki Seva</title>
        <meta name="description" content="Learn about Kalki Seva's shipping policy for delivery of prasad and spiritual items post puja rituals." />
        <meta name="keywords" content="shipping policy, prasad delivery, Kalki Seva shipping details" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Kalki Seva Team" />
      </Helmet>

      {/* Full page center */}
      <div className="flex-grow flex flex-col justify-center">

        <div className="max-w-5xl mx-auto px-6 py-16">

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 mb-16 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Shipping & Prasad Delivery Policy
          </motion.h1>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl p-10 md:p-14 space-y-12"
          >
            {sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`space-y-4 p-6 rounded-xl ${
                  index % 2 === 0
                    ? "bg-gradient-to-r from-blue-50 to-blue-100"
                    : "bg-gradient-to-r from-gray-100 to-gray-200"
                } hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
              >
                <h2 className="text-2xl font-bold text-blue-700">{section.title}</h2>
                <p className="text-lg text-gray-700 leading-relaxed">{section.content}</p>

                {/* List items if available */}
                {section.list && (
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-2">
                    {section.list.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </motion.section>
            ))}
          </motion.div>

        </div>

      </div>

    </div>
  );
};

// 📄 Sections Content
const sections = [
  {
    title: "1. Prasad Preparation & Shipping",
    content:
      "After your Puja is successfully completed, Prasad and other sacred items are prepared and carefully packed for shipping. We currently ship Prasad across India.",
  },
  {
    title: "2. Processing Time",
    content:
      "After the completion of your Puja, the Prasad preparation takes:",
    list: [
      "24–48 hours for regular pujas",
      "Same day for express pujas",
      "2–3 days for special or bulk pujas",
    ],
  },
  {
    title: "3. Delivery Timeframes",
    content:
      "Estimated delivery times after dispatch:",
    list: [
      "Metro Cities: 2–3 business days",
      "Other Cities: 3–5 business days",
      "Rural Areas: 5–7 business days",
      
    ],
  },
  {
    title: "4. Shipping Charges",
    content:
      "Shipping charges are calculated based on:",
    list: [
      "Delivery location India Only",
      "Package weight and dimensions",
      "Selected shipping method (standard or express)",
    ],
  },
  {
    title: "5. Tracking Your Delivery",
    content:
      "Once your Prasad is shipped, you will receive:",
    list: [
      "Shipping confirmation email",
      "Tracking number",
      "Link to track your shipment online",
    ],
  },
  {
    title: "6. Shipping Restrictions",
    content:
      "Please note: We currently only ship within India.",
    list: [
      "Shipping is available to all states and union territories across India",
      "Remote or rural areas may experience slightly longer delivery times",
      "No shipments outside of India are accepted currently",
    ],
  },
  
  {
    title: "7. Lost or Damaged Items",
    content:
      "In case of lost or damaged Prasad items:",
    list: [
      "Please contact our support team immediately",
      "Provide your order number and photos (if applicable)",
      "Replacement or refund will be initiated within 48 hours after verification",
    ],
  },
  {
    title: "8. Refunds for Failed Transactions",
    content:
      "Please note that we do not offer refunds for successfully completed pujas. However, in case of payment failures, the refund will be automatically processed to your original payment method within 7–10 working days.",
  },
  {
    title: "9. Contact Us",
    content:
      "For any shipping or Prasad delivery-related queries, contact us at:",
    list: [
      "Email: support@kalkiseva.com",
      "Phone: +91 8207206644",
      "Support Hours: Monday to Saturday, 9 AM to 6 PM",
    ],
  },
];
