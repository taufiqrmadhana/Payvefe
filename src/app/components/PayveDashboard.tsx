import { LayoutDashboard, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowRight, Calendar, Bell, ChevronRight, Zap, Flag as FlagIcon, Building2, Sparkles, FileCheck, CheckCircle, Plus, Settings as SettingsIcon, Download, Mail, ChartBar, Wallet, Search } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Flag } from '@/app/components/ui/flag';
import { Sidebar } from '@/app/components/Sidebar';

interface PayveDashboardProps {
  onNavigate: (page: string) => void;
}

export function PayveDashboard({ onNavigate }: PayveDashboardProps) {
  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-slate-800/50 backdrop-blur-xl border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search employees..."
                className="w-80 h-10 pl-10 pr-4 rounded-xl bg-slate-700/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all text-white placeholder:text-slate-400"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-slate-400 bg-slate-700 rounded border border-white/10">⌘K</kbd>
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-xl bg-slate-700/50 border border-white/10 flex items-center justify-center hover:bg-slate-700 transition-all">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900">3</span>
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-slate-700 shadow-lg"></div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
          {/* Hero Card */}
          <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Good morning, Sarah</h1>
                <p className="text-white/80 mb-6">Your next payroll is in 3 days</p>
                <Button 
                  onClick={() => onNavigate('payroll-confirmation')}
                  className="h-12 px-8 bg-white text-purple-700 hover:bg-white/90 font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  Execute Payroll Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">75 employees ready</span>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Jan 25, 2026</span>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm font-medium">$29,160 queued</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-emerald-400 text-sm font-semibold">↑ 5</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">75</div>
              <div className="text-sm text-slate-400">Total Employees</div>
              <div className="mt-3 h-8 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg"></div>
            </div>

            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">$32,400</div>
              <div className="text-sm text-slate-400">Monthly Payroll</div>
              <div className="mt-3 text-xs text-slate-500">Next: Jan 25</div>
            </div>

            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <span className="text-amber-400 text-sm font-semibold">7 expiring</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">68</div>
              <div className="text-sm text-slate-400">Active Contracts</div>
            </div>

            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">0.0001</div>
              <div className="text-sm text-slate-400">ETH Avg Gas</div>
              <div className="mt-3 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full inline-block border border-blue-500/30">Base L2</div>
            </div>
          </div>

          {/* Payroll Execution Panel */}
          <div className="mb-8 p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Upcoming Payroll Run</h2>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full border border-purple-500/30">
                Auto-executes Jan 25
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6 p-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl border border-purple-500/30">
                  <div className="text-sm text-slate-400 mb-1">Scheduled Date</div>
                  <div className="text-lg font-bold text-white">Jan 25, 2026 14:00 UTC</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm p-3 bg-slate-700/30 rounded-lg border border-white/10">
                    <Flag country="indonesia" className="w-6 h-4" />
                    <span className="text-white font-medium">Indonesia: 45 employees</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-3 bg-slate-700/30 rounded-lg border border-white/10">
                    <Flag country="singapore" className="w-6 h-4" />
                    <span className="text-white font-medium">Singapore: 20 employees</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-3 bg-slate-700/30 rounded-lg border border-white/10">
                    <Flag country="usa" className="w-6 h-4" />
                    <span className="text-white font-medium">United States: 10 employees</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-6 bg-slate-700/30 rounded-xl border border-white/10 mb-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Gross Payroll</span>
                      <span className="text-white font-semibold">$32,400</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Tax Withholding</span>
                      <span className="text-white font-semibold">-$3,240</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-purple-500/30 to-cyan-500/30"></div>
                    <div className="flex justify-between">
                      <span className="text-white font-bold">Net Transfer</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">$29,160</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-20">Network:</span>
                    <span className="text-white font-medium">Base L2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20">Token:</span>
                    <span className="text-white font-medium">IDRX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20">Est. gas:</span>
                    <span className="text-white font-medium">~$0.50</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => onNavigate('payroll-confirmation')}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Execute Payroll
                  </Button>
                  <Button variant="outline" className="h-12 px-6 rounded-xl border-white/20 text-white hover:bg-white/10">
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
              <h3 className="font-bold text-white mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle, color: 'text-emerald-400', title: 'Payroll executed', desc: '75 employees • $29,160', time: '2h ago' },
                  { icon: Plus, color: 'text-blue-400', title: 'Employee added', desc: 'Anderson Smith', time: '5h ago' },
                  { icon: SettingsIcon, color: 'text-slate-400', title: 'Settings updated', desc: 'Payroll day changed', time: '1d ago' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-700/30 transition-colors cursor-pointer">
                    <div className={`w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{item.title}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                    <div className="text-xs text-slate-500">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Plus, label: 'Add Employee', action: 'add-employee' },
                  { icon: Download, label: 'Export Report', action: 'reports' },
                  { icon: Mail, label: 'Invite Team', action: 'settings' },
                  { icon: ChartBar, label: 'View Analytics', action: 'reports' }
                ].map((action, i) => (
                  <button 
                    key={i}
                    onClick={() => onNavigate(action.action)}
                    className="p-4 rounded-xl border-2 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group"
                  >
                    <action.icon className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 mb-2" />
                    <div className="text-sm font-medium text-white">{action.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}