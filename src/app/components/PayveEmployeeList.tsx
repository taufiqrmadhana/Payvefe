import { Search, Filter, Download, Plus, Mail, MoreVertical, Calendar, DollarSign, MapPin, Clock, ChevronDown, CheckCircle, AlertCircle, XCircle, Zap, Loader2, FileDown, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Flag } from '@/app/components/ui/flag';
import { Sidebar } from '@/app/components/Sidebar';
import { CompanyHeader } from '@/app/components/CompanyHeader';
import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { companyService } from '@/services/companyService';
import { employeeService } from '@/services/employeeService';
import { usePayve } from '@/hooks/usePayve';
import { API_BASE_URL } from '@/constants';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PayveEmployeeListProps {
  onNavigate: (page: string) => void;
}

function calculateDaysRemaining(dateString: string | null): number {
  if (!dateString) return 0;
  const end = new Date(dateString);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays; // Can be negative if expired
}

export function PayveEmployeeList({ onNavigate }: PayveEmployeeListProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const { address } = useAccount();
  const { getEmployeeList } = usePayve();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function fetchEmployees() {
      if (address) {
        try {
          const res = await companyService.getEmployees(address);
          if (res.success && Array.isArray(res.data)) {
            const mapped = res.data.map((e: any) => ({
              id: e.id,
              name: e.full_name,
              email: e.email,
              role: e.position,
              department: e.department,
              status: e.status === 'active' ? 'Active' : (e.status === 'invited' ? 'Invited' : e.status),
              salary: parseFloat(e.monthly_salary_usd || '0'),
              contract: e.contract_end_date ? new Date(e.contract_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Contract',
              days: calculateDaysRemaining(e.contract_end_date),
              location: e.location || 'Unknown',
              hiredDate: e.hired_at ? new Date(e.hired_at) : null
            }));
            setEmployees(mapped);
          }
        } catch (e) {
          console.error("Failed to fetch employees", e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, [address]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e.id));
    }
  };

  // Execute Payroll for selected employees
  const handleExecutePayroll = useCallback(() => {
    if (selectedEmployees.length === 0) return;

    // Store selected employee IDs in session storage for payroll confirmation page
    const selectedData = employees.filter(e => selectedEmployees.includes(e.id));
    sessionStorage.setItem('selectedEmployeesForPayroll', JSON.stringify(selectedData));

    onNavigate('payroll-execution');
  }, [selectedEmployees, employees, onNavigate]);

  // Export selected employees to PDF
  const handleExport = useCallback(() => {
    const selectedData = selectedEmployees.length > 0
      ? employees.filter(e => selectedEmployees.includes(e.id))
      : employees;

    // Create PDF document
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(15, 43, 72);
    doc.text('Employee Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total: ${selectedData.length} employees`, 14, 36);

    // Create table data
    const tableData = selectedData.map(emp => [
      emp.name,
      emp.email || '-',
      emp.department || '-',
      emp.role || '-',
      `$${emp.salary?.toLocaleString() || '0'}`,
      emp.status || '-'
    ]);

    // Add table
    autoTable(doc, {
      head: [['Name', 'Email', 'Department', 'Position', 'Salary', 'Status']],
      body: tableData,
      startY: 42,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [14, 165, 233], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // Save PDF
    doc.save(`employees_${new Date().toISOString().split('T')[0]}.pdf`);
  }, [selectedEmployees, employees]);

  // Update contracts (extend by 1 year)
  const [isUpdatingContracts, setIsUpdatingContracts] = useState(false);

  const handleUpdateContracts = useCallback(async () => {
    if (selectedEmployees.length === 0 || !address) return;

    const confirmed = window.confirm(
      `Are you sure you want to extend contracts for ${selectedEmployees.length} employee(s) by 1 year?`
    );

    if (!confirmed) return;

    setIsUpdatingContracts(true);

    try {
      const updatePromises = selectedEmployees.map(async (empId) => {
        const employee = employees.find(e => e.id === empId);
        if (!employee) return;

        // Calculate new contract end date (1 year from current end or from today)
        const currentEnd = employee.contract !== 'No Contract'
          ? new Date(employee.contract).getTime()
          : Date.now();
        const newEndDate = new Date(Math.max(currentEnd, Date.now()) + 365 * 24 * 60 * 60 * 1000);

        await employeeService.update(empId, {
          admin_wallet_address: address,
          contract_end_date: newEndDate.toISOString().split('T')[0]
        });
      });

      await Promise.all(updatePromises);

      alert(`Successfully extended contracts for ${selectedEmployees.length} employee(s)`);
      setSelectedEmployees([]);

      // Refresh employee list
      window.location.reload();
    } catch (err) {
      console.error('Failed to update contracts:', err);
      alert('Failed to update some contracts. Please try again.');
    } finally {
      setIsUpdatingContracts(false);
    }
  }, [selectedEmployees, employees, address]);

  // Sync employees from blockchain to backend
  const handleSyncFromChain = useCallback(async () => {
    if (!address) return;

    setIsSyncing(true);
    try {
      // 1. Get all employees from smart contract
      const chainEmployees = await getEmployeeList();

      if (chainEmployees.length === 0) {
        alert('No employees found on blockchain');
        return;
      }

      // 2. Send to backend for sync
      const response = await fetch(`${API_BASE_URL}/api/employees/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_wallet: address,
          employees: chainEmployees
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Synced ${result.data.synced} employees (${result.data.created} new, ${result.data.updated} updated)`);
        // Refresh the list
        window.location.reload();
      } else {
        alert('Sync failed: ' + (result.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Sync failed:', err);
      alert('Failed to sync from blockchain');
    } finally {
      setIsSyncing(false);
    }
  }, [address, getEmployeeList]);

  return (
    <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
      <Sidebar currentPage="employee-list" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto">
        <CompanyHeader
          title="Employees"
          subtitle="Manage your team and contracts"
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobile={isMobile}
          onNavigate={onNavigate}
          showNotifications={true}
        >
          <Button
            onClick={handleSyncFromChain}
            disabled={isSyncing}
            variant="outline"
            className="h-10 sm:h-11 px-4 rounded-xl border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 animate-spin sm:mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync from Chain'}</span>
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="h-10 sm:h-11 px-4 rounded-xl border-white/20 text-slate-300 hover:text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export All</span>
          </Button>
          <Button
            onClick={() => onNavigate('add-employee')}
            className="h-10 sm:h-11 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">Add Employee</span>
          </Button>
        </CompanyHeader>

        {/* Content Area */}
        <div className="p-4 sm:p-8">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, wallet..."
                className="w-full h-11 pl-12 pr-4 rounded-xl bg-slate-800/50 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all text-white placeholder:text-slate-400"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-slate-400 bg-slate-700 rounded border border-white/10 hidden sm:block">/</kbd>
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
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>

          {/* Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-xl p-1 border border-white/10 inline-flex min-w-max sm:min-w-0">{/* Added wrapper div */}
              {[
                { id: 'all', label: 'All', count: employees.length },
                { id: 'active', label: 'Active', count: employees.filter(e => e.status === 'Active').length },
                { id: 'expiring', label: 'Expiring Soon', count: employees.filter(e => e.days < 30).length },
                { id: 'archived', label: 'Archived', count: employees.filter(e => e.status === 'Inactive' || e.status === 'Archived').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Average Salary', value: `$${(employees.reduce((acc, e) => acc + (e.salary || 0), 0) / (employees.length || 1)).toLocaleString('en-US', { maximumFractionDigits: 0 })}` },
              { label: 'Total Monthly Cost', value: `$${employees.reduce((acc, e) => acc + (e.salary || 0), 0).toLocaleString()}` },
              { label: 'Newest', value: `${employees.filter(e => e.hiredDate && (new Date().getTime() - e.hiredDate.getTime()) / (1000 * 3600 * 24) < 30).length} this month` },
              { label: 'Avg Contract', value: `${((employees.reduce((acc, e) => acc + (e.days || 0), 0) / (employees.length || 1)) / 30).toFixed(1)} months` }
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
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                          <p>Loading employees...</p>
                        </div>
                      </td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No employees found. Add one to get started.
                      </td>
                    </tr>
                  ) : employees.map((emp) => (
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
                            className={`h-full rounded-full ${emp.status === 'Expiring Soon'
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
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${emp.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
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
                Showing {employees.length > 0 ? 1 : 0}-{Math.min(5, employees.length)} of {employees.length} employees
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
                <Button
                  onClick={handleExecutePayroll}
                  className="h-10 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Execute Payroll
                </Button>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="h-10 px-6 rounded-xl border-white/20 text-white hover:bg-white/10"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={handleUpdateContracts}
                  disabled={isUpdatingContracts}
                  variant="outline"
                  className="h-10 px-6 rounded-xl border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                >
                  {isUpdatingContracts ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
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
