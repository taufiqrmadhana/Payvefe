import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  FileText, 
  Bell, 
  LogOut,
  TrendingUp,
  Settings,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useDisconnect } from 'wagmi';

interface HRDashboardProps {
  onNavigate: (page: string) => void;
}

export function HRDashboard({ onNavigate }: HRDashboardProps) {
  const { disconnect } = useDisconnect();

  const handleLogout = () => {
    disconnect();
    onNavigate('landing');
  };

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
            <div className="text-sm text-gray-500">Dashboard</div>
            
            <div className="flex items-center gap-4">
              <button className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs font-mono text-gray-700">0x1234...5678</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">75</div>
              <div className="text-sm text-gray-600 mb-2">Total Employees</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>5 this month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">$32,400</div>
              <div className="text-sm text-gray-600 mb-2">Monthly Payroll</div>
              <div className="text-xs text-gray-500">Next: Jan 25, 2026</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">68</div>
              <div className="text-sm text-gray-600 mb-2">Active Contracts</div>
              <div className="text-xs text-amber-600">7 expiring soon</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">48.6M IDRX</div>
              <div className="text-sm text-gray-600 mb-2">IDRX Balance</div>
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
                  <span className="text-sm font-medium text-gray-900">January 25, 2026</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Employees:</span>
                  <span className="text-sm font-medium text-gray-900">75</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100 pt-3">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="text-xl font-semibold text-gray-900">$32,400 USD</span>
                </div>
                <div className="text-xs text-gray-500 pt-2">
                  Estimated gas fee: ~$0.50
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => onNavigate('payroll-confirmation')}
                  className="bg-[#1E40AF] hover:bg-[#1e3a8a] text-white px-12 py-6 text-base rounded-md"
                >
                  Execute Payroll
                </Button>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-8 py-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Employee</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: 'Jan 25', name: 'Anderson Smith', amount: '$430', status: 'success', hash: '0xabc1...' },
                    { date: 'Jan 25', name: 'Blake Johnson', amount: '$520', status: 'success', hash: '0xdef2...' },
                    { date: 'Jan 25', name: 'Casey Williams', amount: '$385', status: 'success', hash: '0xghi3...' },
                    { date: 'Jan 24', name: 'Drew Martinez', amount: '$460', status: 'pending', hash: '0xjkl4...' },
                    { date: 'Jan 24', name: 'Emerson Davis', amount: '$490', status: 'success', hash: '0xmno5...' }
                  ].map((tx, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-8 py-4 text-sm text-gray-900">{tx.date}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{tx.name}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{tx.amount}</td>
                      <td className="px-4 py-4">
                        {tx.status === 'success' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                            Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                            <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <a href="#" className="text-sm font-mono text-indigo-600 hover:underline flex items-center gap-1">
                          {tx.hash}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-8 py-4 flex justify-between items-center border-t border-gray-200">
              <div className="text-sm text-gray-600">Showing 1-5 of 75</div>
              <div className="text-sm text-gray-600">1 / 8</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
