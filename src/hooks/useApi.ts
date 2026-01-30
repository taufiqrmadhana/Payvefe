/**
 * React Hooks for API Services
 */

import { useState, useCallback, useEffect } from 'react';
import {
    notificationService,
    type Notification,
    type NotificationListResponse
} from '../services/notificationService';
import {
    transactionService,
    type Transaction,
    type TransactionListResponse,
} from '../services/transactionService';
import {
    dashboardService,
    type DashboardStats,
    type DashboardAnalytics,
} from '../services/dashboardService';
import {
    taxService,
    type TaxCalculationResponse,
    type MaritalStatus,
} from '../services/taxService';
import {
    payslipService,
    type BulkPayslipResponse,
    type PayslipData,
} from '../services/payslipService';
import {
    payrollScheduleService,
    type PayrollSchedule,
} from '../services/payrollScheduleService';
import {
    employeeService,
    type Employee,
    type EmployeeProfile,
} from '../services/employeeService';
import {
    companyService,
    type Company,
    type CompanyCheckResponse,
} from '../services/companyService';

// Simple in-memory cache with timestamp
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache: Record<string, CacheEntry<unknown>> = {};
const CACHE_DURATION = 30000; // 30 seconds

function getCached<T>(key: string): T | null {
    const entry = cache[key] as CacheEntry<T> | undefined;
    if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
        return entry.data;
    }
    return null;
}

function setCache<T>(key: string, data: T): void {
    cache[key] = { data, timestamp: Date.now() };
}

function clearCache(keyPrefix?: string): void {
    if (keyPrefix) {
        Object.keys(cache).forEach(key => {
            if (key.startsWith(keyPrefix)) delete cache[key];
        });
    } else {
        Object.keys(cache).forEach(key => delete cache[key]);
    }
}

// ==================== Notifications Hook ====================

interface NotificationCache {
    notifications: Notification[];
    unreadCount: number;
}

