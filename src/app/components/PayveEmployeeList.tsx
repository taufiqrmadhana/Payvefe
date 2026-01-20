import { Search, Filter, Download, Plus, Mail, MoreVertical, Calendar, DollarSign, MapPin, Clock, ChevronDown, CheckCircle, AlertCircle, XCircle, Zap } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Flag } from '@/app/components/ui/flag';
import { Sidebar } from '@/app/components/Sidebar';
import { useState } from 'react';

interface PayveEmployeeListProps {
  onNavigate: (page: string) => void;
}

export function PayveEmployeeList({ onNavigate }: PayveEmployeeListProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedEmployees.length === mockEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(mockEmployees.map(e => e.id));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar currentPage="employee-list" onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              {/* Left: Title */}
              <div>
                <h1 className="text-2xl font-bold text-white">Employees</h1>
                <p className="text-sm text-slate-400 mt-1">Manage your team and contracts</p>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => onNavigate('add-employee')}
                  className="h-11 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Employee
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* Action Bar */}
          <div className="flex items-center gap-3 mb-6">{/* Moved from header */}
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by name, email, wallet..."
                className="w-80 h-11 pl-12 pr-4 rounded-xl bg-slate-800/50 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all text-white placeholder:text-slate-400"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-slate-400 bg-slate-700 rounded border border-white/10">/</kbd>
            </div>

            {/* Filter */}
            <Button variant="outline" className="h-11 px-4 rounded-xl border-white/20 text-white hover:bg-white/10 bg-slate-800/50 backdrop-blur-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
              <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">3</span>
            </Button>

            {/* Export */}
            <Button variant="outline" className="h-11 px-4 rounded-xl border-white/20 text-white hover:bg-white/10 bg-slate-800/50 backdrop-blur-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex items-center gap-2 bg-slate-800/50 rounded-xl p-1 border border-white/10 inline-flex">{/* Added wrapper div */}
            {[
              { id: 'all', label: 'All', count: 75 },
              { id: 'active', label: 'Active', count: 68 },
              { id: 'expiring', label: 'Expiring Soon', count: 7 },
              { id: 'archived', label: 'Archived', count: 12 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab.id === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Average Salary', value: '$432' },
              { label: 'Total Monthly Cost', value: '$32,400' },
              { label: 'Newest', value: '5 this month' },
              { label: 'Avg Contract', value: '8.2 months' }
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all">
                <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-cyan-600 rounded bg-slate-700 border-white/20"
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Monthly Salary
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Contract End
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockEmployees.map((emp) => (
                    <tr 
                      key={emp.id} 
                      className="hover:bg-slate-700/30 transition-all group"
                    >
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedEmployees.includes(emp.id)}
                          onChange={() => toggleEmployee(emp.id)}
                          className="w-5 h-5 accent-cyan-600 rounded bg-slate-700 border-white/20"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-2">
                              {emp.name}
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="text-sm text-slate-400">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-white">${emp.salary}</div>
                        <div className="text-xs text-slate-500">/month</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`font-medium ${emp.status === 'Expiring Soon' ? 'text-amber-400' : 'text-white'}`}>
                          {emp.contract}
                        </div>
                        <div className="text-xs text-slate-500">{emp.days} days</div>
                        {/* Progress bar */}
                        <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              emp.status === 'Expiring Soon' 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            }`}
                            style={{ width: `${(emp.days / 365) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Flag country={emp.location as any} className="w-6 h-4" />
                          <span className="text-sm text-slate-300 capitalize">{emp.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          emp.status === 'Active' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                          }`}></div>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-slate-900/50">
              <div className="text-sm text-slate-400">
                Showing 1-5 of 75 employees
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-700/50 transition-all">
                  Previous
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/30">
                  1
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-700/50 transition-all">
                  2
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-700/50 transition-all">
                  3
                </button>
                <span className="px-2 text-slate-500">...</span>
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-700/50 transition-all">
                  8
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-slate-300 hover:bg-slate-700/50 transition-all">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar (shows when items selected) */}
          {selectedEmployees.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800/95 backdrop-blur-xl rounded-2xl px-8 py-4 shadow-2xl border border-cyan-500/30 flex items-center gap-6 z-50">
              <span className="text-white font-semibold">{selectedEmployees.length} employees selected</span>
              <div className="flex gap-3">
                <Button className="h-10 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold">
                  Execute Payroll
                </Button>
                <Button variant="outline" className="h-10 px-6 rounded-xl border-white/20 text-white hover:bg-white/10">
                  Export
                </Button>
                <Button variant="outline" className="h-10 px-6 rounded-xl border-white/20 text-white hover:bg-white/10">
                  Update Contracts
                </Button>
                <button 
                  onClick={() => setSelectedEmployees([])}
                  className="text-slate-400 hover:text-white px-3"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const mockEmployees = [
  { id: '1', name: 'Anderson Smith', email: 'anderson@company.com', salary: 432, contract: 'Dec 31, 2025', days: 240, location: 'indonesia', status: 'Active' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', salary: 520, contract: 'Nov 15, 2025', days: 195, location: 'philippines', status: 'Active' },
  { id: '3', name: 'Mike Chen', email: 'mike@company.com', salary: 380, contract: 'Feb 28, 2026', days: 15, location: 'vietnam', status: 'Expiring Soon' },
  { id: '4', name: 'Emma Wilson', email: 'emma@company.com', salary: 450, contract: 'Jan 20, 2026', days: 280, location: 'thailand', status: 'Active' },
  { id: '5', name: 'David Lee', email: 'david@company.com', salary: 490, contract: 'Mar 10, 2026', days: 320, location: 'malaysia', status: 'Active' },
];