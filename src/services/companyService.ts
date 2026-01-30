/**
 * Company Service
 * Handles company-related API calls
 */

import apiClient from './api';

export interface Company {
    id: string;
    company_name: string;
    wallet_address: string;
    payroll_contract_address?: string;
    payroll_day: number;
    status: string;
    created_at: string;
}

export interface CompanyCheckResponse {
    exists: boolean;
    company?: Company;
    is_onchain: boolean;
}

export const companyService = {
    /**
     * Check if a company exists for the given wallet address
     */
    async checkCompany(walletAddress: string): Promise<CompanyCheckResponse> {
        try {
            const response = await apiClient.get<Company>('/api/companies/by-wallet', {
                wallet_address: walletAddress,
            });

            return {
                exists: true,
                company: response.data,
                is_onchain: !!response.data.payroll_contract_address,
            };
        } catch {
            return {
                exists: false,
                is_onchain: false,
            };
        }
    },

    /**
     * Get company by wallet address
     */
    async getByWallet(walletAddress: string) {
        return apiClient.get<Company>('/api/companies/by-wallet', {
            wallet_address: walletAddress,
        });
    },

    /**
     * Get company by ID
     */
    async getById(companyId: string) {
        return apiClient.get<Company>(`/api/companies/${companyId}`);
    },

    /**
     * Get employees by admin wallet address
     */
    async getEmployees(walletAddress: string) {
        return apiClient.get<any[]>('/api/employees', {
            admin_wallet_address: walletAddress,
        });
    },

    /**
     * Create a new company
     */
    async create(data: { company_name: string; wallet_address: string; payroll_day?: number }) {
        return apiClient.post<{ id: string; company_name: string }>('/api/companies', data);
    },
};

export default companyService;
