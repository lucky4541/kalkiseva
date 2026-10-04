/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useEffect, useState } from "react";
import { Hero } from "../components/Hero/Hero";
import { TempleCard } from "../components/Temples/TempleCard";
import { PujaCard } from "../components/Puja/PujaCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";


const LazyQuotesSection = React.lazy(() => import("../components/Spiritual/QuotesSection"));
const LazyBookingSteps = React.lazy(() => import("../components/BookingSteps/BookingSteps"));
const LazyAboutSection = React.lazy(() => import("../components/About/AboutSection"));
const LazyUserReviews = React.lazy(() => import("../components/Reviews/UserReviews"));
const LazyMarketing = React.lazy(() => import("../components/About/Marketing"));
const LazyFeedback = React.lazy(() => import("../components/About/feedback"));
const LazySpiritualSteps = React.lazy(() => import("../components/About/Spritualsteps"));
const LazyTestimonials = React.lazy(() => import("../components/About/Testmonies"));
const LazyWhyChoose = React.lazy(() => import("../components/About/Whychoose"));
const LazyServiceHighlight = React.lazy(() => import("../components/About/ServiceHighlight"));
const LazyPromotionalSection = React.lazy(() => import("../components/Promotional/PromotionalSection"));
const LazyPanchangamSection = React.lazy(() => import("../components/Panchangam/PanchangamSection"));

interface Puja {
  puja_id: string;
  puja_name: string;
  puja_special?: string;
  puja_description?: string;
  temple_name?: string;
  temple_location?: string;
  puja_thumbnail_url?: string;
  total_rating?: number;
  reviews_count?: number;
}

interface Temple {
  temple_id: string;
  temple_name: string;
  temple_location: string;
  temple_thumbnail: string;
}

