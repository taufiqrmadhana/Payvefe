'use client';

import { 
  Wallet, Calendar, FileText, Bell, ArrowUpRight, ArrowDownLeft, Zap, 
  TrendingUp, DollarSign, ExternalLink, Copy, Download, CheckCircle, 
  Clock, Shield, LogOut, User, Settings as SettingsIcon, X, Loader2, 
  Building2, AlertCircle, BadgeCheck, Landmark 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState, useEffect } from 'react';
import { usePayve, usePayveData } from '@/hooks/usePayve';
import { WithdrawModal } from '@/app/components/WithdrawModal';
import { useAccount, useDisconnect } from 'wagmi';
import { useEmployerConfig, useTransactions, useNotifications, useEmployeeProfile, useTaxCalculator } from '@/hooks/useApi';
import { DEFAULT_EXCHANGE_RATE } from '@/constants';
import { transactionService, payslipService } from '@/services';

interface EmployeeDashboardProps {
  onNavigate: (page: string) => void;
}

export function EmployeeDashboard({ onNavigate }: EmployeeDashboardProps) {
  const { claimInvite } = usePayve();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeModal, setActiveModal] = useState<'payslip' | 'contract' | 'schedule' | 'claim' | 'settings' | null>(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [payslipLoading, setPayslipLoading] = useState(false);
  const [inviteSecret, setInviteSecret] = useState('');

  const { employerAddress, setEmployerAddress, isConfigured } = useEmployerConfig();
  const { employee } = usePayveData(employerAddress || undefined);
  const { profile: backendProfile, refresh: refreshProfile } = useEmployeeProfile(address);

  useEffect(() => {
    if (backendProfile?.company_contract_address && !employerAddress) {
      setEmployerAddress(backendProfile.company_contract_address);
    }
  }, [backendProfile?.company_contract_address, employerAddress, setEmployerAddress]);

  const { calculate: calculateTax, loading: taxLoading } = useTaxCalculator();
  const [taxData, setTaxData] = useState<{ gross: number; net: number; tax: number; breakdown: Record<string, number> } | null>(null);

  useEffect(() => {
    const fetchTax = async () => {
      const salaryFromBackend = backendProfile?.monthly_salary_usd;
      const salaryFromContract = employee?.salary ? Number(employee.salary) / 1e18 / DEFAULT_EXCHANGE_RATE : 0;
      const salary = salaryFromBackend ?? salaryFromContract;
      if (typeof salary === 'number' && salary > 0) {
        try {
          const result = await calculateTax(salary);
          if (result) {
            setTaxData({
              gross: result.gross_salary_usd,
              net: result.net_salary_usd,
              tax: result.total_deductions_usd,
              breakdown: {
                'PPh 21': result.pph21_monthly_usd,
                'BPJS Kesehatan': result.breakdown?.deductions?.bpjs_kesehatan ? result.breakdown.deductions.bpjs_kesehatan / DEFAULT_EXCHANGE_RATE : 0,
                'BPJS JHT': result.breakdown?.deductions?.bpjs_jht ? result.breakdown.deductions.bpjs_jht / DEFAULT_EXCHANGE_RATE : 0,
                'BPJS JP': result.breakdown?.deductions?.bpjs_jp ? result.breakdown.deductions.bpjs_jp / DEFAULT_EXCHANGE_RATE : 0,
              }
            });
          }
        } catch (err) { console.error(err); }
      }
    };
    fetchTax();
  }, [backendProfile?.monthly_salary_usd, employee?.salary, calculateTax]);

  const { transactions: apiTransactions, loading: txLoading, refresh: refreshTransactions } = useTransactions(address, false);
  const { unreadCount } = useNotifications(address);

  const isConnectedToCompany = !!(employee && employee.salary > 0n) || !!backendProfile?.company_name;
  const companyName = backendProfile?.company_name || (isConnectedToCompany ? 'Connected' : 'Not Connected');
  const employeeStatus = backendProfile?.status || (employee && employee.salary > 0n ? 'active' : 'pending');
  const hasClaimedInvite = !!(employee && employee.isActive);

  const handleLogout = () => { disconnect(); onNavigate('landing'); };
  const formatIDRX = (val: bigint | undefined) => val ? (Number(val) / 1e18).toLocaleString() : '0';
  const formatUSD = (val: bigint | undefined) => val ? (Number(val) / 1e18 / DEFAULT_EXCHANGE_RATE).toFixed(2) : '0.00';

  const realTransactions = apiTransactions.filter(tx => !tx.tx_hash.match(/^0x0{60,}/i));

  const transactions = realTransactions.map(tx => {
    const isReceive = ['distribute', 'claim_invite'].includes(tx.tx_type);
    const amountUsd = (tx.amount_wei / 1e18 / DEFAULT_EXCHANGE_RATE).toFixed(2);
    const amountIdrx = (tx.amount_wei / 1e18).toLocaleString();
    const date = new Date(tx.created_at);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: isReceive ? 'receive' : 'send',
      title: tx.tx_type === 'distribute' ? 'Salary Payment' : tx.tx_type === 'withdraw' ? 'Bank Withdrawal' : tx.tx_type,
      amount: `${isReceive ? '+' : '-'} $${amountUsd}`,
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      hash: tx.tx_hash,
      idrx: `${amountIdrx} IDRX`,
    };
  });

  const handleClaimInvite = async () => {
    if (!inviteSecret || !employerAddress) return;
    setClaimLoading(true);
    try {
      const txHash = await claimInvite(employerAddress, inviteSecret);
      setEmployerAddress(employerAddress);
      if (address && txHash) {
        await transactionService.create({
          wallet_address: address, tx_hash: txHash, tx_type: 'claim_invite', amount_wei: 0, status: 'success',
          metadata: { company_contract: employerAddress },
        });
        refreshProfile();
      }
      window.location.reload();
    } catch (e) { console.error(e); } finally { setClaimLoading(false); }
  };

  const handleDownloadPayslip = async () => {
    if (!isConnectedToCompany || !employee) {
      alert("Please link wallet first");
      return;
    }
    setPayslipLoading(true);
    try {
      const salaryUsd = Number(employee.salary) / 1e18 / DEFAULT_EXCHANGE_RATE;
      const downloadUrl = payslipService.getEmployeeDownloadUrl(
        salaryUsd, backendProfile?.full_name || employee.name || 'Employee', backendProfile?.company_name || companyName || 'Company',
        { position: backendProfile?.position || 'Staff', department: backendProfile?.department || 'General', paymentDate: new Date().toISOString().slice(0, 10), maritalStatus: 'TK/0', hasNpwp: true, exchangeRate: DEFAULT_EXCHANGE_RATE }
      );
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `payslip_${new Date().toISOString().slice(0, 7)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) { console.error(err); } finally { setPayslipLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden font-sans">
      <div className="fixed top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[10%] left-[5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-indigo-600/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />

      <header className="sticky top-0 z-40 backdrop-blur-[20px] bg-slate-950/80 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/src/public/Payve-Logo.png" alt="Payve" className="w-7 h-7 md:w-8 md:h-8 object-contain" />
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold text-white tracking-tight leading-none">Payve</h1>
              <p className="text-[8px] md:text-[10px] font-bold text-cyan-400 uppercase tracking-widest mt-1">Employee Node</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 md:p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white relative transition-all active:scale-90">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
            </button>
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border border-white/20 shadow-lg active:scale-95 transition-all">
                {(backendProfile?.full_name || employee?.name || 'E')[0].toUpperCase()}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-14 w-64 md:w-72 bg-[#0B0F1A]/95 backdrop-blur-[40px] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                  <div className="p-4 md:p-5 border-b border-white/5 bg-white/5">
                    <p className="text-sm font-bold text-white truncate">{backendProfile?.full_name || employee?.name || 'Employee'}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{backendProfile?.position || 'Verified Workforce'}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-left text-sm font-medium text-slate-400 hover:text-white group">
                      <User className="w-4 h-4" /> My Profile
                    </button>
                    <button onClick={() => { setActiveModal('settings'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-left text-sm font-medium text-slate-400 hover:text-white group">
                      <SettingsIcon className="w-4 h-4" /> Job Settings
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all text-left text-sm font-bold text-red-400 group">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 relative z-10 space-y-6">
        {/* HERO CARD */}
        <div className="relative overflow-hidden bg-white/[0.02] backdrop-blur-[40px] rounded-[2rem] md:rounded-[2.5rem] border border-white/10 p-6 md:p-10 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Available Balance</span>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md truncate max-w-[150px] md:max-w-none ${isConnectedToCompany ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {isConnectedToCompany ? companyName : 'Link Employer'}
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">${formatUSD(employee?.balance)}</h2>
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="text-lg md:text-xl font-medium text-slate-400">{formatIDRX(employee?.balance)} IDRX</span>
                  <span className="px-2 py-0.5 bg-blue-500/10 rounded text-[8px] md:text-[9px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-widest whitespace-nowrap">Rate Locked</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button onClick={() => setIsWithdrawOpen(true)} disabled={!isConnectedToCompany} className="h-12 md:h-14 px-6 md:px-10 bg-white text-black hover:bg-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl disabled:opacity-20 w-full sm:w-auto">
                  <ArrowDownLeft className="w-4 h-4 mr-2" /> Withdraw Funds
                </Button>
                <Button onClick={() => setActiveModal(hasClaimedInvite ? 'settings' : 'claim')} className="h-12 md:h-14 px-6 md:px-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 w-full sm:w-auto">
                  {hasClaimedInvite ? 'Job Settings' : 'Claim Job Invite'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <StatCard label="Monthly Net" val={taxData ? `$${taxData.net.toLocaleString()}` : `$${formatUSD(employee?.salary)}`} icon={<DollarSign className="w-4 h-4 md:w-5 md:h-5" />} color="text-emerald-400" />
              <StatCard label="Next Cycle" val="Feb 25" icon={<Calendar className="w-4 h-4 md:w-5 md:h-5" />} color="text-blue-400" />
              <StatCard label="Node Status" val={isConnectedToCompany ? 'Active' : 'Pending'} icon={<Shield className="w-4 h-4 md:w-5 md:h-5" />} color="text-purple-400" />
              <StatCard label="Tax Payload" val={taxData ? `-$${taxData.tax.toLocaleString()}` : '--'} icon={<TrendingUp className="w-4 h-4 md:w-5 md:h-5" />} color="text-amber-400" />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEDGER */}
          <div className="lg:col-span-2 p-6 md:p-8 bg-white/[0.02] backdrop-blur-[40px] rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-xl overflow-hidden relative order-2 lg:order-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-500" /> Payment Ledger
              </h3>
              <button onClick={() => console.log('')} className="text-xs font-bold text-blue-400 hover:text-blue-300 text-left">Detailed Ledger →</button>
            </div>
            <div className="space-y-2">
              {txLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-800" /></div> :
              transactions.length > 0 ? (
                transactions.map((tx, i) => (
                  <div key={i} className="group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl hover:bg-white/[0.04] border border-transparent hover:border-white/5 transition-all">
                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5 ${tx.type === 'receive' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {tx.type === 'receive' ? <ArrowDownLeft className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-bold text-white truncate">{tx.title}</p>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">{tx.date} • {tx.idrx}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs md:text-sm font-bold ${tx.type === 'receive' ? 'text-emerald-400' : 'text-white'}`}>{tx.amount}</p>
                      <p className="text-[8px] md:text-[9px] text-slate-600 font-mono uppercase tracking-tighter truncate w-16 md:w-auto ml-auto">{tx.hash.slice(0, 10)}...</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-600 font-bold uppercase text-[10px]">No recent node activity</div>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-6 md:p-8 bg-[#0B0F1A]/80 backdrop-blur-[40px] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col gap-6 order-1 lg:order-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <ResourceBtn icon={<Download className="w-4 h-4" />} label="Download Payslip" sub="Latest Entry" onClick={() => setActiveModal('payslip')} />
              <ResourceBtn icon={<FileText className="w-4 h-4" />} label="Work Contract" sub="Legal Entry" onClick={() => setActiveModal('contract')} />
              <ResourceBtn icon={<Calendar className="w-4 h-4" />} label="Cycle Schedule" sub="Automated" onClick={() => setActiveModal('schedule')} />
            </div>
          </div>
        </div>
      </main>

      {/* --- ALL MODALS --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/95 md:bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="relative w-full max-w-lg bg-[#0B0F1A] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 md:top-6 right-4 md:right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"><X className="w-5 h-5 text-white" /></button>
              
              {activeModal === 'payslip' && (
                <div className="text-center space-y-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20"><FileText className="w-7 h-7 md:w-8 md:h-8 text-blue-400" /></div>
                  <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">Monthly Payslip</h2>
                  <div className="bg-black/40 rounded-2xl p-4 md:p-6 text-left space-y-3">
                     <div className="flex justify-between text-[10px] md:text-xs text-slate-500 uppercase tracking-widest"><span>Gross Payment</span><span className="text-white font-bold">${taxData?.gross?.toLocaleString() || formatUSD(employee?.salary)}</span></div>
                     <div className="flex justify-between text-[10px] md:text-xs text-slate-500 uppercase tracking-widest"><span>Tax Deduction</span><span className="text-red-400 font-bold">-${taxData?.tax?.toLocaleString() || '0'}</span></div>
                     <div className="h-px bg-white/5 w-full my-2" />
                     <div className="flex justify-between text-xs md:text-sm text-white font-bold uppercase tracking-widest"><span>Net Salary</span><span className="text-emerald-400">${taxData?.net?.toLocaleString() || formatUSD(employee?.salary)}</span></div>
                  </div>
                  <Button onClick={handleDownloadPayslip} disabled={payslipLoading || !isConnectedToCompany} className="w-full h-12 md:h-14 bg-white text-black rounded-2xl font-bold uppercase tracking-widest transition-all">
                    {payslipLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Download PDF"}
                  </Button>
                </div>
              )}

              {activeModal === 'contract' && (
                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center border border-purple-500/20"><Shield className="w-6 h-6 text-purple-400" /></div>
                    <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">Employment Entry</h2>
                  </div>
                  <div className="space-y-4">
                    <ContractInfo label="Identity" val={employee?.name || 'Unlinked'} />
                    <ContractInfo label="Wallet" val={address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'N/A'} />
                    <ContractInfo label="Base Monthly" val={`$${formatUSD(employee?.salary)}`} />
                    <ContractInfo label="Protocol State" val={employee?.isActive ? 'Active Node' : 'Inactive'} color={employee?.isActive ? 'text-emerald-400' : 'text-red-400'} />
                  </div>
                  <Button onClick={() => setActiveModal(null)} className="w-full h-12 md:h-14 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10">Close Record</Button>
                </div>
              )}

              {activeModal === 'schedule' && (
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">Upcoming Cycles</h2>
                  <div className="space-y-3">
                    {[0, 1, 2].map(i => {
                      const today = new Date();
                      const payDate = new Date(today.getFullYear(), today.getMonth() + i, 25);
                      if (payDate <= today) payDate.setMonth(payDate.getMonth() + 1);
                      return (
                        <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-white">{payDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                            <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">Expected Distribution</p>
                          </div>
                          <p className="text-xs md:text-sm font-bold text-blue-400">25th Cycle</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeModal === 'claim' && (
                <div className="text-center space-y-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20"><BadgeCheck className="w-8 h-8 text-blue-400" /></div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">Link Identity</h2>
                  <div className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Company Node Address</Label>
                      <Input placeholder="0x..." value={employerAddress} onChange={(e) => setEmployerAddress(e.target.value)} className="h-12 bg-black/40 border-white/5 rounded-xl font-mono text-white text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Invite Secret</Label>
                      <Input type="password" placeholder="Enter secret code" value={inviteSecret} onChange={(e) => setInviteSecret(e.target.value)} className="h-12 bg-black/40 border-white/5 rounded-xl text-white text-xs" />
                    </div>
                    <Button onClick={handleClaimInvite} disabled={claimLoading} className="w-full h-12 md:h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg uppercase text-[10px] tracking-widest">
                      {claimLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Authorize Protocol Link'}
                    </Button>
                  </div>
                </div>
              )}

              {activeModal === 'settings' && (
                <div className="space-y-6 md:space-y-8">
                  <div className="text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20"><SettingsIcon className="w-7 h-7 md:w-8 md:h-8 text-blue-400" /></div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">Job Settings</h2>
                  </div>
                  {isConnectedToCompany && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                      <Building2 className="w-5 h-5 text-emerald-400" />
                      <div className="flex-1 min-w-0"><p className="text-xs md:text-sm font-bold text-white truncate">{companyName}</p><p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest truncate">{backendProfile?.position}</p></div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Employer Contract Address</Label>
                    <Input placeholder="0x..." value={employerAddress} onChange={(e) => setEmployerAddress(e.target.value)} className="h-12 bg-black/40 border-white/5 rounded-xl font-mono text-white text-xs" />
                    {isConfigured && <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-2 font-sans"><CheckCircle className="w-3 h-3" /> Configuration Synced</p>}
                  </div>
                  <Button onClick={() => setActiveModal(null)} className="w-full h-12 md:h-14 bg-white text-black rounded-2xl font-bold uppercase text-[10px] tracking-widest">Save & Close</Button>
                </div>
              )}
           </div>
        </div>
      )}

      {isWithdrawOpen && <WithdrawModal onClose={() => setIsWithdrawOpen(false)} companyAddress={employerAddress} />}
    </div>
  );
}

// HELPERS
function StatCard({ label, val, icon, color }: { label: string, val: string, icon: any, color: string }) {
  return (
    <div className="p-4 md:p-6 bg-white/[0.03] backdrop-blur-[30px] rounded-[1.5rem] md:rounded-[2rem] border border-white/10 hover:border-white/20 transition-all shadow-lg">
      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center ${color} mb-4 md:mb-6 border border-white/5`}>{icon}</div>
      <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg md:text-xl font-bold text-white tracking-tight truncate">{val}</p>
    </div>
  );
}

function ResourceBtn({ icon, label, sub, onClick }: { icon: any, label: string, sub: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group active:scale-[0.98]">
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 border border-white/5 transition-transform group-hover:scale-110 flex-shrink-0">{icon}</div>
      <div className="text-left overflow-hidden">
        <p className="text-xs md:text-sm font-bold text-white uppercase tracking-tight truncate">{label}</p>
        <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{sub}</p>
      </div>
    </button>
  );
}

function ContractInfo({ label, val, color }: { label: string, val: string, color?: string }) {
  return (
    <div className="flex justify-between items-center text-xs md:text-sm border-b border-white/5 pb-2">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className={`${color || "text-white"} font-bold truncate ml-4`}>{val}</span>
    </div>
  );
}

function MenuBtn({ icon, label, red, onClick }: { icon: any, label: string, red?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${red ? 'hover:bg-red-500/10' : 'hover:bg-white/5'}`}>
      <div className={`${red ? 'text-red-500' : 'text-slate-400 group-hover:text-white'} transition-colors`}>{icon}</div>
      <span className={`text-sm font-bold ${red ? 'text-red-500' : 'text-slate-400 group-hover:text-white'}`}>{label}</span>
    </button>
  );
}