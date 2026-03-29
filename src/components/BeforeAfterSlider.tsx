import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from 'react-compare-slider';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
}

function Label({ text, side }: { text: string; side: 'left' | 'right' }) {
  return (
    <div
      className="absolute top-4 z-10"
      style={{ [side === 'left' ? 'left' : 'right']: 14 }}
    >
      <span
        style={{
          display: 'inline-block',
          fontFamily: 'Inter, sans-serif',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: side === 'left' ? 'rgba(255,255,255,0.65)' : '#FF9500',
          background: side === 'left' ? 'rgba(0,0,0,0.6)' : 'rgba(255,149,0,0.15)',
          border: `1px solid ${side === 'left' ? 'rgba(255,255,255,0.1)' : 'rgba(255,149,0,0.4)'}`,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: 20,
        }}
      >
        {text}
      </span>
    </div>
  );
}

export function BeforeAfterSlider({ beforeSrc, afterSrc }: BeforeAfterSliderProps) {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.7)',
      }}
    >
      <ReactCompareSlider
        itemOne={
          <div className="relative w-full h-full">
            <ReactCompareSliderImage
              src={beforeSrc}
              alt="Original photo"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
            <Label text="Before" side="left" />
          </div>
        }
        itemTwo={
          <div className="relative w-full h-full">
            <ReactCompareSliderImage
              src={afterSrc}
              alt="Style-matched photo"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
            <Label text="After" side="right" />
          </div>
        }
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{
              background: '#FF9500',
              border: '2.5px solid rgba(255,255,255,0.95)',
              boxShadow: '0 0 0 4px rgba(255,149,0,0.25), 0 4px 16px rgba(0,0,0,0.5)',
              width: 42,
              height: 42,
              backdropFilter: 'none',
            }}
            linesStyle={{
              background: 'rgba(255,149,0,0.85)',
              width: 2,
            }}
          />
        }
        style={{ height: 'clamp(240px, 55vh, 680px)' }}
      />
    </div>
  );
}
