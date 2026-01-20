# GajiChain - Professional B2B SaaS Payroll Platform

## Overview
GajiChain is a modern, professional B2B SaaS payroll application built for remote teams. This application showcases a complete blockchain-based payroll system with **17 distinct pages** covering authentication, onboarding, HR admin workflows, employee views, and comprehensive error handling.

## Design Philosophy

### Professional B2B SaaS Aesthetic
- **English Language Only** - All text, labels, and copy in English
- **No Emojis** - Professional, clean interface throughout
- **Modern Typography** - Inter font family, clear hierarchy
- **Subtle Design** - 6px border radius, minimal shadows
- **Clean Color Palette** - Navy (#1E40AF), Indigo (#6366F1), neutral grays

### Design References
- Stripe Dashboard
- Linear Workspace
- Vercel Platform
- Railway Dashboard

## Color Palette

```css
Primary Navy:    #1E40AF  (main actions, branding)
Accent Indigo:   #6366F1  (highlights, active states)
Success Green:   #10B981  (confirmations, success)
Warning Amber:   #F59E0B  (warnings, expiring)
Error Red:       #EF4444  (errors, destructive)
Gray Scale:      #F9FAFB to #111827
Background:      #FFFFFF, #F9FAFB
```

## Complete Page Structure (17 Pages)

### Authentication & Onboarding

#### 1. Landing Page
- Hero section with value proposition
- Current pain points (3 problems)
- Solution showcase (3 features)
- Technology stack overview
- Professional CTA sections
- **Navigate to:** Authentication, HR Dashboard, Employee Dashboard

#### 2. Authentication (Login/Signup)
- Split screen layout
- Account type selector (Company/Employee)
- Google OAuth option
- Magic link email authentication
- Brand showcase with testimonials
- **Navigate to:** Company Onboarding, Employee Onboarding

#### 3. Company Onboarding (4 Steps)
- Step 1: Company Information (name, size, industry, country)
- Step 2: Wallet Setup (create new or connect existing)
- Step 3: Fund Account (bank transfer or crypto)
- Step 4: Invite Team (add HR members)
- Progress indicator throughout
- **Navigate to:** HR Dashboard

#### 4. Employee Invitation Email
- Professional email template preview
- Setup instructions (3 numbered steps)
- Contract details display
- CTA button to employee onboarding
- Mobile responsive email design

#### 5. Employee Onboarding (4 Steps)
- Step 1: Welcome (benefits overview)
- Step 2: Wallet Setup (create or connect)
- Step 3: Add Bank Account (for withdrawals)
- Step 4: Review Contract (employment details)
- Consumer-friendly language
- **Navigate to:** Employee Dashboard

### HR Admin Workflows

#### 6. HR Dashboard
- Modern admin interface
- 4 metric cards (employees, payroll, contracts, balance)
- Payroll execution panel
- Transaction history table
- Clean sidebar navigation
- **Navigate to:** Employee List, Payroll Confirmation, Settings

#### 7. Employee List
- Searchable employee table
- Filter tabs (All/Active/Expiring)
- Sortable columns
- Bulk selection and actions
- Pagination
- **Navigate to:** Add Employee Modal, Payroll Confirmation

#### 8. Add Employee Modal
- Professional form design
- Validation and helper text
- Uppercase labels for consistency
- Clear field hierarchy
- Clipboard paste functionality

#### 9. Settings (Multi-Tab)
- **General Tab:** Company info, payroll settings, danger zone
- **Team Members Tab:** User management table
- **Wallet & Security Tab:** Connected wallet, multi-sig options
- **Integrations Tab:** Third-party connections (placeholder)
- **Billing Tab:** Plan details, payment method (placeholder)
- **Notifications Tab:** Notification preferences (placeholder)

### Payroll Execution Flow

#### 10. Payroll Confirmation
- Two-step progress indicator
- Detailed summary breakdown
- Employee preview list (expandable)
- Balance verification
- Confirmation checkboxes
- **Navigate to:** Payroll Processing

#### 11. Payroll Processing
- Animated loading state
- Step-by-step progress (5 steps)
- Transaction hash display
- Time estimates
- **Auto-navigates to:** Payroll Success

#### 12. Payroll Success
- Clean success confirmation
- Expandable transaction details
- Action cards (Email, Export, Share)
- Recipient status table
- Timeline view
- **Navigate to:** HR Dashboard, Transaction Detail

#### 13. Transaction Detail Modal
- Full transaction information
- Blockchain details with copy buttons
- Recipients list (expandable table)
- Timeline of events
- Download/Export options
- BaseScan link

### Employee Views

#### 14. Employee Dashboard
- Consumer-friendly interface
- Large balance display (IDRX and USD)
- Quick stats cards (salary, next payroll, contract)
- Transaction history
- Withdraw CTA
- **Navigate to:** Withdraw Modal

#### 15. Withdraw Modal
- Bank withdrawal flow
- Quick amount selection ($100, $200, Max)
- Indonesian bank dropdown (BCA, Mandiri, BRI, BNI)
- Fee breakdown transparency
- Save account option
- Real-time calculation

#### 16. Mobile Employee Dashboard
- Touch-optimized layout
- Bottom navigation (Dashboard, History, Profile, Settings)
- Simplified card design
- Responsive breakpoints
- Single column layout
- 44px minimum tap targets

### Error Handling

#### 17. Error States (Multiple)
- **Insufficient Balance Modal:** Shows shortfall, add funds CTA
- **Transaction Failed Modal:** Error details, retry options
- **Network Mismatch Modal:** Switch network prompt
- **404 Page:** Full page error with navigation
- **Wallet Not Connected Banner:** Inline warning (component)
- **Expired Contract Alert:** Inline alert (component)

## Technical Details

### Component Architecture
```
/src/app/
├── App.tsx                           (Main router with organized quick nav)
├── components/
│   ├── LandingPage.tsx               (Marketing page)
│   ├── Authentication.tsx            (Login/signup split screen)
│   ├── CompanyOnboarding.tsx         (4-step company setup)
│   ├── EmployeeInvitationEmail.tsx   (Email template preview)
│   ├── EmployeeOnboarding.tsx        (4-step employee setup)
│   ├── HRDashboard.tsx               (Admin control panel)
│   ├── EmployeeList.tsx              (Employee management table)
│   ├── AddEmployeeModal.tsx          (Add employee form)
│   ├── Settings.tsx                  (Multi-tab settings)
│   ├── PayrollConfirmation.tsx       (Pre-execution review)
│   ├── PayrollProcessing.tsx         (Loading state)
│   ├── PayrollSuccess.tsx            (Success confirmation)
│   ├── TransactionDetail.tsx         (Full transaction modal)
│   ├── EmployeeDashboard.tsx         (Employee main view)
│   ├── WithdrawModal.tsx             (Bank withdrawal)
│   ├── MobileEmployeeDashboard.tsx   (Mobile-optimized)
│   └── ErrorStates.tsx               (Error modals + components)
```

### Styling
- **Tailwind CSS v4** with custom theme
- **Inter Font** for professional typography
- **Custom animations** in tailwind.css
- **Navy/Indigo color scheme** in theme.css

### Key Features
- ✅ Professional B2B SaaS design language
- ✅ Fully responsive (desktop + mobile)
- ✅ Real data examples (no lorem ipsum)
- ✅ Consistent typography scale
- ✅ Subtle shadows and borders
- ✅ Clean component separation
- ✅ Modern React patterns with TypeScript

## Quick Navigation

A development helper is included in the bottom-right corner with organized access to all 17 pages:

### Core Pages
- Landing - Main marketing page
- Login - Authentication split screen
- HR Dashboard - Admin control panel
- Settings - Multi-tab configuration

### Onboarding Flows
- Company Setup - 4-step company onboarding
- Employee Setup - 4-step employee onboarding  
- Invitation Email - Email template preview

### Payroll Flow
- Employees - Employee management table
- Confirm - Payroll confirmation
- Success - Success state with actions
- TX Detail - Full transaction modal

### Employee Views
- Dashboard - Employee main interface
- Mobile - Mobile-optimized view

### Modals
- Add Employee - Professional form
- Withdraw - Bank withdrawal flow

### Error States
- Low Balance - Insufficient funds error
- TX Failed - Transaction failure
- Wrong Network - Network mismatch
- 404 Page - Page not found

## Complete Feature List

### Authentication & Security
- ✅ Magic link email authentication
- ✅ Google OAuth option
- ✅ Account type selection (Company/Employee)
- ✅ Wallet connection (create new or connect existing)
- ✅ Multi-signature support (settings)
- ✅ Base network validation

### Company Management
- ✅ 4-step onboarding wizard with progress tracking
- ✅ Company profile configuration
- ✅ Team member invitations and role management
- ✅ IDRX balance funding (bank transfer & crypto)
- ✅ Payroll schedule settings
- ✅ Multi-tab settings interface

### Employee Management
- ✅ Searchable employee table with filters
- ✅ Bulk selection and actions
- ✅ Contract status tracking (active/expiring)
- ✅ Add employee form with validation
- ✅ Employee invitation emails
- ✅ Employee onboarding flow

### Payroll Execution
- ✅ Batch payroll execution (75+ employees)
- ✅ Pre-execution confirmation screen
- ✅ Real-time processing status
- ✅ Transaction tracking with blockchain hash
- ✅ Success confirmation with downloadable receipts
- ✅ Email notifications to employees
- ✅ Tax withholding calculation

### Employee Experience
- ✅ Simplified dashboard with balance display
- ✅ Transaction history
- ✅ Bank account withdrawal
- ✅ Multiple bank support (BCA, Mandiri, BRI, BNI)
- ✅ Quick amount selection
- ✅ Fee transparency
- ✅ Mobile-responsive interface

### Transaction Management
- ✅ Full transaction detail modal
- ✅ Blockchain verification links (BaseScan)
- ✅ Timeline view of transaction events
- ✅ Recipient status tracking
- ✅ Export to CSV/PDF
- ✅ Share transaction links

### Error Handling
- ✅ Insufficient balance detection
- ✅ Transaction failure recovery
- ✅ Network mismatch warnings
- ✅ 404 error page
- ✅ Wallet connection prompts
- ✅ Contract expiration alerts

### Data & Analytics
- ✅ Real-time balance tracking (IDRX and USD)
- ✅ Monthly payroll metrics
- ✅ Active contract monitoring
- ✅ Transaction history with pagination
- ✅ Employee count and growth tracking
- ✅ Gas fee estimation

## Development

The application is built with:
- React 18.3.1
- TypeScript
- Tailwind CSS v4
- Lucide React icons
- Radix UI components

All components are fully typed and use modern React patterns including hooks and functional components.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Responsive breakpoint: 768px (md)

---

**Built with professional standards for B2B SaaS applications**