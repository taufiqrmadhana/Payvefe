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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Status */}
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Transaction Successful</h3>
            <p className="text-sm text-gray-600">Jan 25, 2026 14:32 UTC</p>
          </div>

          {/* Transaction Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase text-gray-600">Transaction Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Type</span>
                <span className="text-sm font-medium text-gray-900">Batch Payroll</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Employees</span>
                <span className="text-sm font-medium text-gray-900">75</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-100 pt-3">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-lg font-semibold text-gray-900">$29,160</span>
              </div>
            </div>
          </div>

          {/* Blockchain Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase text-gray-600">Blockchain Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Transaction Hash</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-gray-900">0xabc123def456...</code>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Block Number</span>
                <code className="text-sm font-mono text-gray-900">#12345678</code>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Network</span>
                <span className="text-sm font-medium text-gray-900">Base L2</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Gas Used</span>
                <span className="text-sm font-mono text-gray-900">0.0005 ETH ($1.23)</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Confirmed
                </span>
              </div>
            </div>

            <a 
              href="#" 
              className="flex items-center justify-end gap-2 text-sm text-indigo-600 hover:underline mt-4"
            >
              View on BaseScan
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Recipients List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowAllRecipients(!showAllRecipients)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 text-sm">Recipients (75)</span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showAllRecipients ? 'rotate-180' : ''}`} />
            </button>

            {showAllRecipients && (
              <div className="border-t border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Employee</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Wallet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.map((recipient, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="px-6 py-3 text-sm text-gray-900">{recipient.name}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{recipient.amount}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 text-green-700 text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Received
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs font-mono text-gray-600">{recipient.wallet}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase text-gray-600">Timeline</h4>
            <div className="space-y-4">
              {[
                { label: 'Transaction initiated', time: 'Jan 25, 14:32:15' },
                { label: 'Sent to blockchain', time: 'Jan 25, 14:32:18' },
                { label: 'Confirmed', time: 'Jan 25, 14:32:45' },
                { label: 'Employees notified', time: 'Jan 25, 14:33:02' }
              ].map((event, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    {i < 3 && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">{event.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-3 rounded-b-lg">
          <Button variant="outline" className="flex-1 h-10">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Button variant="outline" className="flex-1 h-10">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" className="flex-1 h-10">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
