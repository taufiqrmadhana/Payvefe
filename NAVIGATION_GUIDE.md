# GajiChain - Navigation Guide

## Overview
GajiChain is a modern payroll application for Indonesian startups. This application includes 10 different pages/views showcasing the complete user journey for both HR administrators and employees.

## Page Structure

### 1. **Landing Page** (Default)
- Modern fintech landing page
- Hero section with demo dashboard preview
- Problem/Solution sections
- How it works (3 steps)
- CTA sections
- **Navigate to:** HR Dashboard, Employee Dashboard

### 2. **HR Dashboard**
- Main admin dashboard
- Stats cards (Total employees, payroll, active, balance)
- Quick payroll action section
- Recent transactions table
- **Navigate to:** Employee List, Payroll Confirmation

### 3. **Employee List Page**
- Complete employee management
- Search and filters (All/Active/Expiring)
- Employee table with pagination
- Bulk actions (when selecting employees)
- **Navigate to:** Add Employee Modal, Payroll Confirmation

### 4. **Add Employee Modal**
- Modal overlay for adding new employees
- Form fields: Name, Email, Wallet, Salary, Contract, Position
- Validation states
- Save and invite options

### 5. **Payroll Confirmation**
- Step 1 of 2 in payroll process
- Summary of payroll details
- Employee preview list (expandable)
- Warning/balance checks
- Confirmation checkboxes
- **Navigate to:** Payroll Processing

### 6. **Payroll Processing**
- Loading/processing state
- Animated progress indicator
- Step-by-step status
- Transaction hash display (when available)
- **Auto-navigates to:** Payroll Success (after ~8 seconds)

### 7. **Payroll Success**
- Success confirmation screen
- Transaction summary
- Expandable transaction details
- Next action cards (Email, Reports, Share)
- Employee status preview
- **Navigate to:** HR Dashboard, Run Payroll Again

### 8. **Employee Dashboard** (Desktop)
- Employee view of their account
- Balance card with withdraw CTA
- Quick stats (Salary, Next payroll, Contract)
- Transaction timeline
- Tips card
- **Navigate to:** Withdraw Modal

### 9. **Withdraw Modal**
- Modal for cashing out to bank
- Amount selection with quick buttons
- Bank selection
- Account details
- Fee breakdown
- Security messaging

### 10. **Mobile Employee Dashboard**
- Mobile-optimized employee view
- Touch-friendly interface
- Bottom navigation
- Simplified transaction cards
- Responsive design for mobile screens

## Quick Navigation Helper

A quick navigation panel is included in the bottom-right corner for easy testing. Use it to jump between pages:

- **Landing**: Main landing page
- **HR Dash**: HR Dashboard
- **Employees**: Employee list
- **Confirm**: Payroll confirmation
- **Success**: Payroll success
- **Employee**: Employee dashboard (auto-switches to mobile on small screens)
- **Mobile**: Force mobile employee view
- **+ Modal**: Open Add Employee modal

## Color Scheme

- **Primary Blue**: #2563EB (warm blue for trust)
- **Accent Orange**: #F97316 (CTAs and actions)
- **Success Green**: #10B981 (confirmations)
- **Background**: White and light gray (#F9FAFB)

## Indonesian Context

The application uses:
- Bahasa Indonesia for all copy
- Rupiah (Rp) currency formatting
- Indonesian names (Andi, Budi, Citra, etc.)
- Local bank names (BCA, Mandiri, BRI, BNI)
- Indonesian date format (25 Jan 2026)

## Design Philosophy

Following the brief:
- ✅ Modern fintech aesthetic (NOT crypto-looking)
- ✅ Warm and approachable (NOT cold/corporate)
- ✅ Real data examples (NO Lorem ipsum)
- ✅ Subtle shadows and rounded corners
- ✅ Clean whitespace and breathable layouts
- ✅ Professional but friendly tone

## User Flows

### HR Admin Flow
1. Landing → HR Dashboard
2. HR Dashboard → Employee List → Add Employee
3. HR Dashboard → Payroll Confirmation → Processing → Success
4. Success → Back to Dashboard

### Employee Flow
1. Landing → Employee Dashboard
2. Employee Dashboard → Withdraw Modal
3. View transactions and balance
4. Mobile-responsive on smaller screens

Enjoy exploring GajiChain! 🚀
