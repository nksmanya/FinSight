# FinSight Dashboard

FinSight is a modern, responsive, and intuitive Finance Dashboard React Application. It provides users and administrators with financial insights, transaction management, and a comprehensive overview of financial health.

## Features

- **Dashboard Overview:** Displays total balance, income, expenses, and trends with interactive charts (using `recharts`).
- **Insights Section:** Provides AI-driven analysis of spending habits including highest spending categories, monthly comparisons, savings rate, and most active spending days.
- **Transaction Management:** Full CRUD (Create, Read, Update, Delete) capability on financial transactions. Features include filtering (by type or category), sorting, and CSV export.
- **Role-Based Access Control (RBAC):** Toggle between 'Admin' and 'Viewer' roles to see how permissions affect the UI. Admins can add/edit/delete transactions, while Viewers have read-only access.
- **Responsive Design:** Optimized for mobile, tablet, and desktop viewing with an intelligent layout structure.
- **Light/Dark Mode:** Full support for system-based or manual theme toggling via `next-themes`.

## Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router) with React 19
- **Styling:** Tailwind CSS with `shadcn/ui` components for clean and accessible design.
- **State Management:** React Context API (`RoleContext` and `TransactionContext`). Complex state filtering and derivations are handled robustly via custom hooks (`useTransactions.ts`).
- **Data Persistence:** Local Storage syncing to ensure changes are persisted across reloads.
- **Icons:** `lucide-react`
- **Charts:** `recharts` for scalable and interactive visualizations.

## Getting Started

### Prerequisites

Make sure you have Node.js (v20+) installed on your machine.

### Installation

1. Clone the repository and navigate to the project root:
   ```bash
   cd finsight
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to explore FinSight.

## Approach & Design Decisions

### State Management
State was managed using standard **React Context** combined with custom hooks to keep components clean. 
- `TransactionContext` holds the source of truth for all transactions and handles Local Storage persistent synchronization.
- `RoleContext` stores the active mock user role, cleanly propagating `isAdmin` access checks down to the UI.

### Data Flow
We abstracted data manipulation (sorting, filtering, pagination) into the `useTransactions` hook. This ensures that the UI layers (like the Transactions table and Insights cards) remain declarative and simply display the processed subsets of data.

### UI / UX
We adopted a clean, minimalist design utilizing `shadcn/ui` and raw Tailwind CSS. Responsive design was implemented gracefully with CSS Grid and Flexbox, wrapping complex dashboard elements accurately on mobile breakpoints. Empty states and toast notifications (`sonner`) were added to inform users of actions (like adding or exporting data).

## License
MIT

