# CivicPulse

# 🏛️ Civic Pulse – Civic Engagement Platform

**Civic Pulse** is a full-stack web application designed to promote transparent communication between citizens and local governance. It empowers users to report civic issues, suggest improvements, track municipal projects, and view open data dashboards in real-time.

---

## 🚀 Features

### 👥 User Features
- ✅ User registration and secure login (with session support)
- 📢 Report civic issues with district and municipality context
- 📄 View your past reports and status updates
- 💡 Suggest improvements for your locality
- 📬 View and upvote community suggestions
- 📊 Track municipal project progress
- 📈 Open Data Dashboard with real-time stats and visualizations
- 👤 Profile management

### 🛠️ Admin Features
- 👁️ View and manage all reported issues
- 📬 Review and manage user suggestions
- 📂 Manage civic projects and statuses
- 👥 Manage registered users
- 📈 Admin analytics and statistics dashboard

---

## 🧑‍💻 Tech Stack

| Layer       | Technology                             |
|-------------|-----------------------------------------|
| Frontend    | React.js (with Axios, Recharts, CSS)    |
| Backend     | Node.js + Express.js                    |
| Database    | MySQL                                   |
| NLP Module  | Python (for future semantic features)   |
| Deployment  | (You can host on Render/Heroku/Vercel)  |

---

## 📁 Project Structure
civic_pulse/
│
├── backend/ # Node.js + Express backend
│ ├── routes/ # Route handlers (auth, issue, suggestion, etc.)
│ ├── db.js # MySQL connection
│ └── server.js # Main server file
│
├── frontend/
│ └── civicpulse/ # React frontend
│ ├── pages/ # User/Admin dashboard + features
│ ├── components/ # Navbar, charts, etc.
│ ├── App.js # Frontend routes
│ └── styles/ # CSS files


---

## 🛠️ Setup Instructions

### 🔧 Prerequisites
- Node.js and npm
- MySQL Server
- Git
- Python (for advanced features like semantic analysis)

### 🔄 Clone the Repository

git clone https://github.com/your-username/civic-pulse.git
cd civic_pulse

Install Backend Dependencies

cd backend
npm install


### Configure Backend Database
Create a MySQL database named: civic_pulse
Update credentials in backend/db.js if needed

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'civic_pulse'
});

Run Backend
npm start

Install Frontend Dependencies
cd ../frontend/civicpulse
npm install

Run Frontend
npm start

