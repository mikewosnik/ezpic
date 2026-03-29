import { useState, useRef, useEffect } from 'react';
import { SPORTS_PRESETS, WILDLIFE_PRESETS, Preset } from '../lib/presets';
import { getCustomPresets, CustomPreset, COLOR_TAGS } from '../lib/customPresets';
import { useAppStore } from '../store/useAppStore';

type AnyPreset = Preset | CustomPreset;

function isCustomPreset(p: AnyPreset): p is CustomPreset {
  return 'sliders' in p;
}

function tagColor(id: string) {
  return COLOR_TAGS.find((c) => c.id === id)?.hex ?? '#888';
}

interface GroupProps {
  label: string;
  items: AnyPreset[];
  selected: AnyPreset | null;
  onSelect: (p: AnyPreset) => void;
}

function DropGroup({ label, items, selected, onSelect }: GroupProps) {
  if (items.length === 0) return null;
  return (
    <div>
      <div
        style={{
          padding: '8px 14px 4px',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {label}
      </div>
      {items.map((p) => {
        const isSelected = selected?.id === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            style={{
              width: '100%', textAlign: 'left',
              padding: '9px 14px',
              background: isSelected ? 'rgba(255,149,0,0.1)' : 'transparent',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            {isCustomPreset(p) && (
              <span
                style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: tagColor(p.colorTag),
                }}
              />
            )}
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? '#FF9500' : 'rgba(255,255,255,0.75)',
                flex: 1,
              }}
            >
              {p.name}
            </span>
            {!isCustomPreset(p) && (
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}>
                {p.category === 'sports' ? 'Sport' : 'Wildlife'}
              </span>
            )}
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="#FF9500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function PresetSelector() {
  const { selectedPreset, setSelectedPreset } = useAppStore();
  const [open, setOpen] = useState(false);
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  // Reload custom presets whenever dropdown opens
  useEffect(() => {
    if (open) setCustomPresets(getCustomPresets());
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (p: AnyPreset) => {
    setSelectedPreset(p);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          height: 48,
          borderRadius: 12,
          background: '#111',
          border: `1.5px solid ${open ? 'rgba(255,149,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px',
          cursor: 'pointer',
          transition: 'border-color 0.15s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {selectedPreset && isCustomPreset(selectedPreset) && (
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: tagColor(selectedPreset.colorTag) }} />
          )}
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: selectedPreset ? 500 : 400,
              color: selectedPreset ? '#fff' : 'rgba(255,255,255,0.3)',
            }}
          >
            {selectedPreset?.name ?? 'Choose a style preset…'}
          </span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <path d="M3 5L7 9L11 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 50,
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            maxHeight: 320,
            overflowY: 'auto',
            paddingBottom: 6,
          }}
        >
          <DropGroup label="Sports" items={SPORTS_PRESETS} selected={selectedPreset} onSelect={handleSelect} />
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
          <DropGroup label="Wildlife" items={WILDLIFE_PRESETS} selected={selectedPreset} onSelect={handleSelect} />
          {customPresets.length > 0 && (
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
              <DropGroup label="My Presets" items={customPresets} selected={selectedPreset} onSelect={handleSelect} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
