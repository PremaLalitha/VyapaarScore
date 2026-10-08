# 🚀 VyapaarScore — Quick Setup & Execution Guide

Follow this simple, step-by-step guide to extract, install, and run **VyapaarScore** on your local machine.

---

## 📌 Prerequisites

Before running the project, make sure you have the following installed on your computer:

1. **Node.js** (v18.0.0 or higher): [Download Node.js](https://nodejs.org/)
2. **MongoDB** (Local MongoDB Community Server or MongoDB Atlas):
   - Local MongoDB running on `mongodb://127.0.0.1:27017`
3. **Git / Terminal / PowerShell**

> 💡 **Tip for Zipping/Sharing**: Before creating the `.zip` file to send to a friend, delete the `node_modules` folders inside both `client/node_modules` and `server/node_modules`. This will reduce the file size from ~400MB down to ~5MB!

---

## 🛠️ Step-by-Step Installation & Launch

### Step 1: Extract the ZIP File
1. Right-click the `.zip` file and select **Extract All**.
2. Open the extracted folder `VyapaarScoreee` in **Visual Studio Code** or your preferred code editor.

---

### Step 2: Configure Backend Environment (`server/.env`)
1. Open the `server` folder.
2. Check if a `.env` file exists. If not, create a new file named `.env` inside `server/` and paste the following configuration:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vyapaarscore
JWT_SECRET=vyapaarscore_secret_jwt_key_2026_safe_dev

# Real Email Delivery via Gmail SMTP (2FA OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=premalalitha08@gmail.com
SMTP_PASS=infxfifuhdleuhfo
EMAIL_FROM="VyapaarScore Verification" <premalalitha08@gmail.com>

# Hide OTP on webpage (Only send to email)
HIDE_DEV_OTP=true
```

---

### Step 3: Install & Start Backend Server

Open your terminal in VS Code and run:

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Start Express backend server
npm run dev
```

✅ You should see:
```text
==================================================
🚀 VyapaarScore Backend running on http://localhost:5000
==================================================
MongoDB Connected: 127.0.0.1
```

---

### Step 4: Install & Start Frontend Application

Open a **SECOND terminal window** (do not close the server terminal):

```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start Vite React frontend
npm run dev
```

✅ You should see:
```text
VITE v5.4.21  ready in 1500 ms

➜  Local:   http://localhost:3000/
```

---

### Step 5: Open Application in Browser

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)** *(or http://localhost:5173)*

---

## 🔑 System Admin Credentials

To access the **System Admin Panel** (`/admin`) and manage user roles:

| Role | Authorized Admin Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| 👑 **System Super Admin** | `premalalitha08@gmail.com` | Any password (e.g. `admin123`) | Monitor system statistics, view all registered merchants/lenders, and dynamically update user roles. |

> ℹ️ *Note*: When signing up or logging in with `premalalitha08@gmail.com`, the system automatically recognizes the email as the System Super Admin and sends the 2FA OTP security code to your inbox.

---

## 🛍️ How to Test Merchant & Lender Roles

Click **Sign Up** on the website to test the user roles:

1. 🛍️ **Micro-Merchant Account**:
   - Register selecting **Merchant** role.
   - Enter your email, verify via 2FA OTP sent to your inbox.
   - Go to `/upload` to drag & drop PhonePe/GPay screenshots or PDF bank statements.
   - Click **Save to Ledger** and watch your credit score (300 to 900) update live.
   - Click **Download Official PDF Report** to view your generated credit evaluation document.

2. 🏦 **NBFC Lender Account**:
   - Register a second account selecting **Lender** role.
   - Open `/lender` to view all merchants who opted to share their credit profile.
   - Evaluate scores, download PDF reports, and click **Approve** or **Reject** to send automated email decision alerts.

---

## ❓ Troubleshooting

- **Error: `EADDRINUSE: address already in use :::5000`**
  - Another process is using port 5000. Close any running Node processes or restart your computer.
- **MongoDB Connection Error**:
  - Make sure MongoDB service is running on your machine. If using MongoDB Atlas, update `MONGODB_URI` in `server/.env` with your Atlas connection string.
- **Python / PaddleOCR & Tesseract.js**:
  - Primary OCR runs via **PaddleOCR**. If Python or PaddleOCR is unavailable, the application automatically falls back to **Tesseract.js OCR** with 100% functionality.
