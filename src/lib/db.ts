import { supabase, isSupabaseConfigured } from './supabase';

export interface Mission {
  id: number;
  code: string;
  title: string;
  description: string;
  active: boolean;
}

export interface WeekendEntry {
  id: string;
  device_id: string;
  display_name: string;
  mission_id: number;
  status: 'Assigned' | 'Completed';
  weekend_key: string;
  assigned_at: string;
  completed_at: string | null;
  proof_text: string | null;
  mission?: Mission; // Joined mission details
}

// 50 Default Missions matching schema.sql
export const DEFAULT_MISSIONS: Mission[] = [
  { id: 1, code: 'WM-001', title: 'Just Begin', description: "Start the thing you've been avoiding. Don't think about finishing it—just begin.", active: true },
  { id: 2, code: 'WM-002', title: 'Open the Project', description: 'Open something you\'ve been delaying and make one meaningful improvement.', active: true },
  { id: 3, code: 'WM-003', title: 'Five Minute Rule', description: 'Commit to working for at least five focused minutes. Keep going if you want.', active: true },
  { id: 4, code: 'WM-004', title: 'Remove One Blocker', description: 'Solve one obstacle that\'s preventing your progress.', active: true },
  { id: 5, code: 'WM-005', title: 'Finish One Small Task', description: 'Choose one unfinished task and complete it before starting anything new.', active: true },
  { id: 6, code: 'WM-006', title: 'Progress Over Perfection', description: 'Move your work forward instead of making it perfect.', active: true },
  { id: 7, code: 'WM-007', title: 'Ship Something', description: 'Publish, submit, push, upload, send, or share something you\'ve been working on.', active: true },
  { id: 8, code: 'WM-008', title: 'Build Instead of Consume', description: 'Spend your time creating instead of endlessly consuming content.', active: true },
  { id: 9, code: 'WM-009', title: 'Complete a Draft', description: 'Finish a rough version instead of waiting for the perfect one.', active: true },
  { id: 10, code: 'WM-010', title: 'Improve Yesterday', description: 'Take something you created earlier and make it better.', active: true },
  { id: 11, code: 'WM-011', title: 'Single Task Mode', description: 'Work on only one objective until you\'ve made visible progress.', active: true },
  { id: 12, code: 'WM-012', title: 'Deep Focus', description: 'Remove distractions and focus completely on one task.', active: true },
  { id: 13, code: 'WM-013', title: 'Stay With It', description: 'Don\'t switch projects until you\'ve completed one meaningful step.', active: true },
  { id: 14, code: 'WM-014', title: 'Beat Resistance', description: 'Do the task you\'ve been mentally avoiding the most.', active: true },
  { id: 15, code: 'WM-015', title: 'Keep Going', description: 'Continue working for a little longer after you feel like stopping.', active: true },
  { id: 16, code: 'WM-016', title: 'Close an Open Loop', description: 'Finish something that\'s been left incomplete.', active: true },
  { id: 17, code: 'WM-017', title: 'Tiny Milestone', description: 'Reach one small milestone before ending today\'s session.', active: true },
  { id: 18, code: 'WM-018', title: 'Simplify Something', description: 'Make part of your work cleaner, simpler, or easier to understand.', active: true },
  { id: 19, code: 'WM-019', title: 'Solve One Problem', description: 'Identify one issue and fix it today.', active: true },
  { id: 20, code: 'WM-020', title: 'Visible Progress', description: 'End today with something you can clearly point to as progress.', active: true },
  { id: 21, code: 'WM-021', title: 'Learn With Purpose', description: 'Learn something directly related to what you\'re building.', active: true },
  { id: 22, code: 'WM-022', title: 'Apply What You Learned', description: 'Use a new idea immediately instead of just reading about it.', active: true },
  { id: 23, code: 'WM-023', title: 'Practice Deliberately', description: 'Repeat a skill you\'re trying to improve until you notice progress.', active: true },
  { id: 24, code: 'WM-024', title: 'Experiment', description: 'Try one new approach without worrying if it works.', active: true },
  { id: 25, code: 'WM-025', title: 'Document Your Learning', description: 'Write down one useful thing you\'ll remember later.', active: true },
  { id: 26, code: 'WM-026', title: 'Ask for Feedback', description: 'Show your work to someone and ask for honest feedback.', active: true },
  { id: 27, code: 'WM-027', title: 'Share Your Progress', description: 'Tell someone what you\'ve completed today.', active: true },
  { id: 28, code: 'WM-028', title: 'Ask One Question', description: 'Reach out when you\'re stuck instead of staying blocked.', active: true },
  { id: 29, code: 'WM-029', title: 'Have the Conversation', description: 'Send the message you\'ve been postponing.', active: true },
  { id: 30, code: 'WM-030', title: 'Take the Uncomfortable Step', description: 'Do one action you\'ve been avoiding because it feels difficult.', active: true },
  { id: 31, code: 'WM-031', title: 'Minimum Viable Progress', description: 'Complete the smallest meaningful version of today\'s work.', active: true },
  { id: 32, code: 'WM-032', title: 'Protect the Streak', description: 'Show up today, even if your progress is small.', active: true },
  { id: 33, code: 'WM-033', title: 'Don\'t Restart', description: 'Continue an existing project instead of beginning a new one.', active: true },
  { id: 34, code: 'WM-034', title: 'Work First', description: 'Finish meaningful work before entertainment.', active: true },
  { id: 35, code: 'WM-035', title: 'Earn the Break', description: 'Complete one important task before taking a long break.', active: true },
  { id: 36, code: 'WM-036', title: 'One More Iteration', description: 'Improve your work one more time before stopping.', active: true },
  { id: 37, code: 'WM-037', title: 'Polish One Detail', description: 'Refine one small part that makes the whole thing better.', active: true },
  { id: 38, code: 'WM-038', title: 'Prepare Tomorrow', description: 'Leave your work in a state that\'s easy to continue tomorrow.', active: true },
  { id: 39, code: 'WM-039', title: 'Create Momentum', description: 'Do something that makes your next session easier.', active: true },
  { id: 40, code: 'WM-040', title: 'End With Intention', description: 'Stop only after you\'ve completed a meaningful checkpoint.', active: true },
  { id: 41, code: 'WM-041', title: 'Build the Habit', description: 'Show up because habits beat motivation.', active: true },
  { id: 42, code: 'WM-042', title: 'Stay Consistent', description: 'Work today regardless of how motivated you feel.', active: true },
  { id: 43, code: 'WM-043', title: 'Keep the Promise', description: 'Finish the task you promised yourself you\'d do.', active: true },
  { id: 44, code: 'WM-044', title: 'Push the Boundary', description: 'Go slightly beyond what you originally planned.', active: true },
  { id: 45, code: 'WM-045', title: 'Make It Real', description: 'Turn one idea into something tangible.', active: true },
  { id: 46, code: 'WM-046', title: 'Clear the Backlog', description: 'Complete one task that\'s been sitting on your list for too long.', active: true },
  { id: 47, code: 'WM-047', title: 'Reduce Friction', description: 'Make one change that helps you work more easily next time.', active: true },
  { id: 48, code: 'WM-048', title: 'Build Momentum', description: 'Complete one action that naturally leads to the next.', active: true },
  { id: 49, code: 'WM-049', title: 'Leave It Better', description: 'Improve something you touched today before walking away.', active: true },
  { id: 50, code: 'WM-050', title: 'Win the Day', description: 'Finish today knowing you moved your life forward, even if only by one step.', active: true },
];

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Helper to fetch local mock entries from localStorage
 */
