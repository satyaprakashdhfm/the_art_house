/** Background art for the homepage Custom Art banner: a flowing gold line and a line-drawn palette with brushes. */
export default function CustomArtDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* One flowing line across the whole card */}
      <svg viewBox="0 0 1200 460" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M-20 420 C 220 330 340 470 590 360 S 930 70 1220 110"
          fill="none"
          stroke="#c27c38"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-20 438 C 230 350 350 488 600 378 S 940 92 1220 132"
          fill="none"
          stroke="#c27c38"
          strokeOpacity="0.18"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Soft beige paint smear behind the palette */}
      <svg viewBox="0 0 400 200" className="absolute bottom-[1%] left-[35%] hidden w-[24%] max-w-[320px] -rotate-[16deg] opacity-40 lg:block">
        <defs>
          <linearGradient id="smear" x1="0" x2="1">
            <stop offset="0" stopColor="#e8d7b4" stopOpacity="0" />
            <stop offset="0.25" stopColor="#e8d7b4" stopOpacity="0.9" />
            <stop offset="0.8" stopColor="#d9c08f" stopOpacity="0.8" />
            <stop offset="1" stopColor="#d9c08f" stopOpacity="0" />
          </linearGradient>
          <filter id="bristles">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.6" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="14" />
          </filter>
        </defs>
        <g filter="url(#bristles)" fill="url(#smear)">
          <path d="M10 120 C 90 70 220 60 390 80 C 300 100 180 120 40 150 Z" />
          <path d="M30 150 C 120 115 250 105 380 112 C 280 132 170 148 60 170 Z" opacity="0.6" />
        </g>
      </svg>

      {/* Palette and brushes: cream line art, between the text and the paintings */}
      <svg
        viewBox="0 0 260 220"
        className="absolute bottom-[3%] left-[42%] hidden w-[14%] max-w-[200px] -rotate-12 text-[#f4ecdc] opacity-75 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* palette */}
        <path d="M120 40 C178 36 226 72 222 118 C219 156 182 178 142 172 C122 169 118 152 100 150 C76 148 80 180 50 176 C18 172 6 136 12 104 C19 64 62 42 120 40 Z" />
        <ellipse cx="62" cy="134" rx="13" ry="10" />
        {[
          [78, 78, 11],
          [120, 64, 11],
          [162, 74, 11],
          [192, 108, 10],
          [176, 144, 9],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="currentColor" fillOpacity="0.14" />
        ))}

        {/* brush 1: long, flat tip */}
        <g transform="translate(40 206) rotate(-60)">
          <path d="M0 -2.5 Q 70 -7 140 -6.5 L140 6.5 Q 70 7 0 2.5 Z" />
          <rect x="140" y="-7" width="26" height="14" rx="1.5" />
          <path d="M148 -7 V7 M156 -7 V7" strokeWidth="1" />
          <path d="M166 -7 Q 190 -9 206 -2 Q 208 0 206 2 Q 190 9 166 7 Z" fill="currentColor" fillOpacity="0.14" />
        </g>
        {/* brush 2: shorter, round tip */}
        <g transform="translate(222 208) rotate(-122)">
          <path d="M0 -2 Q 55 -5.5 110 -5 L110 5 Q 55 5.5 0 2 Z" />
          <rect x="110" y="-5.5" width="20" height="11" rx="1.5" />
          <path d="M117 -5.5 V5.5" strokeWidth="1" />
          <path d="M130 -5.5 Q 150 -7 162 0 Q 150 7 130 5.5 Z" fill="currentColor" fillOpacity="0.14" />
        </g>
      </svg>
    </div>
  );
}
