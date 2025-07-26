# 🍕 Full-Stack Pizza Delivery App

A complete pizza ordering and delivery application built with a modern tech stack, featuring user authentication, custom pizza builder, payment integration, and admin dashboard for inventory and order management.

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Razorpay SDK (payment integration)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Nodemailer (email verification + password reset)

---

## ✅ Features

### 👤 User Module
- User Registration & Login with JWT
- Email Verification
- Forgot & Reset Password
- View Pizza Varieties
- Build Your Own Pizza (custom base, sauce, toppings, cheese, meat)
- Place Order with Razorpay
- View Order Status

### 🛒 Admin Module
- Login to Admin Panel
- Add/Update Inventory Items (base, sauce, cheese, veggies, meat)
- View All Orders
- Update Order Status: Order Received → In Kitchen → Sent to Delivery

---

## 🚀 Setup Instructions

### 📦 Backend Setup
```bash
cd backend
npm install

# Setup environment variables
.env
# Add MONGO_URI, JWT_SECRET, EMAIL credentials, etc.

# Start backend server
npm start
```

🧪 **Completed Features Breakdown**

## 1. Project Initialization
- ✅ Created React frontend and Node/Express backend
- ✅ Initialized Tailwind CSS

## 2. Authentication Module
- ✅ Built user registration with email verification using **Nodemailer**
- ✅ Added secure login and password reset flows

## 3. Pizza Module
- ✅ Created API to fetch available pizza varieties
- ✅ Built custom pizza builder with base, sauce, cheese, toppings
- ✅ Integrated **Razorpay** for payments

## 4. Admin Panel
- ✅ Added protected routes for admin
- ✅ Added inventory management (add/update items)
- ✅ Built order management with status transitions

## 5. Styling and Theming
- 🎨 Dark theme UI using **TailwindCSS**
- ✅ Responsive grid layouts and smooth UI

## 6. Final Touches
- ✅ Removed unnecessary scrollbars
- ✅ Used conditional rendering and error messages
- ✅ Validated forms and optimized UX

---

📸 **Screenshots (Optional)**  
_Add screenshots of Login Page, Dashboard, Admin Panel, etc._

---

🧑‍💻 **Developer**  
**Shivam Tripathi**

🔗 **Connect with me**
- [LinkedIn](https://www.linkedin.com/in/shivam0975/)  

---