function getLocalEntries(): WeekendEntry[] {
  const data = localStorage.getItem('wm_mock_entries');
  return data ? JSON.parse(data) : [];
}

/**
 * Helper to save local mock entries to localStorage
 */
function saveLocalEntries(entries: WeekendEntry[]) {
  localStorage.setItem('wm_mock_entries', JSON.stringify(entries));
}

/**
 * 1. Checks if there is an active entry for the given device and weekend
 */
export async function getEntryForWeekend(
  deviceId: string,
  weekendKey: string
): Promise<WeekendEntry | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('weekend_entries')
        .select(`
          id,
          device_id,
          display_name,
          mission_id,
          status,
          weekend_key,
          assigned_at,
          completed_at,
          proof_text,
          missions (
            id,
            code,
            title,
            description,
            active
          )
        `)
        .eq('device_id', deviceId)
        .eq('weekend_key', weekendKey)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Map joined missions key to camelcase format
      const entryData = data as any;
      return {
        id: entryData.id,
        device_id: entryData.device_id,
        display_name: entryData.display_name,
        mission_id: entryData.mission_id,
        status: entryData.status,
        weekend_key: entryData.weekend_key,
        assigned_at: entryData.assigned_at,
        completed_at: entryData.completed_at,
        proof_text: entryData.proof_text,
        mission: entryData.missions ? {
          id: entryData.missions.id,
          code: entryData.missions.code,
          title: entryData.missions.title,
          description: entryData.missions.description,
          active: entryData.missions.active
        } : undefined
      };
    } catch (e) {
      console.warn('Supabase query failed, falling back to local simulation:', e);
    }
  }

  // Local Storage Fallback (Mock Mode)
  const localEntries = getLocalEntries();
  const found = localEntries.find(
    (e) => e.device_id === deviceId && e.weekend_key === weekendKey
  );
  if (!found) return null;

  const mission = DEFAULT_MISSIONS.find((m) => m.id === found.mission_id);
  return { ...found, mission };
}

