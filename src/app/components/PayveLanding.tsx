import { ArrowRight, Play, Zap, TrendingDown, FileWarning, Clock, Shield, Wallet, Users, ChevronRight, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';

interface PayveLandingProps {
  onNavigate: (page: string) => void;
}

export function PayveLanding({ onNavigate }: PayveLandingProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-white">Payve</div>
              <div className="text-[10px] sm:text-xs text-cyan-400 font-semibold">Powered by Base</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors font-medium">How It Works</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors font-medium">Pricing</a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <Button 
              onClick={() => onNavigate('authentication')}
              variant="ghost"
              className="h-9 sm:h-10 px-4 sm:px-5 text-white hover:bg-white/10 border border-white/20 rounded-lg font-semibold text-sm sm:text-base"
            >
              <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Login</span>
            </Button>
            <Button 
              onClick={() => onNavigate('authentication')}
              className="h-9 sm:h-10 px-4 sm:px-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Start Free Trial</span>
              <span className="sm:hidden">Sign Up</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden w-10 h-10 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center hover:bg-slate-700/50 transition-all"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
            <nav className="px-4 py-4 space-y-2">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium">How It Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all font-medium">Pricing</a>
              <div className="pt-2 flex flex-col gap-2">
                <Button 
                  onClick={() => { setMobileMenuOpen(false); onNavigate('authentication'); }}
                  variant="ghost"
                  className="w-full h-11 text-white hover:bg-white/10 border border-white/20 rounded-lg font-semibold justify-center"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button 
                  onClick={() => { setMobileMenuOpen(false); onNavigate('authentication'); }}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 justify-center"
                >
                  Start Free Trial
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20">
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
        <div className="absolute top-20 left-10 sm:left-20 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold text-cyan-400 tracking-widest uppercase bg-white/5 backdrop-blur-sm border border-white/10">
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Powered by Base L2 • IDRX Integrated
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Cross-Border Payroll
              <br />
              in <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Seconds</span>, Not Days
            </h1>

            <p className="text-base sm:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed max-w-xl">
              Pay global teams with crypto rails. 90% lower fees. Instant settlement.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Button 
                onClick={() => onNavigate('authentication')}
                className="h-11 sm:h-12 px-6 sm:px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm sm:text-base font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto justify-center"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
              <Button 
                variant="ghost"
                className="h-11 sm:h-12 px-6 sm:px-8 text-white border-2 border-white/20 hover:bg-white/10 backdrop-blur-sm text-sm sm:text-base font-semibold rounded-xl w-full sm:w-auto justify-center"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-white" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {['Built on Base L2', 'Audited by OpenZeppelin', 'SOC 2 Compliant'].map((badge, i) => (
                <div key={i} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-slate-300 text-xs sm:text-sm">
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right - 3D Dashboard Mockup */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative transform rotate-0 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 shadow-2xl">
                <div className="space-y-3 sm:space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="text-white font-semibold text-sm sm:text-base">Payroll Dashboard</div>
                    <div className="px-2 sm:px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] sm:text-xs font-semibold border border-emerald-500/30">
                      75 Employees
                    </div>
                  </div>

                  {/* Employee Cards */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs sm:text-sm font-medium">Employee {i}</div>
                        <div className="text-slate-400 text-[10px] sm:text-xs">$520/month</div>
                      </div>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  ))}

                  {/* Total Amount */}
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30">
                    <div className="text-slate-400 text-xs sm:text-sm mb-1">Total Amount</div>
                    <div className="text-white text-xl sm:text-2xl font-bold">$29,160</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="hidden sm:block absolute -top-4 -right-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600/90 backdrop-blur-sm text-white rounded-lg shadow-lg text-xs sm:text-sm font-semibold animate-bounce border border-emerald-500/30">
              Transaction confirmed ✓
            </div>
            <div className="hidden sm:block absolute -bottom-4 -left-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg shadow-lg text-xs sm:text-sm font-semibold border border-blue-500/30">
              $29,160 settled
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 sm:py-16 bg-slate-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-cyan-400 text-xs sm:text-sm font-semibold tracking-widest uppercase">Trusted by forward-thinking companies</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16">
            {[
              { label: 'Processed monthly', value: '$2.4M+' },
              { label: 'Global employees', value: '1,200+' },
              { label: 'Uptime SLA', value: '99.9%' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 sm:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 sm:mb-16">Traditional Payroll is Broken</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: Clock, title: '2-3 Day Settlement', desc: 'Wire transfers stuck in banking hours', color: 'from-red-500 to-orange-500' },
              { icon: TrendingDown, title: '5-8% in Fees', desc: 'Wise, PayPal, and banks take massive cuts', color: 'from-amber-500 to-yellow-500' },
              { icon: FileWarning, title: 'Manual Tax Hell', desc: 'Spreadsheets, errors, compliance nightmares', color: 'from-rose-500 to-pink-500' }
            ].map((problem, i) => (
              <div key={i} className="group p-6 sm:p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 hover:border-white/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center mb-4 sm:mb-6`}>
                  <problem.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{problem.title}</h3>
                <p className="text-slate-400 text-sm sm:text-base">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 sm:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-3 sm:mb-4">
            Meet Payve: Crypto Rails, Banking UX
          </h2>
          <p className="text-base sm:text-xl text-center text-slate-400 mb-8 sm:mb-16">
            Traditional finance experience powered by blockchain technology
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <div className="md:col-span-2 p-6 sm:p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Execute Global Payroll in One Click</h3>
              <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">Pay 1000 employees across 50 countries. Smart contracts handle distribution, compliance, and notifications.</p>
              
              {/* Real Dashboard Preview */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 sm:p-6 border border-white/10">
                {/* Top Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="text-blue-400 text-[10px] sm:text-xs font-semibold mb-1">TOTAL EMPLOYEES</div>
                    <div className="text-white text-xl sm:text-2xl font-bold">75</div>
                  </div>
                  <div className="p-3 sm:p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                    <div className="text-emerald-400 text-[10px] sm:text-xs font-semibold mb-1">MONTHLY PAYROLL</div>
                    <div className="text-white text-xl sm:text-2xl font-bold">$32.4K</div>
                  </div>
                  <div className="p-3 sm:p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                    <div className="text-cyan-400 text-[10px] sm:text-xs font-semibold mb-1">NEXT PAYMENT</div>
                    <div className="text-white text-xl sm:text-2xl font-bold">5 days</div>
                  </div>
                </div>

                {/* Employee List Preview */}
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-600/30 rounded-lg">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${
                        i === 1 ? 'from-blue-500 to-cyan-500' : 
                        i === 2 ? 'from-purple-500 to-pink-500' : 
                        'from-emerald-500 to-green-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs sm:text-sm font-medium">Employee {i}</div>
                        <div className="text-slate-400 text-[10px] sm:text-xs">Indonesia</div>
                      </div>
                      <div className="text-white font-semibold text-xs sm:text-sm">$520</div>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Execute Button Preview */}
                <button className="w-full mt-3 sm:mt-4 h-9 sm:h-10 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Execute Payroll
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">90% Lower Fees</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm sm:text-base">Wise / PayPal</span>
                  <span className="font-bold text-red-400 text-base sm:text-lg">$2,400</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm sm:text-base">Payve</span>
                  <span className="font-bold text-emerald-400 text-base sm:text-lg">$240</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Instant Settlement</h3>
              <p className="text-slate-400 mb-3 sm:mb-4 text-sm sm:text-base">Blockchain-powered transactions settle in seconds, not days</p>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm sm:text-base">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Real-time execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-12 sm:py-20 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 sm:mb-16">
            Built on Best-in-Class Web3 Infrastructure
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'Base L2', desc: 'Lightning-fast transactions', subdesc: 'Gas fees <$0.01', color: 'from-blue-500 to-cyan-500' },
              { name: 'OnchainKit', desc: 'Email login, no seed phrases', subdesc: 'Account Abstraction built-in', color: 'from-indigo-500 to-purple-500' },
              { name: 'IDRX Stablecoin', desc: 'Regulated Indonesian Rupiah', subdesc: 'Instant fiat on/off ramp', color: 'from-cyan-500 to-emerald-500' },
              { name: 'Smart Contracts', desc: 'Audited by OpenZeppelin', subdesc: 'Trustless automation', color: 'from-emerald-500 to-green-500' }
            ].map((tech, i) => (
              <div key={i} className="p-5 sm:p-6 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${tech.color} mb-3 sm:mb-4`}></div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">{tech.name}</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-1">{tech.desc}</p>
                <p className="text-slate-500 text-[10px] sm:text-xs">{tech.subdesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Ready to Transform Your Payroll?</h2>
          <p className="text-base sm:text-xl text-slate-300 mb-6 sm:mb-8">Join 500+ companies paying globally with Payve</p>
          <Button 
            onClick={() => onNavigate('authentication')}
            className="h-12 sm:h-14 px-8 sm:px-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto justify-center"
          >
            Start Free Trial
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
          </Button>
          <p className="text-slate-400 text-xs sm:text-sm mt-4 sm:mt-6">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-white mb-2">Payve</div>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8">Payve-ing the way for cross-border crypto payroll</p>
            <p className="text-slate-500 text-[10px] sm:text-xs">Built with ❤️ on Base • © 2026 Payve</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
