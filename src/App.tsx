import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './pages/Home';
import { Results } from './pages/Results';
import { MyPresets } from './pages/MyPresets';
import { Nav } from './components/Nav';
import { LoadingSteps } from './components/LoadingSteps';
import { useAppStore, AppStatus } from './store/useAppStore';

const LOADING: AppStatus[] = ['analyzing', 'writing', 'transforming', 'finishing'];

function LoadingOverlay() {
  const status = useAppStore((s) => s.status);
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#000' }}
    >
      {/* Progress bar */}
      <motion.div
        className="absolute top-0 left-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, #FF9500, #FFB800)' }}
        initial={{ width: '0%' }}
        animate={{
          width: status === 'analyzing' ? '25%' : status === 'writing' ? '50%' : status === 'transforming' ? '75%' : '95%',
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em' }}>
          Ez<span style={{ color: '#FF9500' }}>Pic</span>
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ width: '100%', maxWidth: 360, padding: '0 24px' }}
      >
        <LoadingSteps status={status as (typeof LOADING)[number]} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-10 text-xs"
        style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'Inter, sans-serif' }}
      >
        This usually takes 20–40 seconds
      </motion.p>
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const status = useAppStore((s) => s.status);
  const loading = LOADING.includes(status as (typeof LOADING)[number]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', width: '100%' }}>
      <Nav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"           element={<Home />} />
          <Route path="/results"    element={<Results />} />
          <Route path="/my-presets" element={<MyPresets />} />
        </Routes>
      </AnimatePresence>
      <AnimatePresence>{loading && <LoadingOverlay />}</AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
