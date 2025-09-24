import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../style.css';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const profilePic = localStorage.getItem('profilePic'); 
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('profilePic'); 
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">
        <span className="material-symbols-outlined">Home :</span>
        FOURFRAME
      </h1>

      <div className="navbar-links">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <div className="navbar-user">
            <div className="user-info" onClick={toggleDropdown}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="profile-pic" />
              ) : (
                <div className="default-pic">🎥</div>
              )}
              <span className="username">{username}</span>
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;