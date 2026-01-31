'use client';

import { Search, Filter, Download, Plus, MoreVertical, Calendar, Landmark, Clock, CheckCircle, XCircle, Zap, Loader2, RefreshCw, FileDown, Users } from 'lucide-react';
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
  return diffDays;
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
  const [isUpdatingContracts, setIsUpdatingContracts] = useState(false);

  // LOGIK DATA TETAP SAMA
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
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(e => e.id));
    }
  };

  const handleExecutePayroll = useCallback(() => {
    if (selectedEmployees.length === 0) return;
    const selectedData = employees.filter(e => selectedEmployees.includes(e.id));
    sessionStorage.setItem('selectedEmployeesForPayroll', JSON.stringify(selectedData));
    onNavigate('payroll-execution');
  }, [selectedEmployees, employees, onNavigate]);

  const handleExport = useCallback(() => {
    const selectedData = selectedEmployees.length > 0 ? employees.filter(e => selectedEmployees.includes(e.id)) : employees;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(15, 43, 72);
    doc.text('Employee Report', 14, 22);
    const tableData = selectedData.map(emp => [emp.name, emp.email || '-', emp.department || '-', emp.role || '-', `$${emp.salary?.toLocaleString() || '0'}`, emp.status || '-']);
    autoTable(doc, {
      head: [['Name', 'Email', 'Department', 'Position', 'Salary', 'Status']],
      body: tableData,
      startY: 42,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    });
    doc.save(`employees_${new Date().toISOString().split('T')[0]}.pdf`);
  }, [selectedEmployees, employees]);

  const handleUpdateContracts = useCallback(async () => {
    if (selectedEmployees.length === 0 || !address) return;
    const confirmed = window.confirm(`Extend contracts for ${selectedEmployees.length} employee(s) by 1 year?`);
    if (!confirmed) return;
    setIsUpdatingContracts(true);
    try {
      await Promise.all(selectedEmployees.map(async (empId) => {
        const employee = employees.find(e => e.id === empId);
        if (!employee) return;
        const currentEnd = employee.contract !== 'No Contract' ? new Date(employee.contract).getTime() : Date.now();
        const newEndDate = new Date(Math.max(currentEnd, Date.now()) + 365 * 24 * 60 * 60 * 1000);
        await employeeService.update(empId, { admin_wallet_address: address, contract_end_date: newEndDate.toISOString().split('T')[0] });
      }));
      window.location.reload();
    } catch (err) {
      alert('Failed to update some contracts.');
    } finally {
      setIsUpdatingContracts(false);
    }
  }, [selectedEmployees, employees, address]);

  const handleSyncFromChain = useCallback(async () => {
    if (!address) return;
    setIsSyncing(true);
    try {
      const chainEmployees = await getEmployeeList();
      if (chainEmployees.length === 0) {
        alert('No employees found on blockchain');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/employees/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_wallet: address, employees: chainEmployees })
      });
      const result = await response.json();
      if (result.success) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  }, [address, getEmployeeList]);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden">
      <Sidebar currentPage="employee-list" onNavigate={onNavigate} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto relative">
        {/* BACKGROUND AURAS */}
        <div className="fixed top-[-5%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[10%] left-[10%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <CompanyHeader title="Workforce" subtitle="Global Talent Registry" isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} isMobile={isMobile} onNavigate={onNavigate}>
          <div className="flex items-center gap-2">
            <Button onClick={handleSyncFromChain} disabled={isSyncing} variant="outline" className="h-10 px-4 rounded-xl border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Sync
            </Button>
            <Button onClick={() => onNavigate('add-employee')} className="h-10 px-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> <span className="text-[10px] uppercase tracking-widest">Add Member</span>
            </Button>
          </div>
        </CompanyHeader>

        <div className="p-6 sm:p-10 relative z-10 max-w-7xl mx-auto space-y-6">
          
          {/* ANALYTICS STRIP - MENGGUNAKAN DATA DINAMIS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox label="Avg Salary" val={`$${(employees.reduce((acc, e) => acc + (e.salary || 0), 0) / (employees.length || 1)).toLocaleString('en-US', { maximumFractionDigits: 0 })}`} icon={<Landmark className="text-blue-400" />} />
            <StatBox label="Monthly Cost" val={`$${employees.reduce((acc, e) => acc + (e.salary || 0), 0).toLocaleString()}`} icon={<Clock className="text-emerald-400" />} />
            <StatBox label="Expiring" val={String(employees.filter(e => e.days < 30).length)} icon={<Calendar className="text-amber-400" />} />
            <StatBox label="Avg Tenure" val={`${((employees.reduce((acc, e) => acc + (e.days || 0), 0) / (employees.length || 1)) / 30).toFixed(1)}m`} icon={<Users className="text-purple-400" />} />
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white/[0.02] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
             {/* SEARCH & TAB BAR */}
             <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    {['all', 'active', 'expiring'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                            {t}
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input placeholder="SEARCH..." className="w-full h-9 bg-black/20 border border-white/5 rounded-lg pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none focus:border-blue-500/50" />
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="px-6 py-5 text-left w-10">
                        <input type="checkbox" className="w-4 h-4 rounded bg-slate-900 border-white/20 accent-blue-600" onChange={toggleAll} checked={selectedEmployees.length === employees.length && employees.length > 0} />
                      </th>
                      <th className="px-4 py-5 text-left">Member</th>
                      <th className="px-4 py-5 text-left">Salary</th>
                      <th className="px-4 py-5 text-left">Contract</th>
                      <th className="px-4 py-5 text-left">Location</th>
                      <th className="px-4 py-5 text-left">Status</th>
                      <th className="px-4 py-5 text-right pr-8">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                       <tr><td colSpan={7} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" /><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Syncing Records...</p></td></tr>
                    ) : employees.length === 0 ? (
                       <tr><td colSpan={7} className="py-20 text-center text-[10px] font-bold uppercase tracking-widest text-slate-600">No On-Chain Records Found</td></tr>
                    ) : employees.filter(e => activeTab === 'all' || (activeTab === 'active' && e.status === 'Active') || (activeTab === 'expiring' && e.days < 30)).map((emp) => (
                      <tr key={emp.id} className="hover:bg-white/[0.04] transition-all group">
                        <td className="px-6 py-4">
                          <input type="checkbox" checked={selectedEmployees.includes(emp.id)} onChange={() => toggleEmployee(emp.id)} className="w-4 h-4 rounded border-white/20 bg-slate-900 accent-blue-600" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner">{emp.name.charAt(0)}</div>
                            <div>
                                <div className="text-sm font-bold text-white tracking-tight">{emp.name}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{emp.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                            <div className="text-sm font-bold text-white tracking-tight">${emp.salary.toLocaleString()}</div>
                            <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{emp.role || 'Personnel'}</div>
                        </td>
                        <td className="px-4 py-4">
                            <div className={`text-[10px] font-bold mb-1.5 ${emp.days < 30 ? 'text-amber-400' : 'text-slate-300'}`}>{emp.contract}</div>
                            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${emp.days < 30 ? 'bg-amber-500' : 'bg-blue-600'}`} style={{ width: `${Math.min((emp.days / 365) * 100, 100)}%` }} />
                            </div>
                        </td>
                        <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                                <Flag country={emp.location.toLowerCase() as any} className="w-4 h-3 rounded-sm opacity-60" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{emp.location}</span>
                            </div>
                        </td>
                        <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                                <div className={`w-1 h-1 rounded-full ${emp.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                                {emp.status}
                            </span>
                        </td>
                        <td className="px-4 py-4 text-right pr-8">
                           <button className="p-2 hover:bg-white/5 rounded-lg text-slate-600 hover:text-white transition-all"><MoreVertical className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          {/* FLOATING ACTION BAR */}
          {selectedEmployees.length > 0 && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#0B0F1A]/90 backdrop-blur-3xl rounded-[2rem] px-8 py-4 shadow-2xl border border-blue-500/30 flex items-center gap-8 z-50 animate-in slide-in-from-bottom-10 duration-500">
               <span className="text-[11px] font-black text-white uppercase tracking-widest">{selectedEmployees.length} MEMBERS SELECTED</span>
               <div className="h-6 w-px bg-white/10" />
               <div className="flex gap-2">
                  <Button onClick={handleExecutePayroll} className="h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20">Execute Run</Button>
                  <Button onClick={handleUpdateContracts} disabled={isUpdatingContracts} variant="outline" className="h-10 px-6 rounded-xl border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5">
                    {isUpdatingContracts ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Extend Contracts'}
                  </Button>
                  <Button onClick={handleExport} variant="outline" className="h-10 px-4 rounded-xl border-white/10 text-white hover:bg-white/5"><FileDown className="w-4 h-4" /></Button>
                  <button onClick={() => setSelectedEmployees([])} className="ml-2 text-slate-500 hover:text-white"><XCircle className="w-5 h-5" /></button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatBox({ label, val, icon }: { label: string, val: string, icon: any }) {
  return (
    <div className="p-5 bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/5 hover:border-white/20 transition-all flex items-center gap-4 group shadow-xl">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <div>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-base font-bold text-white tracking-tight">{val}</p>
      </div>
    </div>
  );
}