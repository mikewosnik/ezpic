import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, clearHistory, HistoryItem } from '../lib/history';

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function HistoryCard({ item }: { item: HistoryItem }) {
  const src = `data:${item.resultMimeType};base64,${item.resultBase64}`;
  const [hovered, setHovered] = useState(false);

  const download = () => {
    const ext = item.resultMimeType.split('/')[1] ?? 'png';
    const a = document.createElement('a');
    a.href = src;
    a.download = `ezpic-${item.originalFilename ?? item.id}.${ext}`;
    a.click();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14, overflow: 'hidden',
        background: '#111',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'border-color 0.2s',
      }}
    >
      {/* Thumbnail */}
      <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
        <img
          src={src}
          alt={item.originalFilename}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.3s',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px', fontFamily: 'Inter, sans-serif' }}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            style={{
              fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100,
              background: 'rgba(255,149,0,0.12)',
              border: '1px solid rgba(255,149,0,0.25)',
              color: '#FF9500',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: '75%',
            }}
          >
            {item.presetName}
          </span>
          <button
            onClick={download}
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
            title="Download"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5V9M6.5 9L4 6.5M6.5 9L9 6.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.5 11H11.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>
          {item.originalFilename}
        </p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
          {formatDate(item.date)}
        </p>
      </div>
    </motion.div>
  );
}

export function HistorySection() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const load = useCallback(() => setItems(getHistory()), []);

  useEffect(() => {
    load();
    // Refresh when storage changes (e.g., batch completes)
    const handler = () => load();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [load]);

  // Allow external refresh via custom event
  useEffect(() => {
    const handler = () => load();
    window.addEventListener('ezpic:history-updated', handler);
    return () => window.removeEventListener('ezpic:history-updated', handler);
  }, [load]);

  const handleClear = () => {
    clearHistory();
    setItems([]);
    setConfirmClear(false);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {items.length} photo{items.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            style={{
              padding: '7px 16px', borderRadius: 8,
              background: 'rgba(255,69,58,0.08)',
              border: '1px solid rgba(255,69,58,0.2)',
              color: '#FF453A', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            Clear History
          </button>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div
          className="flex flex-col items-center justify-center text-center py-20"
          style={{ border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 16 }}
        >
          <div
            style={{
              width: 52, height: 52, borderRadius: 14, marginBottom: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="4" width="16" height="14" rx="3" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <circle cx="8" cy="9" r="1.5" fill="rgba(255,255,255,0.2)" />
              <path d="M3 15L7 11L10 14L14 10L19 15" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
            No edits yet.
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
            Start above.
          </p>
        </div>
      )}

      {/* Grid */}
      <AnimatePresence>
        {items.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {items.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Confirm clear dialog */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setConfirmClear(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#1a1a1a', borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.1)',
                padding: 28, maxWidth: 360, width: '100%',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                Clear all history?
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24, lineHeight: 1.6 }}>
                This will permanently delete all {items.length} saved photos from your browser. This can't be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmClear(false)}
                  style={{
                    flex: 1, height: 42, borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: 14,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleClear}
                  style={{
                    flex: 1, height: 42, borderRadius: 10,
                    background: 'rgba(255,69,58,0.15)',
                    border: '1px solid rgba(255,69,58,0.3)',
                    color: '#FF453A', fontWeight: 600, fontSize: 14,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
