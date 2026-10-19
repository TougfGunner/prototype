import React from 'react';

export interface AJBellWordmarkProps {
  height?: number;
  variant?: 'auto' | 'crimson' | 'white' | 'burgundy' | 'monochrome';
  className?: string;
}

/**
 * Official AJ Bell Redesigned ("Chime") Wordmark & Bell SVG
 * Extracted verbatim from https://www.ajbell.co.uk/ header vector paths (viewBox 0 0 110 35).
 * Defaults to variant="auto" which adapts via --ajb-logo-wordmark (#DA3946 in Light, #FAF9F5 in Dark).
 */
export const AJBellWordmarkLogo: React.FC<AJBellWordmarkProps> = ({
  height = 24,
  variant = 'auto',
  className,
}) => {
  const width = Math.round((height / 35) * 110);
  const wordmarkFill =
    variant === 'white'
      ? '#FFFFFF'
      : variant === 'burgundy'
        ? 'var(--ajb-brand-burgundy)'
        : variant === 'monochrome'
          ? 'currentColor'
          : variant === 'crimson'
            ? 'var(--ajb-brand-crimson)'
            : 'var(--ajb-logo-wordmark)';
  const bellFill =
    variant === 'white'
      ? 'var(--ajb-accent-amber)'
      : variant === 'burgundy'
        ? 'var(--ajb-brand-crimson)'
        : variant === 'monochrome'
          ? 'currentColor'
          : 'var(--ajb-brand-logo-red)';
  const clapperFill =
    variant === 'monochrome'
      ? 'currentColor'
      : variant === 'crimson'
        ? 'var(--ajb-brand-logo-red)'
        : 'var(--ajb-accent-amber)';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AJ Bell"
      role="img"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M13.0156 7.16912L16.0758 15.6436H9.99522L13.0156 7.16912ZM10.0747 0L0 28.1845H5.5242L8.26642 20.443H17.8145L20.5965 28.1845H26.5181L15.9566 0H10.0747Z"
        fill={wordmarkFill}
      />
      <path
        d="M56.6628 19.9209C56.6628 16.497 55.4507 14.4587 53.0761 13.3241C54.8446 12.3502 56.017 10.1111 56.017 7.62096C56.017 2.77126 53.2052 0 47.681 0H39.0967V28.1845H48.2474C53.2847 28.1845 56.6728 25.0919 56.6728 19.9209M47.4327 16.1657C49.688 16.1657 50.9002 17.4308 50.9002 19.6699C50.9002 21.7885 49.688 23.2545 47.4327 23.2545H44.6109V16.1657H47.4327ZM47.1942 4.88986C49.2509 4.88986 50.2941 5.95419 50.2941 8.10292C50.2941 10.2516 49.1614 11.3662 47.1942 11.3662H44.6109V4.88986H47.1942Z"
        fill={wordmarkFill}
      />
      <path
        d="M79.1966 19.0574C79.3159 18.1236 79.2761 17.3505 79.2761 16.8183C79.2761 10.3019 75.1628 6.02448 68.7146 6.02448C62.2664 6.02448 58.1133 10.834 58.1133 17.3505C58.1133 24.3188 62.5843 28.546 69.1517 28.546C74.3878 28.546 77.289 25.6141 78.5806 22.883L74.5964 20.443C73.4638 22.2303 71.894 23.6963 69.1517 23.6963C66.0916 23.6963 64.0746 21.9893 63.7964 19.0574H79.1867H79.1966ZM68.6848 10.6332C71.6257 10.6332 73.4042 12.5108 73.6824 14.9507H63.9256C64.2137 12.4707 65.9425 10.6332 68.6848 10.6332Z"
        fill={wordmarkFill}
      />
      <path
        d="M96.9119 28.1845V25.7145C97.4583 25.4333 97.8259 24.851 97.8259 24.1983V23.385C97.8259 20.8045 99.8925 18.706 102.456 18.706C105.019 18.706 107.086 20.8045 107.086 23.385V24.1983C107.086 24.861 107.454 25.4333 108 25.7145V28.1845H96.9119Z"
        fill={bellFill}
      />
      <path
        d="M104.771 29.6505C104.771 30.9457 103.738 31.99 102.456 31.99C101.174 31.99 100.141 30.9457 100.141 29.6505"
        fill={clapperFill}
      />
      <path
        d="M36.3644 0H30.7607V20.8146C30.7607 21.9592 30.4825 22.9733 28.863 22.9733H27.2932V28.1845C27.9788 28.2247 29.1512 28.2247 29.6678 28.2247C35.0231 28.2247 36.3545 25.4936 36.3545 21.427V0H36.3644Z"
        fill={wordmarkFill}
      />
      <path d="M35.1421 0H29.4888V4.41795H35.1421V0Z" fill={wordmarkFill} />
      <path
        d="M30.8003 6.4462L30.7605 6.51648C30.7605 5.60277 30.2439 4.80955 29.4888 4.40792V4.00629L30.8698 4.40792L30.8003 6.4462Z"
        fill={wordmarkFill}
      />
      <path d="M86.6485 0H81.2534V28.1845H86.6485V0Z" fill={wordmarkFill} />
      <path d="M85.6448 0H79.9915V4.41795H85.6448V0Z" fill={wordmarkFill} />
      <path
        d="M81.303 6.4462L81.2632 6.51648C81.2632 5.60277 80.7466 4.80955 79.9915 4.40792V4.00629L81.3725 4.40792L81.303 6.4462Z"
        fill={wordmarkFill}
      />
      <path d="M94.9844 0H89.5894V28.1845H94.9844V0Z" fill={wordmarkFill} />
      <path d="M93.9908 0H88.3374V4.41795H93.9908V0Z" fill={wordmarkFill} />
      <path
        d="M89.6489 6.4462L89.6092 6.51648C89.6092 5.60277 89.0925 4.80955 88.3374 4.40792V4.00629L89.7185 4.40792L89.6489 6.4462Z"
        fill={wordmarkFill}
      />
    </svg>
  );
};

