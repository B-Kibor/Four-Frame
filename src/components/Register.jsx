import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../style.css';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  age: Yup.number()
    .min(13, 'Must be at least 13 years old')
    .max(120, 'Age must be realistic')
    .required('Age is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const apiUrl = 'http://127.0.0.1:9000';

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      username: values.username,
      email: values.email,
      age: parseInt(values.age),
      password: values.password,
    };

    console.log('Attempting registration with:', payload);
    console.log('API URL:', apiUrl);

    try {
      const response = await axios.post(`${apiUrl}/api/register`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Registration successful:', response.data);
      alert('Registration successful!');
      window.location.href = '/login';
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      
      if (err.code === 'ERR_NETWORK') {
        alert('Cannot connect to server. Make sure your backend is running on port 9000.');
      } else {
        alert(err.response?.data?.message || `Registration failed: ${err.message}`);
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Sign Up</h2>
        
        <Formik
          initialValues={{
            username: '',
            email: '',
            age: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="username" className="login-label">Username</label>
              <Field
                name="username"
                type="text"
                placeholder="Choose a username"
                className="login-input"
              />
              <ErrorMessage name="username" component="div" style={{color: 'red', fontSize: '12px'}} />

              <label htmlFor="email" className="login-label">Email</label>
              <Field
                name="email"
                type="email"
                placeholder="Enter your email"
                className="login-input"
              />
              <ErrorMessage name="email" component="div" style={{color: 'red', fontSize: '12px'}} />

              <label htmlFor="age" className="login-label">Age</label>
              <Field
                name="age"
                type="number"
                placeholder="Enter your age"
                className="login-input"
              />
              <ErrorMessage name="age" component="div" style={{color: 'red', fontSize: '12px'}} />

              <label htmlFor="password" className="login-label">Password</label>
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="login-input"
              />
              <ErrorMessage name="password" component="div" style={{color: 'red', fontSize: '12px'}} />

              <label htmlFor="confirmPassword" className="login-label">Confirm Password</label>
              <Field
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="login-input"
              />
              <ErrorMessage name="confirmPassword" component="div" style={{color: 'red', fontSize: '12px'}} />

              <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                <label>
                  <input
                    type="checkbox"
                    onChange={() => setShowPassword(!showPassword)}
                  /> Show Password
                </label>
              </div>

              <button type="submit" disabled={isSubmitting} className="register-button">
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="login-footer-text">
          Already have an account? <a href="/login" className="login-link">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;