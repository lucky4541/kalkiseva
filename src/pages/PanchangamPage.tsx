import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, StarIcon, ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import PanchangBanner from '../assets/panchangam.webp';
import axios from 'axios';
import { motion } from "framer-motion";
import Skeleton from 'react-loading-skeleton';
import { Helmet } from 'react-helmet-async';


interface PanchangamData {
  tithi?: { name: string; paksha: string };
  nakshatra?: { name: string };
  yoga?: { [key: string]: { name: string; number: number } };
  karana?: { [key: string]: { name: string; number: number } };
  rahukalam?: { starts_at: string; ends_at: string };
  amrutkalam?: { starts_at: string; ends_at: string };
  abhijitmuhurat?: { starts_at: string; ends_at: string };
  yamagandam?: { starts_at: string; ends_at: string };
  gulikakalam?: { starts_at: string; ends_at: string };
}

interface SunData {
  date: string;
  dawn: string;
  day_length: string;
  dusk: string;
  first_light: string;
  golden_hour: string;
  last_light: string;
  solar_noon: string;
  sunrise: string;
  sunset: string;
  timezone: string;
}
interface MoonData {
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination_percentage: string; // ✅ correct field
}

export const PanchangamPage = () => {
 const [sunData, setSunData] = useState<SunData | null>(null);
  const [panchangamData, setPanchangamData] = useState<PanchangamData | null>(null);
   const [, setLocationError] = useState<string>('');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [moonData, setMoonData] = useState<MoonData | null>(null);
const IPGEO_KEY = import.meta.env.VITE_IPGEO_API_KEY;
  const fetchPanchangam = async () => {
    try {
      const response = await fetch(`${BASE_URL}/panchangam/get-panchang-by-date`);
      const json = await response.json();
      const today = new Date().toISOString().split('T')[0];
      const data = json?.data;
  
      // Match only today's observed date
      if (data?.tithiData?.[0]?.date_observed === today) {
        const tithi = data.tithiData?.[0];
        const nakshatra = data.nakshatraDurations?.[0];
        const yoga = data.yogaDurations?.[0];
        const karana = data.karanaDurations?.[0];
        const rahukalam = data.rahuKalam?.[0];
        const amrutkalam = data.amrit?.[0];
        const abhijit = data.abhijit?.[0];
        const yamagandam = data.yamaGandam?.[0];
        const gulikakalam = data.gulikaKalam?.[0];
  
        setPanchangamData({
          tithi: tithi ? { name: tithi.name, paksha: tithi.paksha } : undefined,
          nakshatra: nakshatra ? { name: nakshatra.name } : undefined,
          yoga: yoga ? { '1': { name: yoga.name, number: yoga.number } } : undefined,
          karana: karana ? { '1': { name: karana.name, number: karana.number } } : undefined,
          rahukalam: rahukalam ? {
            starts_at: rahukalam.startsAt,
            ends_at: rahukalam.endsAt,
          } : undefined,
          amrutkalam: amrutkalam ? {
            starts_at: amrutkalam.startsAt,
            ends_at: amrutkalam.endsAt,
          } : undefined,
          abhijitmuhurat: abhijit ? {
            starts_at: abhijit.startsAt,
            ends_at: abhijit.endsAt,
          } : undefined,
          yamagandam: yamagandam ? {
            starts_at: yamagandam.startsAt,
            ends_at: yamagandam.endsAt,
          } : undefined,
          gulikakalam: gulikakalam ? {
            starts_at: gulikakalam.startsAt,
            ends_at: gulikakalam.endsAt,
          } : undefined,
        });
      } else {
        console.warn('No Panchangam data for today\'s observed date.');
      }
    } catch (err) {
      console.error('Error fetching Panchangam:', err);
    }
  };

const fetchMoonTimings = async (lat: number, long: number) => {
  try {
    const res = await axios.get<{
      moonrise: string;
      moonset: string;
      moon_phase: string;
      moon_illumination_percentage: number | string;
    }>(
      `https://api.ipgeolocation.io/astronomy?apiKey=${IPGEO_KEY}&lat=${lat}&long=${long}`
    );

    const m = res.data; // ✅ correct moon data response

    setMoonData({
      moonrise: m.moonrise || "N/A",
      moonset: m.moonset || "N/A",
      moon_phase: m.moon_phase || "N/A",
      moon_illumination_percentage: m.moon_illumination_percentage
        ? m.moon_illumination_percentage.toString()
        : "0",
    });

  } catch (err) {
    console.error("Moon Fetch Error:", err);
  }
};


  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
const getMoonDayLabel = (time: string): string => {
  if (!time) return currentDay;

  const [hour, min] = time.split(":").map(Number);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const eventMinutes = hour * 60 + min;

  if (eventMinutes < nowMinutes) {
    const next = new Date(now);
    next.setDate(now.getDate() + 1);
    return next.toLocaleDateString("en-IN", { weekday: "long" });
  }

  return currentDay;
};

const fetchSunTimes = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // 🌞 Sun timings
          const response = await axios.get<{ results: SunData }>(
            `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`
          );

          if (response.data?.results) {
            setSunData(response.data.results);
          }

          // 🌙 Fetch Moon also
          fetchMoonTimings(latitude, longitude);

        } catch (error) {
          console.error("Sun API Error:", error);
        }
      },
      (error) => {
        console.error("Location Error:", error.message);
        setLocationError("Location access denied.");
      }
    );
  }
};

