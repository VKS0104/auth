import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section grid-2">
        <div>
          <h1 style={{ marginBottom: '1.5rem' }}>Learning skills<br/>for a better career</h1>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '400px' }}>
            We believe the world is more beautiful as each person gets more skill and knows how to implement.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="form-input" 
              style={{ maxWidth: '250px', marginBottom: 0 }}
            />
            <button className="btn btn-primary" style={{ width: 'auto' }}>15 Days Trial</button>
          </div>
        </div>
        
        <div>
          <img 
            src="/images/home_hero_1789664438705.jpg" 
            alt="Students learning together" 
            className="hero-image"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-row" style={{ marginBottom: '6rem' }}>
        <div className="stat-item">
          <h3>12k+</h3>
          <p>Fresh Graduates</p>
        </div>
        <div className="stat-item">
          <h3>9+</h3>
          <p>Years of Experience</p>
        </div>
        <div className="stat-item">
          <h3>358+</h3>
          <p>Excellence Awards</p>
        </div>
        <div className="stat-item">
          <h3>47+</h3>
          <p>Brand Partners</p>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ marginBottom: '2.5rem' }}>Popular Courses</h2>
        
        <div className="grid-3" style={{ textAlign: 'left' }}>
          {/* Course 1 */}
          <div className="card card-fluid card-blue">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Digital Marketing & Basics to Advance</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>By Clifford Lampe</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)' }}>$19.50</span>
              </div>
              <Link to="/signUp" className="btn btn-primary" style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.875rem' }}>View</Link>
            </div>
          </div>
          
          {/* Course 2 */}
          <div className="card card-fluid card-purple">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Design Thinking Process & Strategy</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>By Lida Hogan</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)' }}>$15.33</span>
              </div>
              <Link to="/signUp" className="btn btn-primary" style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.875rem' }}>View</Link>
            </div>
          </div>

          {/* Course 3 */}
          <div className="card card-fluid">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>HTML - Learn programming language</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>By Mike Sheldon</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)' }}>$13.75</span>
              </div>
              <Link to="/signUp" className="btn btn-primary" style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.875rem' }}>View</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
