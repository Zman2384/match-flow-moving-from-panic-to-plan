import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_SPECTRUM, type GhostCategoryId, type SpectrumId } from '@/lib/ghosts';
import type { PieceKey } from '@/lib/match';
import { type CadenceId, DEFAULT_REMINDER_CADENCES } from '@/lib/reminders';

export interface SafetyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface SessionRecord {
  id: string;
  date: string;
  shieldScore: number;
  environment: string;
  mindset: string;
  partner: string;
}

export interface CheckInRecord {
  id: string;
  date: string;
  completed: number;
  total: number;
  note: string;
}

export interface RiskResult {
  date: string;
  score: number;
  weakest: PieceKey;
}

export interface AnxietyEntry {
  id: string;
  date: string;
  fear: string;
  evidence: string;
  action: string;
}

export interface FlowNode {
  id: string;
  prompt: string;
  ifYes: string;
  ifNo: string;
}

/** A ghost the user has dragged into the light. Local only, never synced. */
export interface GhostRecord {
  /** Archetype id, or the id of a custom ghost. */
  id: string;
  namedAt: string;
  /** Set when the user marks the matching MATCH layer as handled. */
  disarmedAt: string | null;
  /** Private note — the user's own words about this fear. */
  note: string;
}

export interface CustomGhost {
  id: string;
  label: string;
  category: GhostCategoryId;
}

export interface CustomScript {
  id: string;
  title: string;
  body: string;
  situation: string;
}

interface MatchState {
  ageConfirmed: boolean;
  statusConfirmed: boolean;
  armed: Record<string, boolean>;
  planUpdatedAt: string | null;
  relationshipStyle: string | null;
  savedClinicIds: string[];
  favoriteScriptIds: string[];
  customScripts: CustomScript[];
  contacts: SafetyContact[];
  sessions: SessionRecord[];
  checkIns: CheckInRecord[];
  riskResults: RiskResult[];
  anxietyEntries: AnxietyEntry[];
  ghostRecords: Record<string, GhostRecord>;
  customGhosts: CustomGhost[];
  ghostSpectrum: SpectrumId;
  flowNodes: FlowNode[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  remindersEnabled: boolean;
  reminderTime: string;
  reminderCadences: Record<CadenceId, boolean>;
  stressTestBest: number | null;

  confirmAge: () => void;
  confirmStatus: () => void;
  toggleOption: (id: string) => void;
  resetPlan: () => void;
  setRelationshipStyle: (id: string) => void;
  toggleSavedClinic: (id: string) => void;
  toggleFavoriteScript: (id: string) => void;
  addCustomScript: (script: Omit<CustomScript, 'id'>) => void;
  removeCustomScript: (id: string) => void;
  addContact: (contact: Omit<SafetyContact, 'id'>) => void;
  removeContact: (id: string) => void;
  addSession: (session: Omit<SessionRecord, 'id' | 'date'>) => void;
  addCheckIn: (checkIn: Omit<CheckInRecord, 'id' | 'date'>) => void;
  addRiskResult: (result: Omit<RiskResult, 'date'>) => void;
  addAnxietyEntry: (entry: Omit<AnxietyEntry, 'id' | 'date'>) => void;
  removeAnxietyEntry: (id: string) => void;
  nameGhost: (id: string) => void;
  releaseGhost: (id: string) => void;
  toggleGhostDisarmed: (id: string) => void;
  setGhostNote: (id: string, note: string) => void;
  addCustomGhost: (label: string, category: GhostCategoryId) => void;
  setGhostSpectrum: (stage: SpectrumId) => void;
  addFlowNode: (node: Omit<FlowNode, 'id'>) => void;
  removeFlowNode: (id: string) => void;
  setEmergencyContact: (name: string, phone: string) => void;
  setRemindersEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
  toggleReminderCadence: (id: CadenceId) => void;
  recordStressTest: (score: number) => void;
  wipeLocalData: () => void;
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const initial = {
  ageConfirmed: false,
  statusConfirmed: false,
  armed: {} as Record<string, boolean>,
  planUpdatedAt: null as string | null,
  relationshipStyle: null as string | null,
  savedClinicIds: [] as string[],
  favoriteScriptIds: [] as string[],
  customScripts: [] as CustomScript[],
  contacts: [] as SafetyContact[],
  sessions: [] as SessionRecord[],
  checkIns: [] as CheckInRecord[],
  riskResults: [] as RiskResult[],
  anxietyEntries: [] as AnxietyEntry[],
  ghostRecords: {} as Record<string, GhostRecord>,
  customGhosts: [] as CustomGhost[],
  ghostSpectrum: DEFAULT_SPECTRUM,
  flowNodes: [] as FlowNode[],
  emergencyContactName: '',
  emergencyContactPhone: '',
  remindersEnabled: false,
  reminderTime: '09:00',
  reminderCadences: { ...DEFAULT_REMINDER_CADENCES },
  stressTestBest: null as number | null,
};

export const useMatchStore = create<MatchState>()(
  persist(
    (set) => ({
      ...initial,

      confirmAge: () => set({ ageConfirmed: true }),
      confirmStatus: () => set({ statusConfirmed: true }),

      toggleOption: (id) =>
        set((state) => ({
          armed: { ...state.armed, [id]: !state.armed[id] },
          planUpdatedAt: new Date().toISOString(),
        })),

      resetPlan: () => set({ armed: {}, planUpdatedAt: null }),

      setRelationshipStyle: (id) => set({ relationshipStyle: id }),

      toggleSavedClinic: (id) =>
        set((state) => ({
          savedClinicIds: state.savedClinicIds.includes(id)
            ? state.savedClinicIds.filter((c) => c !== id)
            : [...state.savedClinicIds, id],
        })),

      toggleFavoriteScript: (id) =>
        set((state) => ({
          favoriteScriptIds: state.favoriteScriptIds.includes(id)
            ? state.favoriteScriptIds.filter((s) => s !== id)
            : [...state.favoriteScriptIds, id],
        })),

      addCustomScript: (script) =>
        set((state) => ({ customScripts: [{ ...script, id: uid() }, ...state.customScripts] })),

      removeCustomScript: (id) =>
        set((state) => ({ customScripts: state.customScripts.filter((s) => s.id !== id) })),

      addContact: (contact) =>
        set((state) => ({ contacts: [...state.contacts, { ...contact, id: uid() }] })),

      removeContact: (id) =>
        set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),

      addSession: (session) =>
        set((state) => ({
          sessions: [
            { ...session, id: uid(), date: new Date().toISOString() },
            ...state.sessions,
          ].slice(0, 60),
        })),

      addCheckIn: (checkIn) =>
        set((state) => ({
          checkIns: [
            { ...checkIn, id: uid(), date: new Date().toISOString() },
            ...state.checkIns,
          ].slice(0, 60),
        })),

      addRiskResult: (result) =>
        set((state) => ({
          riskResults: [{ ...result, date: new Date().toISOString() }, ...state.riskResults].slice(
            0,
            30,
          ),
        })),

      addAnxietyEntry: (entry) =>
        set((state) => ({
          anxietyEntries: [
            { ...entry, id: uid(), date: new Date().toISOString() },
            ...state.anxietyEntries,
          ],
        })),

      removeAnxietyEntry: (id) =>
        set((state) => ({ anxietyEntries: state.anxietyEntries.filter((e) => e.id !== id) })),

      nameGhost: (id) =>
        set((state) =>
          state.ghostRecords[id]
            ? state
            : {
                ghostRecords: {
                  ...state.ghostRecords,
                  [id]: { id, namedAt: new Date().toISOString(), disarmedAt: null, note: '' },
                },
              },
        ),

      releaseGhost: (id) =>
        set((state) => {
          const next = { ...state.ghostRecords };
          delete next[id];
          return {
            ghostRecords: next,
            customGhosts: state.customGhosts.filter((ghost) => ghost.id !== id),
          };
        }),

      toggleGhostDisarmed: (id) =>
        set((state) => {
          const record = state.ghostRecords[id];
          if (!record) return state;
          return {
            ghostRecords: {
              ...state.ghostRecords,
              [id]: {
                ...record,
                disarmedAt: record.disarmedAt ? null : new Date().toISOString(),
              },
            },
          };
        }),

      setGhostNote: (id, note) =>
        set((state) => {
          const record = state.ghostRecords[id];
          if (!record) return state;
          return { ghostRecords: { ...state.ghostRecords, [id]: { ...record, note } } };
        }),

      addCustomGhost: (label, category) =>
        set((state) => {
          const id = `own-${uid()}`;
          return {
            customGhosts: [{ id, label, category }, ...state.customGhosts],
            ghostRecords: {
              ...state.ghostRecords,
              [id]: { id, namedAt: new Date().toISOString(), disarmedAt: null, note: '' },
            },
          };
        }),

      setGhostSpectrum: (stage) => set({ ghostSpectrum: stage }),

      addFlowNode: (node) =>
        set((state) => ({ flowNodes: [...state.flowNodes, { ...node, id: uid() }] })),

      removeFlowNode: (id) =>
        set((state) => ({ flowNodes: state.flowNodes.filter((n) => n.id !== id) })),

      setEmergencyContact: (name, phone) =>
        set({ emergencyContactName: name, emergencyContactPhone: phone }),

      setRemindersEnabled: (enabled) => set({ remindersEnabled: enabled }),
      setReminderTime: (time) => set({ reminderTime: time }),

      toggleReminderCadence: (id) =>
        set((state) => ({
          reminderCadences: { ...state.reminderCadences, [id]: !state.reminderCadences[id] },
        })),

      recordStressTest: (score) =>
        set((state) => ({
          stressTestBest:
            state.stressTestBest === null ? score : Math.max(state.stressTestBest, score),
        })),

      wipeLocalData: () => set({ ...initial }),
    }),
    {
      name: 'match-flow-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
