import { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { Button } from '@/app/components/ui/button';
import { Loader2, CheckCircle, Building2, Wallet, Zap, AlertCircle } from 'lucide-react';
import { usePayve } from '@/hooks/usePayve';
import { API_BASE_URL } from '@/constants';

interface InviteData {
  employee_name: string;
  employee_email: string;
  company_name: string;
  company_contract_address: string;
  position: string;
  department: string;
  monthly_salary_usd: string;
  secret: string;
  status: string;
}

interface InvitePageProps {
  onNavigate: (page: string) => void;
}

export function InvitePage({ onNavigate }: InvitePageProps) {
  // Parse URL params manually (no React Router needed)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const companyFromUrl = urlParams.get('company');

  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { claimInvite } = usePayve();

  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [step, setStep] = useState<'loading' | 'preview' | 'connect' | 'claiming' | 'success' | 'error'>('loading');

  // Fetch invite details
  useEffect(() => {
    const fetchInvite = async () => {
      if (!token) {
        setError('Invalid invite link');
        setStep('error');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/employees/invite/${token}`);
        const result = await response.json();

        if (!result.success) {
          setError(result.message || 'Invite not found or expired');
          setStep('error');
          return;
        }

        setInviteData(result.data);

        if (result.data.status === 'active') {
          setClaimed(true);
          setStep('success');
        } else {
          setStep('preview');
        }
      } catch (err) {
        setError('Failed to load invite');
        setStep('error');
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [token]);

  // Auto-proceed when wallet connected
  useEffect(() => {
    if (isConnected && step === 'connect') {
      handleClaim();
    }
  }, [isConnected, step]);

  const handleConnectWallet = () => {
    setStep('connect');
    // Trigger wallet connection
    const connector = connectors[0]; // Usually injected (MetaMask, Coinbase, etc.)
    if (connector) {
      connect({ connector });
    }
  };

  const handleClaim = async () => {
    if (!inviteData || !address || !token) return;

    setClaiming(true);
    setStep('claiming');

    try {
      const companyAddress = companyFromUrl || inviteData.company_contract_address;

      // Call smart contract claimInvite
      const txHash = await claimInvite(companyAddress, inviteData.secret);

      // Notify backend
      await fetch(`${API_BASE_URL}/api/employees/claim-complete?token=${token}&wallet_address=${address}`, {
        method: 'POST',
      });

      // Save employer address to localStorage for employee dashboard
      localStorage.setItem('payve_employer_address', companyAddress);

      setClaimed(true);
      setStep('success');
    } catch (err: any) {
      console.error('Claim failed:', err);
      setError(err.message || 'Failed to claim invite');
      setStep('error');
    } finally {
      setClaiming(false);
    }
  };

  // Loading state
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading invite...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Invite</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <Button
            onClick={() => onNavigate('landing')}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to Payve!</h1>
          <p className="text-slate-400 mb-2">You're now connected to</p>
          <p className="text-cyan-400 font-semibold text-lg mb-6">{inviteData?.company_name}</p>

          <div className="bg-slate-900/50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500">Position</span>
              <span className="text-white">{inviteData?.position || '-'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-500">Department</span>
              <span className="text-white">{inviteData?.department || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Salary</span>
              <span className="text-emerald-400 font-semibold">
                ${inviteData?.monthly_salary_usd ? Number(inviteData.monthly_salary_usd).toLocaleString() : '-'}/mo
              </span>
            </div>
          </div>

          <Button
            onClick={() => onNavigate('employee')}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-xl"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Claiming state
  if (step === 'claiming') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 max-w-md w-full text-center">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Connecting...</h1>
          <p className="text-slate-400">Please confirm the transaction in your wallet</p>
        </div>
      </div>
    );
  }

  // Preview / Connect state
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">You're Invited!</h1>
          <p className="text-slate-400 mt-2">Join the payroll system</p>
        </div>

        {/* Company Info */}
        <div className="bg-slate-900/50 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{inviteData?.company_name}</p>
              <p className="text-slate-400 text-sm">Inviting you to join</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Your Name</span>
              <span className="text-white">{inviteData?.employee_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Position</span>
              <span className="text-white">{inviteData?.position || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department</span>
              <span className="text-white">{inviteData?.department || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Monthly Salary</span>
              <span className="text-emerald-400 font-semibold">
                ${inviteData?.monthly_salary_usd ? Number(inviteData.monthly_salary_usd).toLocaleString() : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Connect Button */}
        {!isConnected ? (
          <Button
            onClick={handleConnectWallet}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet to Accept
          </Button>
        ) : (
          <Button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2"
          >
            {claiming ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Claiming...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Accept Invitation
              </>
            )}
          </Button>
        )}

        {isConnected && (
          <p className="text-center text-slate-500 text-sm mt-4">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        )}

        <p className="text-center text-slate-600 text-xs mt-6">
          By accepting, you'll link your wallet to receive payments via smart contract
        </p>
      </div>
    </div>
  );
}

export default InvitePage;
