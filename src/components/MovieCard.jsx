import React from 'react';

const MovieCard = ({ movie, onMovieClick, showRemoveButton, onRemoveClick }) => {
  const { title, name, poster_path, release_date, first_air_date, overview } = movie;

  const movieTitle = title || name || "Unknown Title";
  const movieYear = (release_date || first_air_date || "Unknown").split("-")[0];
  const movieDesc = overview || "No description available";
  const movieImage = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "default-image.jpg";

  return (
    <div className="movie-card" onClick={() => onMovieClick(movie)}>
      <img src={movieImage} alt={movieTitle} />
      <div className="movie-details">
        <h2>{movieTitle}</h2>
        <p><strong>Year:</strong> {movieYear}</p>
        <p className="description">{movieDesc.slice(0, 100)}...</p>
        
        <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <div style={{ 
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: '15px',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            Click to Watch Trailer
          </div>
          
          {showRemoveButton && (
            <button
              className="remove-bucket-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveClick(movie);
              }}
            >
              Mark as Watched
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;