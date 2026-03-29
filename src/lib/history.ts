const KEY = 'ezpic_history';

export interface HistoryItem {
  id: string;
  date: string;          // ISO string
  presetName: string;
  originalFilename: string;
  resultBase64: string;
  resultMimeType: string;
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveToHistory(item: HistoryItem): void {
  try {
    const current = getHistory();
    // Newest first, cap at 50 items to keep localStorage lean
    const updated = [item, ...current].slice(0, 50);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // localStorage full or blocked — fail silently
  }
}

export function clearHistory(): void {
  localStorage.removeItem(KEY);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
