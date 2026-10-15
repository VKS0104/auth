import React from 'react'
import { useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';

const SignUp = () => {

  let [data,setData] = useState({
    name:"",
    email:"",
    password:""
  })
  
  let [error, setError] = useState("");
  let [success, setSuccess] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  function fun1(e)
  {
    let {name,value} = e.target;
    setData({
      ...data,
      [name]:value,
    })
    
    // Clear errors when user types
    if (error) setError("");
    if (success) setSuccess("");
  }
  
  async function done()
  {
    try {
      let apiRes = await axios.post(`${API_URL}/signUp`, data);
      
      if (typeof apiRes.data === 'string') {
        if (apiRes.data === "User Already Exist, Please Login") {
          setError(apiRes.data);
          setSuccess("");
        } else if (apiRes.data === "dooooneeee.....") {
          setSuccess("Account created successfully! You can now login.");
          setError("");
          setData({ name: "", email: "", password: "" });
        } else {
          // Fallback for other string messages
          setError(apiRes.data);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  }
   
  return (
    <div className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create an Account</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign up to get started.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group">
        <label className="form-label">Name</label>
        <input 
          type="text" 
          name="name" 
          className="form-input"
          value={data.name} 
          placeholder="Enter your name" 
          onChange={fun1}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input 
          type="email" 
          name="email" 
          className="form-input"
          value={data.email} 
          placeholder="Enter your email" 
          onChange={fun1}
        />
      </div>
      
      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label className="form-label">Password</label>
        <input 
          type="password" 
          name="password" 
          className="form-input"
          value={data.password} 
          placeholder="Create a password" 
          onChange={fun1}
        />
      </div>

      <button className="btn btn-primary" onClick={done}>Sign Up</button>
      
      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Log in</Link>
      </p>
    </div>
  )
}

export default SignUp
