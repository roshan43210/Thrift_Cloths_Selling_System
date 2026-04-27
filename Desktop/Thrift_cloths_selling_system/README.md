# Thrift Clothing Marketplace

A full-stack e-commerce platform for buying and selling pre-loved (thrift) clothing, similar to Daraz but focused on used fashion.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Tailwind CSS + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Google OAuth |
| Email | Nodemailer (OTP) |
| Payments | Mock eSewa & Khalti APIs |
| Realtime | Socket.io (Chat) |

## Features

- **Authentication**: Email + OTP verification, Google OAuth, JWT sessions
- **User Roles**: Buyer, Seller, Admin
- **Products**: Sellers list thrift items with condition, category, price, images
- **Search & Filter**: By keyword, category, condition, price range
- **Cart & Checkout**: Add to cart, 50% advance payment (eSewa/Khalti/COD), remaining on delivery
- **Reviews**: Buyers rate sellers after order completion
- **Real-time Chat**: Socket.io one-to-one messaging
- **Wishlist**: Save favorite items
- **Admin Panel**: View users, products, orders; remove listings
- **Payment Linking**: Save eSewa ID and Khalti ID to profile

## Project Structure

```
Thrift_cloths_selling_system/
├── backend/
│   ├── config/        # DB connection
│   ├── controllers/   # Business logic (auth, products, orders, chat, etc.)
│   ├── middleware/    # Auth guards, error handling
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── utils/         # Email, OTP, JWT helpers
│   ├── .env.example   # Environment template
│   ├── package.json
│   ├── seeder.js      # Sample data
│   └── server.js      # Entry point + Socket.io
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ProtectedRoute
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # All pages
│   │   ├── services/    # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

| Route | Description |
|-------|-------------|
| `POST /api/auth/register` | Register + send OTP |
| `POST /api/auth/verify-otp` | Verify email |
| `POST /api/auth/login` | Login |
| `POST /api/auth/google` | Google OAuth |
| `GET /api/auth/me` | Current user |
| `PUT /api/auth/profile` | Update profile |
| `GET /api/products` | List products (with filters) |
| `POST /api/products` | Create product (seller) |
| `GET /api/cart` | Get cart |
| `POST /api/cart` | Add to cart |
| `POST /api/orders` | Create order |
| `GET /api/orders/my-orders` | Buyer orders |
| `GET /api/orders/seller-orders` | Seller orders |
| `POST /api/payments/esewa` | Mock eSewa pay |
| `POST /api/payments/khalti` | Mock Khalti pay |
| `GET /api/chat/:userId` | Chat history |
| `GET /api/chat/chats` | Conversation list |
| `POST /api/reviews` | Add review |
| `GET/POST /api/wishlist` | Wishlist |
| `GET /api/admin/users` | Admin: all users |
| `GET /api/admin/products` | Admin: all products |

## Sample Users (after seeding)

| Email | Password | Role |
|-------|----------|------|
| admin@thrift.com | 123456 | admin |
| seller@thrift.com | 123456 | seller |
| buyer@thrift.com | 123456 | buyer |
| jane@thrift.com | 123456 | seller |
