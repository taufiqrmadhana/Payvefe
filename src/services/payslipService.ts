/**
 * Payslip Service
 * Handles payslip generation and download API calls
 */

import { API_BASE_URL, DEFAULT_EXCHANGE_RATE } from '../constants';
import apiClient from './api';

export type MaritalStatus = 'TK/0' | 'K/0' | 'K/1' | 'K/2' | 'K/3';

export interface PayslipData {
    employee: {
        id: string;
        name: string;
        email: string;
        department: string;
        position: string;
        hire_date?: string;
    };
    company: {
        name: string;
        address?: string;
    };
    payment: {
        period: string;
        date: string;
        exchange_rate: number;
    };
    tax_config: {
        marital_status: string;
        has_npwp: boolean;
        npwp_number?: string;
    };
    earnings: {
        gross_salary_usd: number;
        gross_salary_idr: number;
    };
    deductions: {
        pph21: number;
        bpjs_kesehatan: number;
        bpjs_jht: number;
        bpjs_jp: number;
        total: number;
    };
    employer_contributions: {
        bpjs_kesehatan: number;
        bpjs_jht: number;
        bpjs_jkk: number;
        bpjs_jkm: number;
        bpjs_jp: number;
        total: number;
    };
    net_salary: {
        idr: number;
        usd: number;
    };
    total_employer_cost: {
        idr: number;
        usd: number;
    };
    annual_tax_info: {
        ptkp: number;
        taxable_income: number;
        pph21_annual: number;
    };
}

export interface BulkPayslipEmployee {
    employee_id: string;
    employee_name: string;
    department?: string;
    gross_salary_usd: number;
    gross_salary_idr: number;
    net_salary_usd: number;
    net_salary_idr: number;
    total_deductions_idr: number;
    pph21_idr: number;
    download_url: string;
}

export interface BulkPayslipResponse {
    period: string;
    company: string;
    exchange_rate: number;
    employees: BulkPayslipEmployee[];
    totals: {
        employee_count: number;
        total_gross_usd: number;
        total_net_usd: number;
        total_deductions_usd: number;
        total_employer_cost_usd: number;
    };
}

