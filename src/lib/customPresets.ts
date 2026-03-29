const KEY = 'ezpic_custom_presets';
export const FREE_LIMIT = 3;

export const COLOR_TAGS = [
  { id: 'orange', hex: '#FF9500' },
  { id: 'blue',   hex: '#0A84FF' },
  { id: 'green',  hex: '#30D158' },
  { id: 'red',    hex: '#FF453A' },
  { id: 'purple', hex: '#BF5AF2' },
  { id: 'yellow', hex: '#FFD60A' },
];

export interface SliderValues {
  exposure: number;    // -100 → +100
  contrast: number;    // -100 → +100
  highlights: number;  // -100 → +100
  shadows: number;     // -100 → +100
  saturation: number;  // -100 → +100
  temperature: number; // -100 (cool) → +100 (warm)
  clarity: number;     // -100 → +100
  vignette: number;    //    0 → +100
}

export const DEFAULT_SLIDERS: SliderValues = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  saturation: 0,
  temperature: 0,
  clarity: 0,
  vignette: 0,
};

export interface CustomPreset {
  id: string;
  name: string;
  colorTag: string; // COLOR_TAGS id
  sliders: SliderValues;
  createdAt: string;
}

export function getCustomPresets(): CustomPreset[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomPreset(preset: CustomPreset): void {
  const current = getCustomPresets();
  const idx = current.findIndex((p) => p.id === preset.id);
  const updated = idx >= 0
    ? current.map((p) => (p.id === preset.id ? preset : p))
    : [...current, preset];
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function deleteCustomPreset(id: string): void {
  const updated = getCustomPresets().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function generateCustomId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Convert slider values into a style description for the AI pipeline. */
export function slidersToStylePrompt(name: string, s: SliderValues): string {
  const parts: string[] = [];

  if (Math.abs(s.exposure) > 5)
    parts.push(s.exposure > 0 ? `bright +${s.exposure} exposure` : `dark ${s.exposure} exposure`);
  if (Math.abs(s.contrast) > 5)
    parts.push(s.contrast > 0 ? `high contrast +${s.contrast}` : `flat low contrast ${s.contrast}`);
  if (Math.abs(s.highlights) > 5)
    parts.push(s.highlights > 0 ? `bright open highlights +${s.highlights}` : `recovered pulled highlights ${s.highlights}`);
  if (Math.abs(s.shadows) > 5)
    parts.push(s.shadows > 0 ? `lifted bright shadows +${s.shadows}` : `deep crushed shadows ${s.shadows}`);
  if (Math.abs(s.saturation) > 5)
    parts.push(s.saturation > 0 ? `highly saturated colors +${s.saturation}` : `desaturated muted colors ${s.saturation}`);
  if (Math.abs(s.temperature) > 5)
    parts.push(s.temperature > 0 ? `warm amber color temperature +${s.temperature}` : `cool blue color temperature ${s.temperature}`);
  if (Math.abs(s.clarity) > 5)
    parts.push(s.clarity > 0 ? `high clarity and micro-contrast +${s.clarity}` : `soft low clarity ${s.clarity}`);
  if (s.vignette > 10)
    parts.push(`vignette strength ${s.vignette}`);

  const description = parts.length > 0
    ? parts.join(', ')
    : 'neutral balanced editing';

  return `Custom preset "${name}": ${description}. Apply this exact photographic editing style to the provided photo. Preserve all subjects, composition, and content exactly. The output must be strictly photorealistic.`;
}

/** Short summary string shown on preset cards (e.g. "Contrast +40 · Sat -20") */
export function sliderSummary(s: SliderValues): string {
  const labels: Record<keyof SliderValues, string> = {
    exposure: 'Exp',
    contrast: 'Con',
    highlights: 'Hi',
    shadows: 'Sha',
    saturation: 'Sat',
    temperature: 'Temp',
    clarity: 'Cla',
    vignette: 'Vig',
  };
  const active = (Object.keys(s) as (keyof SliderValues)[])
    .filter((k) => Math.abs(s[k]) > 5)
    .map((k) => `${labels[k]} ${s[k] > 0 ? '+' : ''}${s[k]}`)
    .slice(0, 3);
  return active.length > 0 ? active.join(' · ') : 'Default';
}
