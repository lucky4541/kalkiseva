// import { useEffect, useRef } from "react";

// export const TopBar = () => {
//   const textRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const textElement = textRef.current;
//     const containerElement = containerRef.current;

//     if (!textElement || !containerElement) return;

//     let animationFrameId: number;
//     let offset = containerElement.offsetWidth;

//     const speed = 0.7; // Smaller = slower

//     const scroll = () => {
//       if (!textElement || !containerElement) return;

//       offset -= speed;
//       if (offset < -textElement.offsetWidth) {
//         offset = containerElement.offsetWidth;
//       }
//       textElement.style.transform = `translateX(${offset}px)`;
//       animationFrameId = requestAnimationFrame(scroll);
//     };

//     animationFrameId = requestAnimationFrame(scroll);

//     return () => cancelAnimationFrame(animationFrameId);
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className="bg-primary overflow-hidden relative w-full h-12 flex items-center"
//     >
//       <div
//         ref={textRef}
//         className="whitespace-nowrap font-semibold tracking-wide text-white text-sm px-4"
//         style={{ willChange: "transform" }}
//       >
//         🕉️ Welcome to Kalki Seva - Experience Divine Blessings and Spiritual Guidance, 🌸 Explore our Online Puja Booking Services for Your Spiritual Needs, 🌺 Connect with Experienced Priests for Personalized Guidance, 🙏 Experience the Power of Traditional Pujas, Performed with Devotion, ✨ Book Your Puja Online, Anytime, Anywhere with Kalkiseva! 🌟
//       </div>
//     </div>
//   );
// };




// import { useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ Needed for navigation

// export const TopBar = () => {
//   const textRef = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate(); // ✅ Initialize navigation

//   useEffect(() => {
//     const textElement = textRef.current;
//     const containerElement = containerRef.current;

//     if (!textElement || !containerElement) return;

//     let animationFrameId: number;
//     let offset = containerElement.offsetWidth;

//     const speed = 0.5; // Adjust speed here

//     const scroll = () => {
//       if (!textElement || !containerElement) return;

//       offset -= speed;
//       if (offset < -textElement.offsetWidth) {
//         offset = containerElement.offsetWidth;
//       }
//       textElement.style.transform = `translateX(${offset}px)`;
//       animationFrameId = requestAnimationFrame(scroll);
//     };

//     animationFrameId = requestAnimationFrame(scroll);

//     return () => cancelAnimationFrame(animationFrameId);
//   }, []);

//   const handleClick = () => {
//     // ✅ Redirect to special offers or pujas page
//     navigate("/special-offers"); 
//     // (You can change the URL to /pujas or /about-us depending on where you want)
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="bg-primary overflow-hidden relative w-full h-12 flex items-center cursor-pointer"
//       onClick={handleClick} // ✅ Make the entire bar clickable
//     >
//       <div
//         ref={textRef}
//         className="whitespace-nowrap font-semibold tracking-wide text-white text-sm px-4"
//         style={{ willChange: "transform" }}
//       >
//         🕉️ Welcome to Kalki Seva - Experience Divine Blessings and Spiritual Guidance, 🌸 Explore our Online Puja Booking Services for Your Spiritual Needs, 🌺 Connect with Experienced Priests for Personalized Guidance, 🙏 Experience the Power of Traditional Pujas, Performed with Devotion, ✨ Book Your Puja Online, Anytime, Anywhere with Kalkiseva! 🌟
//       </div>
//     </div>
//   );
// };


import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const TopBar = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const textElement = textRef.current;
    const containerElement = containerRef.current;

    if (!textElement || !containerElement) return;

    let animationFrameId: number;
    let offset = containerElement.offsetWidth;

    const speed = 0.5; // Smooth slow speed

    const scroll = () => {
      if (!textElement || !containerElement) return;

      offset -= speed;
      if (offset < -textElement.offsetWidth) {
        offset = containerElement.offsetWidth;
      }
      textElement.style.transform = `translateX(${offset}px)`;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleClick = () => {
    Swal.fire({
      title: "🌸 Special Puja Services!",
      text: "Discover divine pujas and book now with special blessings.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Explore Now",
      cancelButtonText: "Later",
      confirmButtonColor: "#8b5cf6",
      background: "#f9f9f9",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/pujas"); // 👉 Change to your offers or puja page
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className="bg-primary overflow-hidden relative w-full h-12 flex items-center cursor-pointer"
      onClick={handleClick}
    >
      <div
        ref={textRef}
        className="whitespace-nowrap font-semibold tracking-wide text-white text-sm px-4"
        style={{ willChange: "transform" }}
      >
        🕉️ Welcome to Kalki Seva - Experience Divine Blessings and Spiritual Guidance, 🌸 Explore our Online Puja Booking Services for Your Spiritual Needs, 🌺 Connect with Experienced Priests for Personalized Guidance, 🙏 Experience the Power of Traditional Pujas, Performed with Devotion, ✨ Book Your Puja Online, Anytime, Anywhere with Kalkiseva! 🌟
      </div>
    </div>
  );
};
