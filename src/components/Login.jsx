import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../style.css';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const Login = () => {
  const [error, setError] = useState(null);
  const apiUrl = "http://127.0.0.1:9000";

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    console.log('Attempting login with:', values);
    console.log('API URL:', `${apiUrl}/api/login`);
    
    try {
      const res = await axios.post(`${apiUrl}/api/login`, values, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Login response:', res.data);
      
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('username', res.data.username || values.username);
        console.log('Login successful, redirecting...');
        window.location.href = '/'; 
      } else {
        setError('No access token received from server');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('Error response:', err.response);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Make sure your backend is running.');
      } else if (err.response?.status === 401) {
        setError('Invalid username/email or password.');
      } else if (err.response?.status === 404) {
        setError('Login endpoint not found. Check your backend.');
      } else {
        setError(err.response?.data?.message || `Login failed: ${err.message}`);
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Four-Frame</h2>
        
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="username">Username</label>
              <Field
                name="username"
                type="text"
                placeholder="Enter your username"
              />
              <ErrorMessage name="username" component="div" style={{color: 'red', fontSize: '12px'}} />

              <label htmlFor="password">Password</label>
              <Field
                name="password"
                type="password"
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" component="div" style={{color: 'red', fontSize: '12px'}} />

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging In...' : 'Log In'}
              </button>
            </Form>
          )}
        </Formik>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <p className="login-footer">
          New to Four-Frame? <a href="/register">Sign up now</a>
        </p>
      </div>
    </div>
  );
};

export default Login;