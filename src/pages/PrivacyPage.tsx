import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export const PrivacyPage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy - Kalki Seva</title>
        <meta name="description" content="Understand how Kalki Seva collects, uses, and protects your personal information through our privacy policy." />
        <meta name="keywords" content="privacy policy, user data protection, Kalki Seva privacy" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Kalki Seva Team" />
      </Helmet>
      
      {/* Page Centering */}
      <div className="flex-grow flex flex-col justify-center">
        
        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-16">

          {/* Fancy Page Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 mb-16 leading-tight tracking-wide"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Privacy Policy
          </motion.h1>

          {/* Main Container */}
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

// 📄 Sections Array
const sections = [
  {
    title: "1. Information We Collect",
    content: "We collect information that you provide directly to us, including:",
    list: [
      "Name and contact information",
      "Login credentials",
      "Payment information",
      "Preferences and settings",
      "Communication history",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: "We use the information we collect to:",
    list: [
      "Provide and maintain our services",
      "Process your transactions",
      "Send you service-related communications",
      "Improve our services",
      "Comply with legal obligations",
    ],
  },
  {
    title: "3. Information Sharing",
    content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with:",
    list: [
      "Service providers who assist in our operations",
      "Temple authorities for puja bookings",
      "Legal authorities when required by law",
    ],
  },
  {
    title: "4. Data Security",
    content: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    title: "5. Your Rights",
    content: "You have the right to:",
    list: [
      "Access your personal information",
      "Correct inaccurate information",
      "Request deletion of your information",
      "Object to processing of your information",
      "Withdraw consent",
    ],
  },
  {
    title: "6. Cookies",
    content: "We use cookies and similar tracking technologies to track activity on our website and hold certain information to improve and analyze our service.",
  },
  {
    title: "7. Changes to This Policy",
    content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.",
  },
  {
    title: "8. Contact Us",
    content: 'If you have any questions about this Privacy Policy, please contact us at ',
    list: [
      "Email: support@kalkiseva.com",
    ],
  },
];
