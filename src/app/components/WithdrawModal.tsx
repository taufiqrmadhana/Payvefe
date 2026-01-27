import { X, Lock, Wallet, Building2, ArrowDownLeft, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useState } from 'react';
import { usePayve, usePayveData } from '@/hooks/usePayve';
import { useAccount } from 'wagmi';

interface WithdrawModalProps {
  onClose: () => void;
}

export function WithdrawModal({ onClose }: WithdrawModalProps) {
  const { withdraw } = usePayve();
  const { address } = useAccount();
  const { employee } = usePayveData(address);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formatted balance
  // employee.balance is bigint wei
  const rawBalance = employee?.balance ? Number(employee.balance) / 1e18 : 0;
  const balanceUSD = (rawBalance / 16000).toFixed(2); // Approx rate
  
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
              <h2 className="text-2xl font-bold text-white">Withdraw Funds</h2>
            </div>
            <p className="text-sm text-slate-400 ml-13">Withdraw your full available balance</p>
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
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-cyan-500/30 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-cyan-400" />
              <p className="text-xs text-slate-300 uppercase tracking-wide font-semibold">Available to Withdraw</p>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
                {rawBalance.toLocaleString()} IDRX
            </p>
            <p className="text-sm text-slate-400">
                ≈ ${balanceUSD} USD
            </p>
          </div>

          {/* Bank Selection */}
          <div className="space-y-2">
            <Label className="text-xs uppercase text-slate-400 font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Confirm Bank Account
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

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
            <Lock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-300 font-semibold mb-1">Secure Withdrawal</p>
              <p className="text-slate-400">Funds will be sent to your linked bank account via our off-ramp partner.</p>
            </div>
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
              onClick={async () => {
                try {
                   setIsSubmitting(true);
                   await withdraw(); // No args, withdraws all
                   alert("Withdrawal successful! Check your wallet.");
                   onClose();
                } catch (e) {
                   console.error(e);
                   alert("Withdrawal failed");
                } finally {
                   setIsSubmitting(false);
                }
              }}
              disabled={rawBalance <= 0 || isSubmitting}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Processing...' : 'Withdraw All Funds'}
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
