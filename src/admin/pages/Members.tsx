import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronRight } from 'lucide-react';
import { MemberDrawer } from '../components/MemberDrawer';
import type { WeekendEntry } from '../../lib/db';

interface MembersProps {
  entries: WeekendEntry[];
  currentWeekendKey: string;
}

export const Members: React.FC<MembersProps> = ({ entries, currentWeekendKey }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Assigned' | 'Completed'>('all');
  const [weekendFilter, setWeekendFilter] = useState<'current' | 'all'>('current');
  const [selectedMember, setSelectedMember] = useState<WeekendEntry | null>(null);

  // Instant filtering on typing (no button required)
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const nameMatch = e.display_name.toLowerCase().includes(searchQuery.toLowerCase());
      const codeMatch = e.mission?.code.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      if (searchQuery && !nameMatch && !codeMatch) return false;

      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (weekendFilter === 'current' && e.weekend_key !== currentWeekendKey) return false;

      return true;
    });
  }, [entries, searchQuery, statusFilter, weekendFilter, currentWeekendKey]);

  const handleExportCSV = () => {
    if (filteredEntries.length === 0) return;
    
    const headers = ['Display Name', 'Mission Code', 'Status', 'Assigned At', 'Completed At', 'Submission'];
    const rows = filteredEntries.map((e) => [
      `"${e.display_name.replace(/"/g, '""')}"`,
      `"${e.mission?.code || ''}"`,
      `"${e.status}"`,
      `"${e.assigned_at}"`,
      `"${e.completed_at || ''}"`,
      `"${(e.proof_text || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `members_export_${weekendFilter === 'current' ? currentWeekendKey : 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl w-full flex-1 flex flex-col justify-start font-sans text-zinc-100">
      {/* Title */}
      <div className="flex justify-between items-center select-none shrink-0">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Members</h2>
          <p className="text-xs text-zinc-500 font-medium font-sans">Audit and filter participant logs.</p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredEntries.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-zinc-100 disabled:opacity-50 text-[10px] font-semibold text-zinc-300 uppercase rounded-lg transition cursor-pointer shadow-sm"
        >
          <Download className="w-3 h-3" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and search parameters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 select-none shrink-0 bg-zinc-900/10 p-3 rounded-xl border border-zinc-900">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-600" />
          <input
            type="text"
            placeholder="Search by display name or mission code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-650 transition"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-zinc-955 border border-zinc-850 rounded-lg text-xs text-zinc-350 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-650 transition cursor-pointer font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <select
            value={weekendFilter}
            onChange={(e) => setWeekendFilter(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-zinc-955 border border-zinc-850 rounded-lg text-xs text-zinc-350 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-zinc-650 transition cursor-pointer font-medium"
          >
            <option value="current">Current Weekend ({currentWeekendKey})</option>
            <option value="all">All Weekends</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 min-h-[40vh] bg-zinc-900/10 border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm">
        <div className="overflow-x-auto overflow-y-auto max-h-[52vh] flex-1">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-zinc-950/60 border-b border-zinc-850 font-mono text-[9px] uppercase tracking-wider text-zinc-550 select-none sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3">Display Name</th>
                <th className="px-6 py-3">Mission Code</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Assigned Time</th>
                <th className="px-6 py-3">Completed Time</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850/60 font-sans font-medium text-zinc-300">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-550 font-medium">
                    No matching members found.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((e) => (
                  <tr key={e.id} className="hover:bg-zinc-900/20 transition duration-150">
                    <td className="px-6 py-3 font-semibold text-zinc-200">{e.display_name}</td>
                    <td className="px-6 py-3 font-mono text-zinc-400 font-bold">{e.mission?.code || '—'}</td>
                    <td className="px-6 py-3 select-none">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide uppercase border ${
                        e.status === 'Completed' 
                          ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-400' 
                          : 'bg-amber-950/20 border-amber-900/30 text-amber-400'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-zinc-500 font-mono text-[10px]">
                      {new Date(e.assigned_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-3 text-zinc-500 font-mono text-[10px]">
                      {e.completed_at 
                        ? new Date(e.completed_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                        : '—'}
                    </td>
                    <td className="px-6 py-3 text-right select-none">
                      <button
                        onClick={() => setSelectedMember(e)}
                        className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition cursor-pointer flex items-center gap-1 ml-auto text-[9.5px] font-mono font-semibold"
                      >
                        <span>AUDIT</span>
                        <ChevronRight className="w-3 h-3 text-zinc-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info counts */}
        <div className="bg-zinc-950/30 border-t border-zinc-850/60 px-6 py-2.5 flex justify-between items-center text-[9px] font-mono text-zinc-550 select-none shrink-0">
          <span>SHOWING {filteredEntries.length} OF {entries.length} LOGS</span>
          <span>W_KEY: {currentWeekendKey}</span>
        </div>
      </div>

      {/* Side drawer detailed profile sheet */}
      <MemberDrawer member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
};
