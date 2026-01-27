import { parseEther } from 'viem';
import { Building2, User, CreditCard, Bell, Globe, Zap, Wallet, Copy, Check, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { IDRX_ADDRESS, PAYVE_ADDRESS } from '@/constants';
import { usePayve, usePayveData } from '@/hooks/usePayve';
import { useReadContract } from 'wagmi';
import MockIDRXABI from '@/abis/MockIDRX.json';
import { Sidebar } from '@/app/components/Sidebar';
import { CompanyHeader } from '@/app/components/CompanyHeader';
import { PayveAddEmployee } from '@/app/components/PayveAddEmployee';
import { WithdrawModal } from '@/app/components/WithdrawModal';

interface SettingsProps {
  onNavigate: (page: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const { deposit, mint, claimInvite } = usePayve();
  const { address } = useAccount();
  const { data: idrxBalance } = useBalance({
    address: address,
    token: IDRX_ADDRESS as `0x${string}`,
  });
  
  // Check if current user is an employee
  const { employee } = usePayveData(address);

  // Total Contract Balance
  const { data: contractBalance } = useReadContract({
    abi: MockIDRXABI.abi,
    address: IDRX_ADDRESS as `0x${string}`,
    functionName: 'balanceOf',
    args: [PAYVE_ADDRESS],
    query: {
         refetchInterval: 2000 // Polling for faster updates
    }
  });

  const [activeTab, setActiveTab] = useState('company');
  const [copied, setCopied] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Modal States
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Employee Tab States
  const [inviteSecret, setInviteSecret] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimInvite = async () => {
    if (!inviteSecret) return;
    try {
        await claimInvite(inviteSecret);
        alert("Invite claimed successfully!");
        setInviteSecret('');
    } catch (e) {
        console.error("Claim failed:", e);
        alert("Failed to claim invite. Check console.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
      <Sidebar currentPage="settings" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto">
        <CompanyHeader 
          title="Settings"
          subtitle="Manage your account and preferences"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
          showNotifications={true}
        />

        {/* Content Area */}
        <div className="p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto bg-slate-800/50 p-1 rounded-xl border border-white/10">
              {[
                { id: 'company' as const, label: 'Company', icon: Building2 },
                { id: 'employee' as const, label: 'Employee', icon: Users },
                { id: 'admin' as const, label: 'Admin', icon: User },
                { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
                { id: 'billing' as const, label: 'Billing', icon: CreditCard },
                { id: 'integrations' as const, label: 'Integrations', icon: Zap },
                { id: 'notifications' as const, label: 'Notifications', icon: Bell }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'company' && (
                <>
                  {/* Company Information */}
                  <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-white">Company Information</h2>
                                <p className="text-sm text-slate-400">Update your company details</p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => setIsAddEmployeeOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
                        >
                            Add Employee
                        </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Company Name</Label>
                        <Input 
                          defaultValue="Acme Corporation"
                          className="h-11 bg-slate-700/50 border-white/10 text-white rounded-xl focus:border-cyan-500/50"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Industry</Label>
                          <select className="w-full h-11 px-4 rounded-xl border border-white/10 bg-slate-700/50 text-white focus:outline-none focus:border-cyan-500/50">
                            <option>Technology</option>
                            <option>Finance</option>
                            <option>Healthcare</option>
                            <option>Retail</option>
                          </select>
                        </div>

                        <div>
                          <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Company Size</Label>
                          <select className="w-full h-11 px-4 rounded-xl border border-white/10 bg-slate-700/50 text-white focus:outline-none focus:border-cyan-500/50">
                            <option>1-10 employees</option>
                            <option>11-50 employees</option>
                            <option>51-200 employees</option>
                            <option>200+ employees</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input 
                            defaultValue="https://acme.com"
                            className="h-11 pl-12 bg-slate-700/50 border-white/10 text-white rounded-xl focus:border-cyan-500/50"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button className="h-11 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'employee' && (
                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white">Employee Actions</h2>
                            <p className="text-sm text-slate-400">Manage your employment status</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Claim Invite Section */}
                        <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                            <h3 className="font-semibold text-white mb-2">Claim Invite</h3>
                            <p className="text-sm text-slate-400 mb-4">Enter the secret code provided by your employer to link your wallet.</p>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Enter invite secret..." 
                                    value={inviteSecret}
                                    onChange={(e) => setInviteSecret(e.target.value)}
                                    className="bg-slate-800 border-white/10 text-white"
                                />
                                <Button 
                                    onClick={handleClaimInvite}
                                    className="bg-blue-600 hover:bg-blue-500 text-white"
                                >
                                    Claim
                                </Button>
                            </div>
                        </div>

                        {/* Withdraw Section */}
                        <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                            <h3 className="font-semibold text-white mb-2">Withdraw Salary</h3>
                            <p className="text-sm text-slate-400 mb-4">Access your available funds.</p>
                            <Button 
                                onClick={() => setIsWithdrawOpen(true)}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold h-11 rounded-xl"
                            >
                                Withdraw Funds
                            </Button>
                        </div>
                    </div>
                </div>
              )}

              {activeTab === 'admin' && (
                <>
                  {/* Admin Account */}
                  <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-white">Admin Account</h2>
                        <p className="text-sm text-slate-400">Manage your personal information</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">First Name</Label>
                          <Input 
                            defaultValue="Admin"
                            className="h-11 bg-slate-700/50 border-white/10 text-white rounded-xl focus:border-cyan-500/50"
                          />
                        </div>
                        <div>
                          <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Last Name</Label>
                          <Input 
                            defaultValue="User"
                            className="h-11 bg-slate-700/50 border-white/10 text-white rounded-xl focus:border-cyan-500/50"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Email</Label>
                        <Input 
                          defaultValue="admin@acme.com"
                          type="email"
                          className="h-11 bg-slate-700/50 border-white/10 text-white rounded-xl focus:border-cyan-500/50"
                        />
                      </div>

                      <div className="pt-4">
                        <Button className="h-11 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50">
                          Update Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'wallet' && (
                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white">Company Wallet</h2>
                      <p className="text-sm text-slate-400">Manage your blockchain wallet</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-cyan-500/30">
                      <div className="text-xs uppercase text-slate-300 font-semibold mb-2">Wallet Address (Base Network)</div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 font-mono text-sm text-white bg-slate-700/50 px-3 py-2 rounded-lg break-all">
                          {address || 'Not connected'}
                        </code>
                        <button 
                          onClick={() => address && handleCopy(address)}
                          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all border border-white/10 flex-shrink-0"
                        >
                          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-300" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                        <div className="text-sm text-slate-400 mb-1">Wallet SDK Balance</div>
                        <div className="text-2xl font-bold text-white">
                            {idrxBalance ? Math.floor(parseFloat(idrxBalance.formatted)).toLocaleString() : '0'} IDRX
                        </div>
                      </div>
                      <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                        <div className="text-sm text-slate-400 mb-1">Company Liquidity (Payve)</div>
                        <div className="text-2xl font-bold text-emerald-400">
                             {contractBalance ? (Number(contractBalance) / 1e18).toLocaleString() : '0'} IDRX
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                          onClick={async () => {
                              const amount = window.prompt("Enter amount to deposit (IDRX):", "100");
                              if (amount) {
                                  try {
                                      await deposit(parseEther(amount));
                                      alert("Deposit successful!");
                                  } catch (e) {
                                      console.error(e);
                                      alert("Deposit failed");
                                  }
                              }
                          }}
                          className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
                      >
                        Deposit to Payve
                      </Button>
                      <Button variant="outline" className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10">
                        Withdraw
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={async () => {
                            const amount = window.prompt("Amount to mint (IDRX):", "1000");
                            if (amount) {
                                try {
                                    await mint(parseEther(amount));
                                    alert("Minted!");
                                } catch (e) {
                                    console.error(e);
                                    alert("Mint failed (Are you the owner?)");
                                }
                            }
                        }}
                        className="flex-1 h-11 rounded-xl border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      >
                        Get Test IDRX
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white">Billing & Subscription</h2>
                      <p className="text-sm text-slate-400">Manage your plan and billing</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-cyan-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Current Plan</div>
                          <div className="text-2xl font-bold text-white">Pro Plan</div>
                        </div>
                        <div className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-semibold border border-emerald-500/30">
                          Active
                        </div>
                      </div>
                      <div className="text-slate-300 mb-4">$99/month • Up to 100 employees</div>
                      <Button variant="outline" className="h-10 px-6 rounded-xl border-white/20 text-white hover:bg-white/10">
                        Upgrade Plan
                      </Button>
                    </div>

                    <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                      <div className="text-sm text-slate-400 mb-2">Next billing date</div>
                      <div className="text-white font-semibold">February 25, 2026</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white">Notification Preferences</h2>
                      <p className="text-sm text-slate-400">Choose what updates you receive</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Payroll executed', desc: 'Get notified when payroll runs complete', checked: true },
                      { label: 'Employee added', desc: 'Receive alerts for new team members', checked: true },
                      { label: 'Contract expiring', desc: 'Reminders when contracts are ending soon', checked: true },
                      { label: 'Low balance', desc: 'Alert when wallet balance is low', checked: true },
                      { label: 'Weekly reports', desc: 'Get weekly summary emails', checked: false }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-white/10">
                        <div>
                          <div className="font-medium text-white">{item.label}</div>
                          <div className="text-sm text-slate-400">{item.desc}</div>
                        </div>
                        <label className="relative inline-block w-12 h-6">
                          <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                          <div className="w-12 h-6 bg-slate-600 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600 transition-all"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white">Integrations</h2>
                      <p className="text-sm text-slate-400">Connect third-party services</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: 'OnchainKit', desc: 'Account Abstraction', status: 'Connected' },
                      { name: 'Base L2', desc: 'Blockchain Network', status: 'Connected' },
                      { name: 'IDRX', desc: 'Stablecoin Provider', status: 'Connected' },
                      { name: 'Slack', desc: 'Team Communication', status: 'Available' }
                    ].map((integration, i) => (
                      <div key={i} className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-white mb-1">{integration.name}</div>
                            <div className="text-sm text-slate-400">{integration.desc}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            integration.status === 'Connected'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-600/50 text-slate-400 border border-slate-500/30'
                          }`}>
                            {integration.status}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className={`w-full h-9 rounded-lg text-sm ${
                            integration.status === 'Connected'
                              ? 'border-white/20 text-white hover:bg-white/10'
                              : 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10'
                          }`}
                        >
                          {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                        </Button>
                      </div>
                    ))}
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
        {isWithdrawOpen && (
            <WithdrawModal onClose={() => setIsWithdrawOpen(false)} />
        )}

      </main>
    </div>
  );
}
