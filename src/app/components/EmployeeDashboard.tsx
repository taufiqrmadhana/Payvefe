import { Wallet, Calendar, FileText, Bell, ArrowUpRight, ArrowDownLeft, Zap, TrendingUp, DollarSign, ExternalLink, Copy, Download, CheckCircle, Clock, Shield, LogOut, User, Settings as SettingsIcon, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';

interface EmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export function EmployeeDashboard({ onNavigate }: EmployeeDashboardProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeModal, setActiveModal] = useState<'payslip' | 'contract' | 'schedule' | null>(null);
  const transactions = [
    { date: 'Jan 25', type: 'receive', title: 'Salary Payment', amount: '+ $430.00', time: '14:32 UTC', hash: '0xabc123def456', status: 'success', idrx: '6,880,000 IDRX' },
    { date: 'Jan 20', type: 'send', title: 'Bank Withdrawal', amount: '- $215.00', time: '09:15 UTC', hash: '0xdef789ghi012', status: 'success', idrx: '3,440,000 IDRX' },
    { date: 'Jan 15', type: 'receive', title: 'Bonus Payment', amount: '+ $100.00', time: '16:20 UTC', hash: '0xghi345jkl678', status: 'success', idrx: '1,600,000 IDRX' },
    { date: 'Jan 10', type: 'send', title: 'Bank Withdrawal', amount: '- $150.00', time: '10:45 UTC', hash: '0xjkl901mno234', status: 'success', idrx: '2,400,000 IDRX' }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Logo */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-white">Payve</div>
                  <div className="text-xs text-cyan-400 font-medium">Employee Portal</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative w-11 h-11 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center hover:bg-slate-700/50 transition-all">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900">2</span>
              </button>
              
              {/* Avatar with Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/10 hover:shadow-cyan-500/50 transition-all"
                >
                  AS
                </button>
                
                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)}
                    ></div>
                    <div className="absolute right-0 top-14 w-64 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                      <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                            AS
                          </div>
                          <div>
                            <p className="text-white font-semibold">Alex Smith</p>
                            <p className="text-xs text-slate-400">alex@company.com</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all text-left">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">My Profile</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-all text-left">
                          <SettingsIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">Settings</span>
                        </button>
                      </div>
                      <div className="p-2 border-t border-white/10">
                        <button 
                          onClick={() => onNavigate('landing')}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-all text-left group"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 font-semibold">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-2xl border border-white/20">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-cyan-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
              <p className="text-xs sm:text-sm uppercase text-white/90 tracking-wide font-semibold">Available Balance</p>
            </div>
            
            <div className="mb-6 sm:mb-8">
              <p className="text-4xl sm:text-6xl font-bold text-white mb-2">$430.00</p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base sm:text-lg text-white/80 font-medium">6,880,000 IDRX</p>
                <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs text-white font-semibold">
                  ≈ 1 USD = 16,000 IDRX
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => onNavigate('withdraw-modal')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 sm:px-8 h-11 sm:h-12 rounded-xl font-bold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all w-full sm:w-auto"
              >
                <ArrowDownLeft className="w-5 h-5 mr-2" />
                Withdraw to Bank
              </Button>
              
              <Button 
                onClick={() => setActiveModal('payslip')}
                variant="outline"
                className="border-2 border-white/30 text-white hover:text-white hover:bg-white/10 px-4 sm:px-6 h-11 sm:h-12 rounded-xl font-semibold backdrop-blur-sm w-full sm:w-auto"
              >
                <FileText className="w-5 h-5 mr-2" />
                View Payslip
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Current Salary */}
          <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/20">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-300 font-semibold">Monthly</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2 uppercase tracking-wide font-semibold">Current Salary</p>
            <p className="text-4xl font-bold text-white mb-1">$430</p>
            <p className="text-sm text-slate-500">Net after taxes</p>
          </div>

          {/* Next Payroll */}
          <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all shadow-lg hover:shadow-cyan-500/20">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                <p className="text-xs text-cyan-300 font-semibold">18 days</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2 uppercase tracking-wide font-semibold">Next Payroll</p>
            <p className="text-4xl font-bold text-white mb-1">Feb 25</p>
            <p className="text-sm text-slate-500">Auto-deposited</p>
          </div>

          {/* Contract Status */}
          <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-500/20">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                <CheckCircle className="w-3 h-3 text-emerald-300" />
                <p className="text-xs text-emerald-300 font-semibold">Active</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2 uppercase tracking-wide font-semibold">Contract Status</p>
            <p className="text-4xl font-bold text-emerald-400 mb-1">Active</p>
            <p className="text-sm text-slate-500">Until Dec 31, 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Transaction History - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Recent Transactions</h2>
                </div>
                <button 
                  onClick={() => onNavigate('payroll-history')}
                  className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  See More →
                </button>
              </div>
              
              <div className="space-y-2">
                {transactions.map((tx, i) => (
                  <div 
                    key={i} 
                    className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-slate-700/50 transition-all border border-transparent hover:border-white/10"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                      tx.type === 'receive' 
                        ? 'bg-gradient-to-br from-emerald-500 to-green-500 group-hover:shadow-emerald-500/50' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:shadow-blue-500/50'
                    }`}>
                      {tx.type === 'receive' ? (
                        <ArrowDownLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <p className="font-bold text-white text-base sm:text-lg truncate">{tx.title}</p>
                        <p className={`text-lg sm:text-xl font-bold flex-shrink-0 ${
                          tx.type === 'receive' ? 'text-emerald-400' : 'text-cyan-400'
                        }`}>{tx.amount}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 flex-1 min-w-0">
                          <p className="text-slate-400 truncate">{tx.date} • {tx.time}</p>
                          <span className="text-slate-600 hidden sm:inline">•</span>
                          <p className="text-slate-500 truncate">{tx.idrx}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-slate-600/50 rounded-lg transition-all">
                            <Copy className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-600/50 rounded-lg transition-all">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 hidden sm:block">
                        <p className="text-xs text-slate-600 font-mono truncate">{tx.hash}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-16">
                  <TrendingUp className="w-20 h-20 mx-auto mb-4 text-slate-700" />
                  <p className="text-slate-400 text-lg font-medium">No transactions yet</p>
                  <p className="text-slate-600 text-sm mt-1">Your payment history will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl">
              <h3 className="font-bold text-white mb-4 text-lg">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveModal('payslip')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">Download Payslip</p>
                    <p className="text-xs text-slate-400">January 2026</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveModal('contract')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">View Contract</p>
                    <p className="text-xs text-slate-400">Employment details</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveModal('schedule')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">Payment Schedule</p>
                    <p className="text-xs text-slate-400">View upcoming</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Network Info */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white">Powered by Base L2</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                All transactions are instant, secure, and verified on the blockchain. Gas fees are minimal.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Network Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-400 font-semibold">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Avg. Gas Fee</span>
                  <span className="text-white font-semibold">$0.02</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Settlement Time</span>
                  <span className="text-white font-semibold">Instant</span>
                </div>
              </div>
            </div>

            {/* IDRX Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white">About IDRX</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                IDRX is a stablecoin pegged 1:1 to Indonesian Rupiah, ensuring your salary maintains stable value.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {activeModal === 'payslip' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Payslip</h2>
                  <p className="text-sm sm:text-base text-slate-400">January 2026</p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Employee Name</span>
                    <span className="text-white font-semibold">Alex Smith</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Employee ID</span>
                    <span className="text-white font-mono">EMP-0042</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Department</span>
                    <span className="text-white font-semibold">Engineering</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Payment Date</span>
                    <span className="text-white font-semibold">Jan 25, 2026</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-cyan-500/30 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Gross Salary</span>
                    <span className="text-white font-semibold">$500.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tax Deduction</span>
                    <span className="text-red-400 font-semibold">- $50.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Platform Fee</span>
                    <span className="text-slate-400 font-semibold">- $2.50</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-cyan-500/30 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-lg">Net Salary</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">$430.00</p>
                      <p className="text-sm text-slate-400">6,880,000 IDRX</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={() => setActiveModal(null)}
                  variant="outline" 
                  className="h-11 sm:h-12 px-6 border-white/20 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'contract' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Employment Contract</h2>
                  <p className="text-sm sm:text-base text-slate-400">Full-time Employee</p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2">Contract Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contract Type</span>
                        <span className="text-white">Full-time Employment</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Start Date</span>
                        <span className="text-white">Jan 1, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">End Date</span>
                        <span className="text-white">Dec 31, 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Position</span>
                        <span className="text-white">Senior Developer</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Department</span>
                        <span className="text-white">Engineering</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10"></div>

                  <div>
                    <h3 className="text-white font-bold mb-2">Compensation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly Salary</span>
                        <span className="text-white font-semibold">$500.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payment Currency</span>
                        <span className="text-white">IDRX (Stablecoin)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payment Frequency</span>
                        <span className="text-white">Monthly (25th)</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-white/10"></div>

                  <div>
                    <h3 className="text-white font-bold mb-2">Benefits</h3>
                    <ul className="space-y-1 text-sm text-slate-300">
                      <li>✓ Health Insurance</li>
                      <li>✓ Paid Time Off (20 days/year)</li>
                      <li>✓ Remote Work Allowance</li>
                      <li>✓ Professional Development Budget</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download Contract
                </Button>
                <Button 
                  onClick={() => setActiveModal(null)}
                  variant="outline" 
                  className="h-11 sm:h-12 px-6 border-white/20 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'schedule' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-800 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Payment Schedule</h2>
                  <p className="text-sm sm:text-base text-slate-400">Upcoming payroll dates</p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6">
                <div className="space-y-4">
                  {[
                    { month: 'February 2026', date: 'Feb 25, 2026', amount: '$430.00', status: 'upcoming', days: '18 days' },
                    { month: 'March 2026', date: 'Mar 25, 2026', amount: '$430.00', status: 'scheduled', days: '46 days' },
                    { month: 'April 2026', date: 'Apr 25, 2026', amount: '$430.00', status: 'scheduled', days: '77 days' },
                    { month: 'May 2026', date: 'May 25, 2026', amount: '$430.00', status: 'scheduled', days: '107 days' }
                  ].map((payment, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        payment.status === 'upcoming' 
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-500' 
                          : 'bg-slate-700'
                      }`}>
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{payment.month}</p>
                        <p className="text-sm text-slate-400">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{payment.amount}</p>
                        <p className="text-xs text-cyan-400">{payment.days}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Auto-payment:</strong> Your salary is automatically deposited to your Payve wallet on the 25th of each month.
                </p>
              </div>

              <Button 
                onClick={() => setActiveModal(null)}
                variant="outline" 
                className="w-full h-11 sm:h-12 border-white/20 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
