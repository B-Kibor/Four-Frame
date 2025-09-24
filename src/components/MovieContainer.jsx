import React from 'react';
import MovieCard from './MovieCard';

const MovieContainer = ({ movies, onMovieClick }) => (
  <>
    {movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} onMovieClick={onMovieClick} />
    ))}
  </>
);

export default MovieContainer;