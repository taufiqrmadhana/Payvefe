/**
 * Payroll Schedule Service
 * Handles payroll scheduling API calls
 */

import apiClient from './api';

export type ScheduleStatus = 'pending' | 'executed' | 'cancelled' | 'failed';

export interface PayrollSchedule {
    id: string;
    company_id: string;
    scheduled_date: string;
    status: ScheduleStatus;
    total_amount_wei: number;
    employee_count: number;
    executed_at?: string;
    tx_hash?: string;
    notes?: string;
    created_at: string;
}

export interface PayrollScheduleListResponse {
    schedules: PayrollSchedule[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateScheduleRequest {
    scheduled_date: string;
    total_amount_wei?: number;
    employee_count?: number;
    notes?: string;
}

export interface UpdateScheduleRequest {
    scheduled_date?: string;
    notes?: string;
}

export const payrollScheduleService = {
    /**
     * List payroll schedules
     */
    async list(adminWalletAddress: string, page: number = 1, limit: number = 20, status?: ScheduleStatus) {
        return apiClient.get<PayrollScheduleListResponse>('/api/payroll-schedules', {
            admin_wallet_address: adminWalletAddress,
            page,
            limit,
            ...(status && { status }),
        });
    },

    /**
     * Get next pending schedule
     */
    async getNext(adminWalletAddress: string) {
        return apiClient.get<PayrollSchedule | null>('/api/payroll-schedules/next', {
            admin_wallet_address: adminWalletAddress,
        });
    },

    /**
     * Create a new schedule
     */
    async create(adminWalletAddress: string, data: CreateScheduleRequest) {
        return apiClient.post<{ id: string; scheduled_date: string }>('/api/payroll-schedules', {
            admin_wallet_address: adminWalletAddress,
            ...data,
        });
    },

    /**
     * Update a schedule
     */
    async update(scheduleId: string, adminWalletAddress: string, data: UpdateScheduleRequest) {
        return apiClient.put<PayrollSchedule>(`/api/payroll-schedules/${scheduleId}`, {
            admin_wallet_address: adminWalletAddress,
            ...data,
        });
    },

    /**
     * Cancel a schedule
     */
    async cancel(scheduleId: string, adminWalletAddress: string) {
        return apiClient.put<{ id: string; status: string }>(`/api/payroll-schedules/${scheduleId}/cancel`, {
            admin_wallet_address: adminWalletAddress,
        });
    },
};

export default payrollScheduleService;
