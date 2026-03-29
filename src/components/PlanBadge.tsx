/**
 * PlanBadge — shell component for future Pro plan upsell.
 * Not functional yet; renders a visual badge only.
 */
export function PlanBadge({ plan = 'Free' }: { plan?: 'Free' | 'Pro' }) {
  const isPro = plan === 'Pro';

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide select-none"
      style={{
        fontFamily: 'Syne, system-ui, sans-serif',
        background: isPro
          ? 'linear-gradient(135deg, #e8a045 0%, #c4822e 100%)'
          : 'rgba(255,255,255,0.08)',
        color: isPro ? '#fff' : 'rgba(255,255,255,0.45)',
        border: isPro ? 'none' : '1px solid rgba(255,255,255,0.10)',
      }}
    >
      {isPro ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M5 1L6.2 3.6L9 4L7 6L7.5 9L5 7.6L2.5 9L3 6L1 4L3.8 3.6L5 1Z" fill="currentColor" />
        </svg>
      ) : null}
      {plan}
    </span>
  );
}
