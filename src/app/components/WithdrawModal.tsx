import { X, Lock, Wallet, Building2, ArrowDownLeft, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useState } from 'react';

interface WithdrawModalProps {
  onClose: () => void;
}

export function WithdrawModal({ onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');

  const quickAmounts = [
    { label: '$100', value: '100' },
    { label: '$200', value: '200' },
    { label: '$430', value: '430' },
    { label: 'Max', value: '430' }
  ];

  const formatAmount = (value: string) => {
    const number = value.replace(/\D/g, '');
    return number;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <ArrowDownLeft className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Withdraw to Bank</h2>
            </div>
            <p className="text-sm text-slate-400 ml-13">Funds arrive in 5-10 minutes</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Current Balance */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-5 border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-cyan-400" />
              <p className="text-xs text-slate-300 uppercase tracking-wide font-semibold">Available Balance</p>
            </div>
            <p className="text-3xl font-bold text-white">$430.00</p>
            <p className="text-xs text-slate-400 mt-1">~6,880,000 IDRX</p>
          </div>

          {/* Amount */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-xs uppercase text-slate-400 font-semibold">Withdrawal Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-semibold">
                $
              </span>
              <Input 
                id="amount"
                value={amount}
                onChange={(e) => setAmount(formatAmount(e.target.value))}
                placeholder="Enter amount"
                className="h-14 rounded-xl pl-8 text-2xl font-bold bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
              />
            </div>
            <p className="text-xs text-slate-500">Minimum $10.00 • Maximum $430.00</p>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => setAmount(qa.value)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    amount === qa.value
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-700/50 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
                  }`}
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bank Selection */}
          <div className="space-y-2">
            <Label className="text-xs uppercase text-slate-400 font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Bank Account
            </Label>
            <select 
              className="w-full h-12 px-4 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option className="bg-slate-800" value="">Select bank</option>
              <option className="bg-slate-800" value="bca">Bank Central Asia (BCA)</option>
              <option className="bg-slate-800" value="mandiri">Bank Mandiri</option>
              <option className="bg-slate-800" value="bri">Bank Rakyat Indonesia (BRI)</option>
              <option className="bg-slate-800" value="bni">Bank Negara Indonesia (BNI)</option>
            </select>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="account-number" className="text-xs uppercase text-slate-400 font-semibold">Account Number</Label>
            <Input 
              id="account-number"
              placeholder="Enter your account number"
              className="h-12 bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50"
            />
          </div>

          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="account-name" className="text-xs uppercase text-slate-400 font-semibold">Account Holder Name</Label>
            <Input 
              id="account-name"
              placeholder="Enter account holder name"
              className="h-12 bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50"
            />
          </div>

          {/* Fee Info */}
          <div className="bg-slate-700/30 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Withdrawal Amount</span>
              <span className="text-white font-semibold">${amount || '0'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Processing Fee (0.5%)</span>
              <span className="text-white font-semibold">${ amount ? (parseFloat(amount) * 0.005).toFixed(2) : '0.00'}</span>
            </div>
            <div className="h-px bg-white/10 my-2"></div>
            <div className="flex justify-between">
              <span className="text-slate-300 font-semibold">You will receive</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ${ amount ? (parseFloat(amount) * 0.995).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
            <Lock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-300 font-semibold mb-1">Secure Transfer</p>
              <p className="text-slate-400">Your withdrawal will be processed securely via Base L2 blockchain</p>
            </div>
          </div>

          {/* Confirm Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-xl border border-white/10">
            <Checkbox id="confirm-withdraw" className="mt-1" />
            <label htmlFor="confirm-withdraw" className="text-sm text-slate-300 cursor-pointer">
              I confirm the bank details are correct. Withdrawals cannot be reversed.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              disabled={!amount || parseFloat(amount) < 10}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 mr-2" />
              Withdraw Now
            </Button>
          </div>

          {/* Info */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Processing time: 5-10 minutes • Available 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
