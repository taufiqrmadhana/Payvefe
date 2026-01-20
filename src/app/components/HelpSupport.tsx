import { Search, MessageCircle, Book, Mail, Phone, FileText, ExternalLink, ChevronRight, Zap, HelpCircle, AlertCircle, Shield, DollarSign } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Sidebar } from '@/app/components/Sidebar';

interface HelpSupportProps {
  onNavigate: (page: string) => void;
}

export function HelpSupport({ onNavigate }: HelpSupportProps) {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar currentPage="help-support" onNavigate={onNavigate} />

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('dashboard')}
          className="text-slate-400 hover:text-white mb-8 text-sm flex items-center gap-2 transition-colors"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Help & Support</h1>
          <p className="text-slate-400 text-lg mb-8">Find answers and get help when you need it</p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search for help..." 
              className="h-14 pl-12 text-base bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/50"
            />
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Getting Started */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Book className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-white mb-4">Getting Started</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Adding Your First Employee →
              </a>
              <a href="#" className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Executing Your First Payroll →
              </a>
              <a href="#" className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Setting Up Bank Withdrawals →
              </a>
              <a href="#" className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Understanding IDRX →
              </a>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-white mb-4">Common Issues</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Transaction Failed →
              </a>
              <a href="#" className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Low Balance Error →
              </a>
              <a href="#" className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Withdrawal Delays →
              </a>
              <a href="#" className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Missing Transactions →
              </a>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-white mb-2">Contact Support</h3>
            <p className="text-sm text-slate-300 mb-4">Can't find what you're looking for?</p>
            <div className="space-y-2">
              <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
              <Button variant="outline" className="w-full h-11 border-white/20 text-white hover:bg-white/10 rounded-xl">
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-3">
            <div 
              className="bg-slate-700/30 rounded-xl border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-white pr-4">What is IDRX?</span>
                <ChevronRight className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              </button>
              <div className="px-5 pb-5 pt-0">
                <p className="text-slate-300 leading-relaxed">IDRX is a stablecoin pegged 1:1 to Indonesian Rupiah, making it easy to pay employees without currency volatility.</p>
              </div>
            </div>

            <div 
              className="bg-slate-700/30 rounded-xl border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-white pr-4">How long do withdrawals take?</span>
                <ChevronRight className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              </button>
              <div className="px-5 pb-5 pt-0">
                <p className="text-slate-300 leading-relaxed">Bank withdrawals typically complete within 5-10 minutes during business hours.</p>
              </div>
            </div>

            <div 
              className="bg-slate-700/30 rounded-xl border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-white pr-4">What fees does Payve charge?</span>
                <ChevronRight className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              </button>
              <div className="px-5 pb-5 pt-0">
                <p className="text-slate-300 leading-relaxed">We charge 0.5% per payroll execution. Employee withdrawals cost $0.50 each.</p>
              </div>
            </div>

            <div 
              className="bg-slate-700/30 rounded-xl border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-white pr-4">Is my money safe?</span>
                <ChevronRight className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              </button>
              <div className="px-5 pb-5 pt-0">
                <p className="text-slate-300 leading-relaxed">Yes. Funds are held in audited smart contracts on Base blockchain. We cannot access your funds.</p>
              </div>
            </div>

            <div 
              className="bg-slate-700/30 rounded-xl border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-white pr-4">Can I cancel a payroll after execution?</span>
                <ChevronRight className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              </button>
              <div className="px-5 pb-5 pt-0">
                <p className="text-slate-300 leading-relaxed">No, blockchain transactions are final. Always review the confirmation screen carefully before proceeding.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/30">
            <Zap className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Instant Payments</h4>
            <p className="text-sm text-slate-400">All payroll executes instantly on Base L2 blockchain</p>
          </div>

          <div className="p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <Shield className="w-8 h-8 text-emerald-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Secure & Safe</h4>
            <p className="text-sm text-slate-400">Your funds are protected by audited smart contracts</p>
          </div>

          <div className="p-6 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <DollarSign className="w-8 h-8 text-cyan-400 mb-3" />
            <h4 className="font-bold text-white mb-2">Low Fees</h4>
            <p className="text-sm text-slate-400">Only 0.5% per payroll execution, much lower than traditional</p>
          </div>
        </div>
      </div>
    </div>
  );
}