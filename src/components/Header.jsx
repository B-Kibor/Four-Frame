import React from 'react';
import SearchBar from './SearchBar';
import CategoryButtons from './CategoryButtons';

const Header = ({
  searchQuery,
  onSearchChange,
  onSearch,
  onCategoryClick,
  onTrendingClick,
  onBucketListClick,
  onHomeClick
}) => (
  <header className="header-container">
    <h1 className="header-title">🎬 FOURFRAME 🎥🔥</h1>

    <SearchBar
      searchTerm={searchQuery}
      onSearchChange={onSearchChange}
      onSearch={onSearch}
    />

    <CategoryButtons
      onCategoryClick={onCategoryClick}
      onTrendingClick={onTrendingClick}
      onHomeClick={onHomeClick}
    />
    
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <button 
        className="bucket-list-header-btn"
        onClick={onBucketListClick}
      >
        My Bucket List
      </button>
    </div>
  </header>
);

export default Header;