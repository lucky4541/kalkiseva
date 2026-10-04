import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export const TermsPage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex flex-col">
       <Helmet>
        <title>Terms and Conditions - Kalki Seva</title>
        <meta name="description" content="Read the terms and conditions of Kalki Seva services, bookings, and online puja rituals." />
        <meta name="keywords" content="terms and conditions, Kalki Seva policy, puja service rules" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Kalki Seva Team" />
      </Helmet>
      
      {/* Page Wrapper */}
      <div className="flex-grow flex flex-col justify-center">
        
        {/* Inner Content */}
        <div className="max-w-5xl mx-auto px-6 py-16">

          {/* Fancy Heading */}
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-center text-blue-800 mb-16 leading-tight tracking-wide"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Terms and Conditions
          </motion.h1>

          {/* Terms Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl p-10 md:p-14 space-y-12"
          >
            {/* Each Term Section */}
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
    title: "1. Acceptance of Terms",
    content: "By accessing and using Temple Services, you accept and agree to be bound by the terms and provisions of this agreement.",
  },
  {
    title: "2. Use License",
    content: "Permission is granted to temporarily download one copy of the materials (information or software) on Temple Services's website for personal, non-commercial transitory viewing only.",
  },
  {
    title: "3. Disclaimer",
    content: "The materials on Temple Services's website are provided on an 'as is' basis. Temple Services makes no warranties, expressed or implied.",
  },
  {
    title: "4. Limitations",
    content: "In no event shall Temple Services or its suppliers be liable for any damages arising out of the use or inability to use the materials on Temple Services's website.",
  },
  {
    title: "5. Accuracy of Materials",
    content: "The materials appearing on Temple Services's website could include technical, typographical, or photographic errors.",
  },
  {
    title: "6. Links",
    content: "Temple Services has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.",
  },
  {
    title: "7. Modifications",
    content: "Temple Services may revise these terms of service for its website at any time without notice.",
  },
  {
    title: "8. Governing Law",
    content: "These terms and conditions are governed by and construed in accordance with the laws of India.",
  },
];
