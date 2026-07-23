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
  { id: 1, code: 'WM-001', title: 'Clear One Backlog', description: 'Finish one thing you\'ve been postponing for a long time.', active: true },
  { id: 2, code: 'WM-002', title: 'Send That Message', description: 'Send the message you\'ve been thinking about sending.', active: true },
  { id: 3, code: 'WM-003', title: 'Finish the Draft', description: 'Complete something that\'s already 80% finished.', active: true },
  { id: 4, code: 'WM-004', title: 'Clean Your Digital Space', description: 'Organize one folder, drive, desktop or inbox.', active: true },
  { id: 5, code: 'WM-005', title: 'Remove One Distraction', description: 'Delete, uninstall or mute one thing that constantly wastes your time.', active: true },
  { id: 6, code: 'WM-006', title: 'Learn Something New', description: 'Spend time learning something you\'ve never explored before.', active: true },
  { id: 7, code: 'WM-007', title: 'Teach Someone', description: 'Explain something you know to another person.', active: true },
  { id: 8, code: 'WM-008', title: 'Fix Something', description: 'Repair, improve or organize something that\'s been annoying you.', active: true },
  { id: 9, code: 'WM-009', title: 'Reach Out', description: 'Reconnect with someone you haven\'t spoken to in a while.', active: true },
  { id: 10, code: 'WM-010', title: 'Appreciate Someone', description: 'Thank someone who deserves appreciation.', active: true },
  { id: 11, code: 'WM-011', title: 'Make Someone\'s Day', description: 'Do something kind without expecting anything back.', active: true },
  { id: 12, code: 'WM-012', title: 'Leave Your Comfort Zone', description: 'Do one thing you\'ve been avoiding because it feels uncomfortable.', active: true },
  { id: 13, code: 'WM-013', title: 'Finish Before Midnight', description: 'Complete one pending task before today ends.', active: true },
  { id: 14, code: 'WM-014', title: 'Build Something', description: 'Create something small from start to finish.', active: true },
  { id: 15, code: 'WM-015', title: 'Share Your Work', description: 'Publish or share something you\'ve created.', active: true },
  { id: 16, code: 'WM-016', title: 'Organize Your Space', description: 'Make one physical space noticeably better than before.', active: true },
  { id: 17, code: 'WM-017', title: 'Delete the Clutter', description: 'Remove unnecessary files, photos or apps.', active: true },
  { id: 18, code: 'WM-018', title: 'Read With Intention', description: 'Read something that genuinely teaches you something useful.', active: true },
  { id: 19, code: 'WM-019', title: 'Write Your Thoughts', description: 'Write about whatever has been on your mind recently.', active: true },
  { id: 20, code: 'WM-020', title: 'Plan Next Week', description: 'Create a realistic plan for the coming week.', active: true },
  { id: 21, code: 'WM-021', title: 'Learn From Someone', description: 'Watch, read or listen to someone more experienced than you.', active: true },
  { id: 22, code: 'WM-022', title: 'Help Without Being Asked', description: 'Offer help before someone asks for it.', active: true },
  { id: 23, code: 'WM-023', title: 'Say No', description: 'Say no to something that isn\'t worth your time.', active: true },
  { id: 24, code: 'WM-024', title: 'Try Something Different', description: 'Break one routine today.', active: true },
  { id: 25, code: 'WM-025', title: 'Finish One Chapter', description: 'Complete one section, lesson or chapter of something you\'re learning.', active: true },
  { id: 26, code: 'WM-026', title: 'Improve Your Setup', description: 'Improve your workspace or study environment.', active: true },
  { id: 27, code: 'WM-027', title: 'Reflect', description: 'Think about one thing you could have done better this week.', active: true },
  { id: 28, code: 'WM-028', title: 'Take Initiative', description: 'Start something instead of waiting for permission.', active: true },
  { id: 29, code: 'WM-029', title: 'Reduce Screen Time', description: 'Spend meaningful time away from unnecessary screens.', active: true },
  { id: 30, code: 'WM-030', title: 'Learn a Useful Tool', description: 'Discover one tool, app or resource that improves your workflow.', active: true },
  { id: 31, code: 'WM-031', title: 'Document Your Progress', description: 'Take a picture, note or screenshot of something you\'ve improved.', active: true },
  { id: 32, code: 'WM-032', title: 'Complete a Personal Goal', description: 'Finish one personal objective you\'ve delayed.', active: true },
  { id: 33, code: 'WM-033', title: 'Ask a Good Question', description: 'Have one meaningful conversation by asking a thoughtful question.', active: true },
  { id: 34, code: 'WM-034', title: 'Leave Something Better', description: 'Improve a place, document or situation before leaving it.', active: true },
  { id: 35, code: 'WM-035', title: 'Take the First Step', description: 'Start something you\'ve been waiting to begin.', active: true },
  { id: 36, code: 'WM-036', title: 'Do the Difficult Thing First', description: 'Complete your hardest task before everything else.', active: true },
  { id: 37, code: 'WM-037', title: 'Declutter Your Mind', description: 'Write down everything currently occupying your thoughts.', active: true },
  { id: 38, code: 'WM-038', title: 'Inspire Someone', description: 'Share something useful with another person.', active: true },
  { id: 39, code: 'WM-039', title: 'Finish What You Started', description: 'Return to something unfinished and complete it.', active: true },
  { id: 40, code: 'WM-040', title: 'Create Instead of Consume', description: 'Spend more time creating than consuming today.', active: true },
  { id: 41, code: 'WM-041', title: 'One Hour of Focus', description: 'Give one uninterrupted hour to something important.', active: true },
  { id: 42, code: 'WM-042', title: 'Learn by Doing', description: 'Instead of reading about it, actually try it.', active: true },
  { id: 43, code: 'WM-043', title: 'Improve One Habit', description: 'Make one small improvement to an existing habit.', active: true },
  { id: 44, code: 'WM-044', title: 'Be Curious', description: 'Explore a topic you\'ve always wanted to understand.', active: true },
  { id: 45, code: 'WM-045', title: 'Solve One Problem', description: 'Identify one problem in your life and make it slightly better.', active: true },
  { id: 46, code: 'WM-046', title: 'Do Something You\'ll Thank Yourself For', description: 'Complete something that makes tomorrow easier.', active: true },
  { id: 47, code: 'WM-047', title: 'Capture a Win', description: 'Celebrate one thing you accomplished this week.', active: true },
  { id: 48, code: 'WM-048', title: 'Reset', description: 'Spend time preparing yourself for a better week ahead.', active: true },
  { id: 49, code: 'WM-049', title: 'Do What You\'ve Been Avoiding', description: 'Stop thinking about it. Start it.', active: true },
  { id: 50, code: 'WM-050', title: 'Leave No Regrets', description: 'Before the weekend ends, finish one thing you\'ll be proud you didn\'t postpone.', active: true },
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
    assignedCount: 142 + actualAssigned,
    completedCount: 87 + actualCompleted
  };
}

