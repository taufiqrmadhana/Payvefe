import { Wallet, Calendar, FileText, Bell, ArrowUpRight, ArrowDownLeft, Menu, Zap, DollarSign, Download, Shield, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';

interface MobileEmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export function MobileEmployeeDashboard({ onNavigate }: MobileEmployeeDashboardProps) {
  const [activeModal, setActiveModal] = useState<'payslip' | 'contract' | 'schedule' | null>(null);
  const transactions = [
    { date: 'Jan 25', type: 'receive', title: 'Salary Payment', amount: '+ $430', status: 'success' },
    { date: 'Jan 20', type: 'send', title: 'Bank Withdrawal', amount: '- $215', status: 'success' },
    { date: 'Jan 15', type: 'receive', title: 'Bonus Payment', amount: '+ $100', status: 'success' }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <img 
              src="/src/public/Payve-Logo.png" 
              alt="Payve Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
            />
          </div>
          <div>
            <div className="text-white font-bold">Payve</div>
            <div className="text-xs text-cyan-400">Employee</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-xl bg-slate-700/50 border border-white/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-slate-300" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900">2</span>
          </button>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-cyan-500/30 text-center shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <p className="text-xs uppercase text-slate-300 tracking-wide font-semibold">Balance</p>
          </div>
          <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">$430.00</p>
          <p className="text-sm text-slate-400 mb-6">~6,880,000 IDRX</p>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => onNavigate('withdraw-modal')}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg text-sm"
            >
              <ArrowDownLeft className="w-4 h-4 mr-1" />
              Withdraw
            </Button>
            <Button 
              onClick={() => setActiveModal('payslip')}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg text-sm"
            >
              <FileText className="w-4 h-4 mr-1" />
              Payslip
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2 shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-slate-400 mb-1 uppercase">Salary</p>
            <p className="text-2xl font-bold text-white">$430</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-2 shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-slate-400 mb-1 uppercase">Next Pay</p>
            <p className="text-2xl font-bold text-white">18 days</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <h3 className="font-bold text-white mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setActiveModal('payslip')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">Download Payslip</p>
                <p className="text-xs text-slate-400">January 2026</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveModal('contract')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">View Contract</p>
                <p className="text-xs text-slate-400">Employment details</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveModal('schedule')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 border border-white/10 hover:bg-slate-700 hover:border-cyan-500/30 transition-all text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">Payment Schedule</p>
                <p className="text-xs text-slate-400">View upcoming</p>
              </div>
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Activity</h3>
            <button className="text-xs text-cyan-400 font-semibold">View All</button>
          </div>

          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-all">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${
                  tx.type === 'receive' 
                    ? 'bg-gradient-to-br from-emerald-500 to-green-500' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}>
                  {tx.type === 'receive' ? (
                    <ArrowDownLeft className="w-5 h-5 text-white" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{tx.title}</p>
                  <p className="text-xs text-slate-400">{tx.date}</p>
                </div>

                <p className={`font-bold text-sm ${
                  tx.type === 'receive' ? 'text-emerald-400' : 'text-cyan-400'
                }`}>{tx.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contract Info */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <p className="text-xs uppercase text-slate-300 tracking-wide font-semibold">Contract Status</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mb-1">Active</p>
          <p className="text-sm text-slate-400">Valid until Dec 31, 2026</p>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <Zap className="w-4 h-4" />
            <span>Powered by Base L2 • Instant & Secure</span>
          </div>
        </div>
      </main>

      {/* Payslip Modal */}
      {activeModal === 'payslip' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Payslip</h2>
                  <p className="text-sm text-slate-400">January 2026</p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Employee Name</span>
                    <span className="text-white font-semibold">Alex Smith</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Employee ID</span>
                    <span className="text-white font-mono">EMP-0042</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Department</span>
                    <span className="text-white font-semibold">Engineering</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Payment Date</span>
                    <span className="text-white font-semibold">Jan 25, 2026</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-cyan-500/30 my-3"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Gross Salary</span>
                    <span className="text-white font-semibold">$500.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Tax Deduction</span>
                    <span className="text-red-400 font-semibold">- $50.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Platform Fee</span>
                    <span className="text-slate-400 font-semibold">- $2.50</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-cyan-500/30 my-3"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Net Salary</span>
                    <div className="text-right">
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">$430.00</p>
                      <p className="text-xs text-slate-400">6,880,000 IDRX</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={() => setActiveModal(null)}
                  className="w-full h-11 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Modal */}
      {activeModal === 'contract' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Contract</h2>
                  <p className="text-sm text-slate-400">Full-time Employee</p>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 mb-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2 text-sm">Contract Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contract Type</span>
                        <span className="text-white">Full-time</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Start Date</span>
                        <span className="text-white">Jan 1, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">End Date</span>
                        <span className="text-white">Dec 31, 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly Salary</span>
                        <span className="text-white font-semibold">$430.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className="text-emerald-400 font-semibold">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setActiveModal(null)}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {activeModal === 'schedule' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-8">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Payment Schedule</h2>
                  <p className="text-sm text-slate-400">Upcoming payments</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="bg-slate-700/50 rounded-xl p-4 border border-cyan-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-cyan-400 font-bold">February 2026</span>
                    <span className="text-white font-bold">$430.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Payment Date</span>
                    <span className="text-slate-300">Feb 25, 2026</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className="text-cyan-400 font-semibold">In 18 days</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-bold">March 2026</span>
                    <span className="text-white font-bold">$430.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Payment Date</span>
                    <span className="text-slate-300">Mar 25, 2026</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className="text-slate-500">Scheduled</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-bold">April 2026</span>
                    <span className="text-white font-bold">$430.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Payment Date</span>
                    <span className="text-slate-300">Apr 25, 2026</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className="text-slate-500">Scheduled</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setActiveModal(null)}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg"
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
