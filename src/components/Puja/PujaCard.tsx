// PujaCard.tsx
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import templeIcon from '../../assets/templeicon.png';
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaMapMarkerAlt,
} from 'react-icons/fa';

interface PujaCardProps {
  id?: string;
  rating?: number;
  ratingCount?: number;
  thumbnail?: string;
  speciality?: string;
  name?: string;
  description?: string;
  temple?: string;
  location?: string;
  loading?: boolean;
}

export const PujaCard = ({
  id = '',
  rating = 0,
  ratingCount = 0,
  thumbnail = '',
  speciality = '',
  name = '',
  description = '',
  temple = '',
  location = '',
  loading = false,
}: PujaCardProps) => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-400" fill="currentColor" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" fill="currentColor" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      {/* Image */}
      {loading ? (
        <Skeleton height={192} enableAnimation={true} />
      ) : (
        <img
  src={thumbnail}
  alt={name || 'Puja Image'}
  loading="lazy"
  decoding="async"
  width="400"
  height="192"
  className="w-full h-48 object-cover rounded-t-lg"
/>

      )}

      <div className="p-4 flex-grow space-y-2">
        {/* Speciality */}
        {loading ? (
          <Skeleton height={20} width={100} enableAnimation={true} className="mx-auto" />
        ) : (
          <div className="flex justify-center">
            <span className="inline-block px-2 py-1 text-sm bg-primary/10 text-primary rounded-md">
              {speciality}
            </span>
          </div>
        )}

        {/* Name */}
        {loading ? (
          <Skeleton height={24} width="75%" />
        ) : (
          <h3 className="text-xl font-semibold">{name}</h3>
        )}

        {/* Description */}
        {loading ? (
          <>
            <Skeleton height={16} />
            <Skeleton height={16} width="90%" />
          </>
        ) : (
          <p className="text-gray-600 line-clamp-2">{description}</p>
        )}

        {/* Temple & Location */}
        {loading ? (
          <>
            <Skeleton height={14} width="60%" />
            <Skeleton height={14} width="70%" />
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <img src={templeIcon} alt="Temple" className="w-5 h-5" />
              <p className="font-medium">{temple}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-gray-500">{location}</p>
            </div>
          </>
        )}
      </div>

      {/* Ratings */}
      <div className="p-4 border-t">
        {loading ? (
          <Skeleton height={16} width="50%" />
        ) : (
          <div className="flex items-center">
            <div className="flex text-lg">{renderStars(Number(rating) || 0)}</div>
            <button
              onClick={() => navigate(`/puja/${id}#reviews`)}
              className="ml-2 text-primary underline hover:text-primary/80"
              title="Read reviews"
            >
              {(Number(rating) || 0).toFixed(1)} / {ratingCount} {ratingCount === 1 ? 'Review' : 'Reviews'}
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="p-4 border-t">
        {loading ? (
          <Skeleton height={40} />
        ) : (
          <button
            onClick={() => navigate(`/puja/${id}?name=${name}`)}
            className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Book Puja
          </button>
        )}
      </div>
    </div>
  );
};
