import React, { useState, useEffect } from 'react';
import Header from './Header';
import MovieContainer from './MovieContainer';
import MovieDetail from './MovieDetail';

const API_KEY = "cfdfd510ab2d960857f9947e9d4df55c";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  
  useEffect(() => {
    fetch(`${apiUrl}/api/movies`) 
      .then(res => res.json())
      .then(data => {
        console.log("🎬 Flask API data:", data);
        
      })
      .catch(err => console.error("❌ Error fetching from Flask backend:", err));
  }, [apiUrl]); 

  const fetchTrending = async () => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`);
      const data = await res.json();
      setMovies(data.results);
      setError("");
    } catch {
      setError("Failed to load trending movies.");
    }
  };

  const fetchCategory = async (category) => {
    try {
      const url = category === "animation"
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=1&with_genres=16`
        : `https://api.themoviedb.org/3/discover/${category}?api_key=${API_KEY}&language=en-US&page=1`;

      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results);
      setError("");
    } catch {
      setError(`Failed to load ${category}.`);
    }
  };

  const searchMovies = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=1`
      );
      const data = await res.json();
      if (data.results.length === 0) {
        setError("No results found.");
        setMovies([]);
      } else {
        setMovies(data.results);
        setError("");
      }
    } catch {
      setError("Search failed. Please try again.");
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="App">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={searchMovies}
        onCategoryClick={fetchCategory}
        onTrendingClick={fetchTrending}
      />

      {movies.length > 0 && (
        <a href="/" className="back-btn">Back to Home</a>
      )}

      {movies.length === 0 && !error && (
        <div className="landing-message">
          <h2>Welcome to Four-Frame</h2>
          <p>Click "Trending" to explore movies.</p>
        </div>
      )}

      <div id="movie-container">
        {error && <h3>{error}</h3>}
        {!error && movies.length > 0 && (
          <MovieContainer movies={movies} onMovieClick={handleMovieClick} />
        )}
      </div>

      {selectedMovie && (
        <MovieDetail movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
};

export default Home;