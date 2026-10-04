import {
  HeartIcon,
  SparklesIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import DeepamImage from "../assets/aboutus.webp";
import KaliImage from "../assets/KAlimatha.webp";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { StarIcon } from "@heroicons/react/24/solid"; // ✅ For stars
import { Helmet } from "react-helmet-async";

interface Review {
  review_id: number;
  review: string;
  review_verified: boolean;
  created: string;
  rating?: number; // ✅ Add rating support
  reviewUser?: {
    username: string;
    otp_verified: boolean;
    profile_pic_url?: string;
  };
}

export const AboutPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [expandedReviewIds, setExpandedReviewIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // ✅ loader
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchReviews = async () => {
    try {
      // console.log("🔵 BASE_URL:", BASE_URL);

      const res = await axios.get<{ message: string; data: Review[] }>(`${BASE_URL}/reviews/verified-reviews`);

      // console.log("🔥 Full API Response:", res.data);

      const verified = res.data.data.filter((review) => review.review_verified === true);

      // console.log("✅ Verified Reviews Only:", verified);

      setReviews(verified);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchReviews();
  }, [BASE_URL]);

  const toggleExpand = (reviewId: number) => {
    setExpandedReviewIds((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
    );
  };

  const MotionSection = ({ children }: { children: React.ReactNode }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

    useEffect(() => {
      if (inView) controls.start("visible");
    }, [inView, controls]);

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          hidden: { opacity: 0, y: 50 },
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Helmet>
        <title>About Kalki Seva - Our Vision, Mission & Team</title>
        <meta
          name="description"
          content="Learn about Kalki Seva – our vision to bring spiritual services online, mission to connect devotees with temples, and our dedicated team working behind the scenes."
        />
        <meta
          name="keywords"
          content="About Kalki Seva, Kalki Seva Team, Spiritual Mission, Online Puja Services, Temple Connection, Indian Rituals Platform"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Kalki Seva Team" />
        <meta
          property="og:title"
          content="About Kalki Seva - Our Vision & Team"
        />
        <meta
          property="og:description"
          content="Discover the vision, mission and people behind Kalki Seva – your trusted platform for online puja bookings and temple services."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kalkiseva.com/about" />
        <meta
          property="og:image"
          content="https://kalkiseva.com/assets/kalkiseva-about.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About Kalki Seva - Vision & Team"
        />
        <meta
          name="twitter:description"
          content="Kalki Seva is your gateway to trusted spiritual services. Meet our dedicated team and understand our vision."
        />
        <meta
          name="twitter:image"
          content="https://kalkiseva.com/assets/kalkiseva-about.jpg"
        />
      </Helmet>

      {/* Hero Section */}
      <motion.div
        className="relative h-[400px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src={DeepamImage} alt="Kalki Seva Temple" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              About Kalki Seva
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Connecting devotees with divine traditions through technology and compassion
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Mission and Vision */}
      <MotionSection>
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-primary">Our Mission</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              At Kalki Seva, our heart beats for the spiritual soul of India.
              We are devoted to bringing sacred rituals closer to every devotee,
              helping them experience the divine blessings of our ancient traditions — 
              all from the sacred lands of India, with purity, devotion, and authenticity.
            </p>
            <h2 className="text-3xl font-bold mb-6 text-primary">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to weave a spiritual network across India, empowering every devotee 
              to stay connected with sacred traditions and participate in temple rituals from anywhere within our homeland.
            </p>
          </div>
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl rotate-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            />
            <img src={KaliImage} alt="Temple Ritual" className="relative rounded-3xl shadow-2xl" />
          </div>
        </div>
      </MotionSection>

      {/* Core Values */}
      <MotionSection>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[HeartIcon, SparklesIcon, UserGroupIcon, BuildingLibraryIcon].map((Icon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.08 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg text-center transition"
                >
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {["Devotion", "Authenticity", "Community", "Heritage"][index]}
                  </h3>
                  <p className="text-gray-600">
                    {[
                      "Preserving the sanctity and purity of religious practices.",
                      "Ensuring genuine traditional ceremonies rooted in our faith.",
                      "Building a global community of devotees united by faith.",
                      "Promoting cultural and spiritual heritage for future generations.",
                    ][index]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      {/* Devotee Reviews */}
      <MotionSection>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Devotees Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear the blessings and experiences from our global community.
            </p>
          </div>

          {/* Loader */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center gap-4"
                >
                  <div className="w-24 h-24 bg-gray-300 rounded-full" />
                  <div className="w-32 h-4 bg-gray-300 rounded" />
                  <div className="w-64 h-3 bg-gray-300 rounded" />
                  <div className="w-48 h-3 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-500 text-lg py-8">
              No reviews found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.review_id}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 50 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition relative"
                >
                 <div className="relative w-24 h-24 mx-auto mb-4">
  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full rotate-6" />
  
  {review.reviewUser?.profile_pic_url ? (
    <img
      src={review.reviewUser.profile_pic_url}
      alt={review.reviewUser.username}
      className="relative rounded-full w-full h-full object-cover border-2 border-primary shadow-md"
    />
  ) : (
    <div className="relative w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-4xl font-semibold text-primary">
      {review.reviewUser?.username?.charAt(0).toUpperCase() || "U"}
    </div>
  )}

  {/* ✅ Pop animation + Tooltip for Verified Badge */}
  {review.reviewUser?.otp_verified && (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      title="Verified User" // ✅ Tooltip on hover
      className="absolute -bottom-2 -right-2 bg-blue-500 p-1 rounded-full shadow-md cursor-pointer"
    >
      <svg
        className="w-5 h-5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    </motion.div>
  )}
</div>


                  <p
                    className={`text-gray-600 italic mb-2 ${
                      expandedReviewIds.includes(review.review_id) ? "" : "line-clamp-4"
                    }`}
                  >
                    "{review.review}"
                  </p>

                  {review.review.length > 200 && (
                    <button
                      onClick={() => toggleExpand(review.review_id)}
                      className="text-blue-600 hover:underline text-sm font-medium mt-2"
                    >
                      {expandedReviewIds.includes(review.review_id) ? "View Less" : "View More"}
                    </button>
                  )}

                  {/* 🌟 Star Rating */}
                  <div className="flex justify-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < (review.rating || 0) ? "text-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold mt-3">
                    {review.reviewUser?.username || "Anonymous"}
                  </h3>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </MotionSection>
    </div>
  );
};
