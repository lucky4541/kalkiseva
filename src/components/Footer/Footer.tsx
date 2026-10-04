import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import PlayStoreImage from "../../assets/playstore.webp";
import AppStoreImage from "../../assets/AppleStore.webp";
import LogoImage from "../../assets/kalkisevalogo.png"; // ✅ Your Logo here (import your logo file)

export const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-orange-200 to-orange-100 text-white overflow-hidden">
      {/* ✨ Spiritual Floating Background Animations */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 opacity-10 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-400 via-green-400 to-purple-400 opacity-10 rounded-full animate-pulse-slow delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* 🪔 About Section */}
          <div>
            <img src={LogoImage} alt="Kalki Seva Logo" className="h-16 mb-6" />
            <p className="text-black leading-relaxed">
              Kalki Seva is India's leading platform for authentic Puja
              bookings, connecting devotees with temples, priests, and sacred
              experiences across INDIA.
            </p>
          </div>

          {/* 🔗 Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-black">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Pujas", href: "/pujas" },
                { name: "Panchangam", href: "/panchangam" },
              ].map((link, idx) => (
                <li key={idx}>
                  <motion.a
                    href={link.href}
                    whileHover={{ scale: 1.05 }}
                    className="text-black hover:text-white transition"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* 📞 Contact Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-black">Contact</h3>
            <ul className="space-y-4 text-black">
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-primary" />
                +91 8207206644
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="h-5 w-5 text-primary" />
                support@kalkiseva.com
              </li>
              <li className="flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 text-primary" />
                Sahapur, Malda, West Bengal - 732142
              </li>
            </ul>
          </div>

          {/* 📱 Get the App */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-black">Get the App</h3>
            <p className="text-black mb-4">Experience Kalki Seva on mobile</p>
            <div className="flex gap-4">
              <motion.a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="block"
              >
                <img src={PlayStoreImage} alt="Google Play" className="h-12" />
              </motion.a>
              <motion.a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="block"
              >
                <img src={AppStoreImage} alt="App Store" className="h-12" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* 🧘‍♂️ Footer Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm"
        >
          <p className="text-black">
            &copy; {new Date().getFullYear()} Kalki Seva. All rights reserved.
          </p>
          <p className="mt-2 text-black">
            Designed & Maintained by{" "}
            <a
              href="https://syncronicit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-bold"
            >
              Syncronic IT Solutions Pvt. Ltd.
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
