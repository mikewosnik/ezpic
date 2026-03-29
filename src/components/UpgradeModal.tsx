import { motion } from 'framer-motion';

interface UpgradeModalProps {
  onClose: () => void;
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111',
          borderRadius: 20,
          border: '1px solid rgba(255,149,0,0.25)',
          padding: 32,
          maxWidth: 400,
          width: '100%',
          boxShadow: '0 0 0 1px rgba(255,149,0,0.1), 0 24px 80px rgba(0,0,0,0.7)',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
        }}
      >
        {/* Crown icon */}
        <div
          style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(255,149,0,0.2), rgba(255,107,0,0.15))',
            border: '1px solid rgba(255,149,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 26,
          }}
        >
          👑
        </div>

        <h3
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#fff',
            marginBottom: 10,
          }}
        >
          Free limit reached
        </h3>

        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 6 }}>
          You've reached the free limit of{' '}
          <strong style={{ color: 'rgba(255,255,255,0.8)' }}>3 custom presets</strong>.
        </p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 28 }}>
          Unlock unlimited presets with{' '}
          <strong style={{ color: '#FF9500' }}>EzPic Pro</strong>
          {' '}— $4.99/month.
        </p>

        {/* Perks */}
        <div
          style={{
            background: 'rgba(255,149,0,0.06)',
            border: '1px solid rgba(255,149,0,0.12)',
            borderRadius: 12,
            padding: '14px 18px',
            marginBottom: 24,
            textAlign: 'left',
          }}
        >
          {[
            'Unlimited custom presets',
            'Batch process up to 50 photos',
            'Priority AI queue',
            'Export presets as .json',
          ].map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <path d="M2.5 7L5.5 10L11.5 4" stroke="#FF9500" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 44, borderRadius: 11,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: 14,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            Maybe Later
          </button>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              flex: 1, height: 44, borderRadius: 11,
              background: 'linear-gradient(135deg, #FF9500, #FF6B00)',
              color: '#000', fontWeight: 700, fontSize: 14,
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 20px rgba(255,149,0,0.35)',
            }}
          >
            Upgrade to Pro
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
