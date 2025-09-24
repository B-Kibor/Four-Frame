import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    profile_pic: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('Fetching profile with token:', token);
        const res = await axios.get('http://127.0.0.1:9000/api/profile', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log('Profile response:', res.data);
        console.log('Password in response:', res.data.password);
        setProfile({
          username: res.data.username || '',
          email: res.data.email || '',
          profile_pic: res.data.profile_pic || ''
        });
        localStorage.setItem('profilePic', res.data.profile_pic || '');
        localStorage.setItem('username', res.data.username || '');
      } catch (err) {
        console.error('Profile fetch error:', err);
        console.error('Error response:', err.response);
        
        // Try to load from localStorage as fallback
        const fallbackProfile = {
          username: localStorage.getItem('username') || '',
          email: '',
          profile_pic: localStorage.getItem('profilePic') || ''
        };
        setProfile(fallbackProfile);
        
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response?.status === 404) {
          setError('Profile endpoint not found. Using offline mode.');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to server. Using offline mode.');
        } else if (err.message.includes('CORS')) {
          setError('CORS error: Backend needs to allow requests from localhost:3000. Using offline mode.');
        } else {
          setError(err.response?.data?.message || 'Failed to load profile. Using offline mode.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile({ ...profile, profile_pic: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setMessage('');
    setError('');
    try {
      await axios.put(
        'http://127.0.0.1:9000/api/profile',
        {
          email: profile.email,
          profile_pic: profile.profile_pic
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      localStorage.setItem('profilePic', profile.profile_pic);
      setMessage('Profile updated successfully.');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to update profile.');
      }
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
      <p className="loading">Loading profile...</p>
    </div>
  );

  return (
    <div className="profile-container">
      <h2 className="profile-header">Your Profile</h2>

      {error && <p className="profile-error">{error}</p>}
      {message && <p className="profile-success">{message}</p>}

      <div className="form-group">
        <label>Username</label>
        <input type="text" name="username" value={profile.username} disabled />
      </div>



      <div className="form-group">
        <label>Email Address</label>
        <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="your.email@example.com" />
      </div>

      <div className="form-group">
        <label>Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px dashed rgba(255, 154, 158, 0.5)',
          borderRadius: '15px',
          color: 'white',
          cursor: 'pointer'
        }} />
        {profile.profile_pic && (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <img
              src={profile.profile_pic}
              alt="Preview"
              style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                border: '3px solid rgba(255, 154, 158, 0.5)',
                boxShadow: '0 8px 25px rgba(255, 154, 158, 0.3)'
              }}
            />
          </div>
        )}
      </div>

      <button onClick={handleSubmit} style={{
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        border: 'none',
        borderRadius: '25px',
        padding: '15px 30px',
        color: 'white',
        fontWeight: '600',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 25px rgba(255, 154, 158, 0.3)',
        width: '100%'
      }} onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 12px 35px rgba(255, 154, 158, 0.4)';
      }} onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 8px 25px rgba(255, 154, 158, 0.3)';
      }}>Update My Profile</button>
    </div>
  );
};

export default Profile;