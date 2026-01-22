import { User, Mail, MapPin, Calendar, Shield, Edit, Check, FileText, Download, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { EmployeeSidebar } from '@/app/components/EmployeeSidebar';

interface EmployeeProfileProps {
  onNavigate: (page: string) => void;
}

export function EmployeeProfile({ onNavigate }: EmployeeProfileProps) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <EmployeeSidebar currentPage="profile" onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">My Profile</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage your personal information</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-2xl border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-4xl sm:text-5xl shadow-2xl border-4 border-white/30">
                AS
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Alex Smith</h2>
                <p className="text-lg sm:text-xl text-white/90 mb-3">Software Engineer</p>
                <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                  <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm text-white font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Verified
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-500/30 backdrop-blur-sm rounded-lg text-sm text-white font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Active Contract
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-4 sm:p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Personal Information</h3>
                  <Button variant="outline" className="h-9 px-4 rounded-xl border-white/20 text-white hover:bg-white/10 text-sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">First Name</Label>
                      <Input 
                        defaultValue="Alex"
                        className="h-11 bg-slate-700/50 border-white/10 text-white rounded-xl"
                        disabled
                      />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Last Name</Label>
                      <Input 
                        defaultValue="Smith"
                        className="h-11 bg-slate-700/50 border-white/10 text-white rounded-xl"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input 
                        defaultValue="alex@company.com"
                        className="h-11 pl-12 bg-slate-700/50 border-white/10 text-white rounded-xl"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Position</Label>
                      <Input 
                        defaultValue="Software Engineer"
                        className="h-11 bg-slate-700/50 border-white/10 text-white rounded-xl"
                        disabled
                      />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Department</Label>
                      <Input 
                        defaultValue="Engineering"
                        className="h-11 bg-slate-700/50 border-white/10 text-white rounded-xl"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs uppercase text-slate-400 font-semibold mb-2 block">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input 
                        defaultValue="Jakarta, Indonesia"
                        className="h-11 pl-12 bg-slate-700/50 border-white/10 text-white rounded-xl"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="p-4 sm:p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Employment Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold">Start Date</p>
                        <p className="text-lg font-bold text-white">Jan 15, 2024</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-700/30 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold">Contract End</p>
                        <p className="text-lg font-bold text-white">Dec 31, 2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Wallet Info */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-cyan-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Wallet Balance</h4>
                    <p className="text-xs text-slate-400">IDRX Stablecoin</p>
                  </div>
                </div>
                
                <div className="text-center py-4">
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">$430.00</p>
                  <p className="text-sm text-slate-400">6,880,000 IDRX</p>
                </div>

                <Button 
                  onClick={() => onNavigate('withdraw-modal')}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all"
                >
                  Withdraw to Bank
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="p-4 sm:p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10">
                <h4 className="font-bold text-white mb-4">Quick Actions</h4>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => onNavigate('payroll-history')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all border border-white/10 text-left"
                  >
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">View Payslips</p>
                      <p className="text-xs text-slate-400">Download history</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all border border-white/10 text-left">
                    <Download className="w-5 h-5 text-emerald-400" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">Tax Documents</p>
                      <p className="text-xs text-slate-400">W-2, 1099 forms</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all border border-white/10 text-left">
                    <ExternalLink className="w-5 h-5 text-purple-400" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">View Contract</p>
                      <p className="text-xs text-slate-400">Employment agreement</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
