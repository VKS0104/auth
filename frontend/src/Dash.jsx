import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Dash = () => {
  let [productDetails,setProductDetails] = useState({
    productName:"",
    amount:0,
  })
  let [myOrders,setMyOrders] = useState([])
  let [orderPlaced,setOrderPlaced] = useState(false)
  let navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Optionally fetch orders on mount
    showOrders();
  }, [])

  async function fun(){
    let token = localStorage.getItem('token');
  
    try {
      let res = await axios.get(`${API_URL}/admin`,{
        headers:{
          'Authorization':token,
        }
      })
      navigate('/admin')
    } catch (err) {
      alert("Only admins can access this page.");
    }
  }

  async function placeOrder(){
    let token = localStorage.getItem('token');
    try {
      let res = await axios.post(`${API_URL}/orders`,productDetails,{
        headers:{
          'Authorization':token,
        }
      })
      if(res) {
        setOrderPlaced(true);
        setProductDetails({ productName: "", amount: 0 });
        showOrders();
        setTimeout(() => setOrderPlaced(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function Order(e){
    let {name,value} = e.target;
    setProductDetails({
      ...productDetails,
      [name]:value,
    })
  }

  async function showOrders(){
    let token = localStorage.getItem('token')
    try {
      let res = await axios.get(`${API_URL}/my-orders`,{
        headers:{
          "Authorization":token,
        }
      })
      if (Array.isArray(res.data)) {
        setMyOrders(res.data)
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Student Dashboard</h2>
        <button className="btn btn-primary" style={{ width: 'auto', background: '#4B5563' }} onClick={fun}>Admin Panel</button>
      </div>

      <div className="grid-2" style={{ marginBottom: '4rem', alignItems: 'start' }}>
        <div>
          <div className="card card-fluid" style={{ maxWidth: '100%' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Purchase a Course</h3>
            
            {orderPlaced && <div className="alert alert-success">Order Placed Successfully!</div>}
            
            <div className="form-group">
              <label className="form-label">Course Name</label>
              <input 
                type="text" 
                placeholder="Enter the course name" 
                className="form-input"
                name="productName" 
                value={productDetails.productName} 
                onChange={Order}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Amount ($)</label>
              <input 
                type="number" 
                placeholder="Enter amount" 
                className="form-input"
                name="amount" 
                value={productDetails.amount} 
                onChange={Order}
              />
            </div>
            
            <button className="btn btn-primary" onClick={placeOrder}>Place Order</button>
          </div>
        </div>
        
        <div>
           <img 
            src="/images/user_dash_1789664452636.jpg" 
            alt="Student Dashboard Overview" 
            className="hero-image"
            style={{ border: 'none', boxShadow: 'none' }}
          />
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '2rem' }}>My Enrolled Courses</h2>
        {myOrders && myOrders.length > 0 ? (
          <div className="grid-3">
            {myOrders.map((order, id) => (
              <div key={id} className="card card-fluid card-blue">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>ORDER #{id + 1}</span>
                  <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>${order.amount}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{order.productName}</h3>
                <div style={{ background: '#E5E7EB', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--success-border)', width: '30%', height: '100%' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'right' }}>30% Completed</p>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't purchased any courses yet.</p>
        )}
      </div>
    </div>
  )
}

export default Dash
