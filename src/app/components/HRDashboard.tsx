import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  FileText, 
  Bell, 
  LogOut,
  TrendingUp,
  Settings,
  ExternalLink,
  Loader2,
  Plus,
  Building2
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useAccount, useDisconnect } from 'wagmi';
import { useState } from 'react';
import { useDashboard, useCompany, useTransactions, useNotifications } from '@/hooks/useApi';
import { usePayve } from '@/hooks/usePayve';
import { DEFAULT_EXCHANGE_RATE } from '@/constants';

interface HRDashboardProps {
  onNavigate: (page: string) => void;
}

export function HRDashboard({ onNavigate }: HRDashboardProps) {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { createCompany: createCompanyOnChain, myCompanyAddress } = usePayve();
  
  // Company state
  const { company, exists: companyExists, loading: companyLoading, createCompany, refresh: refreshCompany } = useCompany(address);
  
  // Dashboard data
  const { stats, analytics, loading: dashboardLoading, refreshStats, refreshAnalytics } = useDashboard(address);
  
  // Transactions  
  const { transactions, loading: txLoading } = useTransactions(address, true);
  
  // Notifications
  const { unreadCount } = useNotifications(address);
  
  // Create company modal state
  const [companyName, setCompanyName] = useState('');
  const [payrollDay, setPayrollDay] = useState(25);
  const [isCreating, setIsCreating] = useState(false);

  const handleLogout = () => {
    disconnect();
    onNavigate('landing');
  };

  const handleCreateCompany = async () => {
    if (!companyName) return;
    
    setIsCreating(true);
    try {
      // Create on blockchain first (if factory is configured)
      if (myCompanyAddress === undefined) {
        try {
          await createCompanyOnChain();
        } catch (e) {
          console.log('Blockchain company creation skipped:', e);
        }
      }
      
      // Create in backend
      await createCompany(companyName, payrollDay);
      setCompanyName('');
      refreshStats();
      refreshAnalytics();
    } catch (err) {
      console.error('Failed to create company:', err);
      alert('Failed to create company. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Loading state
  if (companyLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // No company found - show create company prompt
  if (!companyExists) {
    return (
      <div className="flex h-screen bg-[#F9FAFB]">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6">
            <div className="text-xl font-semibold text-[#1E40AF]">GajiChain</div>
          </div>
          <nav className="flex-1 px-3">
            <a className="flex items-center gap-3 px-4 py-2.5 rounded-md bg-indigo-50 text-[#6366F1] mb-1">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium text-sm">Dashboard</span>
            </a>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button onClick={handleLogout} className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content - Create Company */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to GajiChain</h2>
              <p className="text-gray-600">Create your company to start managing payroll on the blockchain.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Company Name</Label>
                <Input 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Payroll Day</Label>
                <Input 
                  type="number"
                  min={1}
                  max={28}
                  value={payrollDay}
                  onChange={(e) => setPayrollDay(parseInt(e.target.value) || 25)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Day of the month for payroll (1-28)</p>
              </div>
              <Button 
                onClick={handleCreateCompany}
                disabled={!companyName || isCreating}
                className="w-full bg-[#1E40AF] hover:bg-[#1e3a8a] text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Company
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Format helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Transform transactions for display
  const recentTransactions = transactions.slice(0, 5).map(tx => {
    const amountUsd = tx.amount_wei / 1e18 / DEFAULT_EXCHANGE_RATE;
    const date = new Date(tx.created_at);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: tx.tx_type,
      amount: formatCurrency(amountUsd),
      status: tx.status,
      hash: tx.tx_hash ? `${tx.tx_hash.slice(0, 8)}...` : 'N/A',
      fullHash: tx.tx_hash,
    };
  });

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="text-xl font-semibold text-[#1E40AF]">GajiChain</div>
        </div>

        <nav className="flex-1 px-3">
          <a 
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md bg-indigo-50 text-[#6366F1] mb-1"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </a>
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('employee-list');
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 mb-1"
          >
            <Users className="w-5 h-5" />
            <span className="text-sm">Employees</span>
          </a>
          <a 
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 mb-1"
          >
            <Wallet className="w-5 h-5" />
            <span className="text-sm">Payroll</span>
          </a>
          <a 
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 mb-1"
          >
            <FileText className="w-5 h-5" />
            <span className="text-sm">Reports</span>
          </a>
          <a 
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 mb-1"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </a>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-sm">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">Admin</div>
              <div className="text-xs text-gray-500">Manager</div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Dashboard {company && <span className="text-gray-900 font-medium">• {company.company_name}</span>}
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs font-mono text-gray-700">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '0x...'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {dashboardLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">
                    {formatNumber(stats?.employees?.total ?? 0)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Total Employees</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>{stats?.employees?.active ?? 0} active</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">
                    {formatCurrency(stats?.financials?.total_monthly_payroll_usd ?? 0)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Monthly Payroll</div>
                  <div className="text-xs text-gray-500">
                    {stats?.next_payroll?.scheduled_date 
                      ? `Next: ${new Date(stats.next_payroll.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                      : 'No schedule'}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">
                    {formatNumber(stats?.employees?.active ?? 0)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Active Employees</div>
                  <div className="text-xs text-gray-500">
                    {stats?.employees?.invited ?? 0} pending invitation
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mb-1">
                    {formatCurrency(stats?.financials?.balance_usd ?? 0)}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Available Balance</div>
                  <a href="#" className="text-xs text-indigo-600 hover:underline">Top up</a>
                </div>
              </div>

              {/* Payroll Execution Panel */}
              <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Next Payroll Run</h2>
                
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {stats?.next_payroll?.scheduled_date 
                          ? new Date(stats.next_payroll.scheduled_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : 'Not scheduled'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Employees:</span>
                      <span className="text-sm font-medium text-gray-900">{formatNumber(stats?.next_payroll?.employee_count ?? 0)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-100 pt-3">
                      <span className="text-sm text-gray-600">Total:</span>
                      <span className="text-xl font-semibold text-gray-900">{formatCurrency(stats?.next_payroll?.estimated_amount_usd ?? 0)} USD</span>
                    </div>
                    <div className="text-xs text-gray-500 pt-2">
                      Estimated gas fee: ~$0.50
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => onNavigate('payroll-execution')}
                      disabled={(stats?.employees?.total ?? 0) === 0}
                      className="bg-[#1E40AF] hover:bg-[#1e3a8a] text-white px-12 py-6 text-base rounded-md disabled:opacity-50"
                    >
                      Execute Payroll
                    </Button>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-lg border border-gray-200 mb-8">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                </div>
                
                {txLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  </div>
                ) : recentTransactions.length === 0 ? (
                  <div className="px-8 py-12 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-400 mt-1">Your payroll transactions will appear here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left px-8 py-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Type</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((tx, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="px-8 py-4 text-sm text-gray-900">{tx.date}</td>
                            <td className="px-4 py-4 text-sm text-gray-900 capitalize">{tx.type.replace('_', ' ')}</td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">{tx.amount}</td>
                            <td className="px-4 py-4">
                              {tx.status === 'completed' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                  Success
                                </span>
                              ) : tx.status === 'pending' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                                  Pending
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                  Failed
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {tx.fullHash ? (
                                <a 
                                  href={`https://xrpl.org/tx/${tx.fullHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-mono text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                  {tx.hash}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-sm font-mono text-gray-400">N/A</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {recentTransactions.length > 0 && (
                  <div className="px-8 py-4 flex justify-between items-center border-t border-gray-200">
                    <div className="text-sm text-gray-600">Showing 1-{recentTransactions.length} of {transactions.length}</div>
                    <Button variant="outline" size="sm" onClick={() => onNavigate('transactions')}>
                      View All
                    </Button>
                  </div>
                )}
              </div>

              {/* Analytics Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payroll Trends */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Payroll Trends</h3>
                  {analytics?.payroll_trends && analytics.payroll_trends.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.payroll_trends.slice(0, 6).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.month}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ 
                                  width: `${Math.min(100, (item.amount_usd / (Math.max(...analytics.payroll_trends.map(p => p.amount_usd)) || 1)) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-20 text-right">
                              {formatCurrency(item.amount_usd)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No payroll data yet</p>
                    </div>
                  )}
                </div>

                {/* Department Breakdown */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Department Breakdown</h3>
                  {analytics?.department_breakdown && analytics.department_breakdown.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.department_breakdown.map((dept, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{dept.department}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{dept.employee_count} employees</span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(dept.total_salary_usd)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No department data yet</p>
                      <p className="text-sm text-gray-400 mt-1">Add employees to see breakdown</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
