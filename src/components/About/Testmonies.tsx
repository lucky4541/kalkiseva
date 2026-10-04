import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    name: "Rakshita Sharma",
    message:
      "Kalki Seva has truly made my spiritual journey seamless! The experience was divine and heart-touching.",
    location: "West Bengal",
  },
  {
    name: "Saraswati Devi",
    message:
      "The way Kalki Seva organizes pujas remotely is simply amazing. Authentic rituals, fast Prasad delivery!",
    location: "Karnataka",
  },
  {
    name: "Anil Kumar",
    message:
      "Extremely satisfied! I could feel the divine connection even from miles away. Truly blessed!",
    location: "Maharashtra",
  },
];

const TestimonialsCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-16 md:py-24 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl font-bold text-primary mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          What Devotees Are Saying
        </motion.h2>

        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl mx-auto w-full max-w-2xl"
        >
          <p className="text-lg italic text-gray-700 mb-6">
            "{testimonials[current].message}"
          </p>
          <h4 className="font-bold text-primary text-lg">{testimonials[current].name}</h4>
          <p className="text-gray-500 text-sm">{testimonials[current].location}</p>
        </motion.div>
      </div>
    </div>
  );
};
export default TestimonialsCarousel;
