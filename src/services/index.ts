/**
 * Services Index
 * Export all API services
 */

// API Client
export { apiClient } from './api';

// Services
export { transactionService, type Transaction, type TransactionListResponse } from './transactionService';
export { notificationService, type Notification, type NotificationListResponse } from './notificationService';
export { taxService, type TaxCalculationResponse, type TaxBracketsResponse, type MaritalStatus as TaxMaritalStatus } from './taxService';
export { payslipService, type PayslipData, type BulkPayslipResponse } from './payslipService';
export { dashboardService, type DashboardStats, type DashboardAnalytics } from './dashboardService';
export { payrollScheduleService, type PayrollSchedule, type PayrollScheduleListResponse } from './payrollScheduleService';
export { companyService, type Company, type CompanyCheckResponse } from './companyService';
export { employeeService, type Employee, type EmployeeProfile, type EmployeeListResponse } from './employeeService';

