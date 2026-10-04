import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import axios from "axios";

interface ReviewType {
  review_id: number;
  userid: string;
  puja_id: string;
  booking_id: string;
  rating: number;
  review: string;
  uploads_url: string[];
  verified_user: boolean;
  review_verified: boolean;
  created: string;
  updated: string;
  reviewUser?: {
    username: string;
    otp_verified: boolean;
    profile_pic_url?: string;
  };
  reviewedPuja?: {
    puja_name: string;
  };
}

// const fadeInUp = {
//   hidden: { opacity: 0, y: 40 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
//   }),
// };

// const starVariants = {
//   hidden: { scale: 0 },
//   visible: (i: number) => ({
//     scale: 1,
//     transition: { delay: i * 0.1, type: "spring", stiffness: 150 },
//   }),
// };

const UserReviews = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  // const [expandedReviewIds, setExpandedReviewIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchReviews = async () => {
    try {
      // console.log("🔵 BASE_URL:", BASE_URL);

      const res = await axios.get<{ message: string; data: ReviewType[] }>(`${BASE_URL}/reviews/verified-reviews`);

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
     
      fetchReviews();
    }, [BASE_URL]);
   
  // const toggleExpand = (reviewId: number) => {
  //   setExpandedReviewIds((prev) =>
  //     prev.includes(reviewId)
  //       ? prev.filter((id) => id !== reviewId)
  //       : [...prev, reviewId]
  //   );
  // };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
            Divine Experiences Shared
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how our sacred services have touched the hearts of devotees
          </p>
        </motion.div>

 {/* Auto Scroll Single Line Reviews */}
{/* Smooth CSS Marquee Reviews */}
<div className="relative overflow-hidden pt-14 pb-24">
  <div className="marquee">
    <div className="marquee-content">
      {[...reviews, ...reviews].map((review, index) => (
        <div
          key={`${review.review_id}-${index}`}
          className="review-card"
        >
          <div className="flex items-center gap-4 mb-4">
            {review.reviewUser?.profile_pic_url ? (
              <img
                src={review.reviewUser.profile_pic_url}
                alt={review.reviewUser.username || "User"}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gray-300 flex items-center justify-center text-lg font-bold text-white">
                {review.reviewUser?.username
                  ? review.reviewUser.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "U"}
              </div>
            )}

            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {review.reviewUser?.username || "Anonymous"}
              </h3>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? "text-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-base italic leading-relaxed">
            "{review.review}"
          </p>
        </div>
      ))}
    </div>
  </div>
</div>




        {/* Decorative Blur Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full opacity-20 mix-blend-multiply blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-100 rounded-full opacity-20 mix-blend-multiply blur-3xl" />
        </div>
      </div>
    </div>
  );
};
export default UserReviews;
