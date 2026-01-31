'use client';

import { parseEther, encodeFunctionData } from 'viem';
import { Building2, Loader2, Plus, ArrowUpCircle, Coins, Wallet, Sparkles, ShieldCheck, Copy, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState, useEffect, useMemo } from 'react';
import { IDRX_ADDRESS } from '@/constants';
import { usePayve } from '@/hooks/usePayve';
import { useReadContract, useAccount } from 'wagmi';
import MockIDRXABI from '@/abis/MockIDRX.json';
import PayveABI from '@/abis/Payve.json';
import { Sidebar } from '@/app/components/Sidebar';
import { CompanyHeader } from '@/app/components/CompanyHeader';
import { PayveAddEmployee } from '@/app/components/PayveAddEmployee';
import { useCompany } from '@/hooks/useApi';
import { transactionService } from '@/services';
import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus, 
  TransactionStatusLabel, 
  TransactionToast, 
  TransactionToastIcon, 
  TransactionToastLabel, 
  TransactionToastAction 
} from '@coinbase/onchainkit/transaction';

interface SettingsProps {
  onNavigate: (page: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const { createCompany, myCompanyAddress, refetchCompany, mint } = usePayve();
  const { address } = useAccount();
  const { company: backendCompany, exists: backendCompanyExists, loading: companyLoading } = useCompany(address);
  
  // State untuk feedback copy
  const [copied, setCopied] = useState(false);

  const { data: contractBalance, refetch: refetchBalance } = useReadContract({
    abi: MockIDRXABI.abi,
    address: IDRX_ADDRESS as `0x${string}`,
    functionName: 'balanceOf',
    args: myCompanyAddress ? [myCompanyAddress] : undefined,
    query: { enabled: !!myCompanyAddress, refetchInterval: 5000 }
  });

  const { data: userBalance, refetch: refetchUserBalance } = useReadContract({
    abi: MockIDRXABI.abi,
    address: IDRX_ADDRESS as `0x${string}`,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 5000 }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [depositAmount, setDepositAmount] = useState('1000');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fungsionalitas Copy
  const handleCopy = async () => {
    if (!myCompanyAddress) return;
    try {
      await navigator.clipboard.writeText(myCompanyAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleCreateCompany = async () => {
      try {
          setIsCreatingCompany(true);
          await createCompany();
          setTimeout(() => {
              refetchCompany();
              setIsCreatingCompany(false);
          }, 5000);
      } catch (e) {
          console.error(e);
          setIsCreatingCompany(false);
      }
  };

  const handleMint = async () => {
    try {
      const amount = prompt("Enter amount of IDRX to mint:", "10000");
      if (!amount) return;
      await mint(parseEther(amount));
    } catch (e) { console.error(e); }
  };

  const depositCalls = useMemo(() => {
    if (!myCompanyAddress || !IDRX_ADDRESS) return [];
    const depositAmountWei = parseEther(depositAmount || '0');
    const userBalanceWei = userBalance ? BigInt(userBalance.toString()) : BigInt(0);
    if (depositAmountWei > userBalanceWei || depositAmountWei <= BigInt(0)) return [];
    
    try {
      const approveData = encodeFunctionData({
        abi: MockIDRXABI.abi,
        functionName: 'approve',
        args: [myCompanyAddress, depositAmountWei]
      });
      const depositData = encodeFunctionData({
        abi: PayveABI.abi,
        functionName: 'deposit',
        args: [depositAmountWei]
      });
      return [
        { to: IDRX_ADDRESS as `0x${string}`, data: approveData, value: BigInt(0) },
        { to: myCompanyAddress as `0x${string}`, data: depositData, value: BigInt(0) }
      ];
    } catch (err) { return []; }
  }, [myCompanyAddress, depositAmount, userBalance]);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <Sidebar currentPage="settings" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto relative">
        <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[10%] left-[20%] w-[400px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <CompanyHeader 
          title="Settings"
          subtitle="Infrastructure Control Center"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
        />

        <div className="p-6 sm:p-10 relative z-10 max-w-6xl mx-auto">
          {companyLoading ? (
            <div className="py-20 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center shadow-2xl">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Synchronizing Node Data</p>
            </div>
          ) : !myCompanyAddress ? (
            <div className="relative overflow-hidden bg-white/[0.02] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20 shadow-inner">
                <Building2 className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight uppercase">
                {backendCompanyExists ? `Initialize ${backendCompany?.company_name}` : 'Setup Your Infrastructure'}
              </h2>
              <p className="text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
                Deploy your dedicated secure smart contract on Base. 
                Each organization operates on its own isolated liquidity layer.
              </p>
              <Button 
                onClick={handleCreateCompany} 
                disabled={isCreatingCompany}
                className="h-14 px-10 bg-white text-black hover:bg-slate-200 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-95"
              >
                {isCreatingCompany ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Deploying Node</span>
                ) : "Launch On-Chain Contract"}
              </Button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Profile Bar - Updated with Copy Button */}
              <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border border-white/10">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">{backendCompany?.company_name || 'Organization Active'}</h2>
                    
                    {/* Copy Address UI Section */}
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs font-mono text-slate-400 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 break-all max-w-[200px] sm:max-w-none">
                          {myCompanyAddress}
                      </p>
                      <button 
                        onClick={handleCopy}
                        className={`p-2 rounded-lg border transition-all duration-200 ${copied ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}
                        title="Copy Address"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      {copied && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter animate-in fade-in slide-in-from-left-1">Copied!</span>}
                    </div>

                  </div>
                </div>
                <Button 
                  onClick={() => setIsAddEmployeeOpen(true)}
                  className="h-12 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 flex items-center gap-2 transition-all group"
                >
                  <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform" /> Add Member
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Liquidity Card */}
                <div className="p-8 bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 flex flex-col justify-between group hover:border-blue-500/30 transition-all shadow-xl">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Coins className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Contract Liquidity</span>
                  </div>
                  <div className="mt-8">
                    <div className="text-5xl font-bold text-white tracking-tighter mb-2">
                      {contractBalance ? (Number(contractBalance) / 1e18).toLocaleString() : '0'}
                    </div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 rounded-lg text-[10px] font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                        IDRX Stablecoin
                    </div>
                  </div>
                </div>

                {/* Deposit Control Card */}
                <div className="lg:col-span-2 p-8 bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                  
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3 text-slate-500">
                      <ArrowUpCircle className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-[0.2em]">Refill Infrastructure</span>
                    </div>
                    <button onClick={handleMint} className="text-[10px] font-bold text-cyan-400 bg-cyan-400/5 px-3 py-1.5 rounded-xl border border-cyan-400/10 hover:bg-cyan-400 hover:text-black transition-all uppercase tracking-widest">
                        Mint Test Assets
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1 w-full space-y-2.5">
                      <Label className="text-[10px] text-slate-500 font-bold ml-1 uppercase tracking-widest">Funding Amount</Label>
                      <div className="relative group">
                        <Input 
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="h-14 bg-black/40 border-white/5 rounded-2xl text-white font-mono text-lg focus:border-blue-500/50 transition-all pr-16 shadow-inner"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 tracking-tighter">IDRX</span>
                      </div>
                    </div>
                    
                    <div className="w-full sm:w-auto sm:min-w-[220px]">
                      {depositCalls.length > 0 ? (
                        <Transaction 
                            calls={depositCalls} 
                            chainId={84532} 
                            onSuccess={() => { refetchBalance(); refetchUserBalance(); }}
                        >
                          <TransactionButton 
                            className="h-14 w-full !bg-blue-600 hover:!bg-blue-500 !text-white !rounded-2xl !font-bold !text-xs !uppercase !tracking-widest !shadow-lg !shadow-blue-500/20 active:!scale-95 !border-0 !transition-all" 
                            text="Confirm Deposit" 
                          />
                          <TransactionStatus>
                            <TransactionStatusLabel className="text-slate-400 text-xs font-medium" />
                          </TransactionStatus>
                        </Transaction>
                      ) : (
                        <Button disabled className="w-full h-14 bg-white/5 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/5">
                            Insufficient Funds
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Wallet className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Personal Wallet</span>
                      </div>
                      <span className="text-sm font-bold text-slate-300">
                        {userBalance ? (Number(userBalance) / 1e18).toLocaleString() : '0'} <span className="text-[10px] text-slate-600 ml-1">IDRX</span>
                      </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Modal handling */}
        {isAddEmployeeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-300">
              <PayveAddEmployee onClose={() => setIsAddEmployeeOpen(false)} onNavigate={onNavigate} />
          </div>
        )}
      </main>
    </div>
  );
}