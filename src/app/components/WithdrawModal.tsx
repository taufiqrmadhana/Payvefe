'use client';

import { X, Lock, Wallet, Building2, ArrowDownLeft, Zap, Landmark, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';
import { usePayve, usePayveData } from '@/hooks/usePayve';
import { useAccount } from 'wagmi';
import { transactionService } from '@/services';
import { DEFAULT_EXCHANGE_RATE } from '@/constants';

interface WithdrawModalProps {
  onClose: () => void;
  companyAddress?: string;
}

interface Employee {
  salary: bigint;
  balance: bigint;
  wallet: string;
  name: string;
  isActive: boolean;
  lastPayTimestamp: bigint;
}

export function WithdrawModal({ onClose, companyAddress }: WithdrawModalProps) {
  const { withdraw } = usePayve();
  const { address } = useAccount();
  const { employee } = usePayveData(companyAddress);
  const employeeData = employee as unknown as Employee;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawBalance = employeeData?.balance ? Number(employeeData.balance) / 1e18 : 0;
  const balanceUSD = (rawBalance / DEFAULT_EXCHANGE_RATE).toFixed(2);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0B0F1A] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
              <ArrowDownLeft className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight uppercase">Withdraw Funds</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Asset Off-ramp</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 space-y-6">
          
          {/* Balance Display Card */}
          <div className="relative group overflow-hidden p-6 bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/5 text-center transition-all hover:border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Wallet className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Liquidity</span>
              </div>
              <p className="text-4xl font-bold text-white tracking-tighter mb-1">
                {rawBalance.toLocaleString()} <span className="text-blue-500 text-2xl">IDRX</span>
              </p>
              <p className="text-xs font-medium text-slate-500">
                ≈ ${balanceUSD} USD
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Landmark className="w-3 h-3" /> Destination Bank
              </Label>
              <div className="relative group">
                <select 
                  className="w-full h-12 px-4 bg-black/40 border border-white/5 rounded-2xl text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 appearance-none transition-all cursor-pointer group-hover:border-white/10"
                >
                  <option value="">Select your bank...</option>
                  <option value="bca">Bank Central Asia (BCA)</option>
                  <option value="mandiri">Bank Mandiri</option>
                  <option value="bri">Bank Rakyat Indonesia (BRI)</option>
                  <option value="bni">Bank Negara Indonesia (BNI)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Account Number</Label>
              <Input 
                id="account-number"
                placeholder="Ex: 883012XXXX"
                className="h-12 bg-black/40 border-white/5 text-white placeholder:text-slate-700 rounded-2xl focus:border-blue-500/50 font-mono text-sm tracking-widest transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              Cancel
            </button>
            <Button 
              onClick={async () => {
                if (!companyAddress) {
                  alert("Company address missing");
                  return;
                }
                try {
                  setIsSubmitting(true);
                  const txHash = await withdraw(companyAddress);
                  
                  if (address && txHash) {
                    try {
                      await transactionService.create({
                        wallet_address: address,
                        tx_hash: txHash,
                        tx_type: 'withdraw',
                        amount_wei: rawBalance * 1e18,
                        status: 'success',
                        metadata: { company_contract: companyAddress },
                      });
                    } catch (e) { console.error(e); }
                  }
                  alert("Withdrawal successful!");
                  onClose();
                } catch (e) {
                  console.error(e);
                  alert("Withdrawal failed");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={rawBalance <= 0 || isSubmitting}
              className="flex-1 h-14 bg-white text-black hover:bg-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-white/5 disabled:opacity-20"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                   <Loader2Icon />
                   Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-black" />
                  Withdraw All
                </div>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">
              Instant Settlement • Non-Custodial Protocol
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal Icons for better UI
function ChevronDownIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
}

function Loader2Icon() {
  return <Loader2 className="w-4 h-4 animate-spin" />;
}