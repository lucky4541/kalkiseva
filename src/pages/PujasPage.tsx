import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import pujaBanner from "../assets/pujabanner.webp"; // Banner Image
import { AnimatePresence, motion } from "framer-motion";
import { KalkiSevaLoader } from "../components/Loader/KalkiSevaLoader";
import { Helmet } from "react-helmet-async";

const spiritualTexts = [
  "Sacred Pujas & Rituals",
  "Experience Divine Blessings",
  "Invoke Positivity & Prosperity",
  "Traditional Vedic Offerings",
  "Seek Peace & Spiritual Enlightenment",
];

const spiritualDescriptions = [
  "Experience divine blessings through traditional pujas performed by experienced priests.",
  "Embark on a sacred journey towards peace and spiritual growth.",
  "Participate in rituals that attract good fortune and well-being.",
  "Honor the divine with ancient rituals performed by expert priests.",
  "Find inner peace through sacred ceremonies and prayers.",
];

interface Puja {
  puja_id: string;
  puja_name: string;
  puja_special?: string;
  puja_description?: string;
  temple_name?: string;
  temple_location?: string;
  puja_thumbnail_url?: string;
  rating?: string | number;
  reviews?: Array<{ rating: number; review: string }>;
  total_rating?: number;
  reviews_count?: number;
  packages: Array<{
    package_id: string;
    package_name: string;
    package_description?: string;
    number_of_devotees: number;
    price: string;
    puja_date: string;
    features: string[];
  }>;
  puja_dates: string[];
  media: {
    image_urls: string[];
    video_urls: string[];
  };
}

export const PujasPage = () => {
  const navigate = useNavigate();
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [visiblePujas, setVisiblePujas] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPujas = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${BASE_URL}/puja/pujaget`);
    const data = await response.json();
    setPujas(data.data); // directly assign
  } catch (error: unknown) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Failed to fetch pujas");
    }
  } finally {
    setLoading(false);
  }
};

    fetchPujas();
  }, [BASE_URL]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Rotate banner text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % spiritualTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMore = () => {
    setVisiblePujas((prev) => Math.min(prev + 4, pujas.length));
  };

  const handleBookPuja = (puja_id: string, puja_name: string) => {
    navigate(`/puja/${puja_id}?name=${puja_name}`);
  };

  const getAverageRating = (reviews: Array<{ rating: number }>) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return total / reviews.length;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
  <title>All Pujas - Kalki Seva | Explore Vedic Rituals & Book Online</title>
  <meta name="description" content="Explore all available Vedic Pujas at Kalki Seva. Book Satyanarayan Puja, Griha Pravesh, Lakshmi Puja, and more with our trusted platform for spiritual services." />
  <meta name="keywords" content="All Pujas, Online Puja Booking, Hindu Rituals, Vedic Pujas, Kalki Seva, Puja Services" />
  <meta name="author" content="Kalki Seva Team" />
  <meta name="robots" content="index, follow" />


  <meta property="og:title" content="All Pujas - Kalki Seva" />
  <meta property="og:description" content="Discover and book a wide range of Vedic rituals through Kalki Seva's online puja booking platform." />
  <meta property="og:image" content="/src/assets/og-image.png" />
  <meta property="og:url" content="https://www.kalkiseva.com/pujas" />
  <meta property="og:type" content="website" />

  <link rel="canonical" href="https://www.kalkiseva.com/pujas" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="All Pujas - Kalki Seva" />
  <meta name="twitter:description" content="Explore and book various Hindu pujas and rituals online through Kalki Seva." />
  <meta name="twitter:image" content="/src/assets/twitter-card.png" />
</Helmet>

      {/* 🔥 Promotional Banner */}
      <div className="relative h-[300px] overflow-hidden">
        <img src={pujaBanner} alt="Puja Services" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 1.2 }}
                >
                  <h1 className="text-4xl font-extrabold text-white drop-shadow-md">{spiritualTexts[index]}</h1>
                  <p className="text-lg text-white/90">{spiritualDescriptions[index]}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 Pujas Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <KalkiSevaLoader />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {pujas.slice(0, visiblePujas).map((puja) => {
              const rating = getAverageRating(puja.reviews || []);
              return (
                <motion.div
                  key={puja.puja_id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={puja.puja_thumbnail_url || "/default-thumbnail.jpg"}
                    alt={puja.puja_name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 text-sm bg-primary/10 text-primary rounded-md">
                      {puja.puja_special || "Special Puja"}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold">{puja.puja_name}</h3>
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {puja.puja_description || "No description available"}
                    </p>
                    <div className="mt-4">
                      <p className="font-medium">{puja.temple_name || "Unknown Temple"}</p>
                      <p className="text-sm text-gray-500">{puja.temple_location || "Unknown Location"}</p>
                    </div>
                    <div className="mt-4 flex items-center">
                      <div className="flex">{renderStars(rating)}</div>
                     <span className="ml-2 text-gray-500 text-sm">
  {puja.total_rating?.toFixed(1) || "0.0"} / {puja.reviews_count || 0} {puja.reviews_count === 1 ? "review" : "reviews"}
</span>

                    </div>
                    <button
                      onClick={() => handleBookPuja(puja.puja_id, puja.puja_name)}
                      className="mt-4 w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                    >
                      Book Puja
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* 🔥 Load More Button */}
        {visiblePujas < pujas.length && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={loadMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Load More
              <ChevronDownIcon className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
