# Ilham Group - E-commerce Platform

A modern, high-performance e-commerce platform built with **Next.js**, featuring a premium design, secure authentication, and a robust admin dashboard.

## 🚀 Key Features

- **Authentication System**: 
  - Google OAuth Integration.
  - Phone Number & Email registration/login.
  - Secure session management using JWT and HttpOnly cookies.
- **Shopping Experience**:
  - Dynamic **Cyclone Offer** (Flash Sale) with real-time countdown.
  - Category-based product browsing.
  - Featured and Best Selling product sections.
  - Interactive product sliders using Swiper.js.
- **User Features**:
  - Secure Checkout flow for guests and registered users.
  - Password visibility toggle on login/register.
- **Admin Dashboard**:
  - **Cyclone Offer Manager**: Control global sale status and select products.
  - **Product Management**: Create, update, and delete products.
  - **Order Tracking**: Manage customer orders.
  - **Role-based Access**: Protected dashboard routes for administrators.

## 🛠 Tech Stack

### Frontend & Framework
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (motion/react)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

### Backend & Database
- **Runtime**: Node.js (Next.js Serverless Functions)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Auth**: Google Auth Library & JSON Web Tokens (JWT)
- **Security**: Bcrypt.js for password hashing, Jose for Edge-compatible middleware.

### Libraries
- **Sliders**: Swiper.js
- **API Client**: Axios
- **Data Fetching**: SWR (custom useFetch hook)

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ilham-group
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `app/`: Next.js App Router (pages and API routes).
- `app/components/`: Reusable UI components (Shared, Home, Dashboard).
- `app/context/`: React Context providers (Auth, etc.).
- `models/`: Mongoose schemas for MongoDB.
- `lib/`: Shared utility functions and database connection.
- `hooks/`: Custom React hooks.
- `public/`: Static assets (images, icons).

## 📄 License

This project is developed for **Ilham Group**. All rights reserved.
