// components/ServiceHighlight.tsx

import templeImage from "../../assets/1.png"; // Replace with your actual image path
import { easeOut, motion } from "framer-motion";

const ServiceHighlight = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-b from-orange-100 to-yellow-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* IMAGE */}
        <motion.div
          className="w-full h-full"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <img
            src={templeImage}
            alt="Kalki Seva Puja Services"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </motion.div>

        {/* TEXT */}
        <motion.div
          className="text-center lg:text-left"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2
            className="text-4xl font-bold text-orange-800 mb-4 leading-tight"
            variants={fadeInUp}
          >
            Bring Divine Energy Into Your Home
          </motion.h2>

          <motion.p className="text-lg text-gray-700 mb-6" variants={fadeInUp}>
            Kalki Seva connects you with trusted priests for personalized pujas,
            homas, and temple offerings — online. All rituals are
            rooted in tradition and guided by sacred scriptures.
          </motion.p>

          <motion.ul
            className="space-y-2 text-left text-gray-800 font-medium"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {[
              "Vedic Pujas Performed by Experts",
              "Temple Rituals & Homam Services",
              "Personalized Devotee Support",
              "Live Puja Streaming Available",
            ].map((item, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-2"
                variants={fadeInUp}
              >
                <span className="text-green-600">✓</span> {item}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div className="mt-8" variants={fadeInUp}>
            <a
              href="/pujas"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Explore Puja Services
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
export default ServiceHighlight;
