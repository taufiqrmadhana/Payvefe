import { X, User, Mail, Briefcase, Phone, MapPin, Calendar, Sparkles, Wallet, CheckCircle, ArrowRight, ArrowLeft, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';
import { Flag } from '@/app/components/ui/flag';
import { usePayve } from '@/hooks/usePayve';
import { useAccount } from 'wagmi';
import { keccak256, toBytes, toHex } from 'viem';
import { API_BASE_URL } from '@/constants';

interface PayveAddEmployeeProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function PayveAddEmployee({ onClose, onNavigate }: PayveAddEmployeeProps) {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [walletOption, setWalletOption] = useState<'create' | 'existing'>('create');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [salaryIDRX, setSalaryIDRX] = useState('6880000'); // Default ~430 USD
  const [inviteSecret, setInviteSecret] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createInvite, myCompanyAddress } = usePayve();
  const { address } = useAccount();

  const handleCreateInvite = async () => {
    try {
      setIsSubmitting(true);

      // 1. Generate Secret
      const secret = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      setInviteSecret(secret);

      // 2. Hash Secret (keccak256(secret))
      // Note: In solidity we do: keccak256(abi.encodePacked(secret))
      // In viem/js: keccak256(toBytes(secret)) matches this for string
      const inviteHash = keccak256(toBytes(secret));

      console.log("Creating invite:", { name, salary: salaryIDRX, secret, hash: inviteHash });

      // 3. Send Transaction
      // Salary must be in wei (18 decimals) if using IDRX standard, but let's assume input is whole IDRX for now
      // Actually standard ERC20 usually 18 decimals. 
      // mocking 1 IDR = 1 unit? or 1 IDRX = 1e18?
      // Let's assume input as FULL tokens (e.g. 6,880,000 IDRX).
      const salaryBigInt = BigInt(salaryIDRX.replace(/,/g, '')) * BigInt(1e18);

      await createInvite(inviteHash, name || "New Employee", salaryBigInt);

      // 4. Sync employee to backend (always, even without email)
      try {
        const response = await fetch(`${API_BASE_URL}/api/employees/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email || null,
            name: name || 'New Employee',
            position: position || null,
            secret: secret,
            company_contract_address: myCompanyAddress,
            admin_wallet: address,
            monthly_salary_usd: Math.round(parseInt(salaryIDRX.replace(/,/g, '')) / 16000).toString()
          })
        });
        const result = await response.json();
        if (result.success) {
          console.log('Employee synced to backend', email ? '+ invite email sent' : '(no email)');
        }
      } catch (backendError) {
        console.warn('Failed to sync employee to backend, but on-chain invite created:', backendError);
      }

      setSuccess(true);
    } catch (error) {
      console.error("Failed to create invite:", error);
      alert("Failed to create invite on-chain. See console.");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
        <div className="w-full max-w-md mx-4 p-8 bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/50">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Employee Invited!</h2>
          <p className="text-slate-400 mb-6">Transaction confirmed on Base Sepolia.</p>

          {email && email.includes('@') && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Mail className="w-4 h-4" />
                <span className="font-semibold text-sm">Email Invite Sent!</span>
              </div>
              <p className="text-slate-400 text-sm">
                Invite link sent to <span className="text-white">{email}</span>
              </p>
            </div>
          )}

          <div className="bg-slate-900/50 p-4 rounded-xl border border-dashed border-cyan-500/50 mb-6">
            <div className="text-xs uppercase text-cyan-400 font-bold mb-2">Invite Code (Backup)</div>
            <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-3 border border-white/10">
              <code className="flex-1 text-lg font-mono text-white tracking-widest text-center">
                {inviteSecret}
              </code>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => navigator.clipboard.writeText(inviteSecret)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {email ? 'Backup code if email fails. Employee can also use this to claim manually.' : 'Share this code with the employee. They need it to claim their profile.'}
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold">
              Done
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
                <div className={`relative ${s <= step ? 'w-10 h-10' : 'w-8 h-8'} rounded-full transition-all duration-300 ${s < step
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anderson Smith"
                      className="h-13 pl-12 pr-12 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white placeholder:text-slate-500 transition-all"
                    />
                    {name && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="anderson@company.com"
                        type="email"
                        className="h-13 pl-12 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white placeholder:text-slate-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Position</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="e.g. Senior Engineer"
                        className="h-13 pl-12 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white placeholder:text-slate-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
                {/* ... existing fields ... */}
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
              {/* ... header ... */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Contract Information
                </h2>
                <p className="text-slate-400">Employment terms and compensation</p>
              </div>

              <div className="space-y-4">
                {/* ... dates ... */}

                <div>
                  <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Monthly Salary (IDRX)</Label>
                  <div className="relative">
                    <Input
                      value={salaryIDRX}
                      onChange={(e) => setSalaryIDRX(e.target.value)}
                      placeholder="e.g. 5000"
                      className="h-13 pl-4 pr-4 rounded-xl border border-white/10 focus:border-cyan-500/50 bg-slate-700/50 text-white text-xl font-bold transition-all"
                    />
                  </div>
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
              {/* ... Keep existing ... */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Payment Setup
                </h2>
                <p className="text-slate-400">Select how they will receive funds. (For now, we just create an invite)</p>
              </div>

              {/* ... logic for now just goes next ... */}

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
                  Review & Invite
                </h2>
                <p className="text-slate-400">This will create a blockchain transaction</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-700/50 rounded-2xl border border-white/10">
                  <h3 className="font-bold text-white mb-2">Employee</h3>
                  <div className="text-slate-300">{name}</div>
                  <div className="text-slate-400 text-sm">{email}</div>
                </div>
                <div className="p-6 bg-slate-700/50 rounded-2xl border border-white/10">
                  <h3 className="font-bold text-white mb-2">Salary</h3>
                  <div className="text-emerald-400 font-bold text-xl">{salaryIDRX} IDRX</div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setStep(3)}
                  variant="ghost"
                  className="h-12 px-8 rounded-xl text-white hover:bg-white/10"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleCreateInvite}
                  disabled={isSubmitting}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl hover:shadow-xl hover:shadow-cyan-500/50 transition-all font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Invite On-Chain
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
