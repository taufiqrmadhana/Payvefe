import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  FileText, 
  Bell, 
  LogOut,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useState } from 'react';
import { useDisconnect } from 'wagmi';

interface EmployeeListProps {
  onNavigate: (page: string) => void;
}

const employees = [
  { name: 'Anderson Smith', email: 'anderson@company.com', wallet: '0x1234...5678', salary: '$430', contract: 'Dec 31, 2026', status: 'Active', initial: 'AS' },
  { name: 'Blake Johnson', email: 'blake@company.com', wallet: '0x8765...4321', salary: '$520', contract: 'Feb 28, 2026', status: 'Expiring Soon', initial: 'BJ', warning: true },
  { name: 'Casey Williams', email: 'casey@company.com', wallet: '0xabcd...efgh', salary: '$385', contract: 'Jun 30, 2026', status: 'Active', initial: 'CW' },
  { name: 'Drew Martinez', email: 'drew@company.com', wallet: '0x9876...5432', salary: '$460', contract: 'May 15, 2026', status: 'Active', initial: 'DM' },
  { name: 'Emerson Davis', email: 'emerson@company.com', wallet: '0x1111...2222', salary: '$490', contract: 'Jul 20, 2026', status: 'Active', initial: 'ED' },
  { name: 'Finley Garcia', email: 'finley@company.com', wallet: '0x3333...4444', salary: '$425', contract: 'Aug 10, 2026', status: 'Active', initial: 'FG' },
  { name: 'Gray Anderson', email: 'gray@company.com', wallet: '0x5555...6666', salary: '$455', contract: 'Sep 25, 2026', status: 'Active', initial: 'GA' }
];

export function EmployeeList({ onNavigate }: EmployeeListProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring'>('all');
  const { disconnect } = useDisconnect();

  const handleLogout = () => {
    disconnect();
    onNavigate('landing');
  };

  const toggleEmployee = (index: number) => {
    if (selectedEmployees.includes(index)) {
      setSelectedEmployees(selectedEmployees.filter(i => i !== index));
    } else {
      setSelectedEmployees([...selectedEmployees, index]);
    }
  };

  const toggleAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((_, i) => i));
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="text-xl font-semibold text-[#1E40AF]">GajiChain</div>
        </div>

        <nav className="flex-1 px-3">
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('hr-dashboard');
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 mb-1"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </a>
          <a 
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md bg-indigo-50 text-[#6366F1] mb-1"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium text-sm">Employees</span>
          </a>
          <a 
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 mb-1"
          >
            <Wallet className="w-5 h-5" />
            <span className="text-sm">Payroll</span>
          </a>
          <a 
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 mb-1"
          >
            <FileText className="w-5 h-5" />
            <span className="text-sm">Reports</span>
          </a>
          <a 
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-gray-600 hover:bg-gray-50 mb-1"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </a>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-sm">
              AS
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">Admin</div>
              <div className="text-xs text-gray-500">Manager</div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Dashboard &gt; Employees</div>
            
            <div className="flex items-center gap-4">
              <button className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs font-mono text-gray-700">0x1234...5678</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search employees..."
                  className="pl-10 w-64 h-9 text-sm"
                />
              </div>
              <Button 
                onClick={() => onNavigate('add-employee')}
                className="bg-[#1E40AF] hover:bg-[#1e3a8a] text-white h-9 text-sm"
              >
                Add Employee
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1 border-b border-gray-200">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'text-[#1E40AF] border-b-2 border-[#1E40AF] -mb-px' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All (75)
              </button>
              <button 
                onClick={() => setFilter('active')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === 'active' 
                    ? 'text-[#1E40AF] border-b-2 border-[#1E40AF] -mb-px' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Active (68)
              </button>
              <button 
                onClick={() => setFilter('expiring')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === 'expiring' 
                    ? 'text-[#1E40AF] border-b-2 border-[#1E40AF] -mb-px' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Expiring (7)
              </button>
            </div>

            <select className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-600">
              <option>Sort by: Name A-Z</option>
              <option>Sort by: Name Z-A</option>
              <option>Sort by: Salary High-Low</option>
              <option>Sort by: Salary Low-High</option>
            </select>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left w-12">
                    <Checkbox 
                      checked={selectedEmployees.length === employees.length}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Wallet Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contract End</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-12">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Checkbox 
                        checked={selectedEmployees.includes(i)}
                        onCheckedChange={() => toggleEmployee(i)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-xs">
                          {emp.initial}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{emp.name}</div>
                          <div className="text-xs text-gray-500">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-xs text-gray-600 font-mono">{emp.wallet}</code>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-sm text-gray-900">{emp.salary}</span>
                      <span className="text-xs text-gray-500">/month</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-sm ${emp.warning ? 'text-amber-600' : 'text-gray-900'}`}>
                        {emp.contract}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {emp.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                          Expiring Soon
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing 1-10 of 75
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-gray-600 h-8 text-xs">
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-indigo-50 text-[#6366F1] border-indigo-200 h-8 w-8 p-0 text-xs">
                  1
                </Button>
                <Button variant="outline" size="sm" className="text-gray-600 h-8 w-8 p-0 text-xs">
                  2
                </Button>
                <Button variant="outline" size="sm" className="text-gray-600 h-8 w-8 p-0 text-xs">
                  3
                </Button>
                <span className="text-gray-400 text-xs">...</span>
                <Button variant="outline" size="sm" className="text-gray-600 h-8 w-8 p-0 text-xs">
                  8
                </Button>
                <Button variant="outline" size="sm" className="text-gray-600 h-8 text-xs">
                  Next
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Bar */}
      {selectedEmployees.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-lg px-6 py-4 border border-gray-200 flex items-center gap-6 z-50">
          <span className="text-sm font-medium text-gray-900">
            {selectedEmployees.length} selected
          </span>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => onNavigate('payroll-execution')}
              className="bg-[#1E40AF] hover:bg-[#1e3a8a] text-white h-9 text-sm"
            >
              Execute Payroll
            </Button>
            <Button variant="outline" className="h-9 text-sm">
              Export
            </Button>
            <Button variant="outline" className="text-red-600 hover:bg-red-50 h-9 text-sm">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
