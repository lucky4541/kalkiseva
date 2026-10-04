import { motion, easeOut } from "framer-motion";
import AdVideo from "../../assets/marketing.mp4"; // 🔥 Your video path

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

const VideoAdvertisementSection = () => {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* VIDEO SECTION */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            className="order-1"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <video
                src={AdVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
            </div>
          </motion.div>

          {/* TEXT SECTION */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            custom={1}
            className="order-2 text-center lg:text-left"
          >
            <h2 className="text-3xl font-bold text-primary mb-6">
              Experience Divine Connection Seamlessly
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join thousands of devotees embracing the future of sacred rituals.
              Watch how Kalki Seva brings the blessings of ancient traditions
              directly to your doorstep — authentic, soulful, and effortless.
            </p>

            <motion.a
              href="/pujas"
              whileHover={{ scale: 1.05 }}
              className="inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition shadow-md"
            >
              Book Your Puja Now
            </motion.a>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default VideoAdvertisementSection;
