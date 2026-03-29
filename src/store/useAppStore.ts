import { create } from 'zustand';
import { Preset } from '../lib/presets';
import { CustomPreset } from '../lib/customPresets';

export type AppStatus =
  | 'idle'
  | 'analyzing'
  | 'writing'
  | 'transforming'
  | 'finishing'
  | 'done'
  | 'error';

export type BatchItemStatus = 'pending' | 'processing' | 'done' | 'error';

export interface BatchItem {
  id: string;
  file: File;
  previewUrl: string;
  status: BatchItemStatus;
  resultBase64?: string;
  resultMimeType?: string;
  error?: string;
}

// ── Single-image flow (kept for Results page compat) ──────────────────────────
interface SingleImageState {
  refImage: File | null;
  userImage: File | null;
  generatedImage: string | null;
  generatedMimeType: string;
  stylePrompt: string | null;
  status: AppStatus;
  errorMessage: string | null;
}

// ── Batch flow ─────────────────────────────────────────────────────────────────
interface BatchState {
  batchItems: BatchItem[];
  selectedPreset: Preset | CustomPreset | null;
  isBatchRunning: boolean;
}

interface AppState extends SingleImageState, BatchState {
  // Single-image actions
  setRefImage: (f: File | null) => void;
  setUserImage: (f: File | null) => void;
  setGeneratedImage: (b64: string | null, mime?: string) => void;
  setStylePrompt: (p: string | null) => void;
  setStatus: (s: AppStatus) => void;
  setError: (msg: string) => void;
  resetSingle: () => void;

  // Batch actions
  addBatchFiles: (files: File[]) => void;
  removeBatchItem: (id: string) => void;
  clearBatch: () => void;
  updateBatchItem: (id: string, update: Partial<BatchItem>) => void;
  setSelectedPreset: (p: Preset | CustomPreset | null) => void;
  setBatchRunning: (v: boolean) => void;
}

const singleInitial: SingleImageState = {
  refImage: null,
  userImage: null,
  generatedImage: null,
  generatedMimeType: 'image/png',
  stylePrompt: null,
  status: 'idle',
  errorMessage: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...singleInitial,
  batchItems: [],
  selectedPreset: null,
  isBatchRunning: false,

  // Single-image
  setRefImage: (f) => set({ refImage: f }),
  setUserImage: (f) => set({ userImage: f }),
  setGeneratedImage: (b64, mime = 'image/png') =>
    set({ generatedImage: b64, generatedMimeType: mime }),
  setStylePrompt: (p) => set({ stylePrompt: p }),
  setStatus: (s) => set({ status: s }),
  setError: (msg) => set({ status: 'error', errorMessage: msg }),
  resetSingle: () => set(singleInitial),

  // Batch
  addBatchFiles: (files) =>
    set((state) => {
      const existing = new Set(state.batchItems.map((i) => i.file.name + i.file.size));
      const fresh: BatchItem[] = files
        .filter((f) => !existing.has(f.name + f.size))
        .map((f) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          file: f,
          previewUrl: URL.createObjectURL(f),
          status: 'pending',
        }));
      return { batchItems: [...state.batchItems, ...fresh] };
    }),

  removeBatchItem: (id) =>
    set((state) => {
      const item = state.batchItems.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return { batchItems: state.batchItems.filter((i) => i.id !== id) };
    }),

  clearBatch: () =>
    set((state) => {
      state.batchItems.forEach((i) => URL.revokeObjectURL(i.previewUrl));
      return { batchItems: [], isBatchRunning: false };
    }),

  updateBatchItem: (id, update) =>
    set((state) => ({
      batchItems: state.batchItems.map((i) => (i.id === id ? { ...i, ...update } : i)),
    })),

  setSelectedPreset: (p) => set({ selectedPreset: p }),
  setBatchRunning: (v) => set({ isBatchRunning: v }),
}));