/**
 * 2. Assigns a new random unseen mission to the device for the current weekend
 */
export async function assignWeekendMission(
  deviceId: string,
  weekendKey: string,
  displayName: string
): Promise<WeekendEntry> {
  if (isSupabaseConfigured()) {
    try {
      // Execute the RPC function get_random_unseen_mission
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'get_random_unseen_mission',
        { p_device_id: deviceId }
      );

      if (rpcError) throw rpcError;
      if (!rpcData || rpcData.length === 0) {
        throw new Error('No active missions found in database.');
      }

      const selectedMission = rpcData[0]; // get_random_unseen_mission returns table rows

      // Insert into weekend_entries
      const { data: insertedData, error: insertError } = await supabase
        .from('weekend_entries')
        .insert({
          device_id: deviceId,
          display_name: displayName,
          mission_id: selectedMission.id,
          status: 'Assigned',
          weekend_key: weekendKey
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return {
        id: insertedData.id,
        device_id: insertedData.device_id,
        display_name: insertedData.display_name,
        mission_id: insertedData.mission_id,
        status: insertedData.status as 'Assigned' | 'Completed',
        weekend_key: insertedData.weekend_key,
        assigned_at: insertedData.assigned_at,
        completed_at: insertedData.completed_at,
        proof_text: insertedData.proof_text,
        mission: {
          id: selectedMission.id,
          code: selectedMission.code,
          title: selectedMission.title,
          description: selectedMission.description,
          active: selectedMission.active
        }
      };
    } catch (e) {
      console.warn('Supabase mission generation failed, using local generator:', e);
    }
  }

  // Local Storage Fallback (Mock Mode)
  const localEntries = getLocalEntries();
  
  // 1. Get IDs of previously assigned missions
  const assignedIds = new Set(
    localEntries
      .filter((e) => e.device_id === deviceId)
      .map((e) => e.mission_id)
  );

  // 2. Filter default missions to find unseen ones
  let unseenMissions = DEFAULT_MISSIONS.filter((m) => m.active && !assignedIds.has(m.id));

  // 3. Fall back to all active missions if all have been seen
  if (unseenMissions.length === 0) {
    unseenMissions = DEFAULT_MISSIONS.filter((m) => m.active);
  }

  // 4. Select a random mission from the pool
  const randomIndex = Math.floor(Math.random() * unseenMissions.length);
  const selectedMission = unseenMissions[randomIndex];

  const newEntry: WeekendEntry = {
    id: generateUUID(),
    device_id: deviceId,
    display_name: displayName,
    mission_id: selectedMission.id,
    status: 'Assigned',
    weekend_key: weekendKey,
    assigned_at: new Date().toISOString(),
    completed_at: null,
    proof_text: null,
    mission: selectedMission
  };

  localEntries.push(newEntry);
  saveLocalEntries(localEntries);

  return newEntry;
}

/**
 * 3. Completes an assigned mission
 */
export async function completeWeekendMission(
  entryId: string,
  proofText: string
): Promise<WeekendEntry> {
  const completedAt = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('weekend_entries')
        .update({
          status: 'Completed',
          completed_at: completedAt,
          proof_text: proofText
        })
        .eq('id', entryId)
        .select()
        .single();

      if (error) throw error;

      // Keep current mission info cached if available
      return {
        id: data.id,
        device_id: data.device_id,
        display_name: data.display_name,
        mission_id: data.mission_id,
        status: data.status as 'Assigned' | 'Completed',
        weekend_key: data.weekend_key,
        assigned_at: data.assigned_at,
        completed_at: data.completed_at,
        proof_text: data.proof_text
      };
    } catch (e) {
      console.warn('Supabase completion failed, using local simulation:', e);
    }
  }

  // Local Storage Fallback (Mock Mode)
  const localEntries = getLocalEntries();
  const entryIndex = localEntries.findIndex((e) => e.id === entryId);
  if (entryIndex === -1) {
    throw new Error('Entry not found in simulated database.');
  }

  const updatedEntry: WeekendEntry = {
    ...localEntries[entryIndex],
    status: 'Completed',
    completed_at: completedAt,
    proof_text: proofText
  };

  localEntries[entryIndex] = updatedEntry;
  saveLocalEntries(localEntries);

  return updatedEntry;
}

