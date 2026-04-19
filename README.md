# Barracks Prototype

A prototype for our upcoming SIA Project, a Barbershop System. This prototype in particular focuses on the admin side of operations.

## Tech Stack

- **Framework**: Next.js 16.2.3 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Icons**: Lucide React + FontAwesome
- **State**: React Hooks (useState, useMemo)

## Project Structure

```
app/
├── Display/
│   ├── Card.tsx           # Reusable dashboard cards (main & small)
│   ├── Header.tsx         # Navigation header component
│   ├── LandingPage/       # Dashboard landing page
│   └── LoginPage/         # Authentication entry point
├── Records/
│   ├── PageInterface.tsx  # Unified records UI component
│   ├── CustomerRecords/   # Customer management page
│   ├── StaffRecords/      # Staff management page
│   └── InventoryPage/     # Inventory management page
├── data/                  # Static data files
├── globals.css            # Global styles
├── layout.tsx             # Root layout
└── page.tsx               # Entry point (Login)
```


## Features

### Current Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/` | Authentication entry point |
| Dashboard | `/Display/LandingPage` | Main dashboard with overview cards |
| Customer Records | `/Records/CustomerRecords` | Browse, search, manage customers |
| Staff Records | `/Records/StaffRecords` | Browse, search, manage staff |
| Inventory | `/Records/InventoryPage` | Browse, search, manage inventory |

### Dashboard Cards

- **Customer Records** - Total records count + recent activity
- **Staff Records** - Staff count + recent hires
- **Inventory** - Total items + low stock alerts
- **Analytics** - Revenue metrics and trends

## Recent Implementations

- Inventory page now supports frontend-only JSON-seeded CRUD (create, view, edit, delete) with localStorage persistence.
- Stock notification section for low-quantity and high-urgency items.
- Minimalist and cleaner concept for record pages.