const getMoonPhaseIcon = (phase: string) => {
  switch (phase?.toUpperCase()) {
    case "NEW_MOON": return "🌑";
    case "WAXING_CRESCENT": return "🌒";
    case "FIRST_QUARTER": return "🌓";
    case "WAXING_GIBBOUS": return "🌔";
    case "FULL_MOON": return "🌕";
    case "WANING_GIBBOUS": return "🌖";
    case "LAST_QUARTER": return "🌗";
    case "WANING_CRESCENT": return "🌘";
    default: return "🌕";
  }
};

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on mount
    }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // const today = new Date();
  // const formattedDate = today.toLocaleDateString('en-US', {
  //   weekday: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  // });

  // const formattedTime = today.toLocaleTimeString('en-US', {
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   second: '2-digit',
  //   hour12: true,
  // });

  useEffect(() => {
    fetchPanchangam();
    fetchSunTimes();
  }, []);

  const rahuKaalStart = panchangamData?.rahukalam?.starts_at;
  const rahuKaalEnd = panchangamData?.rahukalam?.ends_at;

  const abhijitStart = panchangamData?.abhijitmuhurat?.starts_at;
  const abhijitEnd = panchangamData?.abhijitmuhurat?.ends_at;

  const amrutKaalStart = panchangamData?.amrutkalam?.starts_at;
  const amrutKaalEnd = panchangamData?.amrutkalam?.ends_at;

  const gulikaStart = panchangamData?.gulikakalam?.starts_at;
  const gulikaEnd = panchangamData?.gulikakalam?.ends_at;

  const yamagandamStart = panchangamData?.yamagandam?.starts_at;
  const yamagandamEnd = panchangamData?.yamagandam?.ends_at;

  const amrutKaalStartFormatted = amrutKaalStart ? formatDate(amrutKaalStart) : 'N/A';
  const amrutKaalEndFormatted = amrutKaalEnd ? formatDate(amrutKaalEnd) : 'N/A';

  const rahuKaalStartFormatted = rahuKaalStart ? formatDate(rahuKaalStart) : 'N/A';
  const rahuKaalEndFormatted = rahuKaalEnd ? formatDate(rahuKaalEnd) : 'N/A';

  const abhijitmuhuratStart = abhijitStart ? formatDate(abhijitStart) : 'N/A';
  const abhijitmuhuratEnd = abhijitEnd ? formatDate(abhijitEnd) : 'N/A';



  const gulikakalamStart = gulikaStart ? formatDate(gulikaStart) : 'N/A';
  const gulikakalamEnd = gulikaEnd ? formatDate(gulikaEnd) : 'N/A';

    const yamagandamStartFormat = yamagandamStart ? formatDate(yamagandamStart) : 'N/A';
  const yamagandamEndFormat = yamagandamEnd ? formatDate(yamagandamEnd) : 'N/A';



  const yogaName = panchangamData?.yoga?.["1"]?.name || 'N/A';
  const yogaNumber = panchangamData?.yoga?.["1"]?.number || 'N/A';
   const karanaName = panchangamData?.karana?.["1"]?.name || 'N/A';
  const karanaNumber = panchangamData?.karana?.["1"]?.number || 'N/A';

  


  return (
    <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50">
      <Helmet>
  <title>Panchangam - Daily Vedic Calendar | Kalki Seva</title>
  <meta
    name="description"
    content="Get daily Panchangam details including Tithi, Nakshatra, Yoga, Karana, Rahu Kalam, and auspicious timings. Trusted Vedic calendar by Kalki Seva."
  />
  <meta
    name="keywords"
    content="Panchangam, Daily Panchang, Hindu Calendar, Tithi, Nakshatra, Rahu Kalam, Auspicious Timings, Kalki Seva"
  />
  <meta name="author" content="Kalki Seva Team" />
  <meta name="robots" content="index, follow" />

  <meta property="og:title" content="Daily Panchangam | Kalki Seva" />
  <meta
    property="og:description"
    content="View the complete Vedic Panchangam for today including Tithi, Nakshatra, Muhurat, and more."
  />
  <meta property="og:image" content="/src/assets/og-image.png" />
  <meta property="og:url" content="https://www.kalkiseva.com/panchangam" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Today’s Panchangam - Vedic Calendar | Kalki Seva" />
  <meta
    name="twitter:description"
    content="Check daily Tithi, Nakshatra, Yoga, Karana, and Rahu Kalam timings online at Kalki Seva."
  />
  <meta name="twitter:image" content="/src/assets/twitter-card.png" />
</Helmet>
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={PanchangBanner}
          alt="Panchangam"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="max-w-7xl mx-auto px-4 text-white">
            <h1 className="text-4xl font-bold mb-4">Daily Panchangam</h1>
            <div className="flex items-center text-sm">
              <a href="/" className="hover:text-primary">Home</a>
              <ChevronRightIcon className="h-4 w-4 mx-2" />
              <span>Panchangam</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
  className="bg-white rounded-2xl shadow-xl p-8 mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: false, amount: 0.3 }} // 🔥 animate on scroll down + scroll up
>
  {sunData ? (
    ['sunrise', 'sunset', 'solar_noon', 'golden_hour'].map((key, index) => (
      <motion.div
        key={key}
        className="bg-gradient-to-br from-orange-50 to-yellow-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.2, duration: 0.6 }}
        viewport={{ once: false }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Sun Icon with Rotation */}
        <div className="flex items-center justify-center gap-2 text-amber-600 capitalize mb-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          >
            <SunIcon className="h-6 w-6" />
          </motion.div>
          <span className="text-base font-semibold">
            {key.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Time Display */}
        <p className="text-xl font-bold text-gray-800 tracking-wide">
          {(sunData[key as keyof typeof sunData] as string)?.toUpperCase() || 'N/A'}
        </p>

        {/* Current Day */}
        <p className="text-sm text-gray-500 mt-1">{currentDay}</p>
      </motion.div>
    ))
  ) : (
    Array(4).fill(null).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2, duration: 0.6 }}
        viewport={{ once: false }}
        className="p-6 rounded-xl shadow-md bg-white flex flex-col justify-center items-center"
      >
        <Skeleton circle width={48} height={48} />
        <Skeleton width={80} height={16} className="mt-4" />
        <Skeleton width={100} height={20} className="mt-2" />
        <Skeleton width={60} height={14} className="mt-2" />
      </motion.div>
    ))
  )}
