import React, { useEffect, useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch the actual notification data
    fetch('/api/notifications') // Replace with actual backend endpoint
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(() => setNotifications([]));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul>
          {notifications.map((note, index) => (
            <li key={index}>{note.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
