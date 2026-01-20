import { Zap, DollarSign, Shield, ArrowRight, CheckCircle, UserCircle, Mail, Building2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useState } from 'react';

interface EmployeeOnboardingProps {
  onNavigate: (page: string) => void;
}

export function EmployeeOnboarding({ onNavigate }: EmployeeOnboardingProps) {
  const [step, setStep] = useState(1);

  const totalSteps = 2;

  const handleComplete = () => {
    onNavigate('employee-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-bold text-white">Payve</div>
          </div>
        </div>
      </header>

      {/* Progress Dots */}
      {step > 1 && (
        <div className="border-b border-white/10 px-8 py-6 bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s <= step ? 'w-8 bg-gradient-to-r from-blue-600 to-cyan-600' : 'w-1.5 bg-slate-700'
                  }`}
                ></div>
              ))}
            </div>
            <p className="text-sm text-slate-400 text-center mt-3">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="space-y-8 text-center">
              <div>
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Welcome to Payve</h1>
                <p className="text-xl text-slate-400">Acme Corp uses Payve for payroll</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Instant payments on payday</h3>
                  <p className="text-sm text-slate-400">Receive your salary the moment it's sent</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Withdraw to your bank anytime</h3>
                  <p className="text-sm text-slate-400">Transfer to your bank account in minutes</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Secure & transparent</h3>
                  <p className="text-sm text-slate-400">All transactions recorded on blockchain</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-3">What you get:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  {[
                    'No waiting for bank transfers',
                    'Lower fees than traditional payroll',
                    'Instant salary on payday',
                    'View all payment history',
                    'Withdraw to any bank account',
                    '24/7 access to your funds'
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-white">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)}
                className="h-14 px-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-cyan-500/50"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* STEP 2: Profile Setup */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <UserCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
                <p className="text-slate-400">Set up your account to receive payments</p>
              </div>

              <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-xs uppercase text-slate-400 font-semibold">First Name</Label>
                      <Input 
                        id="first-name" 
                        placeholder="John" 
                        className="h-12 bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-xs uppercase text-slate-400 font-semibold">Last Name</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Doe" 
                        className="h-12 bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase text-slate-400 font-semibold">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="john.doe@acme.com" 
                        className="h-12 pl-12 bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs uppercase text-slate-400 font-semibold">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="+1 (555) 123-4567" 
                      className="h-12 bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank-account" className="text-xs uppercase text-slate-400 font-semibold">Bank Account (for withdrawals)</Label>
                    <Input 
                      id="bank-account" 
                      placeholder="Enter your bank account number" 
                      className="h-12 bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50" 
                    />
                    <p className="text-xs text-slate-500">This will be used to withdraw your salary</p>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-xl border border-white/10">
                    <Checkbox id="terms" className="mt-1" />
                    <label htmlFor="terms" className="text-sm text-slate-300 cursor-pointer">
                      I agree to the <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a> and <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>
                    </label>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button 
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 h-12 rounded-xl border-white/20 text-white hover:bg-white/10"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleComplete}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
                    >
                      Complete Setup
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
