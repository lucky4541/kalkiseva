import { useState } from "react";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Swal from "sweetalert2"; // 🔥 import sweetalert

const ServiceEvaluationWithFeedback = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
    try {
      if (!username || !rating) {
        Swal.fire({
          icon: "warning",
          title: "Missing fields",
          text: "Please fill Name and Rating!",
        });
        return;
      }

      setLoading(true);

      await axios.post(`${BASE_URL}/feedback/feedback-submit`, {
        username,
        email,
        rating,
        message,
      });

      Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Your feedback has been submitted successfully!",
      });

      setShowModal(false);
      setUsername("");
      setEmail("");
      setRating(5);
      setMessage("");
    } catch (error) {
      console.error("Feedback submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✨ Main Section */}
      <div className="py-16 md:py-24 bg-gradient-to-r from-purple-50 to-pink-50 text-center">
        <motion.h2
          className="text-3xl font-bold text-primary mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          How was your Kalki Seva experience?
        </motion.h2>

        <motion.p
          className="text-gray-600 text-lg mb-8 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Your blessings and feedback inspire us to serve better every day.
        </motion.p>

        <motion.button
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.05 }}
          className="inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-primary/90 transition"
        >
          Share Your Feedback
        </motion.button>
      </div>

      {/* ✨ Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-primary text-center">
              Share Your Feedback
            </h2>

            <input
              type="text"
              placeholder="Your Name *"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-primary"
              required
            />

            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-primary"
            />

            {/* 🌟 Star Ratings */}
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className={`h-8 w-8 cursor-pointer ${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <textarea
              placeholder="Share your experience..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-primary"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default ServiceEvaluationWithFeedback;
