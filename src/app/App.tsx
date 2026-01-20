import { useState, useEffect } from 'react';
import { LandingPage } from '@/app/components/LandingPage';
import { Authentication } from '@/app/components/Authentication';
import { CompanyOnboarding } from '@/app/components/CompanyOnboarding';
import { EmployeeInvitationEmail } from '@/app/components/EmployeeInvitationEmail';
import { EmployeeOnboarding } from '@/app/components/EmployeeOnboarding';
import { HRDashboard } from '@/app/components/HRDashboard';
import { EmployeeList } from '@/app/components/EmployeeList';
import { AddEmployeeModal } from '@/app/components/AddEmployeeModal';
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

// Payve Premium Components (Now the default)
import { PayveLanding } from '@/app/components/PayveLanding';
import { PayveDashboard } from '@/app/components/PayveDashboard';
import { PayveEmployeeList } from '@/app/components/PayveEmployeeList';
import { PayveAddEmployee } from '@/app/components/PayveAddEmployee';
import { PayvePayrollExecution } from '@/app/components/PayvePayrollExecution';

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
  | 'withdraw-modal'
  | 'mobile-employee'
  | 'settings'
  | 'transaction-detail'
  | 'reports'
  | 'notifications-full'
  | 'help-support'
  | 'error-404';

type ErrorType = 'insufficient-balance' | 'transaction-failed' | 'network-mismatch' | '404' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('authentication');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const [showPayveAddEmployee, setShowPayveAddEmployee] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [isMobile, setIsMobile] = useState(false);

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
      setShowAddEmployeeModal(true);
    } else if (page === 'withdraw-modal') {
      setShowWithdrawModal(true);
    } else if (page === 'transaction-detail') {
      setShowTransactionDetail(true);
    } else if (page.startsWith('error-')) {
      setCurrentPage('hr-dashboard');
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
      default:
        return <PayveLanding onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderPage()}
      
      {showAddEmployeeModal && (
        <AddEmployeeModal onClose={() => setShowAddEmployeeModal(false)} />
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