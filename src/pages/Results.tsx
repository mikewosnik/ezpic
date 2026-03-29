import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { useAppStore } from '../store/useAppStore';

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function Results() {
  const navigate = useNavigate();
  const { userImage, generatedImage, generatedMimeType, stylePrompt, status, resetSingle: reset } =
    useAppStore();

  const [promptOpen, setPromptOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (status !== 'done' || !generatedImage || !userImage) {
      navigate('/', { replace: true });
    }
  }, [status, generatedImage, userImage, navigate]);

  if (!generatedImage || !userImage) return null;

  const originalSrc = URL.createObjectURL(userImage);
  const resultSrc = `data:${generatedMimeType};base64,${generatedImage}`;

  const handleDownload = () => {
    const ext = generatedMimeType.split('/')[1] ?? 'png';
    const a = document.createElement('a');
    a.href = resultSrc;
    a.download = `ezpic-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleReset = () => { reset(); navigate('/'); };

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" style={{ width: '100%' }} className="flex-1 flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 md:px-10"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={handleReset}
          className="flex items-center gap-2 transition-colors"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.35)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          New photo
        </button>

        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
          }}
        >
          Ez<span style={{ color: '#FF9500' }}>Pic</span>
        </span>

        <div style={{ width: 80 }} />
      </nav>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-8 lg:px-12 pb-14 lg:pb-24 pt-6 sm:pt-10 lg:pt-14 w-full mx-auto gap-6 sm:gap-8 lg:gap-10" style={{ maxWidth: 1100 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div
            className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(48,209,88,0.1)',
              border: '1px solid rgba(48,209,88,0.2)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              fontWeight: 600,
              color: '#30D158',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="#30D158" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Done
          </div>

          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(26px, 5vw, 44px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: '#FFFFFF',
            }}
          >
            Style transferred.
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              color: 'rgba(255,255,255,0.35)',
              marginTop: 8,
            }}
          >
            Drag the handle to compare.
          </p>
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <BeforeAfterSlider beforeSrc={originalSrc} afterSrc={resultSrc} />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-2.5 w-full" style={{ maxWidth: 420 }}
        >
          {/* Download */}
          <button
            onClick={handleDownload}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 12,
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              transition: 'all 0.2s ease',
              background: downloaded
                ? 'rgba(48,209,88,0.15)'
                : 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)',
              color: downloaded ? '#30D158' : '#000',
              boxShadow: downloaded
                ? '0 0 0 1px rgba(48,209,88,0.3)'
                : '0 4px 20px rgba(255,149,0,0.3)',
            }}
          >
            {downloaded ? '✓ Saved' : 'Download'}
          </button>

          {/* Try another */}
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 12,
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            Try another photo
          </button>
        </motion.div>

        {/* Style prompt collapsible */}
        {stylePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="w-full max-w-3xl"
          >
            <button
              onClick={() => setPromptOpen((o) => !o)}
              className="flex items-center gap-2 transition-colors"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.3)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              <motion.span animate={{ rotate: promptOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                ▾
              </motion.span>
              See style prompt
            </button>

            <AnimatePresence>
              {promptOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    style={{
                      marginTop: 12,
                      padding: '16px 18px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 12,
                      lineHeight: 1.7,
                      color: 'rgba(255,255,255,0.4)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {stylePrompt}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
