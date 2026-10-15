
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(
        `${API_URL}/forgot-password`,
        { email }
      );

      setSuccess(res.data);
    } catch (err) {
      setError(
        err.response?.data ||
        'Unable to process your request. Please try again.'
      );
    }
  }

  return (
    <div className="card">
      <h2 style={{ textAlign: 'center' }}>Forgot Password?</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Enter your registered email to receive a reset link.
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Send Reset Link
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        Remembered your password? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
