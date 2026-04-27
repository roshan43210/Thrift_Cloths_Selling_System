# Gmail OTP Setup Guide

## Why OTP goes to terminal instead of real email?

Gmail **does NOT allow** using your regular account password for apps. You must use an **App Password**.

## Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication (2FA)
1. Go to https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under **"Signing in to Google"**, click **2-Step Verification**
4. Follow the steps to enable 2FA (you'll need your phone)

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
   (Or: Security → 2-Step Verification → scroll down → **App passwords**)
2. Select **App**: Mail
3. Select **Device**: Other (Custom name) → type "Thrift Marketplace"
4. Click **Generate**
5. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

### Step 3: Update your .env file
Open `backend/.env` and update these values:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_actual_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password_here
```

**IMPORTANT:**
- `EMAIL_USER` = your full Gmail address (e.g., `john@gmail.com`)
- `EMAIL_PASS` = the 16-character App Password (NOT your Gmail login password)
- Remove any spaces from the App Password (e.g., `abcdefgh12345678`)

### Step 4: Restart the server
```bash
cd backend
npm run dev
```

### Step 5: Test
1. Register a new user with a real email address
2. Check your email inbox (and spam folder)
3. The OTP should arrive within seconds

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid login" | Make sure you're using App Password, not regular password |
| "Less secure app access" | Enable 2FA first, then generate App Password |
| Email not received | Check spam/junk folder |
| "Username and Password not accepted" | Regenerate a new App Password |
| Using Google Workspace? | Admin must allow "Less secure apps" or use App Passwords |

## Still not working?

The OTP will always be shown in the terminal as a fallback. You can:
1. Copy the OTP from the terminal
2. Paste it in the verification screen

This ensures registration always works even if email is not configured.
