# Setup Instructions

## Prerequisites

- Node.js (v18+)
- npm or yarn

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```


## Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/thrift_marketplace
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# Email (use Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

CLIENT_URL=http://localhost:5173
```

> **Note**: For Google OAuth, create credentials at [Google Cloud Console](https://console.cloud.google.com/). For email, enable 2FA on Gmail and generate an App Password.

## Step 3: Seed Dummy Data

```bash
npm run seed
```

This creates sample users:
- `admin@thrift.com` / `123456` (admin)
- `seller@thrift.com` / `123456` (seller)
- `buyer@thrift.com` / `123456` (buyer)

## Step 4: Start Backend

```bash
npm run dev
```

Server runs at `http://localhost:5000`

## Step 5: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 6: Configure Frontend Environment (Optional)

Create `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

> Required only for Google login button to work.

## Step 7: Start Frontend

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## Payment Testing

The app uses **mock payment APIs** for eSewa and Khalti. When you checkout:
1. Select eSewa or Khalti as payment method
2. Click "Pay" — it simulates a successful transaction
3. Order status becomes `partial_paid`
4. Remaining 50% is paid as Cash on Delivery

## Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running (`mongod`) or check your `MONGO_URI` |
| Email not sending | Check EMAIL_USER and EMAIL_PASS. Use Gmail App Password, not regular password |
| CORS errors | Ensure `CLIENT_URL` matches your frontend URL |
| Google login fails | Check `VITE_GOOGLE_CLIENT_ID` matches your Google OAuth credentials |
