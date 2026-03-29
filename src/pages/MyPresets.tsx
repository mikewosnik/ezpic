import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCustomPresets, saveCustomPreset, deleteCustomPreset, generateCustomId,
  CustomPreset, SliderValues, DEFAULT_SLIDERS, FREE_LIMIT, COLOR_TAGS,
  sliderSummary,
} from '../lib/customPresets';
import { UpgradeModal } from '../components/UpgradeModal';

const page = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.2 } },
};

const SLIDER_DEFS: { key: keyof SliderValues; label: string; min: number; max: number }[] = [
  { key: 'exposure',    label: 'Exposure',    min: -100, max: 100 },
  { key: 'contrast',   label: 'Contrast',    min: -100, max: 100 },
  { key: 'highlights', label: 'Highlights',  min: -100, max: 100 },
  { key: 'shadows',    label: 'Shadows',     min: -100, max: 100 },
  { key: 'saturation', label: 'Saturation',  min: -100, max: 100 },
  { key: 'temperature',label: 'Temperature', min: -100, max: 100 },
  { key: 'clarity',    label: 'Clarity',     min: -100, max: 100 },
  { key: 'vignette',   label: 'Vignette',    min:    0, max: 100 },
];

interface SliderRowProps {
  def: typeof SLIDER_DEFS[number];
  value: number;
  onChange: (v: number) => void;
}

