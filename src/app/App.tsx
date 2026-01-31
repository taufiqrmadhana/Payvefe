import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { LandingPage } from '@/app/components/LandingPage';
import { Authentication } from '@/app/components/Authentication';
import { CompanyOnboarding } from '@/app/components/CompanyOnboarding';
import { EmployeeInvitationEmail } from '@/app/components/EmployeeInvitationEmail';
import { EmployeeOnboarding } from '@/app/components/EmployeeOnboarding';
import { HRDashboard } from '@/app/components/HRDashboard';
import { EmployeeList } from '@/app/components/EmployeeList';

import { PayrollConfirmation } from '@/app/components/PayrollConfirmation';
import { PayrollProcessing } from '@/app/components/PayrollProcessing';
import { PayrollSuccess } from '@/app/components/PayrollSuccess';
import { EmployeeDashboard } from '@/app/components/EmployeeDashboard';
import { WithdrawModal } from '@/app/components/WithdrawModal';
import { MobileEmployeeDashboard } from '@/app/components/MobileEmployeeDashboard';
import { Settings } from '@/app/components/Settings';
import { TransactionDetail } from '@/app/components/TransactionDetail';
import { ErrorStates } from '@/app/components/ErrorStates';
import { Reports } from '@/app/components/Reports';
import { Notifications } from '@/app/components/Notifications';
import { HelpSupport } from '@/app/components/HelpSupport';
import { InvitePage } from '@/app/components/InvitePage';

// Payve Premium Components (Now the default)
import { PayveLanding } from '@/app/components/PayveLanding';
import { PayveDashboard } from '@/app/components/PayveDashboard';
import { PayveEmployeeList } from '@/app/components/PayveEmployeeList';
import { PayveAddEmployee } from '@/app/components/PayveAddEmployee';
import { PayvePayrollExecution } from '@/app/components/PayvePayrollExecution';
import { PayrollHistory } from '@/app/components/PayrollHistory';

type Page =
  | 'landing'
  | 'authentication'
  | 'company-onboarding'
  | 'employee-invitation-email'
  | 'employee-onboarding'
  | 'dashboard'
  | 'employee-list'
  | 'add-employee'
  | 'payroll-confirmation'
  | 'payroll-processing'
  | 'payroll-success'
  | 'payroll-execution'
  | 'employee-dashboard'
  | 'payroll-history'
  | 'withdraw-modal'
  | 'mobile-employee'
  | 'settings'
  | 'transaction-detail'
  | 'reports'
  | 'notifications-full'
  | 'help-support'
  | 'invite'
  | 'error-404';

type ErrorType = 'insufficient-balance' | 'transaction-failed' | 'network-mismatch' | '404' | null;

// LocalStorage keys
const STORAGE_KEYS = {
  CURRENT_PAGE: 'payve_current_page',
  USER_TYPE: 'payve_user_type',
} as const;

// Pages that require authentication
const PROTECTED_PAGES: Page[] = [
  'dashboard',
  'employee-list',
  'payroll-confirmation',
  'payroll-processing',
  'payroll-success',
  'payroll-execution',
  'employee-dashboard',
  'payroll-history',
  'settings',
  'reports',
  'notifications-full',
  'help-support',
];

export default function App() {
  const { isConnected } = useAccount();

  // Check URL for invite page
  const getInitialPage = (): Page => {
    const url = new URL(window.location.href);
    if (url.pathname === '/invite' || url.searchParams.has('token')) {
      return 'invite';
    }
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE);
    return (saved as Page) || 'landing';
  };

  // Initialize state from localStorage
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage);

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Persist current page to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, currentPage);
  }, [currentPage]);

  // Check if user should be redirected due to disconnection
  useEffect(() => {
    const savedPage = localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE) as Page;

    // If wallet disconnects and user was on protected page, redirect to landing
    if (!isConnected && PROTECTED_PAGES.includes(savedPage)) {
      setCurrentPage('landing');
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PAGE);
    }
  }, [isConnected]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'add-employee') {
      setShowAddEmployee(true);
    } else if (page === 'withdraw-modal') {
      setShowWithdrawModal(true);
    } else if (page === 'transaction-detail') {
      setShowTransactionDetail(true);
    } else if (page.startsWith('error-')) {
      setCurrentPage('hr-dashboard' as Page);
      setErrorType(page.replace('error-', '') as ErrorType);
    } else {
      setCurrentPage(page as Page);
    }
  };

  const renderPage = () => {
    // Special handling for employee dashboard on mobile
    if (currentPage === 'employee-dashboard' && isMobile) {
      return <MobileEmployeeDashboard onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'landing':
        return <PayveLanding onNavigate={handleNavigate} />;
      case 'authentication':
        return <Authentication onNavigate={handleNavigate} />;
      case 'company-onboarding':
        return <CompanyOnboarding onNavigate={handleNavigate} />;
      case 'employee-invitation-email':
        return <EmployeeInvitationEmail onNavigate={handleNavigate} />;
      case 'employee-onboarding':
        return <EmployeeOnboarding onNavigate={handleNavigate} />;
      case 'dashboard':
        return <PayveDashboard onNavigate={handleNavigate} />;
      case 'employee-list':
        return <PayveEmployeeList onNavigate={handleNavigate} />;
      case 'payroll-confirmation':
        return <PayrollConfirmation onNavigate={handleNavigate} />;
      case 'payroll-processing':
        return <PayrollProcessing onNavigate={handleNavigate} />;
      case 'payroll-success':
        return <PayrollSuccess onNavigate={handleNavigate} />;
      case 'payroll-execution':
        return <PayvePayrollExecution onNavigate={handleNavigate} />;
      case 'employee-dashboard':
        return <EmployeeDashboard onNavigate={handleNavigate} />;
      case 'payroll-history':
        return <PayrollHistory onNavigate={handleNavigate} />;
      case 'mobile-employee':
        return <MobileEmployeeDashboard onNavigate={handleNavigate} />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;
      case 'error-404':
        return <ErrorStates errorType="404" onClose={() => setCurrentPage('landing')} onNavigate={handleNavigate} />;
      case 'reports':
        return <Reports onNavigate={handleNavigate} />;
      case 'notifications-full':
        return <Notifications onNavigate={handleNavigate} />;
      case 'help-support':
        return <HelpSupport onNavigate={handleNavigate} />;
      case 'invite':
        return <InvitePage onNavigate={handleNavigate} />;
      default:
        return <PayveLanding onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderPage()}

      {showAddEmployee && (
        <PayveAddEmployee onClose={() => setShowAddEmployee(false)} onNavigate={handleNavigate} />
      )}

      {showWithdrawModal && (
        <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
      )}

      {showTransactionDetail && (
        <TransactionDetail onClose={() => setShowTransactionDetail(false)} />
      )}

      {errorType && (
        <ErrorStates
          errorType={errorType}
          onClose={() => setErrorType(null)}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}