export function useNotifications(walletAddress: string | undefined) {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        if (walletAddress) {
            const cached = getCached<NotificationCache>(`notifications_${walletAddress}`);
            return cached?.notifications || [];
        }
        return [];
    });
    const [unreadCount, setUnreadCount] = useState(() => {
        if (walletAddress) {
            const cached = getCached<NotificationCache>(`notifications_${walletAddress}`);
            return cached?.unreadCount || 0;
        }
        return 0;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchNotifications = useCallback(async (includeRead = true, force = false) => {
        if (!walletAddress) return;

        const cacheKey = `notifications_${walletAddress}`;
        if (!force) {
            const cached = getCached<NotificationCache>(cacheKey);
            if (cached) {
                setNotifications(cached.notifications);
                setUnreadCount(cached.unreadCount);
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            const response = await notificationService.list(walletAddress, includeRead);
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unread_count);
            setCache(cacheKey, { 
                notifications: response.data.notifications, 
                unreadCount: response.data.unread_count 
            });
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
        } finally {
            setLoading(false);
        }
    }, [walletAddress]);

    const markAsRead = useCallback(async (notifId: string) => {
        try {
            await notificationService.markAsRead(notifId);
            setNotifications(prev =>
                prev.map(n => n.id === notifId ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            // Clear cache so next fetch gets fresh data
            if (walletAddress) clearCache(`notifications_${walletAddress}`);
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    }, [walletAddress]);

    const markAllAsRead = useCallback(async () => {
        if (!walletAddress) return;

        try {
            await notificationService.markAllAsRead(walletAddress);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
            clearCache(`notifications_${walletAddress}`);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    }, [walletAddress]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        refresh: fetchNotifications,
        markAsRead,
        markAllAsRead,
    };
}

// ==================== Transactions Hook ====================

export function useTransactions(walletAddress: string | undefined, isCompany = false) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchTransactions = useCallback(async (pageNum = 1, limit = 20, txType?: string) => {
        if (!walletAddress) return;

        setLoading(true);
        setError(null);

        try {
            const response = isCompany
                ? await transactionService.listByCompany(walletAddress, pageNum, limit, txType)
                : await transactionService.listByWallet(walletAddress, pageNum, limit, txType);

            setTransactions(response.data.transactions);
            setTotal(response.data.total);
            setPage(pageNum);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
        } finally {
            setLoading(false);
        }
    }, [walletAddress, isCompany]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        total,
        page,
        loading,
        error,
        refresh: fetchTransactions,
        nextPage: () => fetchTransactions(page + 1),
        prevPage: () => fetchTransactions(Math.max(1, page - 1)),
    };
}

// ==================== Dashboard Hook ====================

export function useDashboard(adminWalletAddress: string | undefined) {
    const [stats, setStats] = useState<DashboardStats | null>(() => {
        // Initialize from cache if available
        if (adminWalletAddress) {
            return getCached<DashboardStats>(`dashboard_stats_${adminWalletAddress}`);
        }
        return null;
    });
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(() => {
        if (adminWalletAddress) {
            return getCached<DashboardAnalytics>(`dashboard_analytics_${adminWalletAddress}`);
        }
        return null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchStats = useCallback(async (force = false) => {
        if (!adminWalletAddress) return;

        // Check cache first unless forced
        const cacheKey = `dashboard_stats_${adminWalletAddress}`;
        if (!force) {
            const cached = getCached<DashboardStats>(cacheKey);
            if (cached) {
                setStats(cached);
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            const response = await dashboardService.getStats(adminWalletAddress);
            setStats(response.data);
            setCache(cacheKey, response.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch dashboard stats'));
        } finally {
            setLoading(false);
        }
    }, [adminWalletAddress]);

    const fetchAnalytics = useCallback(async (months = 6, force = false) => {
        if (!adminWalletAddress) return;

        const cacheKey = `dashboard_analytics_${adminWalletAddress}`;
        if (!force) {
            const cached = getCached<DashboardAnalytics>(cacheKey);
            if (cached) {
                setAnalytics(cached);
                return;
            }
        }

        try {
            const response = await dashboardService.getAnalytics(adminWalletAddress, months);
            setAnalytics(response.data);
            setCache(cacheKey, response.data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        }
    }, [adminWalletAddress]);

    useEffect(() => {
        fetchStats();
        fetchAnalytics();
    }, [fetchStats, fetchAnalytics]);

    return {
        stats,
        analytics,
        loading,
        error,
        refreshStats: fetchStats,
        refreshAnalytics: fetchAnalytics,
    };
}

// ==================== Tax Calculator Hook ====================

export function useTaxCalculator() {
    const [result, setResult] = useState<TaxCalculationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const calculate = useCallback(async (
        salaryUsd: number,
        maritalStatus: MaritalStatus = 'TK/0',
        hasNpwp = true,
        includeBpjs = true,
        exchangeRate = 16000
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response = await taxService.calculate({
                monthly_salary_usd: salaryUsd,
                marital_status: maritalStatus,
                has_npwp: hasNpwp,
                include_bpjs: includeBpjs,
                exchange_rate: exchangeRate,
            });
            setResult(response.data);
            return response.data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to calculate tax'));
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        result,
        loading,
        error,
        calculate,
    };
}

// ==================== Payroll Schedule Hook ====================

export function usePayrollSchedule(adminWalletAddress: string | undefined) {
    const [schedules, setSchedules] = useState<PayrollSchedule[]>([]);
    const [nextSchedule, setNextSchedule] = useState<PayrollSchedule | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchSchedules = useCallback(async () => {
        if (!adminWalletAddress) return;

        setLoading(true);
        setError(null);

        try {
            const [listRes, nextRes] = await Promise.all([
                payrollScheduleService.list(adminWalletAddress),
                payrollScheduleService.getNext(adminWalletAddress),
            ]);
            setSchedules(listRes.data.schedules);
            setNextSchedule(nextRes.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch schedules'));
        } finally {
            setLoading(false);
        }
    }, [adminWalletAddress]);

    const createSchedule = useCallback(async (scheduledDate: string, notes?: string) => {
        if (!adminWalletAddress) return;

        try {
            await payrollScheduleService.create(adminWalletAddress, { scheduled_date: scheduledDate, notes });
            await fetchSchedules();
        } catch (err) {
            throw err;
        }
    }, [adminWalletAddress, fetchSchedules]);

    const cancelSchedule = useCallback(async (scheduleId: string) => {
        if (!adminWalletAddress) return;

        try {
            await payrollScheduleService.cancel(scheduleId, adminWalletAddress);
            await fetchSchedules();
        } catch (err) {
            throw err;
        }
    }, [adminWalletAddress, fetchSchedules]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    return {
        schedules,
        nextSchedule,
        loading,
        error,
        refresh: fetchSchedules,
        createSchedule,
        cancelSchedule,
    };
}

// ==================== Bulk Payslip Hook ====================

export function useBulkPayslip(adminWalletAddress: string | undefined) {
    const [payslips, setPayslips] = useState<BulkPayslipResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const generate = useCallback(async (paymentDate?: string, exchangeRate = 16000) => {
        if (!adminWalletAddress) return;

        setLoading(true);
        setError(null);

        try {
            const response = await payslipService.bulkGenerate(adminWalletAddress, paymentDate, exchangeRate);
            setPayslips(response.data);
            return response.data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to generate payslips'));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [adminWalletAddress]);

    return {
        payslips,
        loading,
        error,
        generate,
    };
}

// ==================== Employee Portal Hooks ====================

/**
 * Hook for managing employer company address in localStorage
 */
export function useEmployerConfig() {
    const STORAGE_KEY = 'payve_employer_address';
    
    const [employerAddress, setEmployerAddressState] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEY) || '';
        }
        return '';
    });

    const setEmployerAddress = useCallback((address: string) => {
        setEmployerAddressState(address);
        if (typeof window !== 'undefined') {
            if (address) {
                localStorage.setItem(STORAGE_KEY, address);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    return {
        employerAddress,
        setEmployerAddress,
        isConfigured: !!employerAddress,
    };
}

/**
 * Hook for fetching employee profile from backend by wallet
 */
export function useEmployeeProfile(walletAddress: string | undefined) {
    const [profile, setProfile] = useState<EmployeeProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!walletAddress) return;

        setLoading(true);
        setError(null);

        try {
            const response = await employeeService.getByWallet(walletAddress);
            setProfile(response.data);
        } catch (err) {
            // Not found is expected for new users
            if (err instanceof Error && err.message.includes('404')) {
                setProfile(null);
            } else {
                setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
            }
        } finally {
            setLoading(false);
        }
    }, [walletAddress]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        error,
        refresh: fetchProfile,
    };
}

/**
 * Hook for employee list (admin)
 */
export function useEmployees(adminWalletAddress: string | undefined) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchEmployees = useCallback(async () => {
        if (!adminWalletAddress) return;

        setLoading(true);
        setError(null);

        try {
            const response = await employeeService.list(adminWalletAddress);
            setEmployees(response.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch employees'));
        } finally {
            setLoading(false);
        }
    }, [adminWalletAddress]);

    const createEmployee = useCallback(async (data: Omit<import('../services/employeeService').EmployeeCreateRequest, 'admin_wallet_address'>) => {
        if (!adminWalletAddress) throw new Error('No wallet connected');

        const response = await employeeService.create({
            ...data,
            admin_wallet_address: adminWalletAddress,
        });
        await fetchEmployees();
        return response;
    }, [adminWalletAddress, fetchEmployees]);

    const updateEmployee = useCallback(async (
        employeeId: string,
        data: Omit<import('../services/employeeService').EmployeeUpdateRequest, 'admin_wallet_address'>
    ) => {
        if (!adminWalletAddress) throw new Error('No wallet connected');

        const response = await employeeService.update(employeeId, {
            ...data,
            admin_wallet_address: adminWalletAddress,
        });
        await fetchEmployees();
        return response;
    }, [adminWalletAddress, fetchEmployees]);

    const deleteEmployee = useCallback(async (employeeId: string) => {
        if (!adminWalletAddress) throw new Error('No wallet connected');

        await employeeService.delete(employeeId, adminWalletAddress);
        await fetchEmployees();
    }, [adminWalletAddress, fetchEmployees]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    return {
        employees,
        loading,
        error,
        refresh: fetchEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
    };
}

/**
 * Hook for employee payslip (individual employee view)
 */
export function useEmployeePayslip(
    employeeId: string | undefined,
    adminWalletAddress: string | undefined
) {
    const [payslip, setPayslip] = useState<PayslipData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchPayslip = useCallback(async (options?: {
        paymentDate?: string;
        maritalStatus?: MaritalStatus;
        hasNpwp?: boolean;
        exchangeRate?: number;
    }) => {
        if (!employeeId || !adminWalletAddress) return;

        setLoading(true);
        setError(null);

        try {
            const response = await payslipService.generate(employeeId, adminWalletAddress, options);
            setPayslip(response.data);
            return response.data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch payslip'));
        } finally {
            setLoading(false);
        }
    }, [employeeId, adminWalletAddress]);

    return {
        payslip,
        loading,
        error,
        fetchPayslip,
        getDownloadUrl: (options?: Parameters<typeof payslipService.getDownloadUrl>[2]) => 
            employeeId && adminWalletAddress 
                ? payslipService.getDownloadUrl(employeeId, adminWalletAddress, options) 
                : null,
    };
}

// ==================== Company Hook ====================

/**
 * Hook for managing company data and syncing with backend
 */
export function useCompany(walletAddress: string | undefined) {
    const [company, setCompany] = useState<Company | null>(() => {
        if (walletAddress) {
            const cached = getCached<{ company: Company | null; exists: boolean }>(`company_${walletAddress}`);
            return cached?.company || null;
        }
        return null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [exists, setExists] = useState(() => {
        if (walletAddress) {
            const cached = getCached<{ company: Company | null; exists: boolean }>(`company_${walletAddress}`);
            return cached?.exists || false;
        }
        return false;
    });

    const checkCompany = useCallback(async (force = false) => {
        if (!walletAddress) return;

        const cacheKey = `company_${walletAddress}`;
        if (!force) {
            const cached = getCached<{ company: Company | null; exists: boolean }>(cacheKey);
            if (cached) {
                setExists(cached.exists);
                setCompany(cached.company);
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            const result = await companyService.checkCompany(walletAddress);
            setExists(result.exists);
            setCompany(result.company || null);
            setCache(cacheKey, { company: result.company || null, exists: result.exists });
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to check company'));
        } finally {
            setLoading(false);
        }
    }, [walletAddress]);

    const createCompany = useCallback(async (companyName: string, payrollDay = 25) => {
        if (!walletAddress) throw new Error('No wallet connected');

        setLoading(true);
        setError(null);

        try {
            const response = await companyService.create({
                company_name: companyName,
                wallet_address: walletAddress,
                payroll_day: payrollDay,
            });
            clearCache(`company_${walletAddress}`);
            await checkCompany(true);
            return response.data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to create company'));
            throw err;
        } finally {
            setLoading(false);
        }
    }, [walletAddress, checkCompany]);

    useEffect(() => {
        checkCompany();
    }, [checkCompany]);

    return {
        company,
        exists,
        loading,
        error,
        refresh: () => checkCompany(true),
        createCompany,
    };
}