export interface WeekendStats {
  assignedCount: number;
  completedCount: number;
}

/**
 * Fetches community momentum metrics (total spins and completions) for the given weekend
 */
export async function getWeekendStats(weekendKey: string): Promise<WeekendStats> {
  let actualAssigned = 0;
  let actualCompleted = 0;

  if (isSupabaseConfigured()) {
    try {
      const { count: assigned, error: err1 } = await supabase
        .from('weekend_entries')
        .select('*', { count: 'exact', head: true })
        .eq('weekend_key', weekendKey);

      const { count: completed, error: err2 } = await supabase
        .from('weekend_entries')
        .select('*', { count: 'exact', head: true })
        .eq('weekend_key', weekendKey)
        .eq('status', 'Completed');

      if (!err1 && assigned !== null) actualAssigned = assigned;
      if (!err2 && completed !== null) actualCompleted = completed;
    } catch (e) {
      console.warn('Supabase stats failed, using local count:', e);
    }
  } else {
    const localEntries = getLocalEntries();
    const weekendEntries = localEntries.filter((e) => e.weekend_key === weekendKey);
    actualAssigned = weekendEntries.length;
    actualCompleted = weekendEntries.filter((e) => e.status === 'Completed').length;
  }

  return {
    assignedCount: actualAssigned,
    completedCount: actualCompleted
  };
}

/**
 * 5. Admin: Fetch all entries for members with optional joins
 */
