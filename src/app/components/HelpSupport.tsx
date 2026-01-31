'use client';

import { 
  MessageCircle, Book, Mail, FileText, ChevronRight, Zap, 
  HelpCircle, AlertCircle, Shield, DollarSign, Clock, Search
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Sidebar } from '@/app/components/Sidebar';
import { CompanyHeader } from '@/app/components/CompanyHeader';
import { useState, useEffect } from 'react';

interface HelpSupportProps {
  onNavigate: (page: string) => void;
}

export function HelpSupport({ onNavigate }: HelpSupportProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const faqs = [
    { q: "What is IDRX?", a: "IDRX is a stablecoin pegged 1:1 to Indonesian Rupiah, making it easy to pay employees without currency volatility." },
    { q: "How long do withdrawals take?", a: "Bank withdrawals typically complete within 5-10 minutes during business hours via our off-ramp partners." },
    { q: "What fees does Payve charge?", a: "We charge 0.5% per payroll execution. Individual employee withdrawals have a flat fee of $0.50." },
    { q: "Is my money safe?", a: "Yes. Funds are held in non-custodial audited smart contracts on Base blockchain. Only you have authorization to distribute." },
    { q: "Can I cancel a payroll execution?", a: "No, blockchain transactions are immutable. Always review the batch confirmation screen before signing." }
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <Sidebar currentPage="help-support" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto relative">
        {/* BACKGROUND AURAS */}
        <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[10%] right-[5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <CompanyHeader 
          title="Support Center"
          subtitle="Documentation & Technical Assistance"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
        />

        <div className="p-6 sm:p-10 relative z-10 max-w-7xl mx-auto space-y-8">
          
          {/* TOP QUICK LINKS GRID */}
          <div className="grid md:grid-cols-3 gap-6">
            <SupportActionCard 
              icon={<Book className="text-blue-400" />} 
              title="Knowledge Base"
              links={[
                "Adding Your First Employee",
                "Executing Batch Payroll",
                "Setting Up Withdrawals"
              ]}
            />
            <SupportActionCard 
              icon={<AlertCircle className="text-amber-400" />} 
              title="Troubleshooting"
              links={[
                "Transaction Failed Issues",
                "Low Liquidity Warning",
                "Onboarding Delays"
              ]}
            />
            <div className="p-8 bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div>
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Live Assistance</h3>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-6">Response time: ~5 mins</p>
              </div>
              <div className="space-y-3">
                <Button className="w-full h-12 bg-white text-black hover:bg-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                  Start Live Chat
                </Button>
                <Button variant="outline" className="w-full h-12 bg-white/5 text-white border-white/10 hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                  Send Email
                </Button>
              </div>
            </div>
          </div>

          {/* FAQ SECTION */}
          <div className="bg-white/[0.02] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-blue-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight uppercase">Frequently Asked Questions</h2>
            </div>
            
            <div className="p-8 space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`rounded-2xl border transition-all duration-300 ${
                    expandedFaq === idx ? 'bg-white/[0.04] border-white/10 shadow-lg' : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left group"
                  >
                    <span className={`font-bold text-sm transition-colors ${expandedFaq === idx ? 'text-blue-400' : 'text-slate-300 group-hover:text-white'}`}>
                      {faq.q}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform duration-300 ${expandedFaq === idx ? 'rotate-90 text-blue-400' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${expandedFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-5 pt-0 text-sm text-slate-400 leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// SUB-COMPONENTS
function SupportActionCard({ icon, title, links }: { icon: any, title: string, links: string[] }) {
  return (
    <div className="p-8 bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-2xl hover:border-white/20 transition-all group">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">{title}</h3>
      <div className="space-y-4">
        {links.map((link, i) => (
          <a key={i} href="#" className="flex items-center justify-between text-xs font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors group/link">
            {link}
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
}

function InfoBar({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 ${color}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{desc}</p>
      </div>
    </div>
  );
}