import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  StarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface PanchangamData {
  tithi?: { name: string; paksha: string; completes_at: string };
  nakshatra?: { name: string; starts_at: string; ends_at: string };
  yoga?: { name: string; number: number };
  karana?: { name: string; number: number };
  rahukalam?: { starts_at: string; ends_at: string };
  amrutkalam?: { starts_at: string; ends_at: string };
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
  moon_altitude: string;
  moon_distance: string;
  moon_azimuth: string;
  moon_parallactic_angle: string;
  moon_phase: string;
  moon_illumination: string;
}


const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const skeletonVariants = {
  hidden: { opacity: 0.3 },
  visible: { opacity: 0.8 },
};

const SkeletonLoader = () => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={skeletonVariants}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    className="space-y-4 bg-white p-8 rounded-2xl shadow-lg border border-orange-100"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="h-12 w-12 rounded-xl bg-gray-200 animate-pulse"></div>
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="space-y-2">
      <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </motion.div>
);

const PanchangamSection = () => {
  const navigate = useNavigate();
  const [sunData, setSunData] = useState<SunData | null>(null);
  const [panchangamData, setPanchangamData] = useState<PanchangamData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [, setLocationError] = useState<string>("");
  const IPGEO_KEY = import.meta.env.VITE_IPGEO_API_KEY;

const [moonData, setMoonData] = useState<MoonData | null>(null);


  const formatDate = (dateString?: string): string => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "N/A";
    return new Date(dateString)
      .toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  const formatDateWithTime = (dateString?: string): string => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "N/A";
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timePart = date
      .toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
    return `${datePart} - ${timePart}`;
  };

