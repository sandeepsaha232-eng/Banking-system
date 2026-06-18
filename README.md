# GBI Banking System

A full-stack digital banking application with user authentication, OTP-based verification, and a wallet system for managing balances and transactions.

---

## Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (stored as httpOnly cookie)
- Nodemailer (OTP + alert emails)
- bcrypt (password + OTP hashing)

**Frontend**
- Plain HTML, CSS, JavaScript
- Central API method
---

## Project Structure

```
Banking-system/
│
├── Backend/
│   └── src/
│       ├── config/
│       │   ├── db.js                   # MongoDB connection
│       │   └── email.js                # Nodemailer transporter
│       │
│       ├── controllers/
│       │   ├── auth.controller.js      # register, login, logout, verifyOtp
│       │   ├── wallet.controller.js    # balance, deposit
│       │   └── transaction.controller.js
│       │
│       ├── middleware/
│       │   └── auth.middleware.js      # JWT via cookie or Bearer token
│       │
│       ├── models/
│       │   ├── user.model.js           # TTL index on otpCreatedAt (10 min)
│       │   ├── wallet.model.js
│       │   └── transaction.model.js
│       │
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── wallet.routes.js
│       │   └── transaction.routes.js
│       │
│       ├── services/
│       │   ├── authMail.services.js    # OTP generation + email
│       │   └── email.services.js       # login + deposit alert emails
│       │
│       └── main.js
│
├── Frontend/
│   ├── index.html
│   ├── register.html
│   ├── verify-otp.html
│   ├── login.html
│   ├── dashboard.html
│   └── wallet.html
│   │
│   ├── css/
│   │   ├── main.css
│   │   ├── auth.css
│   │   └── dashboard.css
│   │
│   └── js/
│       ├── api.js          # base fetch wrapper, handles 401 globally
│       ├── auth.js         # register, login, logout, verifyOtp, resendOtp (yet to be added)
│       ├── wallet.js       # getBalance, topup
│       ├── guard.js        # redirects to /login if not authenticated
│       └── utils.js        # formatCurrency, showError, showSuccess
│       │ 
│       │
│       └── pages/      # JS logic of all the pages
│           ├── dashboard.js
│           ├── login.js
│           ├── register.js
│           ├── verify-otp.js
│           ├── sendMoney.js
│           └── wallet-page.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- A Gmail account with an App Password for Nodemailer

### Installation

```bash
# clone the repo
git clone https://github.com/nitishsingh10/Banking-system.git
cd Banking-system

# install dependencies
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=your_mongodb_connection_string
EMAIL=your_gmail_address
APP_PASS=your_gmail_app_password
```

> To get a Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords

### Running the Server

```bash
# development (with nodemon)
npm run dev

# production
npm start
```

Server runs at `http://localhost:3000`

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Register a new user |
| POST | `/otp` | No | Verify OTP and activate wallet |
| POST | `/login` | No | Login and set session cookie |
| POST | `/logout` | Yes | Clear session cookie |

### Wallet — `/api/wallet`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/balance` | Yes | Get current wallet balance |
| POST | `/deposit` | Yes | Add funds to wallet |

### Authentication

The server sets a `httpOnly` cookie on login. All protected routes read the token from either:
- the cookie (browser clients), or
- the `Authorization: Bearer <token>` header (Postman / API clients)

---

## User Flow

```
Register → OTP Email → Verify OTP → Login → Dashboard → Wallet
```

1. **Register** — creates an unverified user, sends a 6-digit OTP to email
2. **OTP Verify** — validates OTP (10-minute expiry), creates and links wallet
3. **Login** — returns JWT as httpOnly cookie + user data in response body
4. **Dashboard** — shows user info and current balance
5. **Wallet** — view balance and top up funds

Unverified users are automatically deleted from the database after 10 minutes via a MongoDB TTL index on `otpCreatedAt`.

---

## Key Design Decisions

**OTP security** — OTPs are hashed with bcrypt before being stored. The plain OTP only ever exists in the email. Comparison uses `bcrypt.compare()`.

**Cookie auth** — JWT is stored in an `httpOnly`, `sameSite: strict` cookie. JS on the frontend cannot read or steal it. `secure: true` is enabled automatically in production.

**Dual auth support** — The auth middleware accepts both the cookie and a Bearer token so the API works from a browser and from Postman/mobile clients without any changes.

**TTL cleanup** — MongoDB automatically deletes unverified user documents after 10 minutes. The `verifyOtp` controller also does a manual age check to handle the ~60-second TTL polling delay.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port the server runs on (default: 3000) |
| `JWT_SECRET` | Secret key for signing JWTs |
| `MONGODB_URI` | MongoDB connection string |
| `EMAIL` | Gmail address used to send emails |
| `APP_PASS` | Gmail App Password for Nodemailer |

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m "feat: your feature"`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request against `dev`

---

## Team

Built by [@nitishsingh10](https://github.com/nitishsingh10) and contributors.