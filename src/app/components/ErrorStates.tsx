import { X, AlertTriangle, AlertCircle, XCircle, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';

interface ErrorStatesProps {
  errorType: 'insufficient-balance' | 'transaction-failed' | 'network-mismatch' | '404' | null;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export function ErrorStates({ errorType, onClose, onNavigate }: ErrorStatesProps) {
  if (!errorType) return null;

  // 404 Page (Full Page)
  if (errorType === '404') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-slate-400 mb-8 text-lg">
            The page you're looking for doesn't exist
          </p>
          <Button 
            onClick={() => onNavigate?.('dashboard')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 h-12 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Modal Errors
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">
        {/* Insufficient Balance Error */}
        {errorType === 'insufficient-balance' && (
          <>
            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                  <XCircle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Insufficient IDRX Balance
                </h3>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-5 space-y-3 mb-6 border border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Your current balance</span>
                  <span className="font-mono text-white font-semibold">5,000,000 IDRX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Required for payroll</span>
                  <span className="font-mono text-white font-semibold">48,600,000 IDRX</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                  <span className="text-white font-semibold">Shortfall</span>
                  <div className="text-right">
                    <p className="font-mono text-red-400 font-bold">43,600,000 IDRX</p>
                    <p className="text-xs text-slate-500">~$2,800</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-4 flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10"
              >
                Cancel Payroll
              </Button>
              <Button 
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white h-11 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
              >
                Add Funds
              </Button>
            </div>
          </>
        )}

        {/* Transaction Failed Error */}
        {errorType === 'transaction-failed' && (
          <>
            <div className="p-6">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                  <XCircle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Transaction Failed
                </h3>
                <p className="text-slate-400">
                  The blockchain transaction could not be completed
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-xs text-red-300 font-mono">
                  Error: Insufficient gas fee
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-4 space-y-3">
              <Button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white h-11 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
              >
                Try Again
              </Button>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10"
                >
                  Contact Support
                </Button>
                <Button 
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1 text-slate-300 hover:text-white h-11 hover:bg-white/10"
                >
                  View Details
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Network Mismatch Error */}
        {errorType === 'network-mismatch' && (
          <>
            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
                  <AlertTriangle className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Wrong Network Detected
                </h3>
                <p className="text-slate-400">
                  Please switch to Base network
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-6">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-slate-300 font-semibold">Current network</span>
                  <span className="text-amber-300 font-mono">Ethereum Mainnet</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-semibold">Required network</span>
                  <span className="text-cyan-400 font-mono font-bold">Base L2</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-4 flex gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white h-11 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Switch to Base
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Wallet Not Connected Banner Component (to be used inline in pages)
export function WalletNotConnectedBanner({ onConnect }: { onConnect: () => void }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500/20 border-b border-amber-500/30 px-6 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-200 font-semibold">
            Wallet not connected. Connect your wallet to execute payroll.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={onConnect}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white h-8 text-xs rounded-lg font-semibold"
          >
            Connect Wallet
          </Button>
          <button 
            onClick={() => setDismissed(true)}
            className="text-amber-400 hover:text-amber-300 p-1 hover:bg-amber-500/20 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Expired Contract Alert Component (to be used inline in employee rows)
export function ExpiredContractAlert() {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-300 font-semibold mb-1">
          Contract expired on Dec 31, 2025
        </p>
        <p className="text-xs text-red-400">
          This employee cannot receive payroll
        </p>
      </div>
      <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold whitespace-nowrap">
        Update Contract →
      </a>
    </div>
  );
}