const fetchMoonTimings = async (latitude: number, longitude: number) => {
  try {
    const res = await axios.get<{
      moonrise: string;
      moonset: string;
      moon_altitude: string;
      moon_distance: string;
      moon_azimuth: string;
      moon_parallactic_angle: string;
      moon_phase: string;
      moon_illumination: string;
    }>(
      `https://api.ipgeolocation.io/astronomy?apiKey=${IPGEO_KEY}&lat=${latitude}&long=${longitude}`
    );

    const m = res.data;

    setMoonData({
      moonrise: m.moonrise,
      moonset: m.moonset,
      moon_altitude: m.moon_altitude,
      moon_distance: m.moon_distance,
      moon_azimuth: m.moon_azimuth,
      moon_parallactic_angle: m.moon_parallactic_angle,
      moon_phase: m.moon_phase,
      moon_illumination: m.moon_illumination
    });

    console.log("🌙 Moon Data:", m);
  } catch (err) {
    console.error("❌ Moon API Error:", err);
  }
};


  const fetchPanchangam = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/panchangam/get-panchang-by-date`
      );
      const json = await response.json();
      const data = json.data;

      const tithi = data.tithiData?.[0];
      const nakshatra = data.nakshatraDurations?.[0];
      const yoga = data.yogaDurations?.[0];
      const karana = data.karanaDurations?.[0];
      const rahukalam = data.rahuKalam?.[0];
      const amrutkalam = data.amrit?.[0];

      setPanchangamData({
        tithi: tithi
          ? {
              name: tithi.name,
              paksha: tithi.paksha,
              completes_at: tithi.completes_at,
            }
          : undefined,
        nakshatra: nakshatra
          ? {
              name: nakshatra.name,
              starts_at: nakshatra.starts_at,
              ends_at: nakshatra.ends_at,
            }
          : undefined,
        yoga: yoga
          ? {
              name: yoga.name,
              number: yoga.number,
            }
          : undefined,
        karana: karana
          ? {
              name: karana.name,
              number: karana.number,
            }
          : undefined,
        rahukalam: rahukalam
          ? {
              starts_at: rahukalam.startsAt,
              ends_at: rahukalam.endsAt,
            }
          : undefined,
        amrutkalam: amrutkalam
          ? {
              starts_at: amrutkalam.startsAt,
              ends_at: amrutkalam.endsAt,
            }
          : undefined,
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching Panchangam:", err);
      setIsLoading(false);
    }
  };

  // const fetchSunTimes = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  //         try {
  //           const response = await axios.get<{
  //             results: { [key: string]: string };
  //           }>(
  //             `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`
  //           );
  //           if (response.data?.results) {
  //             setSunData({
  //               date: response.data.results.date,
  //               dawn: response.data.results.dawn,
  //               day_length: response.data.results.day_length,
  //               dusk: response.data.results.dusk,
  //               first_light: response.data.results.first_light,
  //               golden_hour: response.data.results.golden_hour,
  //               last_light: response.data.results.last_light,
  //               solar_noon: response.data.results.solar_noon,
  //               sunrise: response.data.results.sunrise,
  //               sunset: response.data.results.sunset,
  //               timezone: response.data.results.timezone,
  //             });
  //             console.log("🌞 All Sun Timing Info:", response.data.results);
  //           }
  //         } catch (error) {
  //           console.error("❌ Error fetching sun data:", error);
  //         }
  //       },
  //       (error) => {
  //         console.error("❌ Error getting location:", error.message);
  //         setLocationError("Location access denied or unavailable.");
  //       }
  //     );
  //   } else {
  //     setLocationError("Geolocation is not supported by this browser.");
  //   }
  // };

const fetchSunTimes = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        console.log("📍 User Location:", latitude, longitude);

        try {
          // Fetch Sun timings
          const response = await axios.get<{ results: SunData }>(
            `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`
          );

          if (response.data && response.data.results) {
            setSunData(response.data.results);
          }

          // ✅ Fetch Moon Timings also
          fetchMoonTimings(latitude, longitude);

        } catch (error) {
          console.error("❌ Error fetching sun data:", error);
        }
      },
      (error) => {
        console.error("❌ Error getting location:", error.message);
        setLocationError("Location access denied or unavailable.");
      }
    );
  } else {
    setLocationError("Geolocation is not supported by this browser.");
  }
};


  useEffect(() => {
    fetchPanchangam();
    fetchSunTimes();
  }, [BASE_URL]);

  const currentDay = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
  });

  const rahuKaalFormatted = panchangamData?.rahukalam
    ? `${formatDate(panchangamData.rahukalam.starts_at)} - ${formatDate(
        panchangamData.rahukalam.ends_at
      )}`
    : "N/A";

  const amrutKaalFormatted = panchangamData?.amrutkalam
    ? `${formatDate(panchangamData.amrutkalam.starts_at)} - ${formatDate(
        panchangamData.amrutkalam.ends_at
      )}`
    : "N/A";

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date()
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
    const getMoonsetDayLabel = (moonset: string): string => {
  if (!moonset) return currentDay;

  const [setHour, setMin] = moonset.split(":").map(Number);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const setMinutes = setHour * 60 + setMin;

  // If moonset occurs earlier than current time → it's next day
  if (setMinutes < nowMinutes) {
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + 1);

    return nextDay.toLocaleDateString("en-IN", { weekday: "long" });
  }

  return currentDay;
};

const getMoonPhaseIcon = (phase: string) => {
  switch (phase.toUpperCase()) {
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
// const moonCycle = [
//   { phase: "NEW_MOON", icon: "🌑" },
//   { phase: "WAXING_CRESCENT", icon: "🌒" },
//   { phase: "FIRST_QUARTER", icon: "🌓" },
//   { phase: "WAXING_GIBBOUS", icon: "🌔" },
//   { phase: "FULL_MOON", icon: "🌕" },
//   { phase: "WANING_GIBBOUS", icon: "🌖" },
//   { phase: "LAST_QUARTER", icon: "🌗" },
//   { phase: "WANING_CRESCENT", icon: "🌘" },
// ];


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 py-24"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
          >
            Daily Muhurat
          </motion.span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Today's Panchangam
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="block text-primary text-lg font-normal mt-2"
            >
              {formattedDate} - {formattedTime}
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Plan your spiritual activities according to the most auspicious
            timings.
          </motion.p>
        </motion.div>
{/* 🌙 MOON TIMINGS SECTION — Same style as Sun block */}


<motion.div
  className="bg-white rounded-2xl shadow-xl p-8 mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: false, amount: 0.3 }}
>
  {sunData && moonData ? (
    [
      {
        key: "sunrise",
        label: "Sunrise",
        icon: SunIcon,
        value: sunData.sunrise,
      },
      {
        key: "sunset",
        label: "Sunset",
        icon: SunIcon,
        value: sunData.sunset,
      },
      {
        key: "moonrise",
        label: `Moonrise ${getMoonPhaseIcon(moonData.moon_phase)}`,
        icon: MoonIcon,
        value: moonData.moonrise,
      },
      {
        key: "moonset",
        label: `Moonset ${getMoonPhaseIcon(moonData.moon_phase)}`,
        icon: MoonIcon,
        value: moonData.moonset,
      },
    ].map((item, index) => (
      <motion.div
        key={item.key}
        className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 text-center ${
          item.key.includes("sun")
            ? "bg-gradient-to-br from-orange-50 to-yellow-100"
            : "bg-gradient-to-br from-indigo-50 to-purple-100"
        }`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        viewport={{ once: false }}
        whileHover={{ scale: 1.05 }}
      >
        {/* ICON + LABEL */}
        <div className="flex items-center justify-center gap-2 text-gray-700 capitalize mb-2 relative">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="relative"
          >
            <div
              className={`absolute -inset-2 rounded-full opacity-20 blur-lg ${
                item.key.includes("sun") ? "bg-amber-300" : "bg-indigo-300"
              }`}
            ></div>

            <item.icon className="h-6 w-6 relative z-10" />
          </motion.div>

          <span className="text-base font-semibold">{item.label}</span>
        </div>

        {/* VALUE */}
        <p className="text-xl font-bold text-gray-800 tracking-wide">
          {item.value || "N/A"}
        </p>

        {/* DAY LABEL */}
        <p className="text-sm text-gray-500 mt-1">
          {item.key === "moonset"
            ? getMoonsetDayLabel(moonData.moonset)
            : currentDay}
        </p>
      </motion.div>
    ))
  ) : (
    Array(4)
      .fill(0)
      .map((_, i) => (
        <motion.div
          key={i}
          className="bg-gray-100 p-6 rounded-xl flex flex-col items-center justify-center gap-3 h-[150px]"
        >
          <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-gray-300 rounded-md animate-pulse" />
          <div className="h-5 w-32 bg-gray-300 rounded-md animate-pulse" />
        </motion.div>
      ))
  )}
