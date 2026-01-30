/**
 * Notification Service
 * Handles notification API calls
 */

import apiClient from './api';

export interface Notification {
    id: string;
    wallet_address: string;
    notification_type: 'payroll_executed' | 'payment_received' | 'invite_created' | 'invite_claimed' | 'deposit_received' | 'withdraw_success' | 'contract_expiring' | 'system';
    title: string;
    message: string;
    is_read: boolean;
    metadata: Record<string, unknown>;
    created_at: string;
}

export interface NotificationListResponse {
    notifications: Notification[];
    total: number;
    unread_count: number;
}

export interface CreateNotificationRequest {
    wallet_address: string;
    notification_type: string;
    title: string;
    message: string;
    user_id?: string;
    company_id?: string;
    metadata?: Record<string, unknown>;
}

export const notificationService = {
    /**
     * List notifications for a wallet
     */
    async list(walletAddress: string, includeRead: boolean = true, limit: number = 50) {
        return apiClient.get<NotificationListResponse>('/api/notifications', {
            wallet_address: walletAddress,
            include_read: includeRead,
            limit,
        });
    },

    /**
     * Get notification by ID
     */
    async getById(notifId: string) {
        return apiClient.get<Notification>(`/api/notifications/${notifId}`);
    },

    /**
     * Create a new notification
     */
    async create(data: CreateNotificationRequest) {
        return apiClient.post<{ id: string; title: string }>('/api/notifications', data);
    },

    /**
     * Mark notification as read
     */
    async markAsRead(notifId: string) {
        return apiClient.put<{ id: string; is_read: boolean }>(`/api/notifications/${notifId}/read`);
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(walletAddress: string) {
        return apiClient.put<{ updated_count: number }>('/api/notifications/read-all', undefined);
    },

    /**
     * Delete a notification
     */
    async delete(notifId: string) {
        return apiClient.delete(`/api/notifications/${notifId}`);
    },
};

export default notificationService;
