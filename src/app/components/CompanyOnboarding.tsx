import { CheckCircle, Copy, QrCode, Building2, Users, Wallet, Zap, ArrowRight, ArrowLeft, Globe, Mail } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';

interface CompanyOnboardingProps {
  onNavigate: (page: string) => void;
}

export function CompanyOnboarding({ onNavigate }: CompanyOnboardingProps) {
  const [step, setStep] = useState(1);
  const [fundingMethod, setFundingMethod] = useState<'bank' | 'crypto'>('bank');
  const [invites, setInvites] = useState<Array<{ email: string; role: string }>>([]);
  const [newEmail, setNewEmail] = useState('');

  const totalSteps = 3;

  const addInvite = () => {
    if (newEmail) {
      setInvites([...invites, { email: newEmail, role: 'Admin' }]);
      setNewEmail('');
    }
  };

  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-bold text-white">Payve</div>
          </div>
          
          <button 
            onClick={() => step < totalSteps && setStep(step + 1)}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-white/10 px-8 py-8 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  s < step ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/50' :
                  s === step ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/50 ring-4 ring-cyan-500/30' :
                  'bg-slate-700 text-slate-400 border-2 border-white/10'
                }`}>
                  {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full ${
                    s < step ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-slate-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span className={step >= 1 ? 'text-cyan-400' : ''}>Company Info</span>
            <span className={step >= 2 ? 'text-cyan-400' : ''}>Fund Wallet</span>
            <span className={step >= 3 ? 'text-cyan-400' : ''}>Invite Team</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* STEP 1: Company Information */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Company Details</h1>
                <p className="text-slate-400">Tell us about your organization</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-xs uppercase text-slate-400 font-semibold">Company Name</Label>
                  <Input 
                    id="company-name" 
                    placeholder="e.g. Acme Corp" 
                    className="h-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="company-size" className="text-xs uppercase text-slate-400 font-semibold">Company Size</Label>
                    <select 
                      id="company-size" 
                      className="w-full h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option className="bg-slate-800" value="">Select size</option>
                      <option className="bg-slate-800" value="1-10">1-10 employees</option>
                      <option className="bg-slate-800" value="11-50">11-50 employees</option>
                      <option className="bg-slate-800" value="51-200">51-200 employees</option>
                      <option className="bg-slate-800" value="200+">200+ employees</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-xs uppercase text-slate-400 font-semibold">Industry</Label>
                    <select 
                      id="industry" 
                      className="w-full h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option className="bg-slate-800" value="">Select industry</option>
                      <option className="bg-slate-800" value="tech">Technology</option>
                      <option className="bg-slate-800" value="finance">Finance</option>
                      <option className="bg-slate-800" value="healthcare">Healthcare</option>
                      <option className="bg-slate-800" value="retail">Retail</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs uppercase text-slate-400 font-semibold">Website (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input 
                      id="website" 
                      placeholder="https://acme.com" 
                      className="h-12 pl-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs uppercase text-slate-400 font-semibold">Country</Label>
                  <select 
                    id="country" 
                    className="w-full h-12 px-4 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option className="bg-slate-800" value="">Select country</option>
                    <option className="bg-slate-800" value="id">Indonesia</option>
                    <option className="bg-slate-800" value="sg">Singapore</option>
                    <option className="bg-slate-800" value="us">United States</option>
                  </select>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button 
                    onClick={() => setStep(2)}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Fund Wallet */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Fund Your Wallet</h1>
                <p className="text-slate-400">Add funds to start paying employees</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-cyan-500/30">
                <div className="text-sm text-slate-300 mb-2">Your Company Wallet</div>
                <div className="font-mono text-sm text-white bg-slate-700/50 px-3 py-2 rounded-lg mb-4 break-all">
                  0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all text-sm text-white border border-white/10">
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all text-sm text-white border border-white/10">
                    <QrCode className="w-4 h-4" />
                    QR Code
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm text-slate-300 font-semibold">Choose funding method</Label>
                
                <button
                  onClick={() => setFundingMethod('bank')}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                    fundingMethod === 'bank'
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">Bank Transfer</h3>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">RECOMMENDED</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">Transfer from your bank account. Converted to IDRX automatically.</p>
                      <div className="text-sm text-slate-300">Processing time: 1-2 business days</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setFundingMethod('crypto')}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                    fundingMethod === 'crypto'
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Wallet className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">Crypto Wallet</h3>
                      <p className="text-sm text-slate-400 mb-3">Send IDRX or ETH directly from your wallet</p>
                      <div className="text-sm text-slate-300">Processing time: Instant</div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="pt-6 flex justify-between">
                <Button 
                  onClick={() => setStep(1)}
                  variant="ghost"
                  className="h-12 px-8 rounded-xl text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Invite Team */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Invite Your Team</h1>
                <p className="text-slate-400">Add admins to help manage payroll</p>
              </div>

              <div className="space-y-4">
                <Label className="text-sm text-slate-300 font-semibold">Invite admins (Optional)</Label>
                
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="admin@company.com"
                      className="h-12 pl-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50"
                      onKeyPress={(e) => e.key === 'Enter' && addInvite()}
                    />
                  </div>
                  <Button 
                    onClick={addInvite}
                    className="h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold"
                  >
                    Add
                  </Button>
                </div>

                {invites.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {invites.map((invite, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/10">
                        <div>
                          <div className="text-sm font-medium text-white">{invite.email}</div>
                          <div className="text-xs text-slate-400">{invite.role}</div>
                        </div>
                        <button
                          onClick={() => removeInvite(index)}
                          className="text-sm text-slate-400 hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {invites.length === 0 && (
                  <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-white/10">
                    <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                    <p className="text-sm text-slate-400">No invites yet. Add team members to get started.</p>
                  </div>
                )}
              </div>

              <div className="pt-6 flex justify-between">
                <Button 
                  onClick={() => setStep(2)}
                  variant="ghost"
                  className="h-12 px-8 rounded-xl text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
                >
                  Complete Setup
                  <CheckCircle className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
