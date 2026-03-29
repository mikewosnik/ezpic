import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPORTS_PRESETS, WILDLIFE_PRESETS, Preset } from '../lib/presets';
import { useAppStore } from '../store/useAppStore';

function picsumUrl(seed: string, w = 500, h = 680) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

interface LightboxProps {
  preset: Preset;
  onClose: () => void;
  onUse: (p: Preset) => void;
}

function Lightbox({ preset, onClose, onUse }: LightboxProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 20, maxWidth: 480, width: '100%',
        }}
      >
        <img
          src={picsumUrl(preset.seed, 800, 1000)}
          alt={preset.name}
          style={{
            width: '100%',
            maxHeight: '60vh',
            objectFit: 'cover',
            borderRadius: 16,
            boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          }}
        />

        <div style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            {preset.category === 'sports' ? 'Sports' : 'Wildlife'} Preset
          </p>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6 }}>
            {preset.name}
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
            {preset.caption}
          </p>
          <button
            onClick={() => { onUse(preset); onClose(); }}
            style={{
              padding: '12px 32px', borderRadius: 12,
              background: 'linear-gradient(135deg, #FF9500, #FF6B00)',
              color: '#000', fontWeight: 700, fontSize: 14,
              border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 20px rgba(255,149,0,0.4)',
            }}
          >
            Use This Style
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'fixed', top: 20, right: 20,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Close"
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
}

interface GalleryItemProps {
  preset: Preset;
  onClick: () => void;
}

function GalleryItem({ preset, onClick }: GalleryItemProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ breakInside: 'avoid', marginBottom: 12, cursor: 'pointer', borderRadius: 12, overflow: 'hidden', position: 'relative' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={picsumUrl(preset.seed)}
        alt={preset.name}
        loading="lazy"
        style={{ width: '100%', display: 'block', transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
      />
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '32px 12px 12px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          transition: 'opacity 0.2s',
          opacity: hovered ? 1 : 0.7,
        }}
      >
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
          {preset.name}
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
          {preset.caption}
        </p>
      </div>
      {hovered && (
        <div
          style={{
            position: 'absolute', inset: 0,
            border: '2px solid rgba(255,149,0,0.6)',
            borderRadius: 12, pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

export function ReferenceGallery() {
  const [tab, setTab] = useState<'sports' | 'wildlife'>('sports');
  const [lightboxPreset, setLightboxPreset] = useState<Preset | null>(null);
  const { setSelectedPreset } = useAppStore();

  const items = tab === 'sports' ? SPORTS_PRESETS : WILDLIFE_PRESETS;

  const handleUsePreset = (p: Preset) => {
    setSelectedPreset(p);
    document.getElementById('edit')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['sports', 'wildlife'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 20px', borderRadius: 100,
                fontFamily: 'Inter, sans-serif',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.18s',
                background: tab === t ? '#FF9500' : 'rgba(255,255,255,0.06)',
                color: tab === t ? '#000' : 'rgba(255,255,255,0.5)',
                border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {t === 'sports' ? 'Sports Photography' : 'Wildlife'}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              columns: 'var(--gallery-cols, 4)',
              columnGap: 12,
            }}
            className="[--gallery-cols:2] sm:[--gallery-cols:3] lg:[--gallery-cols:4]"
          >
            {items.map((preset) => (
              <GalleryItem
                key={preset.id}
                preset={preset}
                onClick={() => setLightboxPreset(preset)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPreset && (
          <Lightbox
            preset={lightboxPreset}
            onClose={() => setLightboxPreset(null)}
            onUse={handleUsePreset}
          />
        )}
      </AnimatePresence>
    </>
  );
}