/**
 * Compact circular AJ Bell "ll + Bell" Chime Mark for the 38px navigation rail
 */
export const AJBellChimeMark: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="AJ Bell Chime Icon"
    role="img"
    style={{ display: 'block', flexShrink: 0, filter: 'drop-shadow(0 4px 10px rgba(18, 23, 38, 0.22))' }}
  >
    <defs>
      <linearGradient id="ajbell-rail-chime-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--ajb-brand-crimson, #6F8ED6)" />
        <stop offset="52%" stopColor="var(--ajb-accent-periwinkle, #8FA8E0)" />
        <stop offset="100%" stopColor="var(--ajb-brand-burgundy, #0D0D0F)" />
      </linearGradient>
    </defs>
    <rect width="36" height="36" rx="18" fill="url(#ajbell-rail-chime-grad)" />
    <g transform="translate(-71.5, 2.5)">
      <path d="M86.6485 0H81.2534V28.1845H86.6485V0Z" fill="#FFFFFF" />
      <path d="M85.6448 0H79.9915V4.41795H85.6448V0Z" fill="#FFFFFF" />
      <path
        d="M81.303 6.4462L81.2632 6.51648C81.2632 5.60277 80.7466 4.80955 79.9915 4.40792V4.00629L81.3725 4.40792L81.303 6.4462Z"
        fill="#FFFFFF"
      />
      <path d="M94.9844 0H89.5894V28.1845H94.9844V0Z" fill="#FFFFFF" />
      <path d="M93.9908 0H88.3374V4.41795H93.9908V0Z" fill="#FFFFFF" />
      <path
        d="M89.6489 6.4462L89.6092 6.51648C89.6092 5.60277 89.0925 4.80955 88.3374 4.40792V4.00629L89.7185 4.40792L89.6489 6.4462Z"
        fill="#FFFFFF"
      />
      <path
        d="M96.9119 28.1845V25.7145C97.4583 25.4333 97.8259 24.851 97.8259 24.1983V23.385C97.8259 20.8045 99.8925 18.706 102.456 18.706C105.019 18.706 107.086 20.8045 107.086 23.385V24.1983C107.086 24.861 107.454 25.4333 108 25.7145V28.1845H96.9119Z"
        fill="#FFE272"
      />
      <path
        d="M104.771 29.6505C104.771 30.9457 103.738 31.99 102.456 31.99C101.174 31.99 100.141 30.9457 100.141 29.6505"
        fill="#FFE272"
      />
    </g>
  </svg>
);

/**
 * Official AJ Bell "Which? Recommended Provider" & "Feel good, investing" trust pill
 */
export const AJBellMottoPill: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div
    data-testid="ajbell-motto-pill"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: compact ? 6 : 8,
      height: compact ? 26 : 30,
      padding: compact ? '0 10px' : '0 12px',
      borderRadius: 9999,
      background:
        'var(--ajb-gradient-motto-pill, linear-gradient(135deg, #6F8ED6 0%, #5273C2 54%, #17181C 100%))',
      color: '#FFFFFF',
      fontSize: compact ? 10.5 : 11,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      boxShadow: 'var(--ajb-shadow-pill)',
      whiteSpace: 'nowrap',
    }}
  >
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: '#FFE272',
        boxShadow: '0 0 0 3px rgba(255, 226, 114, 0.25)',
        flexShrink: 0,
      }}
    />
    <span style={{ fontWeight: 800 }}>Feel good, investing</span>
    {!compact && (
      <>
        <span style={{ opacity: 0.45 }}>·</span>
        <span style={{ fontWeight: 600, opacity: 0.92, fontSize: 10 }}>
          Which? Recommended 8 yrs
        </span>
      </>
    )}
  </div>
);
