import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const steps = [
  "Choose your Puja & Temple",
  "Submit your details & prayers",
  "Priests perform rituals at sacred temples",
  "Receive blessings and Prasad at your doorstep",
];
const SpiritualJourneySection = () => {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-br from-yellow-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="text-3xl font-bold text-center text-primary mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Spiritual Journey With Kalki Seva
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="p-3 bg-primary/10 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{step}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SpiritualJourneySection;