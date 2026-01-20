import { X, HelpCircle, Calendar as CalendarIcon, Clipboard, UserPlus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';

interface AddEmployeeModalProps {
  onClose: () => void;
}

export function AddEmployeeModal({ onClose }: AddEmployeeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Employee</h2>
              <p className="text-sm text-slate-400 mt-0.5">Enter employee details to begin payroll</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase text-slate-400 font-semibold">Full Name *</Label>
            <Input 
              id="name"
              placeholder="e.g. Anderson Smith"
              className="h-12 rounded-xl bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase text-slate-400 font-semibold">Email Address *</Label>
            <Input 
              id="email"
              type="email"
              placeholder="anderson@company.com"
              className="h-12 rounded-xl bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
            />
            <p className="text-xs text-slate-500">Used for notifications</p>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="wallet" className="text-xs uppercase text-slate-400 font-semibold">Wallet Address (Base Network) *</Label>
              <div className="group relative">
                <HelpCircle className="w-4 h-4 text-slate-500 cursor-help" />
                <div className="invisible group-hover:visible absolute left-0 top-6 bg-slate-700 border border-white/20 text-white text-xs rounded-lg p-3 w-48 z-10 shadow-xl">
                  Base network address for receiving IDRX
                </div>
              </div>
            </div>
            <div className="relative">
              <Input 
                id="wallet"
                placeholder="0x..."
                className="h-12 rounded-xl bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 font-mono text-sm pr-12"
              />
              <Button 
                type="button"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg"
                title="Paste from clipboard"
              >
                <Clipboard className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position" className="text-xs uppercase text-slate-400 font-semibold">Position *</Label>
            <Input 
              id="position"
              placeholder="e.g. Software Engineer"
              className="h-12 rounded-xl bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
            />
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-xs uppercase text-slate-400 font-semibold">Monthly Salary (USD) *</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <Input 
                  id="salary"
                  type="number"
                  placeholder="4300"
                  className="h-12 rounded-xl bg-slate-700/50 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-500/50 pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary-idrx" className="text-xs uppercase text-slate-400 font-semibold">In IDRX</Label>
              <Input 
                id="salary-idrx"
                value="68,800,000 IDRX"
                disabled
                className="h-12 rounded-xl bg-slate-900/50 border-white/10 text-slate-400 font-mono text-sm"
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-xs uppercase text-slate-400 font-semibold">Country *</Label>
            <select 
              id="country"
              className="w-full h-12 px-4 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option className="bg-slate-800" value="">Select country</option>
              <option className="bg-slate-800" value="ID">🇮🇩 Indonesia</option>
              <option className="bg-slate-800" value="PH">🇵🇭 Philippines</option>
              <option className="bg-slate-800" value="VN">🇻🇳 Vietnam</option>
              <option className="bg-slate-800" value="TH">🇹🇭 Thailand</option>
              <option className="bg-slate-800" value="MY">🇲🇾 Malaysia</option>
            </select>
          </div>

          {/* Contract End Date */}
          <div className="space-y-2">
            <Label htmlFor="contract-end" className="text-xs uppercase text-slate-400 font-semibold">Contract End Date *</Label>
            <div className="relative">
              <Input 
                id="contract-end"
                type="date"
                className="h-12 rounded-xl bg-slate-700/50 border-white/10 text-white focus:border-cyan-500/50"
              />
              <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Send Invitation */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
            <Checkbox id="send-invitation" defaultChecked className="mt-0.5" />
            <label htmlFor="send-invitation" className="text-sm text-slate-300 cursor-pointer">
              Send invitation email to employee
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-900/50 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex gap-3 rounded-b-2xl">
          <Button 
            onClick={onClose}
            variant="outline"
            className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>
    </div>
  );
}
