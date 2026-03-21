# 🌿 Sundar Samadhan (सुन्दर समाधान)

**Sundar Samadhan** (Beautiful Solution) is a premium civic-tech platform designed to bridge the gap between citizens and local government in Nepal. It empowers users to foster transparent, accountable, and "beautiful" communities through digital governance, real-time issue tracking, and localized impact contributions.

![Project Preview](https://github.com/pra-neupane01/Sundar-Samadhan/raw/main/Frontend/public/hero-portrait.png)

---

## 🚀 Vision & Purpose
In Many municipalities, the line of communication between people and their representatives is often fragmented. **Sundar Samadhan** solves this by providing a unified, secure, and modern interface where:
- **Citizens** can report issues and see them resolved.
- **Officers** can manage their ward's needs efficiently.
- **Admins** can oversee the entire system's integrity and growth.

---

## ✨ Key Features

### 👤 Citizen Portal
- **Instant Complaint Submission**: Report infrastructure (potholes, water leaks, waste) with photo evidence and location tagging.
- **Real-time Tracking**: Monitor the live status (Pending → Processing → Resolved) of every report.
- **Impact Donations**: Directly fund community projects via integrated Stripe payments.
- **Sundar Points**: Earn recognition and points for proactive community contribution.
- **Community Announcements**: Stay updated with official alerts from your specific ward.

### 🏛️ Municipal Dashboard
- **Issue Management**: Assign, track, and resolve complaints within the ward.
- **Citizen Communication**: Post official announcements and updates to keep the public informed.
- **Ward Analytics**: View data-driven insights on resolution times and high-priority categories.

### 🛡️ Admin Suite
- **User & Role Control**: Manage platform access for citizens and municipal officers.
- **System Oversight**: Review municipal officer verification requests and overall platform health.
- **Donation Ledger**: Transparent tracking of all funds collected for community development.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Lucide React (Icons), Chart.js (Analytics), CSS3 (Premium UI/UX) |
| **Backend** | Node.js, Express.js, JWT (Authentication) |
| **Database** | PostgreSQL |
| **Payments** | Stripe API |
| **Mailing** | Nodemailer (SMTP Integration) |
| **State Mgmt** | React Context API |

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v16+)
- PostgreSQL installed and running

### 2. Clone the Repository
```bash
git clone https://github.com/pra-neupane01/Sundar-Samadhan.git
cd Sundar-Samadhan
```

### 3. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory:
```env
PORT=4849
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sundar_samadhan
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```
Run the server:
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd ../Frontend
npm install
npm run dev
```

---

## 🎨 Design Identity
Sundar Samadhan follows a **Premium Emerald Green** aesthetic (`#22C55E`), symbolizing growth, transparency, and a "Green Nepal." The UI features:
- **Glassmorphism**: Subtle blurs and translucent layers for a modern feel.
- **Micro-interactions**: Smooth hover transitions and animated active state indicators.
- **Responsive Geometry**: Clean pill-based capsule navigation and card-based layouts.

---

## 🤝 Contributing
We welcome contributions to make Nepal more "Sundar"!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/BeautifulAddition`)
3. Commit your Changes (`git commit -m 'Add some Beauty'`)
4. Push to the Branch (`git push origin feature/BeautifulAddition`)
5. Open a Pull Request

---

## 🔒 License
Distributed under the MIT License. See `LICENSE` for more information.

**Sundar Samadhan – Building a more beautiful, accountable, and digital Nepal.**