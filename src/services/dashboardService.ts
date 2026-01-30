/**
 * Dashboard Service
 * Handles dashboard statistics and analytics API calls
 */

import apiClient from './api';

export interface EmployeeStats {
    total: number;
    active: number;
    invited: number;
    inactive: number;
}

export interface FinancialStats {
    total_monthly_payroll_usd: number;
    total_deposited_usd: number;
    total_distributed_usd: number;
    balance_usd: number;
}

export interface DashboardStats {
    company: {
        id: string;
        name: string;
        wallet_address: string;
        payroll_day: number;
    };
    employees: EmployeeStats;
    financials: FinancialStats;
    next_payroll: {
        scheduled_date?: string;
        estimated_amount_usd: number;
        employee_count: number;
    };
    employees_by_location: Array<{ location: string; count: number }>;
}

export interface PayrollTrend {
    month: string;
    amount_usd: number;
    employee_count: number;
}

export interface DepartmentBreakdown {
    department: string;
    employee_count: number;
    total_salary_usd: number;
    percentage: number;
}

export interface DashboardAnalytics {
    period: {
        start_date: string;
        end_date: string;
        months: number;
    };
    payroll_trends: PayrollTrend[];
    department_breakdown: DepartmentBreakdown[];
    employee_growth: Array<{
        month: string;
        total_employees: number;
        new_hires: number;
    }>;
    transaction_summary: {
        total_transactions: number;
        total_deposits: number;
        total_distributions: number;
        total_withdrawals: number;
    };
}

export const dashboardService = {
    /**
     * Get dashboard statistics
     */
    async getStats(adminWalletAddress: string) {
        return apiClient.get<DashboardStats>('/api/dashboard/stats', {
            admin_wallet_address: adminWalletAddress,
        });
    },

    /**
     * Get dashboard analytics
     */
    async getAnalytics(adminWalletAddress: string, months: number = 6) {
        return apiClient.get<DashboardAnalytics>('/api/dashboard/analytics', {
            admin_wallet_address: adminWalletAddress,
            months,
        });
    },
};

export default dashboardService;
