import axios from 'axios';
import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom';

const ResetPassword = () => {
  let [data,setData] = useState({
    newPassword:"",
  });
  
  let [error, setError] = useState("");
  let [success, setSuccess] = useState("");

  let {resetToken} = useParams()
  const API_URL = import.meta.env.VITE_API_URL;

  function change(e){
    setData({
      ...data,
      [e.target.name]:e.target.value,
    })
    
    if (error) setError("");
    if (success) setSuccess("");
  }

  async function resetPass()
  {
    try {
      let res = await axios.post(`${API_URL}/api/reset-password/${resetToken}`,data);
      
      if (typeof res.data === 'string') {
        setSuccess(res.data);
        setError("");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Reset Password</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Enter your new password below.</p>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label className="form-label">New Password</label>
        <input 
          type="password" 
          name="newPassword" 
          className="form-input"
          value={data.newPassword} 
          placeholder="Enter new password" 
          onChange={change}
        />
      </div>

      <button className="btn btn-primary" onClick={resetPass}>Reset Password</button>
      
      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
        Remembered your password? <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Log in</Link>
      </p>
    </div>
  )
}

export default ResetPassword
