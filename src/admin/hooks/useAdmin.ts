import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  getAllEntriesForAdmin, 
  getAllMissionsForAdmin, 
  toggleMissionActiveAdmin, 
  getWeekendOverrideAdmin, 
  setWeekendOverrideAdmin,
  type WeekendEntry,
  type Mission
} from '../../lib/db';
import { useWeekendStatus } from '../../hooks/useWeekendStatus';

export interface AttentionItem {
  type: 'UNCOMPLETED' | 'INACTIVE_MISSIONS' | 'ZERO_COMPLETIONS' | 'OVERRIDE_ENABLED' | 'DUPLICATE_NAME';
  title: string;
  subtitle: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export function useAdmin() {
  const [entries, setEntries] = useState<WeekendEntry[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentOverride, setCurrentOverride] = useState<'automatic' | 'force-open' | 'force-closed'>('automatic');
  const [localDevForce, setLocalDevForce] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const weekendStatus = useWeekendStatus();

  // Toast Notification handler
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Load Admin Data from DB
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [allEntries, allMissions, overrideVal] = await Promise.all([
        getAllEntriesForAdmin(),
        getAllMissionsForAdmin(),
        getWeekendOverrideAdmin()
      ]);
      
      setEntries(allEntries);
      setMissions(allMissions);
      setCurrentOverride(overrideVal);
      setLocalDevForce(localStorage.getItem('WM_DEBUG_FORCE_WEEKEND') === 'true');
    } catch (e) {
      console.error('Failed to load admin stats:', e);
      showToast('Connection error: could not sync latest logs', 'warning');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();

    // Auto-refresh Dashboard feed every 20 seconds
    const refreshTimer = setInterval(() => {
      setRefreshing(true);
      loadData(true);
    }, 20000);

    return () => clearInterval(refreshTimer);
  }, [loadData]);

  // Compute Current Weekend Summary Metrics
  const stats = useMemo(() => {
    const currentWeekendEntries = entries.filter(e => e.weekend_key === weekendStatus.weekendKey);
    const assignedCount = currentWeekendEntries.length;
    const completedCount = currentWeekendEntries.filter(e => e.status === 'Completed').length;
    const completionRate = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0;
    const uniqueParticipants = new Set(currentWeekendEntries.map(e => e.device_id)).size;

    return {
      assignedCount,
      completedCount,
      completionRate,
      uniqueParticipants
    };
  }, [entries, weekendStatus.weekendKey]);

  // Compute Mission Analytics (Times Assigned, Completion Rate per mission)
  const missionAnalytics = useMemo(() => {
    const analyticsMap: { [code: string]: { assigned: number; completed: number } } = {};
    
    entries.forEach((e) => {
      if (e.mission) {
        if (!analyticsMap[e.mission.code]) {
          analyticsMap[e.mission.code] = { assigned: 0, completed: 0 };
        }
        analyticsMap[e.mission.code].assigned += 1;
        if (e.status === 'Completed') {
          analyticsMap[e.mission.code].completed += 1;
        }
      }
    });

    return analyticsMap;
  }, [entries]);

  // Compute Ranked Insights (Most/Least assigned, averages)
  const insights = useMemo(() => {
    const countsList = missions.map((m) => {
      const analytics = missionAnalytics[m.code] || { assigned: 0, completed: 0 };
      return {
        code: m.code,
        title: m.title,
        count: analytics.assigned,
        completed: analytics.completed,
        rate: analytics.assigned > 0 ? Math.round((analytics.completed / analytics.assigned) * 100) : 0
      };
    });

    const spunList = countsList.filter(item => item.count > 0);
    const mostAssigned = [...spunList].sort((a, b) => b.count - a.count).slice(0, 5);
    const leastAssigned = [...spunList].sort((a, b) => a.count - b.count).slice(0, 5);

    let totalMs = 0;
    let completedWithTime = 0;
    entries.forEach((e) => {
      if (e.status === 'Completed' && e.completed_at) {
        const diff = new Date(e.completed_at).getTime() - new Date(e.assigned_at).getTime();
        if (diff > 0) {
          totalMs += diff;
          completedWithTime += 1;
        }
      }
    });

    const averageTime = completedWithTime > 0 
      ? Math.round(totalMs / completedWithTime / 1000 / 60) // in minutes
      : 0;

    return {
      mostAssigned,
      leastAssigned,
      averageTime
    };
  }, [entries, missions, missionAnalytics]);

  // Needs Attention Section
  const needsAttentionList = useMemo((): AttentionItem[] => {
    const list: AttentionItem[] = [];
    const currentWeekendEntries = entries.filter(e => e.weekend_key === weekendStatus.weekendKey);

    const incompleteMembers = currentWeekendEntries.filter(e => e.status === 'Assigned');
    incompleteMembers.forEach((u) => {
      list.push({
        type: 'UNCOMPLETED',
        title: `${u.display_name} has not finished`,
        subtitle: `Assigned: ${u.mission?.code} at ${new Date(u.assigned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });
    });

    if (currentOverride !== 'automatic') {
      list.push({
        type: 'OVERRIDE_ENABLED',
        title: `Weekend override is manually set to: ${currentOverride.toUpperCase()}`,
        subtitle: 'System is not checking standard Saturday/Sunday calendar timing'
      });
    }

    if (currentWeekendEntries.length > 0 && stats.completedCount === 0) {
      list.push({
        type: 'ZERO_COMPLETIONS',
        title: 'Zero completions this weekend',
        subtitle: `${stats.assignedCount} members spun but no proof has been uploaded yet`
      });
    }

    const disabledCount = missions.filter(m => !m.active).length;
    if (disabledCount > 0) {
      list.push({
        type: 'INACTIVE_MISSIONS',
        title: `${disabledCount} disabled missions`,
        subtitle: 'Some library options are temporarily excluded from rolls'
      });
    }

    const names = currentWeekendEntries.map(e => e.display_name.trim().toLowerCase());
    const duplicates = names.filter((name, idx) => names.indexOf(name) !== idx);
    const uniqueDupes = Array.from(new Set(duplicates));
    uniqueDupes.forEach((dName) => {
      list.push({
        type: 'DUPLICATE_NAME',
        title: `Duplicate name alert: "${dName}"`,
        subtitle: 'Multiple device entries recorded with this identity'
      });
    });

    return list;
  }, [entries, missions, currentOverride, stats, weekendStatus.weekendKey]);

  // Operations
  const toggleMissionActive = async (missionId: number, currentActive: boolean) => {
    try {
      await toggleMissionActiveAdmin(missionId, !currentActive);
      const allMissions = await getAllMissionsForAdmin();
      setMissions(allMissions);
      showToast(`Mission active status successfully ${!currentActive ? 'enabled' : 'disabled'}`, 'success');
    } catch (e) {
      console.error('Failed to toggle mission active:', e);
      showToast('Failed to update mission status', 'warning');
    }
  };

  const handleOverrideChange = async (val: 'automatic' | 'force-open' | 'force-closed') => {
    try {
      await setWeekendOverrideAdmin(val);
      setCurrentOverride(val);
      showToast(`Global weekend override updated to ${val.toUpperCase()}`, 'success');
    } catch (e) {
      console.error('Failed to change weekend override:', e);
      showToast('Failed to save override settings', 'warning');
    }
  };

  const handleLocalForceToggle = (checked: boolean) => {
    if (checked) {
      localStorage.setItem('WM_DEBUG_FORCE_WEEKEND', 'true');
      setLocalDevForce(true);
      showToast('Local weekend time simulation enabled', 'info');
    } else {
      localStorage.removeItem('WM_DEBUG_FORCE_WEEKEND');
      setLocalDevForce(false);
      showToast('Local weekend time simulation disabled', 'info');
    }
    // Delay reload slightly to let toast fade/register
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return {
    entries,
    missions,
    loading,
    refreshing,
    currentOverride,
    localDevForce,
    weekendStatus,
    stats,
    insights,
    needsAttentionList,
    missionAnalytics,
    toasts,
    loadData,
    toggleMissionActive,
    handleOverrideChange,
    handleLocalForceToggle,
    showToast
  };
}
