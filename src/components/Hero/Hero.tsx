import { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  image_url: string[];
}

export const Hero = () => {
  const [sliderRef, setSliderRef] = useState<Slider | null>(null);
  const [slides, setSlides] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [0, 1], [15, -15]);
  const rotateY = useTransform(mouseX, [0, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get<{ data: CarouselItem[] }>(
          `${import.meta.env.VITE_API_BASE_URL}/slider/carousels`
        );
        setSlides(res.data.data || []);
      } catch (error) {
        console.error('❌ Failed to fetch hero slides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    appendDots: (dots: React.ReactNode[]) => (
      <div className="absolute bottom-5 w-full z-30">
        <ul className="flex justify-center items-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-white/50 dark:bg-white/30 rounded-full transition-all duration-300" />
    ),
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="
        relative w-full
        h-[260px] 
        sm:h-[320px] 
        md:h-[380px] 
        lg:h-[450px] 
        xl:h-[520px] 
        2xl:h-[600px]
        overflow-hidden 
        rounded-2xl 
        shadow-xl
      "
    >
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse text-gray-500 text-lg">Loading banners...</div>
        </div>
      ) : (
        <>
          <Slider
            ref={(slider) => setSliderRef(slider)}
            {...settings}
            className="w-full h-full [&_.slick-slide]:!h-full [&_.slick-track]:!h-full [&_.slick-list]:!h-full"
          >
            {slides.map((slide, index) => {
              const image = slide.image_url?.[0];

              return (
                <motion.div
                  key={index}
                  className="relative w-full h-full"
                  style={{ rotateX, rotateY }}
                >
                  <motion.div className="absolute inset-0 w-full h-full">
                    {!imageLoaded[index] && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
                        <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                      </div>
                    )}

                    <motion.img
                      src={image}
                      alt={slide.title || `Slide ${index}`}
                      loading="lazy"
                      onLoad={() =>
                        setImageLoaded((prev) => ({ ...prev, [index]: true }))
                      }
                      className={`
                        absolute inset-0 
                        w-full h-full 
                        object-cover object-center
                        transition-opacity duration-1000
                        ${imageLoaded[index] ? 'opacity-100' : 'opacity-0 blur-sm scale-105'}
                      `}
                      sizes="(max-width: 640px) 100vw,
                             (max-width: 768px) 100vw,
                             (max-width: 1024px) 100vw,
                             (max-width: 1280px) 100vw,
                             100vw"
                    />
                  </motion.div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-20"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <motion.h1
                      className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg text-white"
                      whileHover={{ scale: 1.03 }}
                    >
                      {slide.title}
                    </motion.h1>

                    <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 leading-relaxed max-w-2xl">
                      {slide.description}
                    </p>

                    {slide.button_link?.trim() && (
                      <motion.a
                        href={slide.button_link}
                        whileHover={{ scale: 1.05 }}
                        className="inline-block bg-primary px-6 py-3 rounded-full font-semibold text-white text-sm md:text-base shadow-lg hover:bg-primary/90 transition-all"
                      >
                        {slide.button_text?.trim() || "Book Puja"}
                      </motion.a>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </Slider>

          <motion.button
            onClick={() => sliderRef?.slickPrev()}
            whileHover={{ scale: 1.1 }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800 hover:bg-white p-2 rounded-full z-40 shadow"
          >
            <ChevronLeftIcon className="h-5 w-5 text-primary" />
          </motion.button>
          <motion.button
            onClick={() => sliderRef?.slickNext()}
            whileHover={{ scale: 1.1 }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800 hover:bg-white p-2 rounded-full z-40 shadow"
          >
            <ChevronRightIcon className="h-5 w-5 text-primary" />
          </motion.button>
        </>
      )}
    </div>
  );
};
