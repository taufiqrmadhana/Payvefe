/**
 * Tax Service
 * Handles Indonesian tax calculation API calls
 */

import apiClient from './api';
import { DEFAULT_EXCHANGE_RATE } from '../constants';

export type MaritalStatus = 'TK/0' | 'K/0' | 'K/1' | 'K/2' | 'K/3';

export interface TaxCalculationRequest {
    monthly_salary_usd: number;
    marital_status?: MaritalStatus;
    has_npwp?: boolean;
    include_bpjs?: boolean;
    exchange_rate?: number;
}

export interface TaxBreakdown {
    gross_salary: number;
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
    net_salary: number;
    total_employer_cost: number;
}

export interface TaxCalculationResponse {
    currency: string;
    exchange_rate: number;
    gross_salary_usd: number;
    gross_salary_idr: number;
    net_salary_usd: number;
    net_salary_idr: number;
    total_deductions_usd: number;
    total_deductions_idr: number;
    pph21_monthly_usd: number;
    pph21_monthly_idr: number;
    breakdown: TaxBreakdown;
    ptkp_annual: number;
    taxable_income_annual: number;
}

export interface TaxBracket {
    min: number;
    max: number | null;
    rate: number;
    description: string;
}

export interface TaxBracketsResponse {
    pph21_brackets: TaxBracket[];
    ptkp: {
        base: number;
        married_bonus: number;
        per_dependent: number;
        max_dependents: number;
    };
    bpjs_kesehatan: {
        total_rate: number;
        employee_rate: number;
        employer_rate: number;
        max_salary: number;
    };
    bpjs_ketenagakerjaan: {
        jht: { employee_rate: number; employer_rate: number; description: string };
        jkk: { employer_rate: number; description: string };
        jkm: { employer_rate: number; description: string };
        jp: { employee_rate: number; employer_rate: number; max_salary: number; description: string };
    };
    no_npwp_penalty: number;
}

export interface PTKPResponse {
    annual_ptkp: Record<MaritalStatus, number>;
    descriptions: Record<MaritalStatus, string>;
}

export interface BulkTaxResult {
    employee_id: string;
    employee_name: string;
    gross_salary_usd: number;
    net_salary_usd: number;
    total_deductions_usd: number;
    pph21_usd: number;
}

export interface BulkTaxResponse {
    employees: BulkTaxResult[];
    summary: {
        total_employees: number;
        total_gross_usd: number;
        total_net_usd: number;
        total_deductions_usd: number;
        total_employer_cost_usd: number;
    };
    exchange_rate: number;
}

export const taxService = {
    /**
     * Calculate tax for a given salary
     */
    async calculate(request: TaxCalculationRequest) {
        return apiClient.post<TaxCalculationResponse>('/api/tax/calculate', {
            monthly_salary_usd: request.monthly_salary_usd,
            marital_status: request.marital_status || 'TK/0',
            has_npwp: request.has_npwp ?? true,
            include_bpjs: request.include_bpjs ?? true,
            exchange_rate: request.exchange_rate || DEFAULT_EXCHANGE_RATE,
        });
    },

    /**
     * Quick tax simulation (GET endpoint)
     */
    async simulate(
        salaryUsd: number,
        maritalStatus: MaritalStatus = 'TK/0',
        hasNpwp: boolean = true,
        includeBpjs: boolean = true,
        exchangeRate: number = DEFAULT_EXCHANGE_RATE
    ) {
        return apiClient.get<TaxCalculationResponse>('/api/tax/simulate', {
            salary_usd: salaryUsd,
            marital_status: maritalStatus,
            has_npwp: hasNpwp,
            include_bpjs: includeBpjs,
            exchange_rate: exchangeRate,
        });
    },

    /**
     * Get tax brackets and rates
     */
    async getBrackets() {
        return apiClient.get<TaxBracketsResponse>('/api/tax/brackets');
    },

    /**
     * Get PTKP values
     */
    async getPTKP() {
        return apiClient.get<PTKPResponse>('/api/tax/ptkp');
    },

    /**
     * Calculate tax for all employees in a company
     */
    async calculateBulk(adminWalletAddress: string, exchangeRate: number = DEFAULT_EXCHANGE_RATE) {
        return apiClient.post<BulkTaxResponse>('/api/tax/calculate/bulk', {
            admin_wallet_address: adminWalletAddress,
            exchange_rate: exchangeRate,
        });
    },
};

export default taxService;
