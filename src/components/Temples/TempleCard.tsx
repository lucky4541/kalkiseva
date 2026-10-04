import { useNavigate } from 'react-router-dom';

interface TempleCardProps {
  id: string;
  image: string;
  name: string;
  location: string;
}

export const TempleCard = ({ id, image, name, location }: TempleCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative group overflow-hidden rounded-lg">
      <img
  src={image}
  alt={name || 'Temple Image'}
  loading="lazy"
  decoding="async"
  width="400"
  height="256"
  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
/>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 text-white">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-sm opacity-90">{location}</p>
        <button
          onClick={() => navigate(`/temple/${id}`)}  // ✅ Name removed from URL
          className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          View More
        </button>
      </div>
    </div>
  );
};
