import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PayrollProcessingProps {
  onNavigate: (page: string) => void;
}

export function PayrollProcessing({ onNavigate }: PayrollProcessingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Prepared employee data', status: 'done' as const },
    { label: 'Calculated transfer amounts', status: 'done' as const },
    { label: 'Sending transaction to blockchain', status: 'processing' as const },
    { label: 'Awaiting confirmation', status: 'waiting' as const },
    { label: 'Updating database', status: 'waiting' as const }
  ];

  useEffect(() => {
    // Simulate processing steps
    const timer1 = setTimeout(() => setCurrentStep(1), 2000);
    const timer2 = setTimeout(() => setCurrentStep(2), 4000);
    const timer3 = setTimeout(() => setCurrentStep(3), 6000);
    const timer4 = setTimeout(() => {
      onNavigate('payroll-success');
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onNavigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Loader */}
        <div className="mb-8">
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1E40AF] animate-spin"></div>
          </div>
        </div>

        {/* Status Text */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Processing Payroll
        </h1>
        <p className="text-gray-600 mb-12 text-sm">
          Please wait, do not close this window
        </p>

        {/* Progress Steps */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left space-y-3 border border-gray-200">
          {steps.map((step, index) => {
            let status = step.status;
            if (index < currentStep) status = 'done';
            else if (index === currentStep) status = 'processing';
            else status = 'waiting';

            return (
              <div key={index} className="flex items-start gap-3">
                {status === 'done' && (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                )}
                {status === 'processing' && (
                  <Loader2 className="w-4 h-4 text-[#1E40AF] flex-shrink-0 mt-0.5 animate-spin" />
                )}
                {status === 'waiting' && (
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                
                <span className={`text-sm ${
                  status === 'done' ? 'text-green-700' : 
                  status === 'processing' ? 'text-gray-900 font-medium' : 
                  'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Transaction Info */}
        {currentStep >= 2 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 animate-fade-in">
            <div className="text-sm space-y-2">
              <div>
                <span className="text-gray-600">Transaction Hash: </span>
                <a href="#" className="text-indigo-600 hover:underline font-mono text-xs">
                  0xabc123def456...
                </a>
              </div>
              <a 
                href="#" 
                className="text-indigo-600 hover:underline text-sm flex items-center justify-center gap-1"
              >
                View on BaseScan
              </a>
            </div>
          </div>
        )}

        {/* Estimated Time */}
        <div className="text-center text-sm">
          <p className="text-gray-900 font-medium mb-1">Estimated time: 10-30 seconds</p>
          <p className="text-gray-500 text-xs">Depends on Base network conditions</p>
        </div>
      </div>
    </div>
  );
}
