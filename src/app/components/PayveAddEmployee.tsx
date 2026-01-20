import { X, User, Mail, Briefcase, Phone, MapPin, Calendar, Sparkles, Wallet, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';
import { Flag } from '@/app/components/ui/flag';

interface PayveAddEmployeeProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function PayveAddEmployee({ onClose, onNavigate }: PayveAddEmployeeProps) {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [walletOption, setWalletOption] = useState<'create' | 'existing'>('create');

  const handleSubmit = () => {
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
        <div className="w-full max-w-md mx-4 p-8 bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/50">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Employee Added Successfully!</h2>
          <p className="text-slate-400 mb-6">Anderson Smith has been added to your team</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10">
              View Profile
            </Button>
            <Button className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold">
              Add Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-500/30">
        {/* Header */}
        <div className="relative p-8 pb-6">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center transition-all hover:rotate-90 border border-white/10"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`relative ${s <= step ? 'w-10 h-10' : 'w-8 h-8'} rounded-full transition-all duration-300 ${
                  s < step 
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600' 
                    : s === step
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600 ring-4 ring-cyan-500/30'
                    : 'bg-slate-700 border border-white/10'
                }`}>
                  {s < step && (
                    <CheckCircle className="absolute inset-0 m-auto w-5 h-5 text-white" />
                  )}
                </div>
                {s < 4 && <div className={`w-8 h-0.5 ${s < step ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-slate-700'}`}></div>}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 -mt-4">
            <span className={step >= 1 ? 'text-cyan-400 font-semibold' : ''}>Details</span>
            <span className={step >= 2 ? 'text-cyan-400 font-semibold' : ''}>Contract</span>
            <span className={step >= 3 ? 'text-cyan-400 font-semibold' : ''}>Payment</span>
            <span className={step >= 4 ? 'text-cyan-400 font-semibold' : ''}>Review</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Step 1: Employee Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Employee Information
                </h2>
                <p className="text-slate-400">Basic details for payroll setup</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input 
                      placeholder="e.g. Anderson Smith"
                      className="h-13 pl-12 pr-12 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white placeholder:text-slate-500 transition-all"
                    />
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input 
                        placeholder="anderson@company.com"
                        type="email"
                        className="h-13 pl-12 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white placeholder:text-slate-500 transition-all"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Used for login and notifications</p>
                  </div>

                  <div>
                    <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Position</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input 
                        placeholder="e.g. Senior Engineer"
                        className="h-13 pl-12 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white placeholder:text-slate-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input 
                      placeholder="+1 (555) 000-0000"
                      className="h-13 pl-12 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white placeholder:text-slate-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select className="w-full h-13 pl-12 pr-4 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all bg-slate-700/50 text-white">
                      <option>Select location</option>
                      <option>Indonesia</option>
                      <option>Singapore</option>
                      <option>United States</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => setStep(2)}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl hover:shadow-xl hover:shadow-cyan-500/50 transition-all font-semibold"
                >
                  Next: Contract Details
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Contract Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Contract Information
                </h2>
                <p className="text-slate-400">Employment terms and compensation</p>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input 
                        type="date"
                        defaultValue="2026-01-25"
                        className="h-13 pl-12 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input 
                        type="date"
                        defaultValue="2026-12-31"
                        className="h-13 pl-12 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Employment Type</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Full-Time', 'Part-Time', 'Contractor'].map((type) => (
                      <button key={type} className="p-4 rounded-xl border-2 border-cyan-500/30 bg-cyan-500/10 hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all">
                        <div className="text-sm font-semibold text-white">{type}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Monthly Salary</Label>
                  <div className="relative">
                    <select className="absolute left-4 top-1/2 -translate-y-1/2 w-20 h-8 border-r border-white/10 focus:outline-none bg-transparent text-white">
                      <option className="bg-slate-800">USD</option>
                      <option className="bg-slate-800">IDR</option>
                    </select>
                    <Input 
                      placeholder="4,300"
                      className="h-13 pl-28 pr-4 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white text-xl font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30">
                  <div className="text-xs uppercase text-slate-300 font-semibold mb-1">Equivalent in IDRX</div>
                  <div className="text-2xl font-bold text-white">6,880,000 IDRX</div>
                  <div className="text-xs text-slate-400 mt-1">1 USD = 16,000 IDRX • Updated 2 seconds ago</div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
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
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl hover:shadow-xl hover:shadow-cyan-500/50 transition-all font-semibold"
                >
                  Next: Payment Setup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Setup */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Payment Information
                </h2>
                <p className="text-slate-400">Blockchain wallet for receiving salary</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setWalletOption('create')}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                    walletOption === 'create' 
                      ? 'border-cyan-500/50 bg-cyan-500/10' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/50">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">Create Wallet via Email</h3>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">RECOMMENDED</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">We'll create a secure wallet using Account Abstraction. No seed phrases needed.</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Email recovery</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>No crypto knowledge required</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Instant setup</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setWalletOption('existing')}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                    walletOption === 'existing' 
                      ? 'border-cyan-500/50 bg-cyan-500/10' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0 border border-white/10">
                      <Wallet className="w-6 h-6 text-slate-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">Connect Existing Wallet</h3>
                      <p className="text-sm text-slate-400">Employee has a Base-compatible wallet</p>
                    </div>
                  </div>
                </button>

                {walletOption === 'existing' && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <Label className="text-xs uppercase text-slate-300 font-semibold mb-2 block">Base Network Address</Label>
                    <Input 
                      placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                      className="font-mono text-sm h-11 rounded-lg bg-slate-700/50 border-white/10 text-white"
                    />
                    <p className="text-xs text-slate-400 mt-2">Must be Base network compatible</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button 
                  onClick={() => setStep(2)}
                  variant="ghost"
                  className="h-12 px-8 rounded-xl text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(4)}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl hover:shadow-xl hover:shadow-cyan-500/50 transition-all font-semibold"
                >
                  Next: Review
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Review Employee Details
                </h2>
                <p className="text-slate-400">Confirm everything is correct</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-700/50 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Personal Information</h3>
                    <button className="text-cyan-400 text-sm font-medium hover:underline">Edit</button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                        AS
                      </div>
                      <div>
                        <div className="font-semibold text-white">Anderson Smith</div>
                        <div className="text-slate-400">anderson@company.com</div>
                      </div>
                    </div>
                    <div><span className="text-slate-400">Position:</span> <span className="text-white font-medium">Senior Engineer</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Location:</span> 
                      <Flag country="indonesia" className="w-5 h-4" />
                      <span className="text-white font-medium">Indonesia</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-700/50 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Contract Terms</h3>
                    <button className="text-cyan-400 text-sm font-medium hover:underline">Edit</button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-slate-400">Start:</span> <span className="text-white font-medium">Jan 25, 2026</span></div>
                    <div><span className="text-slate-400">End:</span> <span className="text-white font-medium">Dec 31, 2026</span></div>
                    <div><span className="text-slate-400">Type:</span> <span className="px-2 py-1 bg-blue-500/20 text-blue-300 font-medium rounded-full text-xs border border-blue-500/30">Full-Time</span></div>
                    <div><span className="text-slate-400">Duration:</span> <span className="text-white font-medium">12 months</span></div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Compensation</h3>
                    <button className="text-cyan-400 text-sm font-medium hover:underline">Edit</button>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">$430</div>
                  <div className="text-sm text-slate-400">per month</div>
                  <div className="text-sm text-slate-500 mt-2">≈ 6,880,000 IDRX</div>
                </div>

                <div className="p-6 bg-slate-700/50 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Payment Setup</h3>
                    <button className="text-cyan-400 text-sm font-medium hover:underline">Edit</button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="px-3 py-2 bg-emerald-500/20 text-emerald-300 font-medium rounded-lg text-center border border-emerald-500/30">
                      Auto-created Wallet
                    </div>
                    <p className="text-slate-400 text-xs">Wallet will be created via email using Account Abstraction</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-700/50 rounded-2xl border border-cyan-500/30">
                <h3 className="font-bold text-white mb-4">Monthly Cost to Company</h3>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base salary</span>
                    <span className="text-white font-medium">$430</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Employer taxes (10%)</span>
                    <span className="text-white font-medium">$43</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Platform fee (0.5%)</span>
                    <span className="text-white font-medium">$2.15</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-500/30 to-cyan-500/30 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-2xl font-bold text-white">$475.15</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button 
                  onClick={() => setStep(3)}
                  variant="ghost"
                  className="h-12 px-8 rounded-xl text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl hover:shadow-xl hover:shadow-cyan-500/50 transition-all font-semibold"
                >
                  <User className="w-5 h-5 mr-2" />
                  Add Employee
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
