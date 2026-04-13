# CashFlow — Branch Transaction Management System

## Default Login
- **Email:** admin@cashflow.com
- **Password:** Admin@123

---

## Project Structure

```
cashflow_v2/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database queries
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   └── config/db.js     # MySQL connection
│   ├── schema.sql           ← Run this first in MySQL
│   ├── server.js
│   ├── .env                 ← Set your DB password here
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Layout, DataTable, SummaryCard
    │   ├── pages/           # All pages
    │   ├── services/api.js  # API calls
    │   └── utils/           # formatting, export helpers
    ├── .env                 ← API URL config
    └── package.json
```

---

## Setup Instructions

### Step 1 — Database
1. Open MySQL Workbench or your MySQL client
2. Open `backend/schema.sql`
3. Run the entire file
4. This creates the `cashflow` database with all tables + default admin user

### Step 2 — Backend
```bash
cd backend
# Open .env and set your MySQL password:
#   DB_PASSWORD=your_actual_password

npm install
npm run dev
# Backend runs on http://localhost:5000
```

### Step 3 — Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### Step 4 — Login
Go to http://localhost:3000 and log in with:
- Email: admin@cashflow.com
- Password: Admin@123

---

## How It Works

### Branch Manager
- **Dashboard** — Today's total, bill total, profit. Monthly summary with 30/70 split.
- **New Transaction** — Enter amount, select portal, optionally apply discount. Live profit preview shown.
- **Transaction List** — View/filter all transactions. Export to CSV.
- **Expenses** — Add monthly expenses. Deducted from profit at month-end.
- **Excel Export** — Download full monthly report (.xls) with all figures.

### Admin
- **Overview** — All-branch performance table for selected month.
- **Branches** — Create, edit, delete branches.
- **Users** — Create branch managers and operators, assign to branches.
- **Portals** — Create portals with their charge % (portal cost deducted from profit).
- **Settings** — Set Bill Payment %, CC Transfer %, and 30/70 profit split ratio.
- **All Transactions** — View all transactions across all branches with branch filter.

### Profit Formula
```
Customer Charge = Transaction Amount × (Bill/CC Rate %)
Portal Cost     = Transaction Amount × Portal Charge %
Profit          = Customer Charge − Discount − Portal Cost

Net Profit (monthly) = Total Profit − Total Expenses
Branch Manager gets  = Net Profit × 30%
Head Manager gets    = Net Profit × 70%
```

---

## Charge Defaults (editable in Admin → Settings)
| Type | Customer Charge |
|------|----------------|
| Bill Payment | 3.5% |
| CC Transfer  | 2.5% |

Portal charges are set per-portal in Admin → Portals.
