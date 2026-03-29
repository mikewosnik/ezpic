import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { BatchUploadZone } from '../components/BatchUploadZone';
import { PresetSelector } from '../components/PresetSelector';
import { ReferenceGallery } from '../components/ReferenceGallery';
import { HistorySection } from '../components/HistorySection';
import { useAppStore } from '../store/useAppStore';
import { runBatchPipeline } from '../lib/pipeline';

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

const CONTAINER: React.CSSProperties = {
  maxWidth: 1440,
  margin: '0 auto',
  width: '100%',
  padding: '0 clamp(16px, 4vw, 80px)',
};

const SEPARATOR: React.CSSProperties = {
  height: 1,
  background: 'rgba(255,255,255,0.07)',
  width: '100%',
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: 11, fontWeight: 600,
      color: 'rgba(255,255,255,0.3)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 10,
    }}>
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "'Bebas Neue', cursive",
      fontSize: 'clamp(40px, 5vw, 72px)',
      fontWeight: 400,
      letterSpacing: '0.03em',
      lineHeight: 1,
      color: '#fff',
      marginBottom: 0,
    }}>
      {children}
    </h2>
  );
}

export function Home() {
  const navigate = useNavigate();
  const {
    batchItems, selectedPreset, isBatchRunning,
    status, errorMessage, resetSingle,
  } = useAppStore();

  const pendingCount = batchItems.filter((i) => i.status === 'pending').length;
  const doneCount    = batchItems.filter((i) => i.status === 'done').length;
  const canApply     = pendingCount > 0 && !!selectedPreset && !isBatchRunning;

  // Single-image flow compat
  useEffect(() => {
    if (status === 'done') navigate('/results');
  }, [status, navigate]);

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" style={{ width: '100%' }} className="flex-1 flex flex-col">

      {/* ═══════════════════════════════════════════════════════ HERO / EDIT */}
      <section
        id="edit"
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 'clamp(80px, 10vh, 120px)',
          paddingBottom: 'clamp(60px, 8vh, 100px)',
        }}
      >
        <div style={CONTAINER}>
          <div style={{ maxWidth: 780 }}>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,149,0,0.1)',
                  border: '1px solid rgba(255,149,0,0.2)',
                  borderRadius: 100, padding: '6px 14px',
                  marginBottom: 24,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11, fontWeight: 600,
                  color: '#FF9500', letterSpacing: '0.08em', textTransform: 'uppercase',
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF9500', display: 'inline-block' }} />
                AI Style Transfer
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: 'clamp(56px, 9vw, 130px)',
                fontWeight: 400,
                letterSpacing: '0.02em',
                lineHeight: 0.95,
                color: '#FFFFFF',
                marginBottom: 24,
              }}
            >
              Match Any Edit.
              <br />
              <span style={{ color: 'rgba(255,255,255,0.22)' }}>Instantly.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(14px, 1.3vw, 17px)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.65,
                maxWidth: 500,
                marginBottom: 48,
              }}
            >
              Drop your photos, pick a style preset, and let Claude + Gemini do the work.
              Built for wildlife and sports photographers.
            </motion.p>
          </div>

          {/* Upload + controls */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: 900 }}
          >
            <BatchUploadZone />

            {/* Preset + Apply row — only show when photos are added */}
            <AnimatePresence>
              {batchItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      marginTop: 20,
                      padding: 20,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 16,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 14,
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Preset selector */}
                    <div style={{ flex: '1 1 240px', minWidth: 220 }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                        Style Preset
                      </p>
                      <PresetSelector />
                    </div>

                    {/* Apply + status */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: 'transparent', textTransform: 'uppercase', letterSpacing: '0.07em', userSelect: 'none' }}>
                        &nbsp;
                      </p>
                      <button
                        onClick={() => canApply && runBatchPipeline()}
                        disabled={!canApply}
                        style={{
                          height: 48, padding: '0 28px', borderRadius: 12,
                          background: canApply
                            ? 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)'
                            : 'rgba(255,255,255,0.05)',
                          color: canApply ? '#000' : 'rgba(255,255,255,0.2)',
                          fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em',
                          cursor: canApply ? 'pointer' : 'not-allowed',
                          border: 'none', fontFamily: 'Inter, sans-serif',
                          whiteSpace: 'nowrap',
                          boxShadow: canApply ? '0 4px 20px rgba(255,149,0,0.3)' : 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        {isBatchRunning
                          ? `Processing…`
                          : `Apply Preset to ${pendingCount} Photo${pendingCount !== 1 ? 's' : ''}`}
                      </button>
                    </div>
                  </div>

                  {/* Progress summary */}
                  {doneCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        marginTop: 12,
                        padding: '10px 16px',
                        background: 'rgba(48,209,88,0.07)',
                        border: '1px solid rgba(48,209,88,0.18)',
                        borderRadius: 10,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 13, color: '#30D158',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7L5.5 10.5L12 3.5" stroke="#30D158" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {doneCount} photo{doneCount !== 1 ? 's' : ''} transformed — saved to History below
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Single-flow error */}
            <AnimatePresence>
              {status === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: 12, padding: '12px 16px', borderRadius: 12,
                    background: 'rgba(255,69,58,0.08)',
                    border: '1px solid rgba(255,69,58,0.2)',
                    color: '#FF6961', fontSize: 13,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {errorMessage}
                  <button onClick={resetSingle} style={{ marginLeft: 12, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}>
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <div style={SEPARATOR} />

      {/* ═══════════════════════════════════════════════════════ REFERENCE */}
      <section
        id="reference"
        style={{
          paddingTop: 'clamp(60px, 8vh, 100px)',
          paddingBottom: 'clamp(60px, 8vh, 100px)',
        }}
      >
        <div style={CONTAINER}>
          <div style={{ marginBottom: 40 }}>
            <SectionLabel>Inspiration</SectionLabel>
            <SectionHeading>Reference Gallery</SectionHeading>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.35)', marginTop: 12 }}>
              Click any image to preview the style and apply it to your batch.
            </p>
          </div>
          <ReferenceGallery />
        </div>
      </section>

      <div style={SEPARATOR} />

      {/* ═══════════════════════════════════════════════════════ HISTORY */}
      <section
        id="history"
        style={{
          paddingTop: 'clamp(60px, 8vh, 100px)',
          paddingBottom: 'clamp(80px, 10vh, 120px)',
        }}
      >
        <div style={CONTAINER}>
          <div style={{ marginBottom: 40 }}>
            <SectionLabel>Saved</SectionLabel>
            <SectionHeading>Your Edited Photos</SectionHeading>
          </div>
          <HistorySection />
        </div>
      </section>
    </motion.div>
  );
}
