'use client';

import { 
  ArrowLeft, Calendar, Users, Zap, CheckCircle, Shield, Loader2, 
  ArrowRight, Landmark, BadgeCheck, X, Wallet 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { CompanyHeader } from '@/app/components/CompanyHeader';
import { usePayve } from '@/hooks/usePayve';
import { useReadContract, useAccount } from 'wagmi';
import PayveABI from '@/abis/Payve.json';
import { transactionService } from '@/services';

interface PayvePayrollExecutionProps {
  onNavigate: (page: string) => void;
}

export function PayvePayrollExecution({ onNavigate }: PayvePayrollExecutionProps) {
  const [stage, setStage] = useState<'review' | 'confirm' | 'executing' | 'success'>('review');
  const [checked, setChecked] = useState({ verify: false, irreversible: false, amounts: false });
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { distribute, myCompanyAddress } = usePayve();
  const { address } = useAccount();
  const [isExecuting, setIsExecuting] = useState(false);

  // Fetch Real Data
  const { data: payrollStatusRaw } = useReadContract({
      abi: PayveABI.abi,
      address: myCompanyAddress,
      functionName: 'getPayrollStatus',
      query: { enabled: !!myCompanyAddress, refetchInterval: 5000 }
  });
  
  const { data: employeesRaw } = useReadContract({
      abi: PayveABI.abi,
      address: myCompanyAddress,
      functionName: 'getAllEmployees',
      query: { enabled: !!myCompanyAddress }
  });
  
  const employees = employeesRaw as Array<{ wallet: string; name: string; salary: bigint; balance: bigint; isActive: boolean }> | undefined;
  const payrollStatus = payrollStatusRaw as any;

  const employeeCount = payrollStatus ? Number(payrollStatus[0]) : 0;
  const totalSalaryWei = payrollStatus ? payrollStatus[1] : BigInt(0);
  const contractBalanceWei = payrollStatus ? payrollStatus[2] : BigInt(0);

  const totalSalaryIDRX = Number(totalSalaryWei) / 1e18;
  const totalSalaryUSD = (totalSalaryIDRX / 16000).toFixed(2);
  const contractBalanceIDRX = Number(contractBalanceWei) / 1e18;
  const remainingAfterIDRX = contractBalanceIDRX - totalSalaryIDRX;

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Execution Logic with Transaction Recording
  useEffect(() => {
    const runPayroll = async () => {
      if (stage === 'executing' && !isExecuting) {
        setIsExecuting(true);
        try {
          setCurrentStep(1); // Preparing
          const txHash = await distribute(); 
          
          if (txHash && employees && address) {
            try {
              setCurrentStep(3); // Sending to blockchain
              await transactionService.create({
                wallet_address: address,
                tx_hash: txHash,
                tx_type: 'distribute',
                amount_wei: Number(totalSalaryWei),
                status: 'success',
                metadata: { company_contract: myCompanyAddress, employee_count: employees.length },
              });
              
              for (const emp of employees) {
                if (emp.isActive && emp.wallet) {
                  await transactionService.create({
                    wallet_address: emp.wallet,
                    tx_hash: txHash,
                    tx_type: 'distribute',
                    amount_wei: Number(emp.salary),
                    status: 'success',
                    metadata: { company_contract: myCompanyAddress, employee_name: emp.name },
                  });
                }
              }
            } catch (e) { console.error("Recording error:", e); }
          }
          setCurrentStep(5);
          setStage('success');
        } catch (error) {
          setStage('confirm');
        } finally { setIsExecuting(false); }
      }
    };
    runPayroll();
  }, [stage, distribute, isExecuting, employees, address, totalSalaryWei, myCompanyAddress]);

  if (!myCompanyAddress) {
    return (
      <div className="flex min-h-screen bg-[#020617] text-slate-200">
        <Sidebar currentPage="payroll-execution" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="flex-1 flex items-center justify-center relative">
          <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="p-10 bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 text-center max-w-md mx-4 shadow-2xl relative z-10">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Organization Found</h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">You need to initialize your payroll infrastructure on-chain before executing distribution cycles.</p>
            <Button onClick={() => onNavigate('settings')} className="h-12 px-8 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all active:scale-95">Setup Infrastructure</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden">
      <Sidebar currentPage="payroll-execution" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto relative">
        <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[10%] right-[5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <CompanyHeader 
          title="Payroll Control"
          subtitle="Capital Distribution Center"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
        />

        <div className="p-6 sm:p-12 relative z-10 max-w-5xl mx-auto">
          
          {/* STAGE: REVIEW */}
          {stage === 'review' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Users className="w-5 h-5 text-blue-400" />} label="Total Recipients" value={employeeCount.toString()} />
                <StatCard icon={<Landmark className="w-5 h-5 text-emerald-400" />} label="Batch Volume" value={`${fmt(totalSalaryIDRX)} IDRX`} sub={`≈ $${totalSalaryUSD}`} />
                <StatCard icon={<Zap className="w-5 h-5 text-cyan-400" />} label="Network" value="Base L2" sub="Instant Settlement" />
              </div>

              <div className="p-10 bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {/* Balance Check Panel */}
                <div className={`mb-10 p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-center gap-6 ${remainingAfterIDRX < 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${remainingAfterIDRX < 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                            <Wallet className={`w-6 h-6 ${remainingAfterIDRX < 0 ? 'text-red-400' : 'text-emerald-400'}`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Liquidity</p>
                            <p className="text-xl font-bold text-white">{fmt(contractBalanceIDRX)} IDRX</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Surplus After Run</p>
                        <p className={`text-xl font-bold ${remainingAfterIDRX < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{fmt(remainingAfterIDRX)} IDRX</p>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Execute Distribution Cycle</h2>
                    <p className="text-slate-400 mb-10 max-w-md mx-auto leading-relaxed text-sm">
                        Confirming this action will trigger the smart contract to distribute salaries to all active employee nodes.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => onNavigate('dashboard')} variant="ghost" className="h-10 px-5 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl font-bold">Discard</Button>
                        <Button 
                            disabled={remainingAfterIDRX < 0}
                            onClick={() => setStage('confirm')}
                            className="h-10 px-5 bg-white text-black hover:bg-slate-200 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-xl disabled:opacity-20"
                        >
                            Review & Authorize <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE: CONFIRM */}
          {stage === 'confirm' && (
            <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
              <div className="p-10 bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" />
                      Protocol Authorization
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">Security Checkpoint</p>
                  </div>
                  <button onClick={() => setStage('review')} className="p-2 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-3 mb-10">
                  <ConfirmItem id="verify" label="Verified all recipient addresses" checked={checked.verify} onChange={(v) => setChecked({...checked, verify: v})} />
                  <ConfirmItem id="irreversible" label="Acknowledge blockchain finality" checked={checked.irreversible} onChange={(v) => setChecked({...checked, irreversible: v})} />
                  <ConfirmItem id="amounts" label="Confirmed total distribution amount" checked={checked.amounts} onChange={(v) => setChecked({...checked, amounts: v})} />
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Authorizing</p>
                    <p className="text-xl font-bold text-white">{fmt(totalSalaryIDRX)} IDRX</p>
                  </div>
                  <Button 
                    disabled={!checked.verify || !checked.irreversible || !checked.amounts || isExecuting}
                    onClick={() => setStage('executing')}
                    className={`h-14 px-10 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-95 flex items-center gap-2 ${
                      checked.verify && checked.irreversible && checked.amounts 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20' 
                      : 'bg-white/5 text-slate-500 border border-white/5'
                    }`}
                  >
                    {isExecuting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign & Execute"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STAGE: EXECUTING */}
          {stage === 'executing' && (
            <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500 text-center">
              <div className="relative mb-12">
                <div className="w-32 h-32 bg-blue-600/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-xl">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
                <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Processing On-Chain</h2>
              <div className="space-y-3 max-w-xs mx-auto">
                {[
                  { label: 'Relaying to Base Node', step: 1 },
                  { label: 'Signing Distribution', step: 3 },
                  { label: 'Finalizing Payouts', step: 5 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                    {currentStep >= item.step ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-white/20" />}
                    <span className={currentStep >= item.step ? 'text-white' : 'text-slate-600'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE: SUCCESS */}
          {stage === 'success' && (
            <div className="max-w-md mx-auto animate-in zoom-in-95 duration-500">
              <div className="bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 p-10 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/5 blur-[60px] rounded-full" />
                <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                  <BadgeCheck className="w-10 h-10 text-emerald-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Cycle Completed</h1>
                <p className="text-slate-400 text-sm mb-10 leading-relaxed px-4">
                  Payroll for <span className="text-white font-bold">{employeeCount} members</span> has been successfully distributed.
                </p>
                <div className="space-y-3 mb-10 bg-black/20 p-5 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span>Amount</span>
                    <span className="text-white font-mono">${totalSalaryUSD}</span>
                  </div>
                  <div className="h-px bg-white/5 w-full" />
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span>Status</span>
                    <span className="text-emerald-400 font-black">Finalized</span>
                  </div>
                </div>
                <Button onClick={() => onNavigate('dashboard')} className="w-full h-14 bg-white text-black hover:bg-slate-200 rounded-2xl font-bold transition-all active:scale-95 shadow-lg">Return to Dashboard</Button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// Reusable Sub-components (Sesuai Branch Main)
function StatCard({ icon, label, value, sub }: { icon: any, label: string, value: string, sub?: string }) {
  return (
    <div className="p-6 bg-white/[0.03] backdrop-blur-[30px] rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group shadow-lg">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-5 border border-white/5 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-xl font-bold text-white tracking-tight">{value}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-1 font-medium">{sub}</p>}
    </div>
  );
}

function ConfirmItem({ id, label, checked, onChange }: { id: string, label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer group ${checked ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'}`}>
      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${checked ? 'bg-blue-500 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'border-white/20 bg-slate-900'}`}>
        {checked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
      </div>
      <input type="checkbox" id={id} className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${checked ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{label}</span>
    </label>
  );
}