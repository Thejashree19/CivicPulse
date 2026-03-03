import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const location = useLocation();
  const userId = location.state?.userId;

  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!userId) {
      setError('Unauthorized. Please log in.');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5500/api/user/profile/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile.');
      }
    };

    fetchUser();
  }, [userId]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setUpdateMsg('');

    if (!password || !confirmPassword) {
      setUpdateMsg('Please fill out both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setUpdateMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setUpdateMsg('Password should be at least 6 characters.');
      return;
    }

    try {
      setUpdating(true);
      const res = await axios.put(`http://localhost:5500/api/user/update-password/${userId}`, { password });
      setUpdateMsg(res.data.message || 'Password updated successfully.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setUpdateMsg(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setUpdating(false);
    }
  };

  if (error) return <div className="profile-container"><p className="error">{error}</p></div>;
  if (!user) return <div className="profile-container"><p>Loading profile...</p></div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>District:</strong> {user.district}</p>
        <p><strong>Municipality:</strong> {user.municipality}</p>
      </div>

      <div className="password-update">
        <h3>Update Password</h3>
        {updateMsg && <p className="update-message">{updateMsg}</p>}
        <form onSubmit={handlePasswordUpdate}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            minLength={6}
            required
          />
          <button type="submit" disabled={updating}>
            {updating ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
