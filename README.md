# Personal Finance Dashboard

A comprehensive personal finance tracking application built with Next.js, MongoDB, and modern web technologies.

## Features

### ✅ Stage 1: Basic Transaction Tracking
- Add/Edit/Delete transactions (amount, date, description)
- Transaction list view with search and sorting
- Monthly expenses bar chart
- Form validation with Zod

### ✅ Stage 2: Categories
- Predefined categories for income and expenses
- Category-wise pie charts
- Dashboard with summary cards
- Recent transactions display

### ✅ Stage 3: Budgeting
- Set monthly category budgets
- Budget vs actual comparison charts
- Spending insights and analytics
- Budget progress tracking

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/finance-app
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-app
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use the local connection string in `.env.local`

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace the `MONGODB_URI` in `.env.local`

## API Routes

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget

## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main dashboard
├── components/
│   ├── charts/             # Chart components
│   ├── dashboard/          # Dashboard widgets
│   ├── forms/              # Form components
│   ├── lists/              # List components
│   └── ui/                 # UI components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── models/             # Database models
│   ├── mongodb.ts          # Database connection
│   ├── data.ts             # Data utilities
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── README.md
```

## Features Overview

### Dashboard
- Summary cards showing total income, expenses, net income, and monthly change
- Monthly expenses chart
- Category breakdown pie charts
- Recent transactions list
- Spending insights

### Transactions
- Add new transactions with category selection
- Edit existing transactions
- Delete transactions with confirmation
- Search and filter transactions
- Sort by date or amount

### Budgets
- Set monthly budgets for expense categories
- Visual progress bars showing budget utilization
- Budget vs actual comparison charts
- Overspending alerts

### Charts & Analytics
- Monthly expenses trend
- Income/expense category breakdowns
- Budget comparison visualizations
- Spending insights and patterns

## Error Handling

- Comprehensive error boundaries
- Loading states for async operations
- User-friendly error messages
- Graceful fallbacks for missing data

## Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.