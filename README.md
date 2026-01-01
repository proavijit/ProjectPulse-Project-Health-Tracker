# ProjectPulse - Project Health Tracker

ProjectPulse is a production-ready internal project monitoring system designed to track project health, client satisfaction, and delivery risks. It provides role-specific dashboards for Admins, Employees, and Clients to ensure transparent and efficient project management.

## 🚀 Features

- **Automated Health Scoring**: A unique algorithm that calculates project health (0-100) based on client satisfaction, employee confidence, timeline progress, and active risks.
- **Role-Based Dashboards**:
  - **Admin**: Global oversight, project management, and a centralized Risk Repository.
  - **Employee**: Assigned project tracking, weekly check-ins, and risk reporting.
  - **Client**: Health score visualization and weekly satisfaction feedback.
- **Activity Timeline**: A detailed, automated audit trail of all project events.
- **Risk Management**: Structured reporting and mitigation tracking for delivery hazards.
- **Premium UI**: Modern, responsive design built with Next.js and Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Axios, React Hook Form
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT Authentication, Role-Based Access Control (RBAC), Bcrypt password hashing

## 📦 Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/proavijit/ProjectPulse-Project-Health-Tracker.git
   cd ProjectPulse-Project-Health-Tracker
   ```

2. **Configure Backend**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://127.0.0.1:27017/projectpulse
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   ```

3. **Configure Frontend**:
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env.local` file in the `client` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
   ```

4. **Seed the Database**:
   ```bash
   cd ../server
   npm run seed
   ```

## 🏃 Driving the Application

1. **Start Backend**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd client
   npm run dev
   ```

3. **Login with Demo Credentials**:
   - **Admin**: `admin@projectpulse.com` / `admin123`
   - **Employee**: `employee@projectpulse.com` / `employee123`
   - **Client**: `client@projectpulse.com` / `client123`

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by ProjectPulse Team
