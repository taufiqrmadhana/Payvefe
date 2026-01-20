import { ArrowRight, Clock, Percent, FileText, Zap, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold text-gray-900 leading-tight">
                Instant Payroll for<br />Remote Teams
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Pay 1000 employees in 10 seconds with 90% lower fees
              </p>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => onNavigate('hr-dashboard')}
                  className="bg-[#1E40AF] hover:bg-[#1e3a8a] text-white px-8 py-6 text-base rounded-md"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-[#1E40AF] text-[#1E40AF] hover:bg-gray-50 px-8 py-6 text-base rounded-md"
                >
                  View Demo
                </Button>
              </div>

              <div className="flex gap-6 text-sm text-gray-500 pt-4">
                <span>Built on Base L2</span>
                <span>•</span>
                <span>IDRX Integrated</span>
              </div>
            </div>

            {/* Right: Dashboard Mockup */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-2 hover:rotate-0 transition-transform border border-gray-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">January 2026 Payroll</h3>
                    <span className="text-sm text-gray-500">75 employees</span>
                  </div>
                  
                  {[
                    { name: 'Anderson Smith', amount: '$430' },
                    { name: 'Blake Johnson', amount: '$520' },
                    { name: 'Casey Williams', amount: '$385' }
                  ].map((emp, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-700">{emp.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{emp.amount}</span>
                    </div>
                  ))}
                  
                  <Button className="w-full bg-[#1E40AF] hover:bg-[#1e3a8a] text-white py-3 rounded-md mt-4">
                    Execute Payroll
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            Current Payroll Pain Points
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">2-3 day settlement</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Traditional wire transfers take days to settle, delaying employee payments across borders.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                <Percent className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">5-8% transaction fees</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                High fees from PayPal, Wise, and Payoneer reduce take-home pay and increase costs.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Manual tax filing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Error-prone manual processes waste HR time and create compliance risks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            How GajiChain Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 h-48 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-sm w-full border border-gray-200">
                  <div className="text-xs text-gray-500 mb-2 uppercase">Step 1</div>
                  <Button className="w-full bg-[#1E40AF] text-white rounded-md text-sm">
                    Execute Payroll
                  </Button>
                  <div className="text-xs text-gray-500 mt-2">75 employees ready</div>
                </div>
              </div>
              <h3 className="text-base font-semibold mb-2 text-gray-900">One click, all employees paid</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                No manual transfers. Execute batch payments for entire team simultaneously.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 mb-4 h-48 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-sm w-full border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-700">Instant Transfer</span>
                  </div>
                  <div className="text-xs text-gray-500">Base Network</div>
                  <div className="text-xs font-mono text-gray-400 mt-1">0xabc1...def2</div>
                  <div className="mt-2 text-green-600 text-xs font-semibold">Confirmed</div>
                </div>
              </div>
              <h3 className="text-base font-semibold mb-2 text-gray-900">Instant via blockchain</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Transactions complete in seconds. No 2-3 day delays like traditional banks.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 mb-4 h-48 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-sm w-full border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Send className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-medium text-gray-700">Notification</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">January salary received</div>
                  <div className="text-base font-semibold text-gray-900 mt-1">$430</div>
                  <div className="text-xs text-green-600 mt-2">Deposited to wallet</div>
                </div>
              </div>
              <h3 className="text-base font-semibold mb-2 text-gray-900">Employees receive instantly</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Automatic notifications sent. Funds immediately available in IDRX wallet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            Technology Stack
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Base Layer 2</h3>
              <p className="text-sm text-gray-600">Low gas fees, high throughput</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">IDRX Stablecoin</h3>
              <p className="text-sm text-gray-600">Regulated Indonesian Rupiah</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Smart Contracts</h3>
              <p className="text-sm text-gray-600">Automated, trustless execution</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Account Abstraction</h3>
              <p className="text-sm text-gray-600">Email login, no seed phrases</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1E40AF] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-white mb-4">
            Ready to modernize your payroll
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            No credit card required. 14-day free trial.
          </p>
          <Button 
            onClick={() => onNavigate('hr-dashboard')}
            className="bg-white hover:bg-gray-100 text-[#1E40AF] px-12 py-6 text-base rounded-md"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-semibold text-white mb-2">GajiChain</div>
              <p className="text-sm">Modern payroll for remote teams</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Docs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Connect</h4>
              <div className="flex gap-4 text-sm">
                <a href="#" className="hover:text-white">GitHub</a>
                <a href="#" className="hover:text-white">Twitter</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2026 GajiChain. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
