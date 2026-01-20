import { ArrowRight, Play, Zap, TrendingDown, FileWarning, Clock, Shield, Wallet, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface PayveLandingProps {
  onNavigate: (page: string) => void;
}

export function PayveLanding({ onNavigate }: PayveLandingProps) {
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Dark Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        
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

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-cyan-400 tracking-widest uppercase bg-white/5 backdrop-blur-sm border border-white/10">
                <Zap className="w-3 h-3" />
                Powered by Base L2 • IDRX Integrated
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Cross-Border Payroll
              <br />
              in <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Seconds</span>, Not Days
            </h1>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
              Pay global teams with crypto rails. 90% lower fees. Instant settlement.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button 
                onClick={() => onNavigate('authentication')}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-base font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="ghost"
                className="h-12 px-8 text-white border-2 border-white/20 hover:bg-white/10 backdrop-blur-sm text-base font-semibold rounded-xl"
              >
                <Play className="w-5 h-5 mr-2 fill-white" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              {['Built on Base L2', 'Audited by OpenZeppelin', 'SOC 2 Compliant'].map((badge, i) => (
                <div key={i} className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-slate-300 text-sm">
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right - 3D Dashboard Mockup */}
          <div className="relative">
            <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-white font-semibold">Payroll Dashboard</div>
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/30">
                      75 Employees
                    </div>
                  </div>

                  {/* Employee Cards */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">Employee {i}</div>
                        <div className="text-slate-400 text-xs">$520/month</div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  ))}

                  {/* Total Amount */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
                    <div className="text-slate-400 text-sm mb-1">Total Amount</div>
                    <div className="text-white text-2xl font-bold">$29,160</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 px-4 py-2 bg-emerald-600/90 backdrop-blur-sm text-white rounded-lg shadow-lg text-sm font-semibold animate-bounce border border-emerald-500/30">
              Transaction confirmed ✓
            </div>
            <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg shadow-lg text-sm font-semibold border border-blue-500/30">
              $29,160 settled
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-slate-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">Trusted by forward-thinking companies</p>
          </div>
          <div className="grid grid-cols-3 gap-8 mb-16">
            {[
              { label: 'Processed monthly', value: '$2.4M+' },
              { label: 'Global employees', value: '1,200+' },
              { label: 'Uptime SLA', value: '99.9%' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Traditional Payroll is Broken</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: '2-3 Day Settlement', desc: 'Wire transfers stuck in banking hours', color: 'from-red-500 to-orange-500' },
              { icon: TrendingDown, title: '5-8% in Fees', desc: 'Wise, PayPal, and banks take massive cuts', color: 'from-amber-500 to-yellow-500' },
              { icon: FileWarning, title: 'Manual Tax Hell', desc: 'Spreadsheets, errors, compliance nightmares', color: 'from-rose-500 to-pink-500' }
            ].map((problem, i) => (
              <div key={i} className="group p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center mb-6`}>
                  <problem.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
                <p className="text-slate-400">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Meet Payve: Crypto Rails, Banking UX
          </h2>
          <p className="text-xl text-center text-slate-400 mb-16">
            Traditional finance experience powered by blockchain technology
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="md:col-span-2 p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-3">Execute Global Payroll in One Click</h3>
              <p className="text-slate-400 mb-6">Pay 1000 employees across 50 countries. Smart contracts handle distribution, compliance, and notifications.</p>
              <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-slate-500 border border-white/10">
                Dashboard Preview
              </div>
            </div>

            <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-3">90% Lower Fees</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Wise / PayPal</span>
                  <span className="font-bold text-red-400">$2,400</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Payve</span>
                  <span className="font-bold text-emerald-400">$240</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-3">Instant Settlement</h3>
              <p className="text-slate-400 mb-4">Blockchain-powered transactions settle in seconds, not days</p>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Zap className="w-5 h-5" />
                <span>Real-time execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Built on Best-in-Class Web3 Infrastructure
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Base L2', desc: 'Lightning-fast transactions', subdesc: 'Gas fees <$0.01', color: 'from-blue-500 to-cyan-500' },
              { name: 'OnchainKit', desc: 'Email login, no seed phrases', subdesc: 'Account Abstraction built-in', color: 'from-indigo-500 to-purple-500' },
              { name: 'IDRX Stablecoin', desc: 'Regulated Indonesian Rupiah', subdesc: 'Instant fiat on/off ramp', color: 'from-cyan-500 to-emerald-500' },
              { name: 'Smart Contracts', desc: 'Audited by OpenZeppelin', subdesc: 'Trustless automation', color: 'from-emerald-500 to-green-500' }
            ].map((tech, i) => (
              <div key={i} className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tech.color} mb-4`}></div>
                <h3 className="text-lg font-bold text-white mb-2">{tech.name}</h3>
                <p className="text-slate-400 text-sm mb-1">{tech.desc}</p>
                <p className="text-slate-500 text-xs">{tech.subdesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Transform Your Payroll?</h2>
          <p className="text-xl text-slate-300 mb-8">Join 500+ companies paying globally with Payve</p>
          <Button 
            onClick={() => onNavigate('authentication')}
            className="h-14 px-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all duration-200"
          >
            Start Free Trial
            <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
          <p className="text-slate-400 text-sm mt-6">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">Payve</div>
            <p className="text-slate-400 text-sm mb-8">Payve-ing the way for cross-border crypto payroll</p>
            <p className="text-slate-500 text-xs">Built with ❤️ on Base • © 2026 Payve</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
