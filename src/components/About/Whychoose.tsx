import { motion } from 'framer-motion';
import { SparklesIcon, ShieldCheckIcon, GlobeAltIcon, BoltIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: SparklesIcon,
    title: "Sacred & Authentic Rituals",
    description: "We uphold the purity of Vedic traditions with verified priests.",
  },
  {
    icon: ShieldCheckIcon,
    title: "100% Transparency",
    description: "Receive updates, videos, and Prasad for every booked Puja.",
  },
  {
    icon: GlobeAltIcon,
    title: "Pan-India Coverage",
    description: "Connect with temples and priests across India effortlessly.",
  },
  {
    icon: BoltIcon,
    title: "Fast Prasad Delivery",
    description: "Get Prasad delivered to your doorstep within days of Puja.",
  },
];

const WhyChooseSection = () => {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl font-bold text-center text-primary mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Why Choose Kalki Seva?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default WhyChooseSection;
