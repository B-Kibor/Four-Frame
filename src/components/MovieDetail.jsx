import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = "cfdfd510ab2d960857f9947e9d4df55c";

const MovieDetail = ({ movie, onClose }) => {
  const [trailerKey, setTrailerKey] = useState("");
  const [error, setError] = useState("");
  const [bucketMessage, setBucketMessage] = useState("");

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

  const addToBucketList = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setBucketMessage('Please login to add movies to your bucket list.');
      return;
    }

    try {
      console.log('Adding to bucket list:', {
        movie_id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        overview: movie.overview
      });
      
      const response = await axios.post('http://127.0.0.1:9000/api/bucket-list', {
        movie_id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        overview: movie.overview
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Bucket list response:', response.data);
      setBucketMessage('Added to bucket list! ✨');
    } catch (err) {
      console.error('Bucket list error:', err);
      console.error('Error response:', err.response);
      
      if (err.response?.status === 409) {
        setBucketMessage('Already in your bucket list!');
      } else if (err.response?.status === 401) {
        setBucketMessage('Session expired. Please login again.');
      } else if (err.response?.status === 404) {
        setBucketMessage('Bucket list endpoint not found.');
      } else if (err.code === 'ERR_NETWORK') {
        setBucketMessage('Cannot connect to server.');
      } else {
        setBucketMessage(err.response?.data?.message || 'Failed to add to bucket list.');
      }
    }
  };

  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h1 className="modal-title">{movie.title || movie.name}</h1>
        <p className="modal-overview">{movie.overview}</p>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            className="bucket-list-btn"
            onClick={addToBucketList}
          >
            Add to Bucket List
          </button>
          {bucketMessage && (
            <p style={{ 
              marginTop: '10px', 
              color: bucketMessage.includes('Failed') ? '#f87171' : '#4ade80',
              fontWeight: '500'
            }}>
              {bucketMessage}
            </p>
          )}
        </div>

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
          <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>No trailer available.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;