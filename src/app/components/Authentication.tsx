import { ArrowLeft, Mail, Chrome, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';

interface AuthenticationProps {
  onNavigate: (page: string) => void;
}

export function Authentication({ onNavigate }: AuthenticationProps) {
  const [accountType, setAccountType] = useState<'company' | 'employee'>('company');
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Hardcoded authentication
    if (username === 'company' && password === 'company') {
      onNavigate('dashboard');
    } else if (username === 'employee' && password === 'employee') {
      onNavigate('employee-dashboard');
    } else {
      setError('Invalid credentials. Try company/company or employee/employee');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex flex-col">
        <div className="p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-xl font-bold text-white">Payve</div>
            </div>
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 pb-16">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-white mb-2">Sign in to Payve</h1>
            <p className="text-slate-400 mb-8">Choose your account type</p>

            {/* Account Type Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-800/50 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setAccountType('company')}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                  accountType === 'company'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Company
              </button>
              <button
                onClick={() => setAccountType('employee')}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                  accountType === 'employee'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Employee
              </button>
            </div>

            {!showEmailForm ? (
              <>
                {/* Sign In Options */}
                <div className="space-y-3 mb-6">
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start gap-3 text-white border-white/20 hover:bg-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm"
                  >
                    <Chrome className="w-5 h-5 text-slate-300" />
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowEmailForm(true)}
                    className="w-full h-12 justify-start gap-3 text-white border-white/20 hover:bg-white/10 rounded-xl bg-slate-800/50 backdrop-blur-sm"
                  >
                    <Mail className="w-5 h-5 text-slate-300" />
                    Continue with Email
                  </Button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-950 text-slate-500">or</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-400">
                    Don't have an account?{' '}
                    <a href="#" className="text-cyan-400 hover:underline font-semibold">
                      Sign up
                    </a>
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Login Form */}
                <div className="space-y-4 mb-6">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-sm text-red-300 text-center">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm text-slate-300 font-semibold">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="company or employee"
                      className="h-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm text-slate-300 font-semibold">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="company or employee"
                      className="h-12 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50"
                    />
                  </div>

                  <Button
                    onClick={handleLogin}
                    disabled={!username || !password}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white h-12 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sign In
                  </Button>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <p className="text-xs text-blue-300 text-center font-semibold mb-2">
                      Demo Credentials:
                    </p>
                    <p className="text-xs text-slate-400 text-center">
                      Company: <span className="text-cyan-400 font-mono">company / company</span>
                    </p>
                    <p className="text-xs text-slate-400 text-center">
                      Employee: <span className="text-cyan-400 font-mono">employee / employee</span>
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Footer Links */}
            <div className="mt-12 text-center text-xs text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <span className="mx-2">•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Brand Showcase */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white relative overflow-hidden">
        {/* Animated Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        ></div>

        {/* Floating Shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex flex-col items-center justify-center p-16">
          <div className="max-w-lg">
            <blockquote className="text-3xl font-bold mb-6 leading-tight">
              "We reduced payroll processing time from 2 hours to 2 minutes"
            </blockquote>
            <p className="text-cyan-200 mb-12 text-lg">
              Sarah Chen, CFO at RemoteCo
            </p>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-cyan-400/30">
              <div>
                <div className="text-3xl font-bold mb-1">$2.4M</div>
                <div className="text-sm text-slate-300">Processed monthly</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">1,200+</div>
                <div className="text-sm text-slate-300">Employees paid</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">99.9%</div>
                <div className="text-sm text-slate-300">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}