'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  minFontSize?: number;
}

const TextPressure: React.FC<TextPressureProps> = ({
  text = 'Compressa',
  fontFamily = 'Compressa VF',
  fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  strokeWidth = 2,
  className = '',
  minFontSize = 24,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');
  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = () => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  };

  useEffect(() => {
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, [scale, text]);

  useEffect(() => {
    let rafId: number;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const d = dist(mouseRef.current, charCenter);

          const getAttr = (distance: number, minVal: number, maxVal: number) => {
            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
            return Math.max(minVal, val + minVal);
          };

          const wdth = width ? Math.floor(getAttr(d, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : '0';
          const alphaVal = alpha ? getAttr(d, 0, 1).toFixed(2) : '1';

          span.style.opacity = alphaVal;
          span.style.fontVariationSettings = 'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal};
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha, chars.length]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-transparent">
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }
        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}</style>

      <h1
        ref={titleRef}
        className={text-pressure-title ${className} ${flex ? 'flex justify-between' : ''} ${stroke ? 'stroke' : ''} uppercase text-center}
        style={{
          fontFamily,
          fontSize: fontSize,
          lineHeight,
          transform: scale(1, ${scaleY}),
          transformOrigin: 'center top',
          margin: 0,
          fontWeight: 100,
          color: stroke ? undefined : textColor,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            className="inline-block"
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default function Home() {
  return (
    <div className="relative min-h-screen gradient-bg overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        src="/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="star-field min-h-screen">
        <header className="backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-1 flex items-center">
                <img src="/logo.png" alt="StarScope Logo" className="h-10 w-auto" />
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#services" className="text-white/80 hover:text-white transition-colors text-sm">Services</Link>
                <Link href="#about" className="text-white/80 hover:text-white transition-colors text-sm">About</Link>
                <Link href="#membership" className="text-white/80 hover:text-white transition-colors text-sm">Membership</Link>
                <Link href="#contact" className="text-white/80 hover:text-white transition-colors text-sm">Contact</Link>
              </div>
              <div className="flex-1 flex justify-end">
                <Link href="/book" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors text-sm">
                  Book Now
                </Link>
              </div>
            </nav>
          </div>
        </header>

        <main>
          <section className="container mx-auto px-4 py-20 text-center">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="StarScope Logo" className="h-20 w-auto" />
            </div>
            <div style={{ position: 'relative', height: '400px' }}>
              <TextPressure
                text="StarScope"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#ff0000"
                minFontSize={120}
                scale={true}
              />
            </div>
          </section>

          {/* All your other sections remain the same (services, about, membership, contact, footer, etc.) */}
        </main>
      </div>
    </div>
  );
}