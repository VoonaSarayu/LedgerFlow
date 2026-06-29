# LedgerFlow — AI-Powered Billing & Subscription Platform

[![GitHub](https://img.shields.io/badge/GitHub-LedgerFlow-181717?style=for-the-badge&logo=github)](https://github.com/VoonaSarayu/LedgerFlow)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

LedgerFlow is a premium billing and invoicing platform built for modern finance teams, SaaS operators, and revenue-driven businesses. It brings together subscription management, invoice automation, customer insights, and AI-assisted operations into a single elegant experience.

With a polished dark-mode UI and a robust full-stack architecture powered by React, TypeScript, Express, Prisma, and SQLite, LedgerFlow helps teams manage billing workflows with speed, clarity, and control.

---

## ✨ Key Features

- AI-assisted billing console for natural-language operations and workflow simulation
- Interactive billing playground for pricing and revenue scenario planning
- Analytics dashboard with SaaS metrics like MRR, LTV, churn, and payment performance
- Customer and invoice management tools with structured statuses and workflow tracking
- Secure role-based access control for multi-user collaboration
- Premium glassmorphism-inspired UI with a modern dark theme

---

## Why LedgerFlow

LedgerFlow is built to help teams move from scattered billing workflows to a centralized, intelligent operations hub. It brings together finance, customer data, and automation in one place so teams can manage subscriptions, invoices, and revenue insights with greater clarity and control.

Whether you are overseeing a growing SaaS business or managing complex billing operations, LedgerFlow provides a cleaner, faster, and more professional way to stay on top of financial performance.

---

## 📸 Demo & Screenshots

LedgerFlow is designed to feel premium, modern, and highly usable. The following views highlight the experience across the product:

- Dashboard overview with billing and growth insights
- Invoices and customer management screens
- Subscription and payment monitoring views
- AI-assisted console for operational commands and workflow simulation

Below are live screenshots from the LedgerFlow application.

### Dashboard Overview
![Dashboard screenshot](public/screenshots/screenshot-hero.png)

### Interactive Billing Playground
![Billing Playground screenshot](public/screenshots/screenshot-billing.png)

### AI-Powered Developer Console
![AI Console screenshot](public/screenshots/screenshot-console.png)

---

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind-inspired styling and custom UI components

### Backend
- Node.js + Express
- Prisma ORM
- SQLite database
- JWT-based authentication with cookie support

---

## 📂 Project Structure

```text
LedgerFlow/
├── server/                  # Express + Prisma backend
│   ├── prisma/              # Prisma schema and database files
│   ├── src/                 # API routes, middleware, and server entrypoint
│   ├── test_api.js          # API verification script
│   └── package.json         # Backend dependencies and scripts
├── src/                     # React frontend application
│   ├── components/          # Reusable UI components
│   ├── context/             # Auth and global state providers
│   ├── pages/               # Dashboard and management views
│   ├── App.tsx              # Routing setup
│   └── main.tsx             # Application entrypoint
├── index.html               # Vite HTML entry
└── package.json             # Frontend dependencies and scripts
```

---

## 🔌 API Overview

All protected endpoints are served under `/api` and require authentication unless explicitly listed as public.

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a company and admin user |
| POST | `/api/auth/login` | Sign in and create an authenticated session |
| POST | `/api/auth/logout` | Clear the active auth session |
| GET | `/api/auth/me` | Retrieve the current authenticated user |

### Billing and Operations
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/invoices` | List invoices with optional filters |
| GET | `/api/invoices/stats` | Retrieve invoice and billing summaries |
| POST | `/api/invoices` | Create a new invoice |
| PUT | `/api/invoices/:id` | Update invoice details or status |
| DELETE | `/api/invoices/:id` | Remove an invoice |
| GET | `/api/customers` | Retrieve customer records |
| POST | `/api/customers` | Create a new customer |
| GET | `/api/payments` | View payment history |
| POST | `/api/payments` | Record a manual payment |
| GET | `/api/analytics` | Fetch analytics metrics |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment example file and configure it:
   ```bash
   copy .env.example .env
   ```
4. Update the `.env` file with your local values:
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key-here-change-in-production"
   FRONTEND_URL="http://localhost:5173"
   ```
5. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
6. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Return to the project root:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the client:
   ```bash
   npm run dev
   ```
4. Open the app at http://localhost:5173

### Verification
To test the backend endpoints locally, run:
```bash
cd server
node test_api.js
```

---

## 🛡️ License

This project is licensed under the MIT License. See the LICENSE file for details.
