import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TopBar } from './components/Header/TopBar';
import { Navigation } from './components/Header/Navigation';
import { HomePage } from './pages/HomePage';
import { TempleDetailsPage } from './pages/TempleDetailsPage';
import { PujaDetailsPage } from './pages/PujaDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './components/Account/Profile';
import { PanchangamPage } from './pages/PanchangamPage';
import { Footer } from './components/Footer/Footer';
import { PujasPage } from './pages/PujasPage';
import { RefundPage } from './pages/RefundPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ShippingPage } from './pages/ShippingPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import Bookings from './components/Account/Bookings';
import HelpPage from './components/Account/Help';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { BookingFailurePage } from './pages/BookingFailurePage';
import { KalkiSevaLoader } from './components/Loader/KalkiSevaLoader';
import { useEffect, useState } from 'react';
import BookingDetails from './pages/BookingDetails';

import { BookingStatusPage } from './pages/BookingStatusPage';
import { PaymentStatusPage } from './pages/PaymentStatusPage';
import SessionExpired from './pages/SessionExpired';
import OmMusic from './components/OmMusic';
import TempleVisitPopup from './components/TempleVisitPopup';




function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 2 seconds (you can adjust this)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <Router>
      {loading ? (
        <KalkiSevaLoader />
      ) : (
        <div className="min-h-screen">
           <OmMusic />
           
          <header className="fixed top-0 left-0 right-0 z-50 bg-white">
            <TopBar />
            <Navigation />
          </header>
<TempleVisitPopup />
          <main className="pt-24">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/temple/:id/" element={<TempleDetailsPage />} />
              <Route path="/pujas" element={<PujasPage />} />
              <Route path="/puja/:id" element={<PujaDetailsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/panchangam" element={<PanchangamPage />} />
              <Route path="/refundpolicy" element={<RefundPage />} />
              <Route path="/privacypolicy" element={<PrivacyPage />} />
              <Route path="/shippingpolicy" element={<ShippingPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/payment-status/:orderId" element={<PaymentStatusPage />} />
              <Route path="/booking-success/:bookingId" element={<BookingSuccessPage />} />
              <Route path="/booking-failure/:bookingId" element={<BookingFailurePage />} />
              <Route path="/booking/:bookingId" element={<BookingDetails />} />

              <Route path="/booking-status/:bookingId" element={<BookingStatusPage />} />
              <Route path="/session-expired" element={<SessionExpired />} />


            
            </Routes>
          </main>

          <Footer />
        </div>
      )}
    </Router>
  );
}

export default App;