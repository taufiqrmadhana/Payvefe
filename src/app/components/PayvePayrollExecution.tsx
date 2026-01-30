import { ArrowLeft, Calendar, Users, Wallet, Zap, CheckCircle, Shield } from 'lucide-react';
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
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { distribute, myCompanyAddress } = usePayve();
  const { address } = useAccount();
  const [isExecuting, setIsExecuting] = useState(false);

  // Fetch Real Data
  const { data: payrollStatusRaw, isLoading: isStatusLoading } = useReadContract({
      abi: PayveABI.abi,
      address: myCompanyAddress,
      functionName: 'getPayrollStatus',
      query: {
         enabled: !!myCompanyAddress,
         refetchInterval: 5000
      }
  });
  
  // Fetch all employees for transaction recording
  const { data: employeesRaw } = useReadContract({
      abi: PayveABI.abi,
      address: myCompanyAddress,
      functionName: 'getAllEmployees',
      query: { enabled: !!myCompanyAddress }
  });
  
  const employees = employeesRaw as Array<{ wallet: string; name: string; salary: bigint; balance: bigint; isActive: boolean }> | undefined;
  
  const payrollStatus = payrollStatusRaw as any; // Cast to any to bypass generic JSON type issues

  // Parse Data
  // Returns: [count, totalSalary, contractBalance]
  const employeeCount = payrollStatus ? Number(payrollStatus[0]) : 0;
  const totalSalaryWei = payrollStatus ? payrollStatus[1] : BigInt(0);
  const contractBalanceWei = payrollStatus ? payrollStatus[2] : BigInt(0);

  const totalSalaryIDRX = Number(totalSalaryWei) / 1e18;
  const totalSalaryUSD = (totalSalaryIDRX / 16000).toFixed(2); // Approx

  const contractBalanceIDRX = Number(contractBalanceWei) / 1e18;
  const remainingAfterIDRX = contractBalanceIDRX - totalSalaryIDRX;

  // Formatting helper
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const runPayroll = async () => {
      if (stage === 'executing' && !isExecuting) {
        setIsExecuting(true);
        try {
          setCurrentStep(1); // Preparing
          const txHash = await distribute(); // Uses myCompanyAddress internally in updated usePayve
          
          // Record transactions to backend for each employee
          if (txHash && employees && address) {
            try {
              // Record main distribute transaction for admin
              await transactionService.create({
                wallet_address: address,
                tx_hash: txHash,
                tx_type: 'distribute',
                amount_wei: Number(totalSalaryWei),
                status: 'success',
                metadata: { 
                  company_contract: myCompanyAddress,
                  employee_count: employees.length 
                },
              });
              
              // Record distribute transaction for each active employee
              for (const emp of employees) {
                if (emp.isActive && emp.wallet) {
                  await transactionService.create({
                    wallet_address: emp.wallet,
                    tx_hash: txHash,
                    tx_type: 'distribute',
                    amount_wei: Number(emp.salary),
                    status: 'success',
                    metadata: { 
                      company_contract: myCompanyAddress,
                      employee_name: emp.name
                    },
                  });
                }
              }
            } catch (e) {
              console.error("Failed to record transactions:", e);
            }
          }
          
          setCurrentStep(5); // Done
          setProgress(100);
          setStage('success');
        } catch (error) {
          console.error("Payroll failed:", error);
          alert("Payroll execution failed. See console.");
          setStage('confirm'); // Go back
        } finally {
          setIsExecuting(false);
        }
      }
    };
    runPayroll();
  }, [stage, distribute, isExecuting, employees, address, totalSalaryWei, myCompanyAddress]);

  if (!myCompanyAddress) {
      return (
          <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
              <Sidebar currentPage="payroll-execution" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
              <main className="flex-1 flex items-center justify-center">
                  <div className="text-center p-8 bg-slate-800/50 rounded-2xl border border-white/10 max-w-md mx-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-3">No Smart Contract Company</h2>
                      <p className="text-slate-400 mb-6">
                          You need to create an on-chain company first to execute payroll via smart contracts.
                      </p>
                      <Button 
                          onClick={() => onNavigate('settings')}
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl"
                      >
                          Go to Settings
                      </Button>
                  </div>
              </main>
          </div>
      );
  }

  const allChecked = checked.verify && checked.irreversible && checked.amounts;

  if (stage === 'review') {
    return (
      <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
        <Sidebar currentPage="payroll-execution" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <CompanyHeader 
            title="Payroll Execution"
            subtitle="Current Cycle"
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isMobile={isMobile}
            onNavigate={onNavigate}
            showNotifications={true}
          />

          {/* Progress Bar */}
          <div className="px-4 sm:px-8 py-6 sm:py-8 bg-slate-900/50">
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
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Current Payroll Cycle
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm font-medium border border-blue-500/30">
                      Real-time Data
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 border-2 border-blue-500/30">
                  <Users className="w-8 h-8 text-blue-400 mb-3" />
                  <div className="text-4xl font-bold text-white mb-1">{employeeCount}</div>
                  <div className="text-sm text-slate-400 mb-3">Employees</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border-2 border-cyan-500/30">
                  <Wallet className="w-8 h-8 text-cyan-400 mb-3" />
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                      ${totalSalaryUSD}
                  </div>
                  <div className="text-sm text-slate-400 mb-1">Gross Payroll</div>
                  <div className="text-xs text-slate-500">{fmt(totalSalaryIDRX)} IDRX</div>
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
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Total Transfer</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        ${totalSalaryUSD}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">In IDRX</span>
                    <span className="text-slate-400 font-mono">{fmt(totalSalaryIDRX)} IDRX</span>
                  </div>
                </div>
              </div>

              {/* Balance Check */}
              <div className={`p-6 rounded-2xl border-2 mb-8 ${remainingAfterIDRX < 0 ? 'bg-red-500/20 border-red-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className={`w-6 h-6 ${remainingAfterIDRX < 0 ? 'text-red-400' : 'text-emerald-400'}`} />
                  <h3 className="font-bold text-white">Balance Check</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Current Balance</div>
                    <div className="text-lg font-bold text-white">{fmt(contractBalanceIDRX)} IDRX</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Required</div>
                    <div className="text-lg font-bold text-white">{fmt(totalSalaryIDRX)} IDRX</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Remaining After</div>
                    <div className={`text-lg font-bold ${remainingAfterIDRX < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {fmt(remainingAfterIDRX)} IDRX
                    </div>
                  </div>
                </div>
                {remainingAfterIDRX < 0 && (
                     <div className="mt-4 text-red-300 font-semibold">Insufficient funds. Please deposit more IDRX.</div>
                )}
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
                  disabled={remainingAfterIDRX < 0}
                  className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
        <Sidebar currentPage="payroll-execution" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto">
          <CompanyHeader 
            title="Confirm Payroll"
            subtitle="Review and confirm payroll execution"
          />
          
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Confirm Payroll Execution</h2>
                <p className="text-red-400 font-semibold">This action cannot be undone</p>
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
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">${totalSalaryUSD}</div>
                  <div className="text-slate-300 mb-1">{fmt(totalSalaryIDRX)} IDRX</div>
                  <div className="text-sm text-slate-500">To {employeeCount} employees</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button 
                  onClick={() => setStage('review')}
                  variant="outline"
                  className="flex-1 h-14 rounded-xl border-white/20 text-slate-300 hover:text-white hover:bg-white/10"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStage('executing')}
                  disabled={!allChecked}
                  className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Execute Payroll
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (stage === 'executing') {
    return (
      <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
        <Sidebar currentPage="payroll-execution" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <main className="flex-1 overflow-y-auto">
          <CompanyHeader 
            title="Executing Payroll"
            subtitle="Processing blockchain transaction"
          />
          
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Executing Payroll...</h2>
                <p className="text-slate-400">Please wait, do not close this page</p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {[
                  { label: 'Preparing transaction', step: 1 },
                  { label: 'Calculating amounts', step: 2 },
                  { label: 'Sending to blockchain', step: 3 },
                  { label: 'Distributing to employees', step: 4 },
                  { label: 'Sending notifications', step: 5 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-700/30 border border-white/10">
                    {currentStep > item.step ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : currentStep === item.step ? (
                      <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-white/30"></div>
                    )}
                    <span className={`font-medium ${currentStep >= item.step ? 'text-white' : 'text-slate-500'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Success stage
  return (
    <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
      <Sidebar currentPage="payroll-execution" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto">
        <CompanyHeader 
          title="Payroll Complete"
          subtitle="Transaction successful"
        />
        
        <div className="max-w-2xl mx-auto p-4 lg:p-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">Payroll Executed Successfully!</h1>
              <p className="text-xl text-slate-400">{employeeCount} employees have received their payment</p>
            </div>

            {/* Summary */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-2 border-emerald-500/30 mb-8">
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-2">Total Transferred:</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-1">${totalSalaryUSD}</div>
                <div className="text-slate-300">{fmt(totalSalaryIDRX)} IDRX</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                onClick={() => onNavigate('dashboard')} 
                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl"
              >
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => onNavigate('transactions')} 
                variant="outline"
                className="flex-1 h-14 rounded-xl border-white/20 text-slate-300 hover:text-white hover:bg-white/10"
              >
                View Transactions
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}