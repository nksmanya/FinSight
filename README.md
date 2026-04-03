# FinSight - Financial Intelligence Dashboard

Finsight is a comprehensive, modern financial dashboard application built with Next.js and React. It provides powerful insights into your financial health with interactive charts, transaction management, and role-based access control. Perfect for tracking income, expenses, and understanding your spending patterns at a glance.

---

## Key Features

### Dashboard
- **Total Balance Card** - Displays net position with trend indicators and teal-colored styling for visual prominence
- **Income & Expense Cards** - Color-coded metrics (green for income, red for expenses) with month-over-month comparisons
- **Balance Trend Chart** - Interactive dual-area chart showing income vs. expenses with 3M/6M/1Y range toggle
- **Spending Donut Chart** - Visual breakdown of spending by category with interactive hover states
- **Monthly Comparison Chart** - Month-by-month financial comparison with animated bar charts
- **Recent Activity Feed** - Latest transactions displayed with detailed information

### Insights Section
- **Financial Pulse Cards** - Three key metrics:
  - Highest Spending Category (color-coded in blue)
  - Latest Month Spend (displayed in red)
  - Net Position (color-coded: green for positive, red for negative)
- **Full Category Breakdown** - Ranked spending categories with color-coded bars
- **Top Expense Categories** - Donut chart with center overlay showing category analysis
- **Monthly Comparison Analysis** - Month-by-month spending trends with hover interactions
- **Insight Radar Signals** - AI-driven analysis including:
  - Category Concentration analysis
  - Income Coverage tracking
  - Savings Strength metrics
  - Expense Pressure indicators
- **Action Board** - Recommended actions based on spending patterns
- **Narrative Snapshot** - Text-based financial summary with highlighted top spending categories
- **Smooth Animations** - Staggered reveals and transitions using Framer Motion

### Transaction Management
- **Full CRUD Operations** - Create, read, update, and delete transactions
- **Advanced Filtering**:
  - Filter by transaction type (Income/Expense)
  - Filter by spending category
  - Date range filtering (All Dates / Current Month / Custom Range)
- **Search Functionality** - Search transactions by description or category
- **Sorting Options** - Sort by date or amount in ascending/descending order
- **Pagination** - Display control (10, 25, 50, or 100 items per page)
- **CSV Export** - Export filtered transactions to CSV format
- **Real-time Stats** - Live display of income, expenses, and transaction count

### Role-Based Access Control (RBAC)
- **Admin Role**:
  - Full access to all features
  - Can add, edit, and delete transactions
  - Admin Controls in settings for user and data management
  - General system settings
- **Viewer Role**:
  - Read-only access to all data
  - Can filter and search transactions
  - Limited settings with display preferences

### Settings Page
- **Admin Controls** - User management, data management (export/reset), system configuration
- **General Settings** - Application name and version information
- **Viewer Settings** - Theme selection, notification preferences, data display options
- **Role-Specific Interface** - Different sections based on user role

### UI/UX Features
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- **Light/Dark Mode** - System-based or manual theme toggling
- **Color-Coded Metrics** - Green for positive values, red for expenses/negative values
- **Interactive Charts** - Hover interactions, custom tooltips, smooth animations
- **Polished Components** - Clean card layouts with shadow effects and transitions
- **Accessibility** - Semantic HTML and keyboard navigation support

---

## Tech Stack

| Category | Technologies |
|----------|---------------|
| **Frontend Framework** | Next.js 16.2.2 (App Router) with React 19.2.4 |
| **Styling** | Tailwind CSS 4 with shadcn/ui components |
| **Animations** | Framer Motion 12.38.0 |
| **Charts & Visualization** | Recharts 3.8.1 |
| **State Management** | React Context API (RoleContext, TransactionContext) |
| **Icons** | Lucide React 1.7.0 |
| **Theming** | Next-Themes 0.4.6 |
| **Toast Notifications** | Sonner 2.0.7 |
| **Data Persistence** | Browser LocalStorage |

---

## Getting Started

### Prerequisites
- Node.js v20+ 
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/finsight.git
   cd finsight
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

---

---

## Usage Scenarios

### For Users (Viewer Role)
- View financial dashboards and insights
- Search and filter transactions
- Export transaction data to CSV
- Customize display preferences in settings

### For Administrators (Admin Role)
- Full control over transactions
- Access admin settings for system configuration
- User and data management capabilities
- Generate reports and export data


---

## Color Palette

- **Primary Green** - Income, positive metrics (#10b981)
- **Primary Red** - Expenses, negative metrics (#ef4444)
- **Primary Blue** - Category highlights (#3b82f6)
- **Teal** - Main balance card background (#14b8a6)
- **Neutral** - Backgrounds and borders (Tailwind slate/gray)

---

## Chart Features

- **Interactive Tooltips** - Dark-themed custom tooltips with smooth animations
- **Hover States** - Visual feedback on chart interactions
- **Responsive Containers** - Charts scale to parent container
- **Smooth Animations** - Entrance animations with staggered timing
- **Color Consistency** - Category colors matched across all visualizations

---

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

