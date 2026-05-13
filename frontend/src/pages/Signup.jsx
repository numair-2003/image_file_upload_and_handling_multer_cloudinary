import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    console.log('--- SIGNUP INITIATED ---');
    console.log('Target API:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

    try {
      const res = await signupAPI(form);
      
      if (res.data?.token && res.data?.data) {
        login(res.data.token, res.data.data);
        navigate('/'); 
      } else {
        alert("Registration Successful! Please login.");
        navigate('/login');
      }
      
    } catch (err) {
      console.error('Signup Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Signup failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-tag">SIGNUP</span>
          <h1 className="auth-title">Create account!</h1>
          <p className="auth-sub">Join the community gallery!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>NAME</label>
            <input
              type="text"
              name="name"
              placeholder="Numair Fahad"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>EMAIL</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>PASSWORD</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="auth-error">⚠ {error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;