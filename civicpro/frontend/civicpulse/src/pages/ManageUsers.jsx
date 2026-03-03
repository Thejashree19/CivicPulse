import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageUsers.css';

const initialFormState = {
  id: null,
  name: '',
  email: '',
  district: '',
  municipality: '',
  phone: ''
};

const districts = [
  "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
  "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
  "Nagapattinam", "Namakkal", "Perambalur", "Pudukottai", "Ramanathapuram",
  "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi",
  "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
  "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

const fetchUsers = async () => {
  setLoading(true);
  try {
    const res = await axios.get('http://localhost:5500/api/user/users');
    console.log("Fetched users:", res.data); // Add this line
    setUsers(res.data);
    setError('');
  } catch (err) {
    console.error('Fetch error:', err); // Add this line
    setError('Failed to fetch users');
  } finally {
    setLoading(false);
  }
};

  const openAddForm = () => {
    setForm(initialFormState);
    setIsEditMode(false);
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setForm({ ...user });
    setIsEditMode(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email) {
      alert('Name and Email are required.');
      return;
    }

    const userData = {
      name: form.name,
      email: form.email,
      district: form.district,
      municipality: form.municipality,
      phone: form.phone
    };

    try {
  if (isEditMode) {
    await axios.put(`http://localhost:5500/api/user/users/${form.id}`, userData);
  } else {
    await axios.post('http://localhost:5500/api/user/users', userData);
  }
  closeForm();
  fetchUsers();
} catch (err) {
  console.error('Save user error:', err.response || err.message);
  alert('Error saving user: ' + (err.response?.data?.message || err.message));
    }
}

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5500/api/user/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>
      <button onClick={openAddForm} className="btn-add">Add New User</button>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>District</th>
              <th>Municipality</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.district || '-'}</td>
                <td>{user.municipality || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td>
                  <button onClick={() => openEditForm(user)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEditMode ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit} className="user-form">
              <label>
                Name*:
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Email*:
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                District:
                <select name="district" value={form.district} onChange={handleInputChange}>
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>

              <label>
                Municipality:
                <input
                  type="text"
                  name="municipality"
                  value={form.municipality}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Phone:
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                />
              </label>

              <div className="form-buttons">
                <button type="submit" className="btn-submit">
                  {isEditMode ? 'Update' : 'Add'}
                </button>
                <button type="button" className="btn-cancel" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