</motion.div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, index) => <SkeletonLoader key={index} />)
            : [
                {
                  title: "Tithi & Paksha",
                  value: (
                    <div>
                      <div className="text-lg font-medium">
                        {panchangamData?.tithi?.name} (
                        {panchangamData?.tithi?.paksha})
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Ends At:{" "}
                        {formatDateWithTime(
                          panchangamData?.tithi?.completes_at
                        )}
                      </div>
                    </div>
                  ),
                  icon: MoonIcon,
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  title: "Nakshatra",
                  value: (
                    <div>
                      <div className="text-lg font-medium">
                        {panchangamData?.nakshatra?.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {formatDate(panchangamData?.nakshatra?.starts_at)} to{" "}
                        {formatDate(panchangamData?.nakshatra?.ends_at)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Ends At:{" "}
                        {formatDateWithTime(panchangamData?.nakshatra?.ends_at)}
                      </div>
                    </div>
                  ),
                  icon: StarIcon,
                  color: "bg-purple-50 text-purple-600",
                },
                {
                  title: "Yoga",
                  value: `${panchangamData?.yoga?.name || "N/A"} (${
                    panchangamData?.yoga?.number || "N/A"
                  })`,
                  icon: SunIcon,
                  color: "bg-amber-50 text-amber-600",
                },
                {
                  title: "Karana",
                  value: `${panchangamData?.karana?.name || "N/A"} (${
                    panchangamData?.karana?.number || "N/A"
                  })`,
                  icon: StarIcon,
                  color: "bg-green-50 text-green-600",
                },
                {
                  title: "Rahu Kaal",
                  value: (
                    <div>
                      {rahuKaalFormatted}
                      <div className="text-sm text-gray-600 mt-1">
                        Ends At:{" "}
                        {formatDateWithTime(panchangamData?.rahukalam?.ends_at)}
                      </div>
                    </div>
                  ),
                  icon: ClockIcon,
                  color: "bg-red-50 text-red-600",
                },
                {
                  title: "Amrit Kaal",
                  value: (
                    <div>
                      {amrutKaalFormatted}
                      <div className="text-sm text-gray-600 mt-1">
                        Ends At:{" "}
                        {formatDateWithTime(
                          panchangamData?.amrutkalam?.ends_at
                        )}
                      </div>
                    </div>
                  ),
                  icon: ClockIcon,
                  color: "bg-indigo-50 text-indigo-600",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="offscreen"
                  whileInView="onscreen"
                  viewport={{ once: true, amount: 0.2 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 group cursor-pointer"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`p-3 rounded-xl ${item.color} transition-transform duration-300`}
                    >
                      <item.icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                 <motion.div
  className="text-lg text-gray-700 font-medium"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2 }}
>
  {item.value || "N/A"}
</motion.div>
                  <div className="text-sm text-gray-600 mt-2">{currentDay}</div>
                </motion.div>
              ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            onClick={() => navigate("/panchangam")}
            className="inline-block px-6 py-3 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Full Panchangam
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default PanchangamSection;