</motion.div>

       
       

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-12">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Basic Information */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
          <div className="space-y-6">
            {[
              {
                icon: <MoonIcon className="h-6 w-6 text-primary" />,
                title: "Tithi & Paksha",
                text: `${panchangamData?.tithi?.name}, ${panchangamData?.tithi?.paksha}`,
              },
              {
                icon: <StarIcon className="h-6 w-6 text-primary" />,
                title: "Nakshatra",
                text: panchangamData?.nakshatra?.name,
              },
              {
                icon: <SunIcon className="h-6 w-6 text-primary" />,
                title: "Yog",
                text: `${yogaName}, ${yogaNumber}`,
              },
              {
                icon: <MoonIcon className="h-6 w-6 text-primary" />,
                title: "Karana",
                text: `${karanaName}, ${karanaNumber}`,
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Moon Timings */}
        <motion.div
  className="bg-white rounded-2xl shadow-lg p-8"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
    Moon Timings
    <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
      Live
    </span>
  </h2>

  {moonData ? (
    <div className="grid grid-cols-2 gap-6">

  {/* 🌙 Moonrise */}
  <div className="text-center p-6 rounded-xl bg-indigo-50">
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      className="mx-auto mb-2"
    >
      <MoonIcon className="h-8 w-8 text-indigo-600 mx-auto" />
    </motion.div>

    <h3 className="font-medium text-gray-900">Moonrise</h3>
    <p className="text-xl font-bold">{moonData.moonrise}</p>
    <p className="text-sm text-gray-500">{getMoonDayLabel(moonData.moonrise)}</p>
  </div>

  {/* 🌙 Moonset */}
  <div className="text-center p-6 rounded-xl bg-purple-50">
    <motion.div
      animate={{ rotate: [0, -360] }}
      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      className="mx-auto mb-2"
    >
      <MoonIcon className="h-8 w-8 text-purple-600 mx-auto" />
    </motion.div>

    <h3 className="font-medium text-gray-900">Moonset</h3>
    <p className="text-xl font-bold">{moonData.moonset}</p>
    <p className="text-sm text-gray-500">{getMoonDayLabel(moonData.moonset)}</p>
  </div>

  {/* 🌝 Moon Phase */}
  <div className="text-center p-6 rounded-xl bg-yellow-50">
    <div className="text-4xl mb-1">{getMoonPhaseIcon(moonData.moon_phase)}</div>
    <h3 className="font-medium text-gray-900">Moon Phase</h3>
    <p className="font-semibold text-gray-700 uppercase">
      {moonData.moon_phase.replace(/_/g, " ")}
    </p>
  </div>

  {/* 💡 Illumination */}
  <div className="text-center p-6 rounded-xl bg-blue-50">
    <div className="text-4xl mb-1">💡</div>
   <h3 className="font-medium text-gray-900">Moon Brightness</h3>
   <p className="text-xl font-bold">
 {moonData.moon_illumination_percentage
  ? `${moonData.moon_illumination_percentage}%`
  : "0%"}

</p>

  </div>

</div>

  ) : (
    <p className="text-gray-500 text-center">Fetching moon data...</p>
  )}
</motion.div>

      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Auspicious Timings */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold mb-6">Auspicious Timings</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Amrit Kaal</h3>
                <p className="text-gray-600">
                  {amrutKaalStartFormatted} - {amrutKaalEndFormatted}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Abhijit Muhurat</h3>
                <p className="text-gray-600">
                  {abhijitmuhuratStart} - {abhijitmuhuratEnd}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Inauspicious Timings */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold mb-6">Inauspicious Timings</h2>
          <div className="space-y-6">
            {[
              {
                label: "Rahu Kaal",
                time: `${rahuKaalStartFormatted} - ${rahuKaalEndFormatted}`,
              },
              {
                label: "Yamaganda Kaal",
                time: `${yamagandamStartFormat} - ${yamagandamEndFormat}`,
              },
              {
                label: "Gulika Kaal",
                time: `${gulikakalamStart} - ${gulikakalamEnd}`,
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                  <p className="text-gray-600">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
      </div>
    </div>
  );
};