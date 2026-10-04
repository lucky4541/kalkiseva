import {
  DevicePhoneMobileIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import PlayStoreImage from '../../assets/playstore.webp';
import AppStoreImage from '../../assets/AppleStore.webp';
import AppImage from '../../assets/iphone 13 mini.webp';
import { motion } from 'framer-motion';

const features = [
  { icon: SparklesIcon, title: 'Easy Booking Process' },
  { icon: HeartIcon, title: 'Personalized Experience' },
  { icon: StarIcon, title: 'Exclusive Offers' },
  { icon: DevicePhoneMobileIcon, title: 'Real-time Updates' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const PromotionalSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            custom={0}
          >
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-6"
              variants={fadeInUp}
              custom={0}
            >
              Download Our Mobile App for a Better Experience
            </motion.h2>
            <motion.p
              className="text-gray-600 mb-8"
              variants={fadeInUp}
              custom={1}
            >
              Get easy access to all our services right from your mobile device.
              Book pujas, check panchangam, and receive important notifications
              about your bookings.
            </motion.p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  variants={fadeInUp}
                  custom={index + 2}
                >
                  <feature.icon className="h-6 w-6 text-primary" />
                  <span className="text-gray-700">{feature.title}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={fadeInUp}
              custom={6}
            >
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={PlayStoreImage} alt="Play Store" className="h-12" />
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={AppStoreImage} alt="App Store" className="h-12" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl transform rotate-6"></div>
            <img
              src={AppImage}
              alt="App Preview"
              className="relative rounded-3xl shadow-2xl w-[250px] h-[500px] ml-20 hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default PromotionalSection;
