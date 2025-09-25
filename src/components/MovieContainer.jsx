import React from 'react';
import MovieCard from './MovieCard';

const MovieContainer = ({ movies, onMovieClick, showRemoveButton, onRemoveClick }) => (
  <div id="movie-container">
    {movies.map((movie) => (
      <MovieCard 
        key={movie.id} 
        movie={movie} 
        onMovieClick={onMovieClick}
        showRemoveButton={showRemoveButton}
        onRemoveClick={onRemoveClick}
      />
    ))}
  </div>
);

export default MovieContainer;