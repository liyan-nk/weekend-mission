import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronRight, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import { MemberDrawer } from '../components/MemberDrawer';
import type { WeekendEntry } from '../../lib/db';

interface MembersProps {
  entries: WeekendEntry[];
  currentWeekendKey: string;
  loading: boolean;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const Members: React.FC<MembersProps> = ({ 
  entries, 
  currentWeekendKey, 
  loading,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Assigned' | 'Completed'>('all');
  const [weekendFilter, setWeekendFilter] = useState<'current' | 'all'>('current');
  const [selectedMember, setSelectedMember] = useState<WeekendEntry | null>(null);

  // Filter on keypress
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
    
    try {
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
      showToast('Member logs successfully exported to CSV', 'success');
    } catch (e) {
      console.error(e);
      showToast('CSV export failed', 'warning');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="space-y-6 max-w-6xl w-full flex-1 flex flex-col justify-start font-sans text-zinc-900 p-2"
    >
      {/* Title */}
      <div className="flex justify-between items-center select-none shrink-0">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 leading-none">Members</h2>
          <p className="text-xs text-zinc-505 font-bold mt-1 font-mono tracking-wide uppercase">Registry Database Audit</p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={loading || filteredEntries.length === 0}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border-2 border-zinc-900 hover:bg-zinc-50 active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(24,24,27,1)] disabled:opacity-50 text-[10px] font-bold text-zinc-900 uppercase rounded-lg transition-all cursor-pointer shadow-[2.5px_2.5px_0px_0px_rgba(24,24,27,1)]"
        >
          <Download className="w-3.5 h-3.5 text-zinc-900" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and search parameters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 select-none shrink-0 bg-white border-2 border-zinc-900 p-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(24,24,27,1)]">
        <div className="relative col-span-2">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            disabled={loading}
            placeholder="Search by display name or mission code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-[#fbfaf8] border border-zinc-900 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition font-bold"
          />
        </div>

        <div>
          <select
            disabled={loading}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-[#fbfaf8] border border-zinc-900 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition cursor-pointer font-bold"
          >
            <option value="all">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <select
            disabled={loading}
            value={weekendFilter}
            onChange={(e) => setWeekendFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-[#fbfaf8] border border-zinc-900 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition cursor-pointer font-bold"
          >
            <option value="current">Current Weekend ({currentWeekendKey})</option>
            <option value="all">All Weekends</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 min-h-[40vh] bg-white border-2 border-zinc-900 rounded-xl overflow-hidden flex flex-col justify-between shadow-[3.5px_3.5px_0px_0px_rgba(24,24,27,1)]">
        <div className="overflow-x-auto overflow-y-auto max-h-[52vh] flex-1">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-[#f5f3ee] border-b border-zinc-900 font-mono text-[9px] uppercase tracking-wider text-zinc-500 select-none sticky top-0 z-10 font-bold">
              <tr>
                <th className="px-6 py-3.5 border-r border-zinc-900/10">Display Name</th>
                <th className="px-6 py-3.5 border-r border-zinc-900/10">Mission Code</th>
                <th className="px-6 py-3.5 border-r border-zinc-900/10">Status</th>
                <th className="px-6 py-3.5 border-r border-zinc-900/10">Assigned Time</th>
                <th className="px-6 py-3.5 border-r border-zinc-900/10">Completed Time</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/40 font-sans font-bold text-zinc-800">
              {loading ? (
                /* Pulsing Row Skeletons */
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 border-r border-zinc-900/10"><div className="h-3.5 bg-zinc-200 rounded w-2/3"></div></td>
                    <td className="px-6 py-4 border-r border-zinc-900/10"><div className="h-3.5 bg-zinc-200 rounded w-1/2"></div></td>
                    <td className="px-6 py-4 border-r border-zinc-900/10"><div className="h-4 bg-zinc-200 rounded w-1/3"></div></td>
                    <td className="px-6 py-4 border-r border-zinc-900/10"><div className="h-3.5 bg-zinc-200 rounded w-3/4"></div></td>
                    <td className="px-6 py-4 border-r border-zinc-900/10"><div className="h-3.5 bg-zinc-200 rounded w-1/2"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-6 bg-zinc-200 rounded w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 font-bold select-none">
                    <div className="flex flex-col items-center justify-center">
                      <Inbox className="w-5 h-5 text-zinc-400 mb-2.5" />
                      <p className="text-xs text-zinc-550 max-w-xs leading-relaxed font-bold">No registry members matched your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((e) => (
                  <tr key={e.id} className="hover:bg-stone-50 transition duration-150">
                    <td className="px-6 py-4 border-r border-zinc-900/10 font-black text-zinc-900">{e.display_name}</td>
                    <td className="px-6 py-4 border-r border-zinc-900/10 font-mono text-zinc-800">{e.mission?.code || '—'}</td>
                    <td className="px-6 py-4 border-r border-zinc-900/10 select-none">
                      <span className={`px-2.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide uppercase border ${
                        e.status === 'Completed' 
                          ? 'bg-emerald-50 border-emerald-900 text-emerald-805' 
                          : 'bg-amber-50 border-amber-900 text-amber-805'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-zinc-900/10 text-zinc-650 font-mono font-semibold">
                      {new Date(e.assigned_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4 border-r border-zinc-900/10 text-zinc-650 font-mono font-semibold">
                      {e.completed_at 
                        ? new Date(e.completed_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-right select-none">
                      <button
                        onClick={() => setSelectedMember(e)}
                        className="px-2.5 py-1 bg-white border border-zinc-900 hover:bg-zinc-50 active:translate-y-[1px] active:shadow-none text-zinc-800 rounded transition cursor-pointer flex items-center gap-1 ml-auto text-[9px] font-mono font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <span>AUDIT</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info counts */}
        <div className="bg-[#f5f3ee] border-t border-zinc-900 px-6 py-3 flex justify-between items-center text-[9px] font-mono text-zinc-500 select-none shrink-0 font-bold">
          <span>SHOWING {filteredEntries.length} OF {entries.length} RECORDS</span>
          <span>W_KEY: {currentWeekendKey}</span>
        </div>
      </div>

      {/* Slide Drawer details sheet */}
      <MemberDrawer member={selectedMember} onClose={() => setSelectedMember(null)} />
    </motion.div>
  );
};
