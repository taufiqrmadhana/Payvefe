import { Button } from '@/app/components/ui/button';
import { Zap, Building2, DollarSign, Calendar, Coins, Mail } from 'lucide-react';

interface EmployeeInvitationEmailProps {
  onNavigate: (page: string) => void;
}

export function EmployeeInvitationEmail({ onNavigate }: EmployeeInvitationEmailProps) {
  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      {/* Email Container */}
      <div className="max-w-2xl mx-auto">
        {/* Preview Notice */}
        <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <p className="text-sm text-amber-300 font-semibold">
            📧 Email Preview - This is how the invitation email appears to employees
          </p>
        </div>

        {/* Email */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          {/* Email Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-bold text-white">Payve</div>
            </div>
            <p className="text-cyan-100 text-sm">Cross-Border Crypto Payroll</p>
          </div>

          {/* Email Body */}
          <div className="px-8 py-8">
            <p className="text-white text-lg mb-6">Hello Anderson,</p>

            <p className="text-slate-300 mb-4 leading-relaxed">
              <span className="font-semibold text-white">Acme Corp</span> has added you to their Payve payroll system.
            </p>

            <p className="text-slate-300 mb-8 leading-relaxed">
              You'll receive your salary payments <span className="text-cyan-400 font-semibold">instantly</span> to your wallet on the <span className="text-cyan-400 font-semibold">25th of each month</span>.
            </p>

            {/* What to do next */}
            <div className="bg-slate-700/50 rounded-xl p-6 mb-8 border border-white/10">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                What to do next
              </h3>
              <ol className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    1
                  </span>
                  <span>Click the button below to set up your account</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    2
                  </span>
                  <span>Your wallet will be created automatically (no seed phrases!)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    3
                  </span>
                  <span>Add your bank account for easy withdrawals to local currency</span>
                </li>
              </ol>
            </div>

            {/* CTA Button */}
            <div className="text-center mb-8">
              <Button 
                onClick={() => onNavigate('employee-onboarding')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-10 py-6 text-base h-auto rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
              >
                Set Up My Account
              </Button>
            </div>

            {/* Details Card */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-xl p-6 space-y-4">
              <h4 className="text-white font-bold mb-3">Your Employment Details</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-sm text-slate-400">Company</span>
                </div>
                <span className="text-white font-semibold">Acme Corp</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-sm text-slate-400">Monthly Salary</span>
                </div>
                <span className="text-white font-semibold">$430</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-sm text-slate-400">Contract End</span>
                </div>
                <span className="text-white font-semibold">Dec 31, 2026</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Coins className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-sm text-slate-400">Payment Token</span>
                </div>
                <span className="text-cyan-400 font-semibold">IDRX</span>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>Powered by Base L2 • Instant settlement • Low fees</span>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-slate-400 mb-4">
                Questions? Contact your HR department or reply to this email.
              </p>
            </div>
          </div>

          {/* Email Footer */}
          <div className="bg-slate-900/50 px-8 py-6 border-t border-white/10">
            <p className="text-xs text-slate-500 text-center mb-2">
              This is an automated message from Payve.
            </p>
            <div className="text-center text-xs text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
              <span className="mx-2">•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
