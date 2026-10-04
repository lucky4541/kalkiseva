import {
  HeartIcon,
  UsersIcon,
  SparklesIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import HinduImage from '../../assets/hindu.webp';
import { motion, easeOut } from 'framer-motion';

const features = [
  {
    icon: HeartIcon,
    title: 'Devotion',
    description:
      'Fostering deep spiritual connections and devotion through our platform.',
  },
  {
    icon: UsersIcon,
    title: 'Nationwide Community',
    description:
      'Connecting devotees across India for collective worship and spiritual fulfillment.',
  },
  {
    icon: SparklesIcon,
    title: 'Authenticity',
    description:
      'Upholding the sanctity and purity of traditional puja practices.',
  },
  {
    icon: GlobeAltIcon,
    title: 'Accessibility',
    description:
      'Making puja services available anytime, anywhere across India, with ease.',
  },
];

// Corrected Framer Motion Variants (No TS Errors)
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      duration: 0.6,
      ease: easeOut,
    },
  }),
};

const AboutSection = () => {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div
            className="order-2 lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
          >
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-6"
              variants={fadeInUp}
              custom={0}
            >
              About Kalki Seva Puja Booking Platform
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 mb-8 leading-relaxed"
              variants={fadeInUp}
              custom={1}
            >
              Kalki Seva is dedicated to preserving the spiritual heritage and
              tradition of Indian pujas while making these services easily
              accessible across India. Our platform connects you with authentic
              temples and experienced priests for a seamless and meaningful
              spiritual experience.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  variants={fadeInUp}
                  custom={index + 2}
                >
                  <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="relative order-1 lg:order-2 mb-8 lg:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            custom={1}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl rotate-6"></div>

            <div className="relative aspect-[4/5] w-full max-w-lg mx-auto lg:max-w-none">
              <img
                src={HinduImage}
                alt="Traditional Temple"
                className="relative rounded-3xl shadow-2xl w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AboutSection;
