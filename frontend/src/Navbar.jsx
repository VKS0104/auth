import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        AuthApp
      </Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/signUp" className="nav-link">Sign Up</Link>
        <Link to="/login" className="nav-btn">Login</Link>
      </div>
    </nav>
  )
}

export default Navbar
