# FloraVerse 🌿

FloraVerse is a comprehensive digital ecosystem designed for plant enthusiasts. It combines a vibrant marketplace for buying and selling plants with an advanced AI-powered gardening assistant to help users identify plants and diagnose diseases.

## 🚀 Features

### 🛒 Dual-Role Marketplace
*   **For Buyers**: Browse a curated selection of plants, seeds, and gardening tools. Integrated cart system for a seamless shopping experience.
*   **For Sellers**: Dedicated dashboard to list products, manage inventory, and receive order notifications.

### 🤖 AI Gardening Assistant (FloraBot)
*   **Expert Advice**: Powered by Google Gemini AI to answer any gardening or botanical questions.
*   **Plant Identification**: Upload an image to identify plant species instantly.
*   **Disease Diagnosis**: Get organic and chemical treatment recommendations for sick plants via image analysis.

### ✨ Modern User Experience
*   **Responsive Design**: Optimized for mobile, tablet, and desktop using Tailwind CSS.
*   **Persistant State**: Uses local storage to keep your session and cart data safe across browser refreshes.
*   **Elegant UI**: Clean, glassmorphism-inspired design with smooth transitions.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)
*   **AI Integration**: Google Gemini 2.0 Flash
*   **Icons**: Lucide React

## 🏁 Getting Started

### Prerequisites
*   Node.js (Latest LTS recommended)
*   MongoDB (installed locally or a cloud URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd FloraVerse
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**
    ```bash
    cd server
    npm install
    cd ..
    ```

4.  **Environment Setup**
    
    **Frontend (.env)**
    Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```

    **Backend (server/.env)**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/floraverse
    ```

5.  **Run the Application**

    You need to run both the backend and frontend servers.

    **Terminal 1 (Backend):**
    ```bash
    cd server
    npm start
    ```

    **Terminal 2 (Frontend):**
    ```bash
    npm run dev
    ```
    
    The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI components
├── context/         # Store management & Auth (connected to backend)
├── pages/           # Page-level components
├── services/        # Gemini AI integration
└── types.ts         # TypeScript definitions

server/
├── models/          # Mongoose models (Product, Order, User)
└── index.js         # Backend API entry point
```

## 📄 License
This project is for educational purposes.
