/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { PujaCard } from './PujaCard';
import { motion } from 'framer-motion';

interface Puja {
  puja_id: string;
  puja_name: string;
  puja_thumbnail_url: string;
  puja_special: string;
  puja_description: string;
  temple_name: string;
  temple_location: string;
  total_rating: number;
  reviews_count: number;
}

export const PujaList = () => {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPujas = async () => {
      try {
        const res = await fetch(`${BASE_URL}/puja/pujaget`);
        if (!res.ok) throw new Error('Failed to fetch pujas');
        const json = await res.json();
        setPujas(json.data || []);
        await new Promise((r) => setTimeout(r, 1000)); // UX delay
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchPujas();
  }, [BASE_URL]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="py-12 px-4 space-y-12">
      {error && (
        <div className="text-center text-red-500 text-lg font-medium">
          {error}
        </div>
      )}
      {!error && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array(6)
                .fill({})
                .map((_, index) => (
                  <PujaCard key={index} loading />
                ))}
            </div>
          ) : pujas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {pujas.map((puja: Puja, index: number) => (
                <motion.div
                  key={puja.puja_id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeInUp}
                  custom={index}
                >
                  <PujaCard
                    loading={false}
                    id={puja.puja_id}
                    thumbnail={puja.puja_thumbnail_url}
                    speciality={puja.puja_special}
                    name={puja.puja_name}
                    description={puja.puja_description}
                    temple={puja.temple_name}
                    location={puja.temple_location}
                    rating={puja.total_rating}
                    ratingCount={puja.reviews_count}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-lg mt-6">
              No pujas available at this moment.
            </div>
          )}
        </>
      )}
    </div>
  );
};
