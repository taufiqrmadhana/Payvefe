/**
 * Employee Service
 * Handles employee-related API calls for both admin and employee portal
 */

import apiClient from './api';

export interface Employee {
    id: string;
    email: string;
    full_name: string;
    wallet_address?: string;
    position?: string;
    department?: string;
    monthly_salary_usd?: string;
    status: 'invited' | 'active' | 'inactive';
    hired_at?: string;
    contract_end_date?: string;
    location?: string;
    employment_type?: string;
    created_at?: string;
}

export interface EmployeeListResponse {
    employees: Employee[];
    total: number;
}

export interface EmployeeCreateRequest {
    admin_wallet_address: string;
    email: string;
    full_name: string;
    monthly_salary_usd: number;
    position?: string;
    department?: string;
}

export interface EmployeeUpdateRequest {
    admin_wallet_address: string;
    full_name?: string;
    monthly_salary_usd?: number;
    position?: string;
    department?: string;
    status?: string;
    wallet_address?: string;
    contract_end_date?: string;
}

export interface EmployeeProfile {
    id: string;
    email: string;
    full_name: string;
    wallet_address?: string;
    position?: string;
    department?: string;
    monthly_salary_usd?: string;
    status: string;
    hired_at?: string;
    contract_end_date?: string;
    location?: string;
    employment_type?: string;
    company_name?: string;
    company_contract_address?: string;
}

export const employeeService = {
    /**
     * List employees (admin only)
     */
    async list(adminWalletAddress: string) {
        return apiClient.get<Employee[]>('/api/employees', {
            admin_wallet_address: adminWalletAddress,
        });
    },

    /**
     * Create a new employee (admin only)
     */
    async create(data: EmployeeCreateRequest) {
        return apiClient.post<{ id: string; email: string; full_name: string; status: string }>('/api/employees', data);
    },

    /**
     * Update employee (admin only)
     */
    async update(employeeId: string, data: EmployeeUpdateRequest) {
        return apiClient.put<{ id: string; email: string; full_name: string; status: string }>(
            `/api/employees/${employeeId}`,
            data
        );
    },

    /**
     * Delete employee (admin only)
     */
    async delete(employeeId: string, adminWalletAddress: string) {
        return apiClient.delete<void>(`/api/employees/${employeeId}?admin_wallet_address=${adminWalletAddress}`);
    },

    /**
     * Get employee by wallet address (for employee portal)
     * This checks if the connected wallet belongs to any employee
     */
    async getByWallet(walletAddress: string) {
        return apiClient.get<EmployeeProfile>('/api/employees/me', {
            wallet_address: walletAddress,
        });
    },

    /**
     * Link wallet address to employee profile after claiming invite
     */
    async linkWallet(employeeId: string, walletAddress: string, companyContractAddress: string) {
        return apiClient.post<{ success: boolean }>('/api/employees/link-wallet', {
            employee_id: employeeId,
            wallet_address: walletAddress,
            company_contract_address: companyContractAddress,
        });
    },
};

export default employeeService;
