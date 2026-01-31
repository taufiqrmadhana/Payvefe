'use client';

import { X, User, Mail, Briefcase, Sparkles, CheckCircle, ArrowRight, ArrowLeft, Copy, Loader2, Landmark } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';
import { usePayve } from '@/hooks/usePayve';
import { useAccount } from 'wagmi';
import { keccak256, toBytes } from 'viem';
import { API_BASE_URL } from '@/constants';

interface PayveAddEmployeeProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function PayveAddEmployee({ onClose, onNavigate }: PayveAddEmployeeProps) {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [salaryIDRX, setSalaryIDRX] = useState('6880000');
  const [inviteSecret, setInviteSecret] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createInvite, myCompanyAddress } = usePayve();
  const { address: adminAddress } = useAccount();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateInvite = async () => {
    try {
      setIsSubmitting(true);
      
      // 1. Generate Logic (Sesuai branch terbaru)
      const secret = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      setInviteSecret(secret);
      const inviteHash = keccak256(toBytes(secret));
      
      // Sanitasi input angka (menghapus koma jika ada)
      const cleanSalary = salaryIDRX.replace(/,/g, '');
      const salaryBigInt = BigInt(cleanSalary) * BigInt(1e18);

      // 2. Blockchain Transaction
      await createInvite(inviteHash, name || "New Employee", salaryBigInt);

      // 3. Backend Synchronization (Fungsionalitas krusial dari branch teman)
      try {
        await fetch(`${API_BASE_URL}/api/employees/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email || null,
            name: name || 'New Employee',
            position: position || null,
            secret: secret,
            company_contract_address: myCompanyAddress,
            admin_wallet: adminAddress,
            monthly_salary_usd: Math.round(parseInt(cleanSalary) / 16000).toString()
          })
        });
      } catch (apiErr) {
        console.warn("Blockchain success, but API sync failed:", apiErr);
      }

      setSuccess(true);
    } catch (error) {
      console.error("Failed to create invite:", error);
      alert("Blockchain transaction failed. Please check your wallet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Invite Ready</h2>
        <p className="text-slate-400 text-sm mb-8 px-4">Share this secret code with your employee to claim their profile.</p>
        
        <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 mb-8 flex items-center gap-3 group">
          <code className="flex-1 text-lg font-mono text-cyan-400 tracking-wider truncate px-2">{inviteSecret}</code>
          <button onClick={() => handleCopy(inviteSecret)} className="p-2.5 hover:bg-white/5 rounded-xl transition-all active:scale-90 cursor-pointer">
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400 group-hover:text-white" />}
          </button>
        </div>

        <Button onClick={onClose} className="w-full h-12 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer">
          Dismiss
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl bg-[#0B0F1A]/80 backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="p-8 pb-4 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Add New Employee</h3>
          </div>
          <div className="flex gap-1.5 mt-3">
             {[1, 2, 3].map(i => (
               <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'w-2 bg-white/10'}`} />
             ))}
          </div>
        </div>
        <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white active:scale-90 cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-8 pt-6 min-h-[280px]">
        {step === 1 && (
          <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.15em] ml-1">Full Name</Label>
              <Input 
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Satoshi Nakamoto"
                className="h-12 bg-black/20 border-white/5 rounded-xl text-white focus:border-blue-500/50 transition-all placeholder:text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.15em] ml-1">Job Position</Label>
              <Input 
                value={position} onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Lead Blockchain Engineer"
                className="h-12 bg-black/20 border-white/5 rounded-xl text-white focus:border-blue-500/50 transition-all placeholder:text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.15em] ml-1">Email Address</Label>
              <Input 
                value={email} onChange={(e) => setEmail(e.target.value)}
                type="email" placeholder="name@company.com"
                className="h-12 bg-black/20 border-white/5 rounded-xl text-white focus:border-blue-500/50 transition-all placeholder:text-slate-700"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 py-4 animate-in slide-in-from-right-4 duration-300 text-center">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] block">Monthly Compensation (IDRX)</Label>
              <Input 
                value={salaryIDRX} onChange={(e) => setSalaryIDRX(e.target.value)}
                className="h-20 text-4xl font-bold bg-transparent border-none text-white text-center focus:ring-0 placeholder:text-slate-800"
                placeholder="0"
              />
              <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto">
              Funds will be locked in the company's smart contract for automated distribution.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Employee</span>
                <span className="text-sm font-bold text-white">{name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Salary</span>
                <span className="text-sm font-bold text-emerald-400">{Number(salaryIDRX.replace(/,/g, '')).toLocaleString()} IDRX</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
               <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Awaiting on-chain confirmation via Base Network</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Actions */}
      <div className="p-8 pt-0 flex items-center justify-between gap-4">
        {step > 1 ? (
          <Button 
            variant="ghost" 
            onClick={() => setStep(step - 1)}
            className="h-12 px-5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-bold uppercase tracking-wider">Back</span>
          </Button>
        ) : (
          <div /> 
        )}
        
        <Button 
          onClick={step < 3 ? () => setStep(step + 1) : handleCreateInvite}
          disabled={isSubmitting || (step === 1 && !name)}
          className={`h-12 px-8 rounded-xl font-bold transition-all shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer ${
            step === 3 
            ? 'bg-blue-600 hover:bg-blue-500 text-white min-w-[180px]' 
            : 'bg-white text-black hover:bg-slate-200 min-w-[140px]'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="text-xs uppercase tracking-wider">
                {step === 3 ? "Confirm On-Chain" : "Continue"}
              </span>
              {step < 3 && <ArrowRight className="w-4 h-4" />}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}