import React, { useEffect, useState } from 'react';

const API_KEY = "cfdfd510ab2d960857f9947e9d4df55c";

const MovieDetail = ({ movie, onClose }) => {
  const [trailerKey, setTrailerKey] = useState("");
  const [error, setError] = useState("");

  const type = movie?.media_type || 'movie';

  useEffect(() => {
    if (!movie) return;

    const fetchTrailer = async () => {
      try {
        console.log('Fetching trailer for:', movie.title || movie.name, 'ID:', movie.id, 'Type:', type);
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movie.id}/videos?api_key=${API_KEY}&language=en-US`);
        const data = await res.json();
        console.log('Trailer data:', data);
        const trailer = data.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) {
          console.log('Found trailer:', trailer.key);
          setTrailerKey(trailer.key);
        } else {
          console.log('No trailer found');
          setError("No trailer available for this movie.");
        }
      } catch (err) {
        console.error('Trailer fetch error:', err);
        setError("Failed to load trailer.");
      }
    };

    fetchTrailer();
  }, [movie, type]);

  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h1 className="modal-title">{movie.title || movie.name}</h1>
        <p className="modal-overview">{movie.overview}</p>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {trailerKey ? (
          <div className="trailer-container">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            ></iframe>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#2d1b69' }}>No trailer available.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;