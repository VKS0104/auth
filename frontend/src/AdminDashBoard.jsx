import React, { useState, useEffect} from 'react'
import axios from 'axios';

const AdminDashBoard = () => {
  let [users,setUsers] = useState([]);

  async function getUsers(){
    let token = localStorage.getItem('token')
    try {
      let res = await axios.get('http://localhost:3000/users', {
        headers: { Authorization: token }
      })
      if (Array.isArray(res.data)) {
        setUsers(res.data)
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    getUsers()
  }, [])

  async function changeRole(id, role) {
    let token = localStorage.getItem('token')
    try {
      let res = await axios.patch(
        `http://localhost:3000/users/${id}/role`,
        { role: role },
        { headers: { Authorization: token } }
      )
      getUsers()
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page-container">
      <div className="grid-2" style={{ marginBottom: '3rem', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Admin Dashboard</h1>
          <p style={{ fontSize: '1.125rem' }}>Manage users, update roles, and oversee platform access from this central control panel.</p>
        </div>
        <div>
          <img 
            src="/images/admin_dash_1789664463819.jpg" 
            alt="Admin Management Interface" 
            className="hero-image"
            style={{ border: 'none', boxShadow: 'none' }}
          />
        </div>
      </div>

      <div className="card card-fluid" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--card-border)', background: '#F9FAFB' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>System Users</h2>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>USER ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>CURRENT ROLE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {users.map((a) => (
                <tr key={a._id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{a._id.substring(0, 8)}...</td>
                  <td style={{ fontWeight: '600' }}>{a.name}</td>
                  <td>{a.email}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: a.role === 'admin' ? 'var(--accent-purple)' : 'var(--accent-blue)',
                      color: '#111827'
                    }}>
                      {a.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={a.role} 
                      onChange={(e) => changeRole(a._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashBoard
