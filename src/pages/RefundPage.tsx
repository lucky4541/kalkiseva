import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export const RefundPage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
       <Helmet>
        <title>Refund Policy - Kalki Seva</title>
        <meta name="description" content="Read Kalki Seva's refund policy on cancellations, rescheduling, and payments related to online pujas." />
        <meta name="keywords" content="refund policy, booking cancellation, Kalki Seva refund" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Kalki Seva Team" />
      </Helmet>

      {/* Centering the page */}
      <div className="flex-grow flex flex-col justify-center">
        
        <div className="max-w-5xl mx-auto px-6 py-16">

          {/* Fancy Page Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 mb-16 leading-tight tracking-wide"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Refund & Cancellation Policy
          </motion.h1>

          {/* Content Sections */}
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

                {/* Show list if available */}
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
    title: "1. Refund & Cancellation Policy",
    content:
      "Kalki Seva follows a strict no-refund and no-cancellation policy once a booking has been successfully made, unless the service could not be delivered due to temple closure, service disruption, or technical failure from our side.",
  },
  {
    title: "2. Failed Transactions",
    content:
      "If a payment fails during the transaction but the amount was debited from your account, the amount will be automatically refunded within 7–10 working days back to your original payment method.",
  },
  {
    title: "3. Special Cases for Refund",
    content:
      "In rare cases like temple non-availability, unforeseen closures, or technical failure preventing your puja/service to happen, the booking will be cancelled and 100% amount will be refunded within 7–10 working days.",
  },
  {
    title: "4. Non-Refundable Items",
    content:
      "The following situations are NOT eligible for a refund:",
    list: [
      "Cancellation request by user after booking confirmation",
      "Change of mind by user",
      "Completed puja or service",
      "Convenience fees and taxes",
    ],
  },
  {
    title: "5. How to Contact Us",
    content:
      "For any refund or transaction queries, please contact our support team via:",
    list: [
      "Email: support@kalkiseva.com",
      "Phone: +91 8207206644",
      "Support Hours: Monday to Saturday, 9 AM to 6 PM",
    ],
  },
];