function SliderRow({ def, value, onChange }: SliderRowProps) {
  const pct = ((value - def.min) / (def.max - def.min)) * 100;
  return (
    <div className="flex items-center gap-4">
      <span
        style={{
          fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
          color: 'rgba(255,255,255,0.55)', width: 84, flexShrink: 0,
        }}
      >
        {def.label}
      </span>
      <div style={{ flex: 1, position: 'relative', height: 4 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
        <div
          style={{
            position: 'absolute', top: 0, bottom: 0, left: 0,
            width: `${pct}%`, background: Math.abs(value) > 5 ? '#FF9500' : 'rgba(255,255,255,0.2)',
            borderRadius: 2, transition: 'width 0.1s, background 0.2s',
          }}
        />
        <input
          type="range"
          min={def.min}
          max={def.max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            opacity: 0, cursor: 'pointer',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
          color: Math.abs(value) > 5 ? '#FF9500' : 'rgba(255,255,255,0.35)',
          width: 36, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value > 0 ? `+${value}` : value}
      </span>
    </div>
  );
}

const EMPTY_FORM = { name: '', colorTag: 'orange', sliders: { ...DEFAULT_SLIDERS } };

export function MyPresets() {
  const [presets, setPresets] = useState<CustomPreset[]>([]);
  const [form, setForm] = useState<{ name: string; colorTag: string; sliders: SliderValues } | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CustomPreset | null>(null);

  const load = () => setPresets(getCustomPresets());
  useEffect(() => { load(); }, []);

  const tagHex = (id: string) => COLOR_TAGS.find((c) => c.id === id)?.hex ?? '#888';

  const openNew = () => {
    if (presets.length >= FREE_LIMIT) { setShowUpgrade(true); return; }
    setEditId(null);
    setForm({ ...EMPTY_FORM, sliders: { ...DEFAULT_SLIDERS } });
  };

  const openEdit = (p: CustomPreset) => {
    setEditId(p.id);
    setForm({ name: p.name, colorTag: p.colorTag, sliders: { ...p.sliders } });
  };

  const cancelForm = () => { setForm(null); setEditId(null); };

  const saveForm = () => {
    if (!form || !form.name.trim()) return;
    const preset: CustomPreset = {
      id: editId ?? generateCustomId(),
      name: form.name.trim().slice(0, 20),
      colorTag: form.colorTag,
      sliders: form.sliders,
      createdAt: editId
        ? (presets.find((p) => p.id === editId)?.createdAt ?? new Date().toISOString())
        : new Date().toISOString(),
    };
    saveCustomPreset(preset);
    load();
    cancelForm();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteCustomPreset(deleteTarget.id);
    load();
    setDeleteTarget(null);
  };

  const updateSlider = (key: keyof SliderValues, v: number) => {
    if (!form) return;
    setForm((f) => f ? { ...f, sliders: { ...f.sliders, [key]: v } } : f);
  };

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" style={{ width: '100%' }} className="flex-1 flex flex-col">
      {/* Header */}
      <div
        style={{
          maxWidth: 1440, margin: '0 auto', width: '100%',
          padding: '80px clamp(16px,4vw,80px) 0',
        }}
      >
        <div style={{ paddingTop: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>
            Freemium
          </p>
          <h1
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 'clamp(48px, 6vw, 80px)',
              fontWeight: 400,
              letterSpacing: '0.03em',
              lineHeight: 1,
              color: '#fff',
              marginBottom: 8,
            }}
          >
            My Presets
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>
            Build your own editing styles with precise slider control.
          </p>
        </div>

        {/* Create + quota row */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <button
            onClick={openNew}
            style={{
              height: 44, padding: '0 24px', borderRadius: 11,
              background: presets.length < FREE_LIMIT
                ? 'linear-gradient(135deg, #FF9500, #FF6B00)'
                : 'rgba(255,255,255,0.06)',
              color: presets.length < FREE_LIMIT ? '#000' : 'rgba(255,255,255,0.35)',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              border: presets.length < FREE_LIMIT ? 'none' : '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'Inter, sans-serif',
              boxShadow: presets.length < FREE_LIMIT ? '0 4px 16px rgba(255,149,0,0.3)' : 'none',
            }}
          >
            + New Preset
          </button>

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            {presets.length} of {FREE_LIMIT} free presets used
          </p>
        </div>

        {/* Separator */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 40 }} />

        {/* Builder form */}
        <AnimatePresence>
          {form && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden', marginBottom: 32 }}
            >
              <div
                style={{
                  background: '#111', borderRadius: 18,
                  border: '1px solid rgba(255,149,0,0.2)',
                  padding: 'clamp(20px,3vw,36px)',
                  boxShadow: '0 0 0 1px rgba(255,149,0,0.06)',
                }}
              >
                <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 24 }}>
                  {editId ? 'Edit Preset' : 'New Preset'}
                </h2>

                {/* Name + color row */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                      Name
                    </label>
                    <input
                      maxLength={20}
                      value={form.name}
                      onChange={(e) => setForm((f) => f ? { ...f, name: e.target.value } : f)}
                      placeholder="e.g. My Golden Hour"
                      style={{
                        width: '100%', height: 44,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, padding: '0 14px',
                        color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif',
                        outline: 'none',
                      }}
                    />
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>
                      {form.name.length}/20
                    </p>
                  </div>

                  <div>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
                      Color Tag
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {COLOR_TAGS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setForm((f) => f ? { ...f, colorTag: c.id } : f)}
                          style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: c.hex, border: 'none', cursor: 'pointer',
                            outline: form.colorTag === c.id ? `3px solid ${c.hex}` : 'none',
                            outlineOffset: 2,
                            transform: form.colorTag === c.id ? 'scale(1.2)' : 'scale(1)',
                            transition: 'transform 0.15s, outline 0.15s',
                          }}
                          aria-label={c.id}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                  {SLIDER_DEFS.map((def) => (
                    <SliderRow
                      key={def.key}
                      def={def}
                      value={form.sliders[def.key]}
                      onChange={(v) => updateSlider(def.key, v)}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={cancelForm}
                    style={{
                      flex: 1, height: 44, borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: 14,
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveForm}
                    disabled={!form.name.trim()}
                    style={{
                      flex: 1, height: 44, borderRadius: 10,
                      background: form.name.trim()
                        ? 'linear-gradient(135deg, #FF9500, #FF6B00)'
                        : 'rgba(255,255,255,0.05)',
                      color: form.name.trim() ? '#000' : 'rgba(255,255,255,0.2)',
                      fontWeight: 700, fontSize: 14,
                      cursor: form.name.trim() ? 'pointer' : 'not-allowed',
                      border: 'none', fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Save Preset
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preset cards */}
        {presets.length === 0 && !form ? (
          <div
            className="flex flex-col items-center justify-center text-center py-20"
            style={{ border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 16 }}
          >
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
              No custom presets yet.
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
              Create your first one above.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14,
              paddingBottom: 80,
            }}
          >
            <AnimatePresence>
              {presets.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: '#111', borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.07)',
                    padding: '18px 20px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: tagHex(p.colorTag), flexShrink: 0 }} />
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{p.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => openEdit(p)}
                        style={{
                          height: 30, padding: '0 12px', borderRadius: 7,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500,
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        style={{
                          height: 30, padding: '0 12px', borderRadius: 7,
                          background: 'rgba(255,69,58,0.08)',
                          border: '1px solid rgba(255,69,58,0.15)',
                          color: '#FF453A', fontSize: 12, fontWeight: 500,
                          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                    {sliderSummary(p.sliders)}
                  </p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
                    Created {new Date(p.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#1a1a1a', borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.1)',
                padding: 28, maxWidth: 340, width: '100%',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                Delete "{deleteTarget.name}"?
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
                This can't be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, height: 42, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Cancel
                </button>
                <button onClick={confirmDelete} style={{ flex: 1, height: 42, borderRadius: 10, background: 'rgba(255,69,58,0.12)', border: '1px solid rgba(255,69,58,0.25)', color: '#FF453A', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade modal */}
      <AnimatePresence>
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
