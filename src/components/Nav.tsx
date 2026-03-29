import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Edit',      href: '/#edit' },
  { label: 'Reference', href: '/#reference' },
  { label: 'History',   href: '/#history' },
  { label: 'My Presets', href: '/my-presets' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close hamburger on route change
  useEffect(() => { setOpen(false); }, [location]);

  const isHome = location.pathname === '/';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled || open
          ? 'rgba(0,0,0,0.85)'
          : 'rgba(0,0,0,0)',
        backdropFilter: scrolled || open ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled || open ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.07)'
          : '1px solid transparent',
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 80px)',
          height: 60,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            textDecoration: 'none',
          }}
        >
          Ez<span style={{ color: '#FF9500' }}>Pic</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/my-presets'
                ? location.pathname === '/my-presets'
                : false;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={link.href.startsWith('/#') ? (e) => {
                  if (isHome) {
                    e.preventDefault();
                    const id = link.href.slice(2);
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }
                } : undefined}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  color: isActive ? '#FF9500' : 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 8,
                  transition: 'color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = isActive ? '#FF9500' : 'rgba(255,255,255,0.55)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: 22,
                height: 1.5,
                background: '#fff',
                borderRadius: 2,
                transition: 'transform 0.2s, opacity 0.2s',
                transformOrigin: 'center',
                transform:
                  open
                    ? i === 0 ? 'translateY(5px) rotate(45deg)'
                    : i === 2 ? 'translateY(-5px) rotate(-45deg)'
                    : 'scaleX(0)'
                    : 'none',
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '12px 24px 20px',
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith('/#') && isHome) {
                  e.preventDefault();
                  const id = link.href.slice(2);
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  setOpen(false);
                }
              }}
              style={{
                display: 'block',
                fontFamily: 'Inter, sans-serif',
                fontSize: 15,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
