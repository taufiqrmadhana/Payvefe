import { ArrowLeft, AlertTriangle, Lock } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useState } from 'react';

interface PayrollConfirmationProps {
  onNavigate: (page: string) => void;
}

export function PayrollConfirmation({ onNavigate }: PayrollConfirmationProps) {
  const [confirmed1, setConfirmed1] = useState(false);
  const [confirmed2, setConfirmed2] = useState(false);
  const [showAllEmployees, setShowAllEmployees] = useState(false);

  const employees = [
    { name: 'Anderson Smith', amount: '$430', initial: 'AS' },
    { name: 'Blake Johnson', amount: '$520', initial: 'BJ' },
    { name: 'Casey Williams', amount: '$385', initial: 'CW' },
    { name: 'Drew Martinez', amount: '$460', initial: 'DM' },
    { name: 'Emerson Davis', amount: '$490', initial: 'ED' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-5">
        <button 
          onClick={() => onNavigate('hr-dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
        
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1E40AF] text-white rounded-full flex items-center justify-center text-xs font-semibold">
              1
            </div>
            <span className="font-medium text-gray-900">Confirm Payroll Execution</span>
          </div>
          <div className="text-gray-400">of</div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs font-semibold">
              2
            </div>
            <span className="text-gray-500">Complete</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Summary Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">January 2026 Payroll</h2>
            <p className="text-sm text-gray-500 mt-1">Jan 25, 2026 14:30 UTC</p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Employees</span>
              <span className="text-sm font-medium text-gray-900">75</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Gross Payroll</span>
                <span className="text-sm font-medium text-gray-900">$32,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax Withholding (10%)</span>
                <span className="text-sm font-medium text-red-600">- $3,240</span>
              </div>
            </div>

            <div className="flex justify-between py-3 border-t-2 border-gray-900">
              <span className="text-base font-semibold text-gray-900">Net Transfer</span>
              <span className="text-xl font-semibold text-gray-900">$29,160</span>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Network</span>
              <span className="text-gray-900 font-medium">Base L2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Token</span>
              <span className="text-gray-900 font-medium">IDRX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated gas</span>
              <span className="text-gray-900 font-medium">~$0.50</span>
            </div>
          </div>
        </div>

        {/* Employee Preview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase text-gray-600">Recipients (75)</h3>
          
          <div className={`space-y-2 ${!showAllEmployees ? 'max-h-64 overflow-hidden' : ''}`}>
            {employees.map((emp, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-xs">
                    {emp.initial}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{emp.amount}</span>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setShowAllEmployees(!showAllEmployees)}
            className="text-sm text-indigo-600 hover:underline mt-4 w-full text-center py-2"
          >
            {showAllEmployees ? 'Hide' : 'Show 70 more'}
          </button>
        </div>

        {/* Verification */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="text-amber-900 font-medium">
                Verify IDRX balance: 48,600,000 required
              </p>
              <p className="text-green-700 font-medium">
                Current balance: 52,000,000 IDRX
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Checkboxes */}
        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="confirm1" 
              checked={confirmed1}
              onCheckedChange={(checked) => setConfirmed1(checked as boolean)}
              className="mt-0.5"
            />
            <label htmlFor="confirm1" className="text-sm text-gray-700 cursor-pointer">
              I have verified employee data
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="confirm2"
              checked={confirmed2}
              onCheckedChange={(checked) => setConfirmed2(checked as boolean)}
              className="mt-0.5"
            />
            <label htmlFor="confirm2" className="text-sm text-gray-700 cursor-pointer">
              I understand blockchain transactions are irreversible
            </label>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Transaction executed via smart contract
          </p>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => onNavigate('hr-dashboard')}
              className="px-6 h-9"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => onNavigate('payroll-processing')}
              disabled={!confirmed1 || !confirmed2}
              className="bg-[#1E40AF] hover:bg-[#1e3a8a] text-white px-6 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4 mr-2" />
              Execute Payroll
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
