import { useParams } from "react-router-dom";
import { useState, useEffect, Key } from "react";
import { PujaCard } from "../components/Puja/PujaCard";
import { motion } from "framer-motion";
import { KalkiSevaLoader } from "../components/Loader/KalkiSevaLoader";
import Slider from "react-slick";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { Helmet } from "react-helmet-async";

interface Temples {
  temple_id: number;
  temple_name: string;
  temple_location: string | null;
  temple_description: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
  opening_hours: string | null;
  latitude: number | null;
  longitude: number | null;
  temple_thumbnail: string | null;
  temple_images_url: string[] | null;
  temple_video_url: string[] | null;
  history: string | null;
  history_images_url: string[] | null;
  facilities: string[];
  festivals: string[];
}

interface PujaReview {
  review_id: string;
  rating: number;
}

interface Puja {
  puja_id: string;
  puja_name: string;
  puja_special: string;
  puja_description: string;
  temple_name?: string;
  temple_location?: string;
  puja_thumbnail_url?: string;
  pujaReviews?: PujaReview[];
}

export const TempleDetailsPage = () => {
  const { id } = useParams();
  const [temple, setTemple] = useState<Temples | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // "Book Puja" links open the temple straight on its pujas tab (?tab=pujas)
  const [activeTab, setActiveTab] = useState<string>(
    () => new URLSearchParams(window.location.search).get("tab") || "overview"
  );
  const [templePujas, setTemplePujas] = useState<Puja[]>([]);
  const [pujaLoading, setPujaLoading] = useState<boolean>(true);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchTempleData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/alltemples/getTemple/${id}`);
        if (!response.ok) throw new Error("Failed to fetch temple details");
        const data = await response.json();
        setTemple(data?.data || null);
      } catch (error: unknown) {
        if (error instanceof Error) setError(error.message);
        else setError("Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchTempleData();
  }, [id, BASE_URL]);

useEffect(() => {
  const fetchTemplePujas = async () => {
    try {
      const res = await fetch(`${BASE_URL}/puja/temple/${id}/pujas`);
      if (!res.ok) throw new Error("Failed to fetch assigned pujas");
      const json = await res.json();
      setTemplePujas(json?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setPujaLoading(false);
    }
  };
  if (id) fetchTemplePujas();
}, [id, BASE_URL]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Scroll to the puja list when arriving from a "Book Puja" button
  useEffect(() => {
    if (temple && new URLSearchParams(window.location.search).get("tab") === "pujas") {
      setTimeout(() => document.getElementById("temple-tabs")?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [temple]);

  if (loading) return <KalkiSevaLoader />;
  if (error) return <div>Error: {error}</div>;
  if (!temple) return <div>Temple not found.</div>;

  const sliderSettings = {
    dots: true,
    infinite: (temple.temple_images_url?.length ?? 0) > 1,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6 },
    }),
  };
  const openModal = (url: string, type: "image" | "video") => {
    setSelectedMedia(url);
    setMediaType(type);
  };
  
  const closeModal = () => {
    setSelectedMedia(null);
    setMediaType(null);
  };

  // 👉 Click outside modal background to close
const closeModalOutside = () => {
  setSelectedMedia(null);
  setMediaType(null);
};

// const parseOpeningHours = (raw: string) => {
//   try {
//     // Handle double-quoted string by parsing it
//     const decoded = JSON.parse(raw); // removes outer quotes and escape chars
//     return decoded.split(/\r?\n/).map((line: string) => line.replace('\t', ': '));
//   } catch {
//     // Fallback if not double-encoded
//     return raw.split(/\r?\n/).map(line => line.replace('\t', ': '));
//   }
// };
//   if (!temple.opening_hours) {
//     temple.opening_hours = "No timings available";
//   }



  return (
    <div className="bg-gray-50">
      <Helmet>
  <title>{temple?.temple_name} - Temple Darshan, History & Pujas | Kalki Seva</title>
  <meta
    name="description"
    content={`Explore ${temple?.temple_name}, located at ${temple?.temple_location}. Learn about its history, available pujas, timings, festivals, and facilities. Book darshan or rituals online via Kalki Seva.`}
/>
  <meta
    name="keywords"
    content={`${temple?.temple_name}, Temple Darshan, Online Pujas, Hindu Temples, Festivals, Vedic Rituals, Kalki Seva`}
  />
  <meta name="author" content="Kalki Seva Team" />
  <meta name="robots" content="index, follow" />
</Helmet>
      {/* Hero Section */}
   

<div className="relative h-[60vh] overflow-hidden">
  {/* 🌥 Moving Cloud Background Layer */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-0 w-[200%] h-full bg-[url('/clouds.png')] bg-repeat-x opacity-30 animate-cloudsMove"></div>
  </div>

  {/* 🖼 Hero Slider */}
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
    className="relative z-10"
  >
    <Slider
      {...sliderSettings}
      infinite={!!(temple.temple_images_url && temple.temple_images_url.length > 1)}
      className="w-full"
    >
      {temple.temple_images_url && temple.temple_images_url.length > 0 ? (
        temple.temple_images_url.map((image, index) => (
          <div key={index} className="h-[60vh] overflow-hidden">
            <motion.img
              src={image || "/default-temple-image.jpg"}
              alt={`${temple.temple_name} - Image ${index + 1}`}
              className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-1000 rounded-none"
              initial={{ scale: 1.05 }}
              whileHover={{ scale: 1.1 }}
            />
          </div>
        ))
      ) : (
        <div className="h-[60vh] overflow-hidden">
          <motion.img
            src="/default-temple-image.jpg"
            alt="Temple Image"
            className="w-full h-full object-cover"
            initial={{ scale: 1.05 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      )}
    </Slider>
  </motion.div>

  {/* 🕉 Hero Text Section */}
  <motion.div
    className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center z-20"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    viewport={{ once: true }}
  >
    <div className="text-center text-white px-4">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
      >
        {temple.temple_name}
      </motion.h1>

      <motion.div
        className="flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        viewport={{ once: true }}
      >
        <MapPinIcon className="h-5 w-5 text-white" />
        <p className="text-xl">{temple.temple_location}</p>
      </motion.div>
    </div>
  </motion.div>
</div>


      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
      {/* 🔥 Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="temple-tabs"
        className="flex overflow-x-auto space-x-4 mb-8 pb-2 scrollbar-hide"
      >
        {["overview", "history", "timings", "facilities", "festivals", "pujas"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 ease-in-out transform hover:scale-105 ${
              activeTab === tab ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* 🔥 Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8"
      >
        {/* Overview Tab */}
          {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-4">About the Temple</h2>
           <div className="text-gray-600 space-y-3">
  {temple.temple_description
    ?.split(/\r?\n\r?\n/) // Split into paragraphs by double newlines
    .filter((para) => para.trim() !== "") // Remove empty lines
    .map((para, index) => (
      <p key={index} className="leading-relaxed whitespace-pre-line">
        {para.trim()}
      </p>
    ))}
</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Contact Info */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-primary" />
                    <span>{temple.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GlobeAltIcon className="h-5 w-5 text-primary" />
                    <a href={`https://${temple.website}`} className="text-primary hover:underline">
                      {temple.website}
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Timings */}
 <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Timings</h3>
      <div className="space-y-2 text-gray-600 whitespace-pre-line">
  {(() => {
    let value =
      typeof temple.opening_hours === "string" && temple.opening_hours.trim().startsWith("[")
        ? JSON.parse(temple.opening_hours)[0]
        : temple.opening_hours || "Not available";

    if (typeof value !== "string") return <p>Not available</p>;

    // Decode any escaped sequences and strip all types of quotes
    value = value
      .replace(/^"+|"+$/g, "") // remove leading/trailing quotes (even multiple)
      .replace(/^'+|'+$/g, "") // remove single quotes if present
      .replace(/\\"/g, '"') // unescape internal quotes
      .replace(/"{2,}/g, '"') // collapse double quotes
      .replace(/\\r\\n|\\n|\\r/g, "\n") // handle all newline types
      .replace(/\\\\/g, "\n") // handle double backslashes
      .replace(/\\+/g, "") // remove leftover slashes
      .trim();

    // Remove any stray leading or trailing quotes again
    value = value.replace(/^"+|"+$/g, "").replace(/^'+|'+$/g, "");

    return value
      .split("\n")
      .filter((line: string) => line.trim() !== "")
      .map((line: string, i: Key | null | undefined) => (
        <div key={i} className="flex items-start gap-3">
          <ClockIcon className="h-5 w-5 text-primary mt-1" />
          <p>{line.trim()}</p>
        </div>
      ));
  })()}
</div>




              </motion.div>




            </div>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h2 className="text-2xl font-bold mb-6">Temple History</h2>
    <div className="text-gray-600 space-y-3">
  {temple.history
    ?.split(/\r?\n\r?\n/) // Split into paragraphs by double newlines
    .filter((para: string) => para.trim() !== "") // Ignore empty lines
    .map((para: string, index: number) => (
      <p key={index} className="leading-relaxed whitespace-pre-line">
        {para.trim()}
      </p>
    ))}
</div>

    {/* 📸 Fancy Gallery Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {/* Temple Images */}
      {(temple.temple_images_url ?? []).map((image: string, index: number) => (
        <motion.div
          key={`image-${index}`}
          whileHover={{ scale: 1.05 }}
          className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md"
          onClick={() => openModal(image, "image")}
        >
          <img
            src={image}
            alt={`Temple Image ${index + 1}`}
            className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <p className="text-white font-semibold">View Image</p>
          </div>
        </motion.div>
      ))}

      {/* Temple Videos */}
      {(temple.temple_video_url ?? []).map((videoUrl: string, index: number) => (
        <motion.div
          key={`video-${index}`}
          whileHover={{ scale: 1.05 }}
          className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md"
          onClick={() => openModal(videoUrl, "video")}
        >
          <video
            src={videoUrl}
            className="w-full h-60 object-cover"
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <p className="text-white font-semibold">View Video</p>
          </div>
        </motion.div>
      ))}
    </div>

    {/* ✨ Fancy Modal Viewer */}
    {selectedMedia && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={closeModalOutside}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()} // prevent click inside
          className="relative max-w-4xl w-full p-6"
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-3xl font-bold z-10"
          >
            &times;
          </button>

          {mediaType === "image" ? (
            <img
              src={selectedMedia}
              alt="Selected Temple Media"
              className="w-full max-h-[80vh] rounded-lg object-contain"
            />
          ) : (
            <video
              controls
              src={selectedMedia}
              className="w-full max-h-[80vh] rounded-lg"
            />
          )}
        </motion.div>
      </motion.div>
    )}
  </motion.div>
)}


        {/* Timings Tab */}
        {activeTab === "timings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">Temple Timings</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Daily Timings</h3>
                <div className="space-y-2 text-gray-600 whitespace-pre-line">
  {(() => {
    let value =
      typeof temple.opening_hours === "string" && temple.opening_hours.trim().startsWith("[")
        ? JSON.parse(temple.opening_hours)[0]
        : temple.opening_hours || "Not available";

    if (typeof value !== "string") return <p>Not available</p>;

    // Decode any escaped sequences and strip all types of quotes
    value = value
      .replace(/^"+|"+$/g, "") // remove leading/trailing quotes (even multiple)
      .replace(/^'+|'+$/g, "") // remove single quotes if present
      .replace(/\\"/g, '"') // unescape internal quotes
      .replace(/"{2,}/g, '"') // collapse double quotes
      .replace(/\\r\\n|\\n|\\r/g, "\n") // handle all newline types
      .replace(/\\\\/g, "\n") // handle double backslashes
      .replace(/\\+/g, "") // remove leftover slashes
      .trim();

    // Remove any stray leading or trailing quotes again
    value = value.replace(/^"+|"+$/g, "").replace(/^'+|'+$/g, "");

    return value
      .split("\n")
      .filter((line: string) => line.trim() !== "")
      .map((line: string, i: Key | null | undefined) => (
        <div key={i} className="flex items-start gap-3">
          <ClockIcon className="h-5 w-5 text-primary mt-1" />
          <p>{line.trim()}</p>
        </div>
      ));
  })()}
</div>


              </div>

              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Special Notes</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Timings may vary during festivals and special occasions.</li>
                  <li>Temple remains closed during afternoon rituals.</li>
                  <li>Special Darshan available early mornings.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}



        {/* Facilities Tab */}
        {activeTab === "facilities" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">Temple Facilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {temple.facilities.map((facility: string, index: number) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg text-center">
                  <span className="text-gray-700">{facility}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Festivals Tab */}
        {activeTab === "festivals" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">Important Festivals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {temple.festivals.map((festival: string, index: number) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg text-center">
                  <CalendarIcon className="h-5 w-5 mx-auto text-primary mb-2" />
                  <span className="text-gray-700">{festival}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pujas Tab */}
        {activeTab === "pujas" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">
              Available Pujas at {temple.temple_name}
            </h2>

            {pujaLoading ? (
              <KalkiSevaLoader />
            ) : templePujas.length === 0 ? (
              <p className="text-gray-500">No Pujas Available in this Temple.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {templePujas.map((puja: Puja, index: number) => {
  const ratingCount = puja.pujaReviews?.length || 0;

  const rating =
    ratingCount > 0
      ? puja.pujaReviews!.reduce((sum, review) => sum + review.rating, 0) /
        ratingCount
      : 0;

  return (
    <motion.div
      key={puja.puja_id}
      variants={fadeInUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <PujaCard
        id={puja.puja_id}
        thumbnail={puja.puja_thumbnail_url || "/default-puja.jpg"}
        speciality={puja.puja_special}
        name={puja.puja_name}
        description={puja.puja_description}
        temple={temple.temple_name}
        location={temple.temple_location || ""}
        rating={rating}
        ratingCount={ratingCount}
        loading={false}
      />
    </motion.div>
  );
})}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
    </div>
  );
};
