# Ilham Group E-Commerce Platform

A modern, full-stack e-commerce web application built with Next.js, featuring a robust admin dashboard, user authentication, interactive storefront, and a dynamic shopping cart system.

## 🚀 Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/) for beautiful, pre-built components.
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
- **Carousels/Sliders:** [Swiper.js](https://swiperjs.com/)
- **Animations:** [Motion](https://motion.dev/) (Framer Motion)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

### Backend & Database
- **Database:** [MongoDB](https://www.mongodb.com/)
- **ORM / Schema Modeling:** [Mongoose](https://mongoosejs.com/)
- **API Routes:** Next.js App Router API endpoints

### Authentication & Security
- **Custom Auth:** JWT (JSON Web Tokens) using `jose` and `jsonwebtoken`.
- **Social Login:** Google OAuth Integration (`@react-oauth/google`, `google-auth-library`).
- **Security:** Password hashing via `bcryptjs`. Role-based route protection for admin paths via Next.js Middleware.

### Media & Storage
- **Image Hosting:** [Cloudinary API](https://cloudinary.com/) for fast and reliable product image uploads directly from the dashboard.

### Data Fetching & State
- **Data Fetching:** [SWR](https://swr.vercel.app/) and [Axios](https://axios-http.com/) for fast, reactive data fetching with caching.
- **State Management:** React Context API (Global Cart state management).

---

## ✨ Key Features

### 🛍️ Storefront Experience
- **Dynamic Homepage:** Features Hero Sliders, Top Products, Weekly Best Sellers, and an animated "Cyclone Offer" flash sale countdown.
- **Advanced Shop Filters:** Filter by Category, Best Selling, and search functionality.
- **Product Variations:** Selectable Colors and Sizes enforced before adding to cart.
- **Shopping Cart:** Persistent, global cart state tracking unique product variations.
- **Checkout Process:** Fully integrated checkout calculating subtotals, applying discounts, and submitting order details.

### 🛡️ Admin Dashboard (`/dashboard`)
- **Product Management:** Add, edit, and delete products. 
- **Product Visibility Controls:** Quickly toggle products as "Featured" or completely "Disable" them to hide them from the storefront without deleting data.
- **Order Management:** View all customer orders, update statuses (Pending, Processing, Completed), and hover to see exact order details (purchased items, variations, and quantities).
- **Cyclone Offer Management:** Schedule and update the active flash sale.
- **Role Management:** Admins can securely manage and grant admin privileges to other users.

---

## 🛠️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ilham-group
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Cloudinary (Image Uploads)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 📁 Project Structure

* `app/`: Next.js App Router structure containing all pages, layouts, and API endpoints.
* `app/components/`: Reusable React components divided into `home`, `shared`, and UI specific folders.
* `models/`: Mongoose database schemas (Product, Order, User, etc).
* `app/context/`: React Context providers (CartContext).
* `hooks/`: Custom React hooks (e.g., `useFetch` wrapper for SWR).
* `lib/`: Utility functions and database connection logic.
