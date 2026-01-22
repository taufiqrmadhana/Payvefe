import { ArrowLeft, Calendar, Users, Wallet, Zap, CheckCircle, Clock, Database, Bell, Send, Code, Shield, Copy, ExternalLink, Download, TrendingDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { CompanyHeader } from '@/app/components/CompanyHeader';

interface PayvePayrollExecutionProps {
  onNavigate: (page: string) => void;
}

export function PayvePayrollExecution({ onNavigate }: PayvePayrollExecutionProps) {
  const [stage, setStage] = useState<'review' | 'confirm' | 'executing' | 'success'>('review');
  const [checked, setChecked] = useState({ verify: false, irreversible: false, amounts: false });
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (stage === 'executing') {
      const steps = [
        { delay: 500, step: 1 },
        { delay: 1500, step: 2 },
        { delay: 3000, step: 3 },
        { delay: 5000, step: 4 },
        { delay: 7000, step: 5 }
      ];

      steps.forEach(({ delay, step }) => {
        setTimeout(() => setCurrentStep(step), delay);
      });

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage('success'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [stage]);

  const allChecked = checked.verify && checked.irreversible && checked.amounts;

  if (stage === 'review') {
    return (
      <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
        <Sidebar currentPage="payroll-execution" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <CompanyHeader 
            title="Payroll Execution"
            subtitle="January 2026 Cycle"
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isMobile={isMobile}
            onNavigate={onNavigate}
            showNotifications={true}
          />

          {/* Progress Bar */}
          <div className="px-4 sm:px-8 py-6 sm:py-8 bg-slate-900/50">{/* Moved out of header */}
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-white font-semibold text-sm sm:text-base">Review</span>
              </div>
              <div className="w-12 h-1 sm:w-16 bg-white/30 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/30 border-2 border-white/20"></div>
                <span className="text-white/60 text-sm sm:text-base">Confirm</span>
              </div>
              <div className="w-12 h-1 sm:w-16 bg-white/30 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/30 border-2 border-white/20"></div>
                <span className="text-white/60 text-sm sm:text-base">Execute</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8 pb-12">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50 flex-shrink-0">
                  <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{/* Changed h1 to h2 */}
                    January 2026 Payroll
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm font-medium border border-blue-500/30">
                      January 25, 2026 • 14:00 UTC
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 border-2 border-blue-500/30">
                  <Users className="w-8 h-8 text-blue-400 mb-3" />
                  <div className="text-4xl font-bold text-white mb-1">75</div>
                  <div className="text-sm text-slate-400 mb-3">Employees</div>
                  <button className="text-sm text-blue-400 font-medium hover:underline">View breakdown ↓</button>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border-2 border-cyan-500/30">
                  <Wallet className="w-8 h-8 text-cyan-400 mb-3" />
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">$32,400</div>
                  <div className="text-sm text-slate-400 mb-1">Gross Payroll</div>
                  <div className="text-xs text-slate-500">52,560,000 IDRX</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border-2 border-emerald-500/30">
                  <Zap className="w-8 h-8 text-emerald-400 mb-3" />
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-1">Instant</div>
                  <div className="text-sm text-slate-400 mb-1">Settlement Time</div>
                  <div className="text-xs text-slate-500">Via Base L2</div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="p-6 rounded-2xl bg-slate-700/50 border border-white/10 mb-8">
                <h3 className="font-bold text-white mb-4">Financial Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gross Payroll</span>
                    <span className="text-white font-semibold">$32,400</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tax Withholding (10%)</span>
                    <span className="text-red-400 font-semibold">- $3,240</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Platform Fee (0.5%)</span>
                    <span className="text-slate-400 font-semibold">- $162</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-cyan-500/30 my-3"></div>
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Net Transfer</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">$29,160</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">In IDRX</span>
                    <span className="text-slate-400 font-mono">466,560,000 IDRX</span>
                  </div>
                </div>
              </div>

              {/* Balance Check */}
              <div className="p-6 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/30 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <h3 className="font-bold text-white">Balance Check</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Current Balance</div>
                    <div className="text-lg font-bold text-white">520,000,000 IDRX</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Required</div>
                    <div className="text-lg font-bold text-white">466,560,000 IDRX</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Remaining After</div>
                    <div className="text-lg font-bold text-emerald-400">53,440,000 IDRX</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  onClick={() => onNavigate('dashboard')}
                  variant="outline" 
                  className="flex-1 h-11 sm:h-12 rounded-xl border-white/20 text-slate-300 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setStage('confirm')}
                  className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold"
                >
                  Continue to Confirm
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (stage === 'confirm') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full bg-slate-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Confirm Payroll Execution</h2>
            <p className="text-sm sm:text-base text-red-400 font-semibold">This action cannot be undone</p>
          </div>

          {/* Checklist */}
          <div className="space-y-4 mb-8">
            <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-white/10 hover:border-cyan-500/30 cursor-pointer transition-all bg-slate-700/30">
              <input 
                type="checkbox" 
                checked={checked.verify}
                onChange={(e) => setChecked({ ...checked, verify: e.target.checked })}
                className="w-5 h-5 mt-0.5 accent-cyan-600"
              />
              <span className="text-white font-medium">I have verified all employee details</span>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-white/10 hover:border-cyan-500/30 cursor-pointer transition-all bg-slate-700/30">
              <input 
                type="checkbox"
                checked={checked.irreversible}
                onChange={(e) => setChecked({ ...checked, irreversible: e.target.checked })}
                className="w-5 h-5 mt-0.5 accent-cyan-600"
              />
              <span className="text-white font-medium">I understand this transaction is irreversible</span>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-white/10 hover:border-cyan-500/30 cursor-pointer transition-all bg-slate-700/30">
              <input 
                type="checkbox"
                checked={checked.amounts}
                onChange={(e) => setChecked({ ...checked, amounts: e.target.checked })}
                className="w-5 h-5 mt-0.5 accent-cyan-600"
              />
              <span className="text-white font-medium">I confirm the payment amounts are correct</span>
            </label>
          </div>

          {/* Final Amount */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-cyan-500/30 mb-8">
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-2">You are about to transfer:</div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">$29,160</div>
              <div className="text-slate-300 mb-1">466,560,000 IDRX</div>
              <div className="text-sm text-slate-500">To 75 employees + $1.23 gas</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              onClick={() => setStage('review')}
              variant="outline"
              className="flex-1 h-12 sm:h-14 rounded-xl border-white/20 text-slate-300 hover:text-white hover:bg-white/10"
            >
              Back
            </Button>
            <Button 
              onClick={() => setStage('executing')}
              disabled={!allChecked}
              className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <Zap className="w-5 h-5 mr-2" />
              Execute Payroll
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'executing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl w-full">
          {/* Progress Ring */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                <circle 
                  cx="96" 
                  cy="96" 
                  r="88" 
                  stroke="url(#gradient)" 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  className="transition-all duration-300"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mt-6">Executing Payroll...</h2>
            <p className="text-white/70 mt-2">Please wait, do not close this page</p>
          </div>

          {/* Progress Steps */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4 border border-white/10">
              {[
                { label: 'Preparing transaction', step: 1 },
                { label: 'Calculating amounts', step: 2 },
                { label: 'Sending to blockchain', step: 3 },
                { label: 'Distributing to employees', step: 4 },
                { label: 'Sending notifications', step: 5 }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {currentStep > item.step ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  ) : currentStep === item.step ? (
                    <div className="w-6 h-6 rounded-full border-2 border-cyan-400 animate-spin" style={{ borderTopColor: 'transparent' }}></div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white/30"></div>
                  )}
                  <span className="text-white font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-4">Transaction Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-white/60 mb-1">Transaction Hash</div>
                  <div className="text-white font-mono text-xs">0xabc123def456...</div>
                </div>
                <div>
                  <div className="text-white/60 mb-1">Confirmations</div>
                  <div className="text-white font-semibold">{Math.min(Math.floor(progress / 10), 12)} / 12</div>
                </div>
                <div>
                  <div className="text-white/60 mb-1">Network</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white">Base L2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
            <CheckCircle className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">Payroll Executed Successfully!</h1>
          <p className="text-xl text-white/80 mb-2">75 employees have received their payment</p>
          <p className="text-white/60">Completed at 14:32:45 UTC</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: CheckCircle, label: 'Amount Transferred', value: '$29,160', sub: 'Sent to 75 employees', color: 'from-emerald-500 to-green-500' },
            { icon: Zap, label: 'Transaction Speed', value: '8 seconds', sub: 'Lightning fast on Base', color: 'from-cyan-500 to-blue-500' },
            { icon: TrendingDown, label: 'Gas Saved', value: '$48.77', sub: 'vs Ethereum mainnet', color: 'from-green-500 to-emerald-500' },
            { icon: Shield, label: 'Confirmations', value: '12 / 12', sub: 'Fully confirmed', color: 'from-blue-500 to-cyan-500' }
          ].map((card, i) => (
            <div key={i} className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-sm text-white/60">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Transaction Details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
          <h3 className="text-white font-bold mb-4">Blockchain Verification</h3>
          <div className="flex items-center gap-3 mb-3">
            <code className="flex-1 text-white font-mono text-sm bg-black/20 px-4 py-2 rounded-lg">
              0xabc123def456789...
            </code>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <Copy className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <ExternalLink className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 font-semibold">
            View Transaction Details
          </Button>
          <Button variant="outline" className="h-12 px-8 border-2 border-white/20 text-white hover:bg-white/10 rounded-xl">
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </Button>
          <Button 
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="h-12 px-8 text-white hover:bg-white/10 rounded-xl"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}