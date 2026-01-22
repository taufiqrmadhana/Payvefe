import { X, CheckCircle, Copy, ExternalLink, Download, Share2, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';

interface TransactionDetailProps {
  onClose: () => void;
}

export function TransactionDetail({ onClose }: TransactionDetailProps) {
  const [showAllRecipients, setShowAllRecipients] = useState(false);

  const recipients = [
    { name: 'Anderson Smith', amount: '$430', wallet: '0x1234...5678' },
    { name: 'Blake Johnson', amount: '$520', wallet: '0x8765...4321' },
    { name: 'Casey Williams', amount: '$385', wallet: '0xabcd...efgh' },
    { name: 'Drew Martinez', amount: '$460', wallet: '0x9876...5432' },
    { name: 'Emerson Davis', amount: '$490', wallet: '0x1111...2222' }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Transaction Details</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Status */}
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full mb-4 border border-emerald-500/30">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Transaction Successful</h3>
            <p className="text-sm text-slate-400">Jan 25, 2026 14:32 UTC</p>
          </div>

          {/* Transaction Summary */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h4 className="font-bold text-white mb-4 text-xs uppercase text-slate-400 tracking-wide">Transaction Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-sm text-slate-400">Type</span>
                <span className="text-sm font-semibold text-white">Batch Payroll</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-slate-400">Employees</span>
                <span className="text-sm font-semibold text-white">75</span>
              </div>
              <div className="flex justify-between py-2 border-t border-white/10 pt-3">
                <span className="text-sm text-slate-400">Total Amount</span>
                <span className="text-lg font-bold text-white">$29,160</span>
              </div>
            </div>
          </div>

          {/* Blockchain Details */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h4 className="font-bold text-white mb-4 text-xs uppercase text-slate-400 tracking-wide">Blockchain Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-400">Transaction Hash</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-cyan-400">0xabc123def456...</code>
                  <button className="text-slate-400 hover:text-cyan-400 transition-colors p-1.5 hover:bg-white/10 rounded">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-slate-400">Block Number</span>
                <code className="text-sm font-mono text-white">#12345678</code>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-slate-400">Network</span>
                <span className="text-sm font-semibold text-white">Base L2</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-slate-400">Gas Used</span>
                <span className="text-sm font-mono text-white">0.0005 ETH ($1.23)</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-400">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/30">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  Confirmed
                </span>
              </div>
            </div>

            <a 
              href="#" 
              className="flex items-center justify-end gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors mt-4"
            >
              View on BaseScan
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Recipients List */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowAllRecipients(!showAllRecipients)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
            >
              <span className="font-bold text-white text-sm">Recipients (75)</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showAllRecipients ? 'rotate-180' : ''}`} />
            </button>

            {showAllRecipients && (
              <div className="border-t border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-slate-900/50">
                        <th className="text-left px-6 py-3 text-xs font-bold text-slate-300 uppercase tracking-wide">Employee</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-300 uppercase tracking-wide">Amount</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-300 uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-300 uppercase tracking-wide">Wallet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recipients.map((recipient, i) => (
                        <tr key={i} className="hover:bg-slate-700/30 transition-all">
                          <td className="px-6 py-3 text-sm text-white font-medium">{recipient.name}</td>
                          <td className="px-4 py-3 text-sm font-bold text-white">{recipient.amount}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                              <CheckCircle className="w-3 h-3" />
                              Received
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs font-mono text-cyan-400">{recipient.wallet}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h4 className="font-bold text-white mb-4 text-xs uppercase text-slate-400 tracking-wide">Timeline</h4>
            <div className="space-y-4">
              {[
                { label: 'Transaction initiated', time: 'Jan 25, 14:32:15' },
                { label: 'Sent to blockchain', time: 'Jan 25, 14:32:18' },
                { label: 'Confirmed', time: 'Jan 25, 14:32:45' },
                { label: 'Employees notified', time: 'Jan 25, 14:33:02' }
              ].map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
                    {i < 3 && <div className="w-0.5 h-full bg-white/10 mt-1"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-semibold text-white">{event.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-b-2xl">
          <Button 
            variant="outline" 
            className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10 bg-slate-800/50 backdrop-blur-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10 bg-slate-800/50 backdrop-blur-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all font-semibold"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
