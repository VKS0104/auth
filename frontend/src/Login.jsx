import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  let [data, setData] = useState({
    email: "",
    password: "",
  })

  let [error, setError] = useState("");

  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL;

  function fun(e) {
    let { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    })

    if (error) setError("");
  }

  async function done() {
    try {
      let apiRes = await axios.post(`${API_URL}/login`, data);

      // The backend returns 200 OK with string messages for errors
      if (typeof apiRes.data === 'string') {
        setError(apiRes.data);
        return;
      }

      let token = apiRes.data?.token;

      if (token) {
        localStorage.setItem('token', token)
        navigate('/dash')
        setData({
          email: "",
          password: ""
        })
      }
    } catch (err) {
      setError("An unexpected error occurred while logging in.");
    }
  }


  async function handleGoogleSuccess(credentialResponse) {
    try {
      const credential = credentialResponse.credential;

      const apiRes = await axios.post(
        `${API_URL}/auth/google`,
        { credential }
      );

      const token = apiRes.data?.token;

      if (token) {
        localStorage.setItem('token', token);
        navigate('/dash');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Google sign-in failed. Please try again.'
      );
    }
  }


  return (
    <div className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Please enter your details to sign in.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-input"
          value={data.email}
          placeholder="Enter your email"
          onChange={fun}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label className="form-label">Password</label>
          <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Forgot Password?</Link>
        </div>
        <input
          type="password"
          name="password"
          className="form-input"
          value={data.password}
          placeholder="Enter your password"
          onChange={fun}
        />
      </div>

      <button className="btn btn-primary" onClick={done}>Sign In</button>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
        Don't have an account? <Link to="/signUp" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Sign up</Link>
      </p>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google sign-in failed.')}
        />
      </div>
    </div>
  )
}

export default Login