export const HomePage = () => {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loadingTemples, setLoadingTemples] = useState(true);
  const [loadingPujas, setLoadingPujas] = useState(true);
  const [errorTemples, setErrorTemples] = useState("");
  const [errorPujas, setErrorPujas] = useState("");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await fetch(`${BASE_URL}/alltemples/getAllTemples`);
        if (!response.ok) throw new Error("Failed to fetch Temples");
        const data = await response.json();
        const activeTemples = (data.data || []).filter((temple: any) => temple.status === "active");
        setTemples(activeTemples.slice(0, 3));
      } catch (error: any) {
        setErrorTemples(error.message || "An unknown error occurred");
      } finally {
        setLoadingTemples(false);
      }
    };

    fetchTemples();
  }, [BASE_URL]);

  useEffect(() => {
    const fetchPujas = async () => {
      try {
        const response = await fetch(`${BASE_URL}/puja/pujaget`);
        if (!response.ok) throw new Error("network-error");
        const data = await response.json();
        const latestPujas = (data.data || []).slice(0, 3);
        setPujas(latestPujas);
      } catch (error: any) {
        setErrorPujas(error.message || "An unknown error occurred");
      } finally {
        setLoadingPujas(false);
      }
    };

    fetchPujas();
  }, [BASE_URL]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <>
    
    <Helmet>
  <title>Kalki Seva - Book Online Puja Services, Temple Darshan & Vedic Rituals</title>
  <meta name="description" content="Kalki Seva offers online puja services, temple darshan bookings, and Vedic rituals performed by experienced priests. Book Satyanarayan Puja, Griha Pravesh, Lakshmi Puja, and more with ease and devotion." />
  <meta name="keywords" content="Kalki Seva, Puja Booking, Temple Services, Online Puja, Hindu Rituals, Astrology Services, Indian Traditions, Vedic Pujas, Spiritual Services" />
  <meta name="author" content="Kalki Seva Team" />
  <meta name="robots" content="index, follow" />
  <meta property="og:title" content="Kalki Seva - Book Pujas & Temple Services Online" />
  <meta property="og:description" content="Book pujas, temple visits, astrology consultations and more through Kalki Seva's trusted and divine online platform." />
  <meta property="og:image" content="/src/assets/og-image.png" />
  <meta property="og:url" content="https://www.kalkiseva.com" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Kalki Seva - Your Gateway to Divine Services" />
  <meta name="twitter:description" content="Experience seamless online puja booking and spiritual services through Kalki Seva." />
  <meta name="twitter:image" content="/src/assets/twitter-card.png" />
</Helmet>

<Hero />



      {/* Static Intro Section with LCP Element */}
      <section className="pt-6 pb-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">🌟 Temples</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto sm:mx-0 leading-relaxed">
            Discover a curated list of temples and explore their deep-rooted spiritual significance.
          </p>
        </div>
      </section>

      {/* Temple Cards */}
      <section className="pb-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {loadingTemples ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white shadow rounded-lg p-4 animate-pulse">
                  <div className="h-40 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : errorTemples ? (
            <div className="text-center text-red-500">{errorTemples}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {temples.map((temple, index) =>
                index === 0 ? (
                  <TempleCard
                    key={temple.temple_id}
                    id={temple.temple_id}
                    image={temple.temple_thumbnail || "/default-temple.jpg"}
                    name={temple.temple_name}
                    location={temple.temple_location}
                  />
                ) : (
                  <motion.div
                    key={temple.temple_id}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    custom={index}
                  >
                    <TempleCard
                      id={temple.temple_id}
                      image={temple.temple_thumbnail || "/default-temple.jpg"}
                      name={temple.temple_name}
                      location={temple.temple_location}
                    />
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Puja Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 text-center sm:text-left">
            <div className="w-full sm:w-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                🔱 Popular Pujas
              </h2>
              <p className="text-base text-gray-600 max-w-xl mx-auto sm:mx-0">
                Book these sacred pujas performed by experienced priests for your well-being and spiritual prosperity.
              </p>
            </div>

            <div className="mt-6 sm:mt-0">
              <button
                onClick={() => navigate("/pujas")}
                className="bg-primary text-white px-5 py-2 rounded-md hover:bg-primary-dark transition-all"
              >
                View All Pujas
              </button>
            </div>
          </div>

          {loadingPujas ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => <PujaCard key={i} loading />)}
            </div>
          ) : errorPujas ? (
            <div className="text-center text-red-500">{errorPujas}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pujas.map((puja, index) =>
                index === 0 ? (
                  <PujaCard
                    key={puja.puja_id}
                    id={puja.puja_id}
                    rating={puja.total_rating || 0}
                    ratingCount={puja.reviews_count || 0}
                    thumbnail={puja.puja_thumbnail_url || "/default-thumbnail.jpg"}
                    speciality={puja.puja_special || "N/A"}
                    name={puja.puja_name || "Unnamed Puja"}
                    description={puja.puja_description || "No description available"}
                    temple={puja.temple_name || "Unknown Temple"}
                    location={puja.temple_location || "Unknown Location"}
                  />
                ) : (
                  <motion.div
                    key={puja.puja_id}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    custom={index}
                  >
                    <PujaCard
                      id={puja.puja_id}
                      rating={puja.total_rating || 0}
                      ratingCount={puja.reviews_count || 0}
                      thumbnail={puja.puja_thumbnail_url || "/default-thumbnail.jpg"}
                      speciality={puja.puja_special || "N/A"}
                      name={puja.puja_name || "Unnamed Puja"}
                      description={puja.puja_description || "No description available"}
                      temple={puja.temple_name || "Unknown Temple"}
                      location={puja.temple_location || "Unknown Location"}
                    />
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lazy-loaded sections below the fold */}
      <Suspense fallback={<div />}>
        <LazyPanchangamSection />
        <LazyQuotesSection />
        <LazyBookingSteps />
        <LazyAboutSection />
        <LazyUserReviews />
        <LazyMarketing />
        <LazyFeedback />
        <LazySpiritualSteps />
        <LazyServiceHighlight />
        <LazyTestimonials />
        <LazyWhyChoose />
        <LazyPromotionalSection />
      </Suspense>
    </>
  );
};
