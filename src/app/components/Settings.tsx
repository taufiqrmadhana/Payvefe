import { parseEther, encodeFunctionData } from 'viem';
import { Building2, Loader2 } from 'lucide-react';
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
  
  // Total Contract Balance (of my company)
  const { address } = useAccount();
  
  // Backend company data
  const { company: backendCompany, exists: backendCompanyExists, loading: companyLoading } = useCompany(address);
  
  const { data: contractBalance, refetch: refetchBalance } = useReadContract({
    abi: MockIDRXABI.abi,
    address: IDRX_ADDRESS as `0x${string}`,
    functionName: 'balanceOf',
    args: myCompanyAddress ? [myCompanyAddress] : undefined,
    query: {
         enabled: !!myCompanyAddress,
         refetchInterval: 5000 
    }
  });

  // User's Wallet Balance
  const { data: userBalance, refetch: refetchUserBalance } = useReadContract({
    abi: MockIDRXABI.abi,
    address: IDRX_ADDRESS as `0x${string}`,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
         enabled: !!address,
         refetchInterval: 5000 
    }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Modal States
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  // Creation State
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  
  // Deposit State
  const [depositAmount, setDepositAmount] = useState('1000');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCreateCompany = async () => {
      try {
          setIsCreatingCompany(true);
          const tx = await createCompany();
          console.log("Creation tx:", tx);
          
          // Wait for a bit (hacky polling wait)
          setTimeout(() => {
              refetchCompany();
              setIsCreatingCompany(false);
          }, 5000);
          
      } catch (e) {
          console.error("Failed to create company", e);
          setIsCreatingCompany(false);
          alert("Failed to create company");
      }
  };

  const handleMint = async () => {
    try {
      const amount = prompt("Enter amount of IDRX to mint:", "10000");
      if (!amount) return;
      await mint(parseEther(amount));
      alert("Minted " + amount + " IDRX successfully!");
    } catch (e) {
      console.error("Mint failed:", e);
      alert("Failed to mint. ensuring you have a wallet connected?");
    }
  };

  // Deposit Calls for Transaction Component
  const depositCalls = useMemo(() => {
    console.log("Constructing depositCalls. IDRX:", IDRX_ADDRESS, "Company:", myCompanyAddress);
    
    if (!myCompanyAddress || !IDRX_ADDRESS) {
      console.warn("Cannot construct calls: Missing address");
      return [];
    }

    const depositAmountWei = parseEther(depositAmount || '0');
    const userBalanceWei = userBalance ? BigInt(userBalance.toString()) : BigInt(0);
    
    // Check if user has enough balance
    if (depositAmountWei > userBalanceWei) {
      console.warn("Insufficient balance for deposit");
      return [];
    }
    
    if (depositAmountWei <= BigInt(0)) {
      console.warn("Invalid deposit amount");
      return [];
    }
    
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
        {
          to: IDRX_ADDRESS as `0x${string}`,
          data: approveData,
          value: BigInt(0)
        },
        {
          to: myCompanyAddress as `0x${string}`,
          data: depositData,
          value: BigInt(0)
        }
      ];
    } catch (err) {
      console.error("Error encoding function data:", err);
      return [];
    }
  }, [myCompanyAddress, depositAmount, userBalance]);

  return (
    <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
      <Sidebar currentPage="settings" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto">
        <CompanyHeader 
          title="Settings"
          subtitle="Manage your company account"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
          showNotifications={true}
        />

        {/* Content Area */}
        <div className="p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Main Company Content */}
            <div className="space-y-6">
                  {/* Loading State */}
                  {companyLoading ? (
                    <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 text-center">
                      <Loader2 className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
                      <p className="text-slate-400">Loading company data...</p>
                    </div>
                  ) : !myCompanyAddress ? (
                      // No on-chain company - show deploy button
                      <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 text-center">
                          <Building2 className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-80" />
                          <h2 className="text-2xl font-bold text-white mb-2">
                            {backendCompanyExists ? `Deploy Contract for ${backendCompany?.company_name}` : 'Create Your Organization'}
                          </h2>
                          <p className="text-slate-400 mb-6 max-w-md mx-auto">
                              Deploy your own secure Payroll Smart Contract on Base. 
                              One contract per company ensures complete asset isolation.
                          </p>
                          <Button 
                              onClick={handleCreateCompany} 
                              disabled={isCreatingCompany}
                              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20"
                          >
                              {isCreatingCompany ? "Deploying Contract..." : "Deploy Company Contract"}
                          </Button>
                      </div>
                  ) : (
                    <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white">{backendCompany?.company_name || 'Company Information'}</h2>
                                    <p className="text-sm text-slate-400">
                                      {myCompanyAddress || backendCompany?.payroll_contract_address || `Payroll Day: ${backendCompany?.payroll_day || 25}`}
                                    </p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => setIsAddEmployeeOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
                            >
                                Add Employee
                            </Button>
                        </div>

                        {/* Company Stats / Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                                <div className="text-sm text-slate-400 mb-1">Company Liquidity (Payve)</div>
                                <div className="text-2xl font-bold text-emerald-400">
                                        {contractBalance ? (Number(contractBalance) / 1e18).toLocaleString() : '0'} IDRX
                                </div>
                            </div>
                            <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                                  <div className="flex justify-between items-center mb-2">
                                  <Label className="text-xs text-slate-400">Deposit Amount (IDRX)</Label>
                                  <div className="text-right">
                                    <span className="text-xs text-slate-400 mr-2">
                                      Bal: {userBalance ? (Number(userBalance) / 1e18).toLocaleString() : '0'}
                                    </span>
                                    <button onClick={async () => { await handleMint(); refetchUserBalance(); }} className="text-xs text-cyan-400 hover:text-cyan-300 underline">
                                      Mint Test IDRX
                                    </button>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                    <Input 
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        className="bg-slate-800 border-white/10 text-white"
                                    />
                                    {/* OnchainKit Transaction Component */}
                                    <div className="flex-1">
                                      {depositCalls.length > 0 ? (
                                        <Transaction
                                            calls={depositCalls}
                                            className="w-full"
                                            chainId={84532} // Base Sepolia
                                            onError={(err) => { 
                                              console.error("Transaction Error:", err);
                                              alert(`Transaction failed: ${err.message || 'Unknown error'}`);
                                            }}
                                            onSuccess={(res) => { 
                                              console.log("Success", res); 
                                              refetchBalance(); 
                                              refetchUserBalance();
                                              alert("Top Up successful!");
                                            }}
                                        >
                                          <TransactionButton className="h-10 w-full bg-slate-800 hover:bg-slate-700 text-white rounded-md" text="Top Up" />
                                          <TransactionStatus>
                                            <TransactionStatusLabel />
                                            <TransactionToast>
                                              <TransactionToastIcon />
                                              <TransactionToastLabel />
                                              <TransactionToastAction />
                                            </TransactionToast>
                                          </TransactionStatus>
                                        </Transaction>
                                      ) : (
                                        <Button disabled className="w-full h-10 bg-slate-800 text-slate-500">
                                          {!myCompanyAddress 
                                            ? "Deploy Contract First" 
                                            : !userBalance || Number(userBalance) === 0
                                              ? "Mint IDRX First"
                                              : parseFloat(depositAmount || '0') > Number(userBalance) / 1e18
                                                ? "Insufficient Balance"
                                                : "Enter Amount"}
                                        </Button>
                                      )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {isAddEmployeeOpen && (
            <PayveAddEmployee onClose={() => setIsAddEmployeeOpen(false)} onNavigate={onNavigate} />
        )}

      </main>
    </div>
  );
}