export async function getAllEntriesForAdmin(): Promise<WeekendEntry[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('weekend_entries')
        .select(`
          id,
          device_id,
          display_name,
          mission_id,
          status,
          weekend_key,
          assigned_at,
          completed_at,
          proof_text,
          missions (
            id,
            code,
            title,
            description,
            active
          )
        `)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      if (data) {
        return (data as any[]).map((entryData) => ({
          id: entryData.id,
          device_id: entryData.device_id,
          display_name: entryData.display_name,
          mission_id: entryData.mission_id,
          status: entryData.status,
          weekend_key: entryData.weekend_key,
          assigned_at: entryData.assigned_at,
          completed_at: entryData.completed_at,
          proof_text: entryData.proof_text,
          mission: entryData.missions ? {
            id: entryData.missions.id,
            code: entryData.missions.code,
            title: entryData.missions.title,
            description: entryData.missions.description,
            active: entryData.missions.active
          } : undefined
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch entries failed, using local fallback:', e);
    }
  }

  // Local Storage Fallback
  const localEntries = getLocalEntries();
  return localEntries.map((e) => {
    const isMockInactive = JSON.parse(localStorage.getItem('wm_mock_inactive_mission_ids') || '[]').includes(e.mission_id);
    const mission = DEFAULT_MISSIONS.find((m) => m.id === e.mission_id);
    return {
      ...e,
      mission: mission ? { ...mission, active: !isMockInactive } : undefined
    };
  });
}

/**
 * 6. Admin: Fetch all missions (active and inactive)
 */
export async function getAllMissionsForAdmin(): Promise<Mission[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;
      if (data) return data;
    } catch (e) {
      console.warn('Supabase fetch missions failed, using default list:', e);
    }
  }

  // Local Storage Fallback
  const inactiveIds = JSON.parse(localStorage.getItem('wm_mock_inactive_mission_ids') || '[]') as number[];
  return DEFAULT_MISSIONS.map((m) => ({
    ...m,
    active: !inactiveIds.includes(m.id)
  }));
}

/**
 * 7. Admin: Toggle active status of a mission
 */
export async function toggleMissionActiveAdmin(missionId: number, active: boolean): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('missions')
        .update({ active })
        .eq('id', missionId);

      if (error) throw error;
      return;
    } catch (e) {
      console.warn('Supabase toggle mission failed, using local storage overrides:', e);
    }
  }

  // Local Storage Override Fallback
  const inactiveIds = new Set<number>(JSON.parse(localStorage.getItem('wm_mock_inactive_mission_ids') || '[]'));
  if (active) {
    inactiveIds.delete(missionId);
  } else {
    inactiveIds.add(missionId);
  }
  localStorage.setItem('wm_mock_inactive_mission_ids', JSON.stringify(Array.from(inactiveIds)));
}

/**
 * 8. Admin: Get global weekend override status
 */
export async function getWeekendOverrideAdmin(): Promise<'automatic' | 'force-open' | 'force-closed'> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('weekend_settings')
        .select('value')
        .eq('key', 'weekend_override')
        .maybeSingle();

      if (error) throw error;
      if (data && (data.value === 'automatic' || data.value === 'force-open' || data.value === 'force-closed')) {
        return data.value as any;
      }
    } catch (e) {
      console.warn('Supabase get override failed, fallback to local settings:', e);
    }
  }

  // Local Storage Override
  const val = localStorage.getItem('WM_MOCK_WEEKEND_STATUS');
  if (val === 'automatic' || val === 'force-open' || val === 'force-closed') {
    return val;
  }
  return 'automatic';
}

/**
 * 9. Admin: Set global weekend override status
 */
export async function setWeekendOverrideAdmin(value: 'automatic' | 'force-open' | 'force-closed'): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('weekend_settings')
        .upsert({ key: 'weekend_override', value });

      if (error) throw error;
      return;
    } catch (e) {
      console.warn('Supabase set override failed, using local storage overrides:', e);
    }
  }

  // Local Storage Override Fallback
  localStorage.setItem('WM_MOCK_WEEKEND_STATUS', value);
}


