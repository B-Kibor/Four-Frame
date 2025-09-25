import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import MovieContainer from './MovieContainer';
import MovieDetail from './MovieDetail';

const API_KEY = "cfdfd510ab2d960857f9947e9d4df55c";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showBucketList, setShowBucketList] = useState(false);
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
      setShowBucketList(false); // Clear bucket list view
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
      setShowBucketList(false); // Clear bucket list view
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
      setShowBucketList(false); // Clear bucket list view
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

  const goHome = () => {
    setShowBucketList(false);
    setMovies([]);
    setError("");
    setSearchQuery("");
  };

  const fetchBucketList = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view your bucket list.');
      return;
    }

    try {
      console.log('Fetching bucket list...');
      const response = await axios.get('http://127.0.0.1:9000/api/bucket-list', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Bucket list response:', response.data);
      console.log('Number of movies in bucket list:', response.data.length);
      console.log('First movie structure:', response.data[0]);
      
      // Transform backend data to match TMDB format if needed
      const transformedMovies = (response.data || []).map(item => ({
        id: item.movie_id || item.id || Math.random(),
        bucket_id: item.id, // Database ID for deletion
        title: item.title || 'Unknown Title',
        name: item.title || 'Unknown Title', // For TV shows
        poster_path: item.poster_path || null,
        overview: item.overview || 'No description available',
        release_date: item.release_date || '2024',
        media_type: 'movie'
      }));
      
      console.log('Transformed movies:', transformedMovies);
      console.log('Setting movies state with:', transformedMovies.length, 'items');
      setMovies(transformedMovies);
      setShowBucketList(true);
      setError("");
    } catch (err) {
      console.error('Bucket list fetch error:', err);
      console.error('Error response:', err.response);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure backend is running.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err.response?.status === 404) {
        setError('Bucket list endpoint not found.');
      } else if (err.response?.status === 500) {
        setError('Server error. Check your Flask backend logs.');
      } else {
        setError(err.response?.data?.message || 'Failed to load bucket list.');
      }
      
      // Show bucket list view even if API fails
      setShowBucketList(true);
      setMovies([]); // Empty array to show empty state
    }
  };

  const removeBucketListItem = async (movie) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to remove movies.');
      return;
    }

    // Use bucket_id (database ID) if available, otherwise use movie_id
    const deleteId = movie.bucket_id || movie.id;
    
    try {
      console.log('Removing movie:', movie.title, 'with ID:', deleteId);
      const response = await axios.delete(`http://127.0.0.1:9000/api/bucket-list/${deleteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Remove response:', response.data);
      
      // Refresh bucket list after successful removal
      fetchBucketList();
    } catch (err) {
      console.error('Remove bucket list error:', err);
      console.error('Error response:', err.response);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err.response?.status === 404) {
        setError('DELETE endpoint missing. Add DELETE /api/bucket-list/:id to your Flask backend.');
      } else if (err.response?.status === 500) {
        setError('Server error. Check your Flask backend.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server.');
      } else {
        setError(err.response?.data?.message || 'Failed to remove from bucket list.');
      }
    }
  };

  return (
    <div className="App">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={searchMovies}
        onCategoryClick={fetchCategory}
        onTrendingClick={fetchTrending}
        onBucketListClick={fetchBucketList}
        onHomeClick={goHome}
      />



      {movies.length === 0 && !error && !showBucketList && (
        <div className="landing-message">
          <h2>Welcome to Four-Frame</h2>
          <p className="welcome-subtitle">Your Ultimate Movie Discovery Experience</p>
          <div className="welcome-features">
            <div className="feature-item">
              <span className="feature-icon">🎬</span>
              <p>Discover trending movies and hidden gems</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <p>Search through thousands of titles</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📝</span>
              <p>Create your personal bucket list</p>
            </div>
          </div>
          <p className="welcome-cta">Ready to dive into the world of cinema? Start exploring now!</p>
        </div>
      )}

      {showBucketList && movies.length === 0 && (
        <div className="landing-message">
          <h2>Your Bucket List is Empty</h2>
          <p>Add movies to your bucket list by clicking the "Add to Bucket List" button in movie details!</p>
        </div>
      )}

      <div id="movie-container">
        {error && <h3>{error}</h3>}
        {!error && movies.length > 0 && (
          <div>
            {showBucketList && (
              <h2 style={{ textAlign: 'center', color: 'white', marginBottom: '2rem' }}>
                My Bucket List ({movies.length} movies)
              </h2>
            )}
            <MovieContainer 
              movies={movies} 
              onMovieClick={handleMovieClick}
              showRemoveButton={showBucketList}
              onRemoveClick={removeBucketListItem}
            />
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetail movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
};

export default Home;