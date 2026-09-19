# FloraVerse 🌿

FloraVerse is a professional, full-stack digital ecosystem for plant enthusiasts. It combines a dynamic marketplace with detailed seller analytics, administrative oversight, and a weather-integrated gardening dashboard.

## 🚀 Key Features

### 💹 Unified Management Dashboard
*   **Role-Based Access**: Single-interface functionality for Sellers and System Administrators.
*   **Global Oversight**: Monitor system-wide orders, track revenue metrics, and manage catalog listings.
*   **Real-Time Analytics**: Visual tracking of weekly sales performance.

### 🛒 Robust Marketplace
*   **Smart Shopping**: Categorized product browsing with real-time stock tracking and search filters.
*   **Detailed Delivery**: Comprehensive checkout flow capturing buyer names, phones, and precise delivery addresses.
*   **Persistent Cart**: Shopping sessions are preserved across browser refreshes for a seamless user experience.
*   **Mock Payment Integration**: Simulation of a professional payment gateway checkout flow.

### 🤖 Smart Gardening Dashboard (Buyer)
*   **Weather-Integrated UI**: Real-time local weather syncing (temperature, humidity, conditions) to help buyers provide optimal care for their purchases.
*   **Personalized Experience**: Dashboard tailored to the user's gardening preferences and shopping history.

## 👥 User Roles

| Role | Access Level | Key Functionalities |
| :--- | :--- | :--- |
| **Admin** | Superuser | View all orders, Global Revenue Tracking, Catalog Management |
| **Seller** | Vendor | List products, Personal Sales Analytics, Order Fulfillment |
| **Buyer** | Customer | Shop, AI Assistant access, Weather-integrated dashboard |

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)
*   **State Management**: React Context API
*   **Visualization**: Custom SVG/Flexbox-based Dynamic Charting
*   **Icons**: Lucide React

## 🏁 Getting Started

### Prerequisites
*   Node.js (LTS version)
*   MongoDB (Installed locally or an Atlas connection string)

### Environment Setup

**Frontend (.env)**
```env
VITE_GEMINI_API_KEY=your_gemini_key_here
```

**Backend (server/.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/floraverse
```

### Installation & Execution

1. **Install Dependencies**:
   ```bash
   npm install       # Root directory
   cd server
   npm install       # Server directory
   ```

2. **Run All Services**:
   - **Backend**: `cd server && npm start` (Runs on port 5000)
   - **Frontend**: `npm run dev` (Runs on port 3000 with API proxying)


