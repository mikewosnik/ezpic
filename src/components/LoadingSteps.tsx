import { motion, AnimatePresence } from 'framer-motion';
import { AppStatus } from '../store/useAppStore';

interface Step {
  num: string;
  label: string;
  sublabel: string;
  visibleFrom: AppStatus[];
}

const STEPS: Step[] = [
  {
    num: '01',
    label: 'Analyzing reference',
    sublabel: 'Claude reads the edit style',
    visibleFrom: ['analyzing', 'writing', 'transforming', 'finishing'],
  },
  {
    num: '02',
    label: 'Writing style prompt',
    sublabel: 'Color, tone, atmosphere mapped',
    visibleFrom: ['writing', 'transforming', 'finishing'],
  },
  {
    num: '03',
    label: 'Applying with Gemini',
    sublabel: 'Transforming your photo',
    visibleFrom: ['transforming', 'finishing'],
  },
  {
    num: '04',
    label: 'Finishing up',
    sublabel: 'Almost there',
    visibleFrom: ['finishing'],
  },
];

function getStepState(step: Step, status: AppStatus, index: number) {
  const visible = step.visibleFrom.includes(status);
  if (!visible) return 'hidden';

  const visibleIndexes = STEPS
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.visibleFrom.includes(status))
    .map(({ i }) => i);

  const lastVisibleIndex = visibleIndexes[visibleIndexes.length - 1];
  if (index === lastVisibleIndex) return 'active';
  return 'done';
}

interface LoadingStepsProps {
  status: AppStatus;
}

export function LoadingSteps({ status }: LoadingStepsProps) {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      {STEPS.map((step, i) => {
        const state = getStepState(step, status, i);
        if (state === 'hidden') return null;

        return (
          <AnimatePresence key={step.num}>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
              className="flex items-center gap-4"
              style={{
                paddingBottom: i < STEPS.length - 1 ? 20 : 0,
                position: 'relative',
              }}
            >
              {/* Vertical connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="absolute"
                  style={{
                    left: 19,
                    top: 40,
                    width: 1,
                    height: 20,
                    background: state === 'done'
                      ? 'rgba(48,209,88,0.4)'
                      : 'rgba(255,255,255,0.08)',
                  }}
                />
              )}

              {/* Step indicator */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    state === 'done'
                      ? 'rgba(48,209,88,0.12)'
                      : state === 'active'
                        ? 'rgba(255,149,0,0.12)'
                        : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${
                    state === 'done'
                      ? 'rgba(48,209,88,0.3)'
                      : state === 'active'
                        ? 'rgba(255,149,0,0.35)'
                        : 'rgba(255,255,255,0.08)'
                  }`,
                  transition: 'all 0.3s ease',
                }}
              >
                {state === 'done' ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="#30D158" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : state === 'active' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5" stroke="rgba(255,149,0,0.2)" strokeWidth="2" />
                      <path d="M7 2a5 5 0 0 1 5 5" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                ) : (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.3)',
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {step.num}
                  </span>
                )}
              </div>

              {/* Text */}
              <div style={{ fontFamily: 'Inter, sans-serif', flex: 1 }}>
                <p
                  className="font-semibold text-sm leading-tight"
                  style={{
                    color:
                      state === 'done'
                        ? 'rgba(255,255,255,0.35)'
                        : state === 'active'
                          ? '#FFFFFF'
                          : 'rgba(255,255,255,0.5)',
                    transition: 'color 0.3s',
                    textDecoration: state === 'done' ? 'none' : 'none',
                  }}
                >
                  {step.label}
                </p>
                {state === 'active' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs mt-0.5"
                    style={{ color: 'rgba(255,149,0,0.7)' }}
                  >
                    {step.sublabel}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
}
