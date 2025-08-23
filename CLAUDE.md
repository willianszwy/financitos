# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Financitos** is a Progressive Web App (PWA) for personal finance management with the following key features:
- Monthly management of income, expenses, and investments
- Upload receipts to Google Drive with organized folder structure
- Automatic due date notifications at 10:00 AM
- Shopping list module (App Comprinhas)
- Offline functionality with automatic Google Drive synchronization

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Forms**: React Hook Form
- **Date handling**: Date-fns
- **Icons**: Lucide Icons
- **PWA**: Service Worker (Workbox), Web App Manifest
- **APIs**: Google Drive API v3, Google OAuth2, File System Access API
- **Storage**: Local Storage (offline), Google Drive (sync), IndexedDB (cache)

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── forms/           # Specific forms
│   ├── modals/          # Modal components
│   └── cards/           # Summary cards
├── pages/
│   ├── Financitos/      # Main finance page
│   └── Comprinhas/      # Shopping list page
├── hooks/
│   ├── useGoogleDrive/  # Google Drive integration
│   ├── useLocalStorage/ # Local storage management
│   └── useNotifications/ # Push notifications
├── services/
│   ├── googleDrive.ts   # Google Drive API
│   ├── storage.ts       # Data management
│   └── notifications.ts # Notification system
├── utils/
│   ├── calculations.ts  # Financial calculations
│   ├── formatters.ts    # Data formatting
│   └── dates.ts         # Date manipulation
├── types/
│   ├── financial.ts     # Financial data types
│   └── shopping.ts      # Shopping list types
└── styles/
    └── globals.css      # Tailwind global styles
```

## Core Features

### Financial Management
- **Entradas (Income)**: Source, date, and amount tracking
- **Saídas (Expenses)**: Description, type (Fixed/Unique), due date, payment status, payment method, receipts
- **Investimentos (Investments)**: Savings and CDI tracking with automatic growth calculations

### Shopping List (Comprinhas)
- Item description, estimated price, priority levels (High 🔴/Medium 🟡/Low 🔵), deadline, product links

### Google Drive Integration
- OAuth2 authentication
- Organized folder structure: `/Financitos/dados/` for JSON data, `/Financitos/comprovantes/YYYY-MM/` for receipts
- Automatic synchronization with offline support

## Color Palette

- **Income (Green)**: #139469ff / #077552ff
- **Expenses (Red)**: #992525ff / #700909ff
- **Investments (Blue)**: #1f498dff / #06173bff
- **Priority High**: 🔴 #a85959ff
- **Priority Medium**: 🟡 #ddb56fff
- **Priority Low**: 🔵 #5c85c7ff

## Data Models

### Financial Data Structure
- Monthly organization (YYYY-MM.json format)
- Income: source, date, amount
- Expenses: description, type, due_date, payment_date, status, payment_method, amount, receipt_path
- Investments: bank, current_value, growth, rate, projection

### Notifications
- Push notifications for due dates at 10:00 AM
- Content includes item name and amount

## Development Notes

- Implement PWA manifest and service worker for offline functionality
- Use React Hook Form for all form handling with proper validation
- Implement proper TypeScript types for all data structures
- Follow mobile-first responsive design principles
- Ensure proper error handling for Google Drive API calls
- Implement proper loading states for all async operations
- sempre criar testes