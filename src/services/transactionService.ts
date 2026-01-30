/**
 * Transaction Service
 * Handles transaction history API calls
 */

import apiClient from './api';

export interface Transaction {
    id: string;
    wallet_address: string;
    tx_hash: string;
    tx_type: 'deposit' | 'distribute' | 'withdraw' | 'create_invite' | 'claim_invite' | 'mint';
    amount_wei: number;
    status: 'pending' | 'success' | 'failed';
    company_id?: string;
    employee_id?: string;
    metadata: Record<string, unknown>;
    created_at: string;
}

export interface TransactionListResponse {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateTransactionRequest {
    wallet_address: string;
    tx_hash: string;
    tx_type: string;
    amount_wei: number;
    status: string;
    company_id?: string;
    employee_id?: string;
    metadata?: Record<string, unknown>;
}

export const transactionService = {
    /**
     * List transactions for a wallet
     */
    async listByWallet(
        walletAddress: string,
        page: number = 1,
        limit: number = 20,
        txType?: string
    ) {
        return apiClient.get<TransactionListResponse>('/api/transactions', {
            wallet_address: walletAddress,
            page,
            limit,
            ...(txType && { tx_type: txType }),
        });
    },

    /**
     * List transactions for a company (admin only)
     */
    async listByCompany(
        adminWalletAddress: string,
        page: number = 1,
        limit: number = 20,
        txType?: string
    ) {
        return apiClient.get<TransactionListResponse>('/api/transactions/company', {
            admin_wallet_address: adminWalletAddress,
            page,
            limit,
            ...(txType && { tx_type: txType }),
        });
    },

    /**
     * Get transaction by ID
     */
    async getById(txId: string) {
        return apiClient.get<Transaction>(`/api/transactions/${txId}`);
    },

    /**
     * Record a new transaction
     */
    async create(data: CreateTransactionRequest) {
        return apiClient.post<{ id: string; tx_hash: string; status: string }>('/api/transactions', data);
    },

    /**
     * Update transaction status
     */
    async updateStatus(txId: string, status: string, metadata?: Record<string, unknown>) {
        return apiClient.put<{ id: string; status: string }>(`/api/transactions/${txId}/status`, {
            status,
            metadata,
        });
    },
};

export default transactionService;