export const payslipService = {
    /**
     * Generate payslip data for an employee (JSON)
     */
    async generate(
        employeeId: string,
        adminWalletAddress: string,
        options?: {
            paymentDate?: string;
            maritalStatus?: MaritalStatus;
            hasNpwp?: boolean;
            exchangeRate?: number;
        }
    ) {
        const params: Record<string, string | number | boolean> = {
            admin_wallet_address: adminWalletAddress,
            format: 'json',
        };

        if (options?.paymentDate) params.payment_date = options.paymentDate;
        if (options?.maritalStatus) params.marital_status = options.maritalStatus;
        if (options?.hasNpwp !== undefined) params.has_npwp = options.hasNpwp;
        if (options?.exchangeRate) params.exchange_rate = options.exchangeRate;

        return apiClient.get<PayslipData>(`/api/payslip/generate/${employeeId}`, params);
    },

    /**
     * Get payslip download URL
     */
    getDownloadUrl(
        employeeId: string,
        adminWalletAddress: string,
        options?: {
            paymentDate?: string;
            maritalStatus?: MaritalStatus;
            hasNpwp?: boolean;
            exchangeRate?: number;
        }
    ): string {
        const params = new URLSearchParams();
        params.append('admin_wallet_address', adminWalletAddress);

        if (options?.paymentDate) params.append('payment_date', options.paymentDate);
        if (options?.maritalStatus) params.append('marital_status', options.maritalStatus);
        if (options?.hasNpwp !== undefined) params.append('has_npwp', String(options.hasNpwp));
        if (options?.exchangeRate) params.append('exchange_rate', String(options.exchangeRate));

        return `${API_BASE_URL}/api/payslip/download/${employeeId}?${params.toString()}`;
    },

    /**
     * Get payslip HTML view URL
     */
    getViewUrl(
        employeeId: string,
        adminWalletAddress: string,
        options?: {
            paymentDate?: string;
            maritalStatus?: MaritalStatus;
            hasNpwp?: boolean;
            exchangeRate?: number;
        }
    ): string {
        const params = new URLSearchParams();
        params.append('admin_wallet_address', adminWalletAddress);
        params.append('format', 'html');

        if (options?.paymentDate) params.append('payment_date', options.paymentDate);
        if (options?.maritalStatus) params.append('marital_status', options.maritalStatus);
        if (options?.hasNpwp !== undefined) params.append('has_npwp', String(options.hasNpwp));
        if (options?.exchangeRate) params.append('exchange_rate', String(options.exchangeRate));

        return `${API_BASE_URL}/api/payslip/generate/${employeeId}?${params.toString()}`;
    },

    /**
     * Generate payslips for all employees
     */
    async bulkGenerate(
        adminWalletAddress: string,
        paymentDate?: string,
        exchangeRate: number = DEFAULT_EXCHANGE_RATE
    ) {
        const params: Record<string, string | number> = {
            admin_wallet_address: adminWalletAddress,
            exchange_rate: exchangeRate,
        };
        if (paymentDate) params.payment_date = paymentDate;

        return apiClient.post<BulkPayslipResponse>('/api/payslip/bulk-generate', params);
    },

    /**
     * Get preview URL for payslip simulator
     */
    getPreviewUrl(
        salaryUsd: number,
        companyName: string = 'Demo Company',
        employeeName: string = 'John Doe',
        maritalStatus: MaritalStatus = 'TK/0',
        hasNpwp: boolean = true,
        exchangeRate: number = DEFAULT_EXCHANGE_RATE
    ): string {
        const params = new URLSearchParams({
            salary_usd: String(salaryUsd),
            company_name: companyName,
            employee_name: employeeName,
            marital_status: maritalStatus,
            has_npwp: String(hasNpwp),
            exchange_rate: String(exchangeRate),
        });

        return `${API_BASE_URL}/api/payslip/preview?${params.toString()}`;
    },

    /**
     * Get employee preview URL (no admin wallet required)
     * Opens payslip in browser for Print to PDF
     */
    getEmployeePreviewUrl(
        salaryUsd: number,
        employeeName: string,
        companyName: string,
        options?: {
            position?: string;
            department?: string;
            paymentDate?: string;
            maritalStatus?: MaritalStatus;
            hasNpwp?: boolean;
            exchangeRate?: number;
        }
    ): string {
        const params = new URLSearchParams({
            salary_usd: String(salaryUsd),
            employee_name: employeeName,
            company_name: companyName,
            position: options?.position || 'Staff',
            department: options?.department || 'General',
            marital_status: options?.maritalStatus || 'TK/0',
            has_npwp: String(options?.hasNpwp !== false),
            exchange_rate: String(options?.exchangeRate || DEFAULT_EXCHANGE_RATE),
        });

        if (options?.paymentDate) {
            params.append('payment_date', options.paymentDate);
        }

        return `${API_BASE_URL}/api/payslip/employee-preview?${params.toString()}`;
    },

    /**
     * Get employee download URL (no admin wallet required)
     * Downloads payslip directly as HTML file
     */
    getEmployeeDownloadUrl(
        salaryUsd: number,
        employeeName: string,
        companyName: string,
        options?: {
            position?: string;
            department?: string;
            paymentDate?: string;
            maritalStatus?: MaritalStatus;
            hasNpwp?: boolean;
            exchangeRate?: number;
        }
    ): string {
        const params = new URLSearchParams({
            salary_usd: String(salaryUsd),
            employee_name: employeeName,
            company_name: companyName,
            position: options?.position || 'Staff',
            department: options?.department || 'General',
            marital_status: options?.maritalStatus || 'TK/0',
            has_npwp: String(options?.hasNpwp !== false),
            exchange_rate: String(options?.exchangeRate || DEFAULT_EXCHANGE_RATE),
        });

        if (options?.paymentDate) {
            params.append('payment_date', options.paymentDate);
        }

        return `${API_BASE_URL}/api/payslip/employee-download?${params.toString()}`;
    },
};

export default payslipService;
