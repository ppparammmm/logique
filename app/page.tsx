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
                    span.style.fontVariationSettings = `wght ${wght}, wdth ${wdth}, ital ${italVal}`;
                });
            }

            rafId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(rafId);
    }, [width, weight, italic, alpha, chars.length]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-transparent"
        >
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
                className={`text-pressure-title ${className} ${flex ? 'flex justify-between' : ''
                    } ${stroke ? 'stroke' : ''} uppercase text-center`}
                style={{
                    fontFamily,
                    fontSize: fontSize,
                    lineHeight,
                    transform: `scale(1, ${scaleY})`,
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
    <div className="min-h-screen gradient-bg">
      <div className="star-field min-h-screen">
        <header className="backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center justify-between">
              <div className="flex-1"></div>
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
            <div style={{position: 'relative', height: '400px'}}>
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

          <section id="services" className="container mx-auto px-4 py-20">
            <h2 className="text-4xl font-bold text-white text-center mb-16">Our Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="glass-effect rounded-xl p-8 hover-glow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🔭</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Guided Stargazing Tours</h3>
                <p className="text-white/70 mb-6">
                  Physical stargazing sessions at observatories or dark-sky sites, led by certified astronomy guides. 
                  Includes telescope viewing, laser pointer sky tours, and storytelling.
                </p>
                <button className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Learn More →
                </button>
              </div>

              <div className="glass-effect rounded-xl p-8 hover-glow">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">📸</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Astrophotography Sessions</h3>
                <p className="text-white/70 mb-6">
                  Book personalized astrophotography shoots with professional equipment. 
                  Receive digital photos or printed frames, plus training workshops for amateur photographers.
                </p>
                <button className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Learn More →
                </button>
              </div>

              <div className="glass-effect rounded-xl p-8 hover-glow">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">📺</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Live Celestial Events</h3>
                <p className="text-white/70 mb-6">
                  Real-time streaming of major celestial events like eclipses, meteor showers, and planetary conjunctions. 
                  Accessible globally with expert commentary and Q&A.
                </p>
                <button className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Learn More →
                </button>
              </div>

              <div className="glass-effect rounded-xl p-8 hover-glow">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Educational Workshops</h3>
                <p className="text-white/70 mb-6">
                  Online and offline learning modules for students and enthusiasts. 
                  Cover telescope handling, astrophysics basics, and night-sky navigation.
                </p>
                <button className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Learn More →
                </button>
              </div>

              <div className="glass-effect rounded-xl p-8 hover-glow">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Membership Plans</h3>
                <p className="text-white/70 mb-6">
                  Monthly and annual subscriptions with exclusive benefits. 
                  Early booking, discounts, exclusive live streams, and astrophotography wallpapers.
                </p>
                <button className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Learn More →
                </button>
              </div>

              <div className="glass-effect rounded-xl p-8 hover-glow">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🌌</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Virtual Reality Tours</h3>
                <p className="text-white/70 mb-6">
                  Immersive VR experiences of distant galaxies, nebulae, and planetary systems. 
                  Explore the cosmos from the comfort of your home.
                </p>
                <button className="text-indigo-400 hover:text-indigo-300 font-semibold">
                  Learn More →
                </button>
              </div>
            </div>
          </section>

          <section id="about" className="container mx-auto px-4 py-20">
            <div className="glass-effect rounded-2xl p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-6">About StarScope</h2>
                  <p className="text-white/80 text-lg mb-6">
                    StarScope is a premium stargazing and astrophotography service dedicated to making astronomy 
                    accessible to everyone. Our mission is to spark curiosity and make night-sky exploration 
                    a memorable experience for all.
                  </p>
                  <p className="text-white/80 text-lg mb-8">
                    With certified astronomy guides, state-of-the-art equipment, and a passion for sharing 
                    the wonders of the universe, we provide unforgettable experiences that connect people 
                    with the cosmos.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-400">500+</div>
                      <div className="text-white/60">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-400">50+</div>
                      <div className="text-white/60">Events Streamed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-400">1000+</div>
                      <div className="text-white/60">Photos Captured</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full h-96 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl flex items-center justify-center">
                    <span className="text-6xl">🌌</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="membership" className="container mx-auto px-4 py-20">
            <h2 className="text-4xl font-bold text-white text-center mb-16">Membership Plans</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-effect rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
                <div className="text-4xl font-bold text-white mb-2">₹1900</div>
                <div className="text-white/60 mb-8">per month</div>
                <ul className="text-white/80 space-y-3 mb-8">
                  <li>✓ Access to live streams</li>
                  <li>✓ Basic astrophotography</li>
                  <li>✓ Educational content</li>
                  <li>✓ Community forum</li>
                </ul>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors">
                  Get Started
                </button>
              </div>

              <div className="glass-effect rounded-xl p-8 text-center border-2 border-indigo-500 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Professional</h3>
                <div className="text-4xl font-bold text-white mb-2">₹4900</div>
                <div className="text-white/60 mb-8">per month</div>
                <ul className="text-white/80 space-y-3 mb-8">
                  <li>✓ Everything in Starter</li>
                  <li>✓ Priority booking</li>
                  <li>✓ Exclusive workshops</li>
                  <li>✓ HD wallpapers</li>
                  <li>✓ 20% discount on tours</li>
                </ul>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors">
                  Get Started
                </button>
              </div>

              <div className="glass-effect rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Premium</h3>
                <div className="text-4xl font-bold text-white mb-2">₹9900</div>
                <div className="text-white/60 mb-8">per month</div>
                <ul className="text-white/80 space-y-3 mb-8">
                  <li>✓ Everything in Professional</li>
                  <li>✓ Private sessions</li>
                  <li>✓ Custom astrophotography</li>
                  <li>✓ VIP event access</li>
                  <li>✓ 40% discount on tours</li>
                </ul>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </section>

          <section id="contact" className="container mx-auto px-4 py-20">
            <div className="glass-effect rounded-2xl p-12">
              <h2 className="text-4xl font-bold text-white text-center mb-16">Get in Touch</h2>
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Ready to Explore the Universe?</h3>
                  <p className="text-white/80 text-lg mb-8">
                    Contact us to book your stargazing experience, join our membership, or learn more about our services.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white">📧</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Email</div>
                        <div className="text-white/60">parammehta06@gmail.com</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white">📞</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Phone</div>
                        <div className="text-white/60">6291776113</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white">📍</span>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Location</div>
                        <div className="text-white/60">Kolkata</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Email</label>
                      <input 
                        type="email" 
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Message</label>
                      <textarea 
                        rows={4}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-indigo-500"
                        placeholder="Tell us about your stargazing dreams..."
                      />
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors font-semibold">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="glass-effect border-t border-white/10 mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">★</span>
                  </div>
                  <span className="text-xl font-bold text-white">StarScope</span>
                </div>
                <p className="text-white/60">
                  Making astronomy accessible to everyone through premium stargazing experiences.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-white/60">
                  <li>Guided Tours</li>
                  <li>Astrophotography</li>
                  <li>Live Streams</li>
                  <li>Workshops</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-white/60">
                  <li>About Us</li>
                  <li>Team</li>
                  <li>Careers</li>
                  <li>Press</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Connect</h4>
                <ul className="space-y-2 text-white/60">
                  <li>Contact</li>
                  <li>Support</li>
                  <li>Blog</li>
                  <li>Newsletter</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
              <p>&copy; 2025 StarScope. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}