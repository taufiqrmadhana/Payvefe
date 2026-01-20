import { Building2, User, CreditCard, Bell, Shield, Mail, Globe, Save, ChevronRight, Zap, Wallet, Copy, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';
import { Sidebar } from '@/app/components/Sidebar';

interface SettingsProps {
  onNavigate: (page: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('company');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar currentPage="settings" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-800/50 backdrop-blur-xl border-b border-white/10 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <button onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400 transition-colors">Dashboard</button>
              <span>›</span>
              <span className="text-white">Settings</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-10 h-10 rounded-xl bg-slate-700/50 border border-white/10 flex items-center justify-center hover:bg-slate-700 transition-all">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full text-xs text-white font-bold flex items-center justify-center border-2 border-slate-900">3</span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-slate-700 shadow-lg"></div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-slate-400">Manage your account and organization preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto bg-slate-800/50 p-1 rounded-xl border border-white/10">
              {[
                { id: 'company' as const, label: 'Company', icon: Building2 },
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
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-white">Company Information</h2>
                        <p className="text-sm text-slate-400">Update your company details</p>
                      </div>
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
                        <code className="flex-1 font-mono text-sm text-white bg-slate-700/50 px-3 py-2 rounded-lg">
                          0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                        </code>
                        <button 
                          onClick={() => handleCopy('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')}
                          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all border border-white/10"
                        >
                          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-300" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                        <div className="text-sm text-slate-400 mb-1">IDRX Balance</div>
                        <div className="text-2xl font-bold text-white">500,000</div>
                      </div>
                      <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                        <div className="text-sm text-slate-400 mb-1">ETH Balance</div>
                        <div className="text-2xl font-bold text-white">0.245</div>
                      </div>
                      <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                        <div className="text-sm text-slate-400 mb-1">Network</div>
                        <div className="text-lg font-bold text-cyan-400">Base L2</div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50">
                        Top Up Wallet
                      </Button>
                      <Button variant="outline" className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10">
                        Withdraw
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
      </div>
    </div>
  );
}