import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  number: '01' | '02';
  label: string;
  sublabel: string;
  file: File | null;
  onFileChange: (file: File) => void;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_MB = 10;

export function UploadZone({ number, label, sublabel, file, onFileChange }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = file ? URL.createObjectURL(file) : null;

  const accept = useCallback(
    (f: File) => {
      setError(null);
      if (!ACCEPTED.includes(f.type)) { setError('JPEG, PNG, WebP or GIF only'); return; }
      if (f.size > MAX_MB * 1024 * 1024) { setError(`Max ${MAX_MB} MB`); return; }
      onFileChange(f);
    },
    [onFileChange],
  );

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) accept(f);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) accept(f);
    e.target.value = '';
  };

  const active = dragging || hovering;

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        className="relative overflow-hidden cursor-pointer select-none outline-none"
        style={{
          height: 'clamp(200px, 22vw, 360px)',
          background: '#111111',
          borderRadius: 16,
          border: `1.5px solid ${dragging ? '#FF9500' : file ? '#30D158' : active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
          transition: 'border-color 0.18s ease',
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} className="sr-only" onChange={onChange} />

        {/* Number badge */}
        <div
          className="absolute top-4 left-4 z-10 font-bold tabular-nums"
          style={{
            fontSize: 11,
            letterSpacing: '0.08em',
            color: file ? '#30D158' : 'rgba(255,255,255,0.25)',
            fontFamily: 'Inter, sans-serif',
            transition: 'color 0.2s',
          }}
        >
          {number}
        </div>

        <AnimatePresence mode="wait">
          {file && previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onLoad={() => URL.revokeObjectURL(previewUrl)}
              />
              {/* Bottom overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}
              >
                <span
                  className="text-white/80 text-xs truncate max-w-[75%]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {file.name}
                </span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#30D158' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </div>
              {/* Hover-to-replace */}
              <AnimatePresence>
                {hovering && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.55)' }}
                  >
                    <span
                      className="text-white text-sm font-semibold px-4 py-2 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.12)', fontFamily: 'Inter, sans-serif' }}
                    >
                      Change photo
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center"
            >
              {/* Icon */}
              <motion.div
                animate={dragging ? { scale: 1.2, y: -6 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: dragging ? 'rgba(255,149,0,0.15)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${dragging ? 'rgba(255,149,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 12V4M9 4L6 7M9 4L12 7"
                    stroke={dragging ? '#FF9500' : 'rgba(255,255,255,0.45)'}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 15H15"
                    stroke={dragging ? '#FF9500' : 'rgba(255,255,255,0.25)'}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              <div style={{ fontFamily: 'Inter, sans-serif' }}>
                <p className="font-bold text-sm text-white mb-1">{label}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{sublabel}</p>
              </div>

              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
                {dragging ? 'Release to upload' : 'Drop or click to browse'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs px-1"
            style={{ color: '#FF453A', fontFamily: 'Inter, sans-serif' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
