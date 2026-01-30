import { CheckCircle, Mail, BarChart3, Share2, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';

interface PayrollSuccessProps {
  onNavigate: (page: string) => void;
}

export function PayrollSuccess({ onNavigate }: PayrollSuccessProps) {
  const [showDetails, setShowDetails] = useState(false);

  const employees = [
    { name: 'Anderson Smith', status: 'Received', amount: '$430' },
    { name: 'Blake Johnson', status: 'Received', amount: '$520' },
    { name: 'Casey Williams', status: 'Received', amount: '$385' },
    { name: 'Drew Martinez', status: 'Received', amount: '$460' },
    { name: 'Emerson Davis', status: 'Received', amount: '$490' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-scale-in">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Payroll Executed Successfully
          </h1>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 mb-8 text-center">
          <p className="text-lg text-gray-900 mb-2">
            <span className="font-semibold">75 employees</span> received payment
          </p>
          <p className="text-3xl font-semibold text-gray-900 mb-2">
            $29,160
          </p>
          <p className="text-sm text-gray-600">
            Executed: Jan 25, 2026 14:32 UTC
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-white border border-gray-200 rounded-lg mb-8 overflow-hidden">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900 text-sm">View Transaction Details</span>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
          
          {showDetails && (
            <div className="px-6 pb-6 space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transaction Hash</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-gray-900">0xabc123def456...</code>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Block Number</span>
                <span className="text-xs font-mono text-gray-900">#12345678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Gas Used</span>
                <span className="text-xs font-mono text-gray-900">0.0005 ETH</span>
              </div>
              <a 
                href="#" 
                className="flex items-center justify-end gap-1 text-sm text-indigo-600 hover:underline"
              >
                View on BaseScan
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2 text-sm">Email Notifications</h3>
            <p className="text-sm text-gray-600 mb-4">75 emails sent to employees</p>
            <a href="#" className="text-sm text-indigo-600 hover:underline">
              View Template
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2 text-sm">Export Report</h3>
            <p className="text-sm text-gray-600 mb-4">Download payslip and proof</p>
            <Button variant="outline" className="text-sm h-8">
              Download PDF
            </Button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2 text-sm">Share Transaction</h3>
            <p className="text-sm text-gray-600 mb-4">Send to team members</p>
            <Button variant="outline" className="text-sm h-8">
              Copy Link
            </Button>
          </div>
        </div>

        {/* Recipient Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="font-medium text-gray-900 mb-4 text-sm uppercase text-gray-600">Recipient Status</h3>
          
          <div className="space-y-2">
            {employees.map((emp, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-900">{emp.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-green-600 text-xs font-medium flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    {emp.status}
                  </span>
                  <span className="text-gray-600 font-mono text-xs">{emp.amount}</span>
                </div>
              </div>
            ))}
          </div>

          <a href="#" className="text-sm text-indigo-600 hover:underline mt-4 block text-center">
            View All Recipients
          </a>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            onClick={() => onNavigate('hr-dashboard')}
            className="bg-[#1E40AF] hover:bg-[#1e3a8a] text-white px-12 h-10"
          >
            Return to Dashboard
          </Button>
          <Button 
            onClick={() => onNavigate('payroll-execution')}
            variant="outline"
            className="px-12 h-10"
          >
            Execute Another Payroll
          </Button>
        </div>
      </div>
    </div>
  );
}
