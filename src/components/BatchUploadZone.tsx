import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, BatchItem } from '../store/useAppStore';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_MB = 10;

function StatusOverlay({ status, error }: { status: BatchItem['status']; error?: string }) {
  if (status === 'pending') return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background:
          status === 'processing'
            ? 'rgba(0,0,0,0.55)'
            : status === 'done'
              ? 'rgba(48,209,88,0.25)'
              : 'rgba(255,69,58,0.35)',
        borderRadius: 10,
      }}
    >
      {status === 'processing' && (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
            <path d="M12 3a9 9 0 0 1 9 9" stroke="#FF9500" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      )}
      {status === 'done' && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12L9.5 16.5L19 7" stroke="#30D158" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 6V11M10 13.5V14" stroke="#FF453A" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10" cy="10" r="8" stroke="#FF453A" strokeWidth="1.5" />
          </svg>
          {error && <span style={{ fontSize: 9, color: '#FF453A', wordBreak: 'break-word' }}>{error.slice(0, 40)}</span>}
        </div>
      )}
    </div>
  );
}

export function BatchUploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { batchItems, addBatchFiles, removeBatchItem, isBatchRunning } = useAppStore();

  const accept = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter(
      (f) => ACCEPTED.includes(f.type) && f.size <= MAX_MB * 1024 * 1024,
    );
    if (valid.length > 0) addBatchFiles(valid);
  }, [addBatchFiles]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    accept(e.dataTransfer.files);
  };

  const hasItems = batchItems.length > 0;

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload photos"
        onClick={() => !isBatchRunning && inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          width: '100%',
          minHeight: hasItems ? 80 : 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          borderRadius: 16,
          border: `1.5px dashed ${dragging ? '#FF9500' : 'rgba(255,255,255,0.12)'}`,
          background: dragging ? 'rgba(255,149,0,0.05)' : 'rgba(255,255,255,0.025)',
          cursor: isBatchRunning ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          padding: hasItems ? '16px 24px' : 32,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          multiple
          className="sr-only"
          onChange={(e) => { if (e.target.files) accept(e.target.files); e.target.value = ''; }}
        />

        {hasItems ? (
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(255,149,0,0.12)',
                border: '1px solid rgba(255,149,0,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 9V3M7 3L4.5 5.5M7 3L9.5 5.5" stroke="#FF9500" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 11.5H12" stroke="#FF9500" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              Add more photos
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.div
              animate={dragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: dragging ? 'rgba(255,149,0,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${dragging ? 'rgba(255,149,0,0.35)' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 14V5M11 5L7.5 8.5M11 5L14.5 8.5" stroke={dragging ? '#FF9500' : 'rgba(255,255,255,0.4)'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 17H18.5" stroke={dragging ? '#FF9500' : 'rgba(255,255,255,0.25)'} strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </motion.div>
            <div style={{ fontFamily: 'Inter, sans-serif' }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>
                {dragging ? 'Drop your photos' : 'Drop photos here'}
              </p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                Select multiple files at once · JPEG PNG WebP · max 10 MB each
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail grid */}
      <AnimatePresence>
        {hasItems && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', marginTop: 16 }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 10,
              }}
            >
              {batchItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', background: '#111' }}
                >
                  <img
                    src={item.resultBase64
                      ? `data:${item.resultMimeType};base64,${item.resultBase64}`
                      : item.previewUrl}
                    alt={item.file.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  <StatusOverlay status={item.status} error={item.error} />

                  {/* Remove button */}
                  {item.status !== 'processing' && !isBatchRunning && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeBatchItem(item.id); }}
                      style={{
                        position: 'absolute', top: 5, right: 5,
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.7)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff', fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        lineHeight: 1, zIndex: 10,
                      }}
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  )}

                  {/* Download done item */}
                  {item.status === 'done' && item.resultBase64 && (
                    <a
                      href={`data:${item.resultMimeType};base64,${item.resultBase64}`}
                      download={`ezpic-${item.file.name}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'absolute', bottom: 5, right: 5,
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#30D158',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10,
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 1V7.5M5.5 7.5L3 5M5.5 7.5L8 5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 10H10" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </a>
                  )}

                  {/* Filename tooltip on bottom */}
                  <div
                    style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '16px 6px 4px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
                      fontSize: 9, color: 'rgba(255,255,255,0.6)',
                      fontFamily: 'Inter, sans-serif',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {item.file.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
