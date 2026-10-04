import { useEffect, useState } from 'react';
import { TempleCard } from './TempleCard';

interface Temple {
  temple_id: string;
  temple_name: string;
  temple_location: string;
  temple_thumbnail: string;
}

export const TempleList = () => {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track error state
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Fetch temple data from backend
    const fetchTemples = async () => {
      try {
        const response = await fetch(`${BASE_URL}/alltemples/getAlltemples`); // Adjust the URL based on your backend setup
        if (!response.ok) {
          throw new Error('Failed to fetch Temples');
        }
        const data = await response.json();
        console.log(data); // Log the data to see the structure
        if (data && data.data) {
          setTemples(data.data); // Set temple data from API response
        } else {
          console.error('No data returned from API:', data);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message); // Set error if request fails
        } else {
          setError('An unknown error occurred'); // Handle unknown error type
        }
      } finally {
        setLoading(false); // Set loading to false after fetching data or error
      }
    };

    fetchTemples();
  }, [BASE_URL]); // Empty dependency array ensures this runs once after the initial render

  if (loading) {
    return <div>Loading...</div>; // Display loading message while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message if the fetch failed
  }

  // Display exactly 4 temples using slice
  const displayedTemples = temples.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayedTemples.map(temple => (
        <TempleCard
          key={temple.temple_id}
          id={temple.temple_id}
          image={temple.temple_thumbnail}
          name={temple.temple_name}
          location={temple.temple_location}
        />
      ))}
    </div>
  );
};
