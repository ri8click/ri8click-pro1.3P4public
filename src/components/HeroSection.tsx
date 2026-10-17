import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  PhoneCall, 
  Sparkles, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Play,
  Pause,
  Award,
  Layers,
  Sun,
  Film
} from 'lucide-react';
import { HeroSlide, PropertyCategory } from '../types';

interface HeroSectionProps {
  slides: HeroSlide[];
  onExploreClick: () => void;
  onContactAgentClick: () => void;
  onSelectCategoryFilter: (category: PropertyCategory) => void;
  onOpen3DTour: (sample: any) => void;
}

// High-vibrancy architectural fallback/enhancement images if a slide image fails or needs ultra-HD boost
const VIBRANT_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=90',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2200&q=90',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2200&q=90',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2200&q=90',
];

const SLIDE_DURATION_MS = 7000;

export const HeroSection: React.FC<HeroSectionProps> = ({
  slides,
  onExploreClick,
  onContactAgentClick,
  onSelectCategoryFilter,
  onOpen3DTour
}) => {
  const activeSlides = slides.filter(s => s.isActive).sort((a, b) => a.order - b.order);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVibrantHdrMode, setIsVibrantHdrMode] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % activeSlides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused, currentIdx]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  }, []);

  if (activeSlides.length === 0) return null;
  const slide = activeSlides[currentIdx] || activeSlides[0];

  const handlePrev = () => {
    setCurrentIdx(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIdx(prev => (prev + 1) % activeSlides.length);
  };

  const quickCategories: { label: string; value: PropertyCategory }[] = [
    { label: 'All Portfolios', value: 'all' },
    { label: 'Luxury Residential', value: 'residential' },
    { label: 'Commercial Plazas', value: 'commercial' },
    { label: 'Modular Smart Pods', value: 'modular' },
    { label: 'Mega Projects', value: 'projects' }
  ];

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950 text-white select-none shadow-2xl border-b border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      {/* 1. Animated Cinematic Widescreen Backdrop with Ken Burns & Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{
              opacity: 1,
              scale: 1.14,
              x: currentIdx % 2 === 0 ? ['0%', '-1.5%'] : ['-1.5%', '0%'],
              y: currentIdx % 2 === 0 ? ['0%', '-1%'] : ['-1%', '0%']
            }}
            exit={{ opacity: 0, scale: 1.18 }}
            transition={{
              opacity: { duration: 1.1, ease: 'easeInOut' },
              scale: { duration: 11, ease: 'linear' },
              x: { duration: 11, ease: 'linear' },
              y: { duration: 11, ease: 'linear' }
            }}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            <img
              src={slide.imageUrl || VIBRANT_FALLBACK_IMAGES[currentIdx % VIBRANT_FALLBACK_IMAGES.length]}
              alt={slide.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  VIBRANT_FALLBACK_IMAGES[currentIdx % VIBRANT_FALLBACK_IMAGES.length];
              }}
              style={{
                transform: `translate3d(${mousePos.x * -12}px, ${mousePos.y * -8}px, 0)`
              }}
              className={`w-full h-full object-cover object-center transition-transform duration-300 ease-out ${
                isVibrantHdrMode
                  ? 'filter saturate-[1.35] contrast-[1.12] brightness-[1.06]'
                  : 'filter saturate-[1.10] contrast-[1.05] brightness-[0.95]'
              }`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Multi-Stop Color-Graded Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

        {/* Dynamic Vibrant Atmospheric Light Blooms */}
        <motion.div
          animate={{
            x: mousePos.x * 35,
            y: mousePos.y * 25,
            scale: [1, 1.15, 1]
          }}
          transition={{ scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute -top-16 left-1/4 w-[28rem] h-[28rem] rounded-full bg-amber-400/20 blur-[110px] pointer-events-none mix-blend-screen"
        />
        <motion.div
          animate={{
            x: mousePos.x * -35,
            y: mousePos.y * -25,
            scale: [1.1, 0.95, 1.1]
          }}
          transition={{ scale: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute -bottom-20 right-1/4 w-[30rem] h-[30rem] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none mix-blend-screen"
        />
        <div className="absolute top-1/3 right-10 w-80 h-80 rounded-full bg-fuchsia-500/15 blur-[100px] pointer-events-none mix-blend-screen" />
      </div>

      {/* 2. Top Cinematic Status & Quick Category Ribbon */}
      <div className="relative z-20 border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 pr-2 border-r border-white/15 shrink-0">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Cinematic View</span>
            </span>
            {quickCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onSelectCategoryFilter(cat.value)}
                className="px-3 py-1 rounded-full text-[11px] font-semibold text-slate-200 hover:text-slate-950 hover:bg-amber-400 bg-white/5 border border-white/10 transition-all shrink-0 cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsVibrantHdrMode(prev => !prev)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isVibrantHdrMode
                  ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 shadow-sm shadow-amber-400/20'
                  : 'bg-slate-900/70 border-white/15 text-slate-400 hover:text-white'
              }`}
              title="Toggle Vibrant HDR Color Grading"
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{isVibrantHdrMode ? 'Vibrant HDR: ON' : 'Standard Tone'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Foreground Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 min-h-[560px] sm:min-h-[640px] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Animated Staggered Headlines, Highlights & Action CTAs */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                {/* Tag & Society Pill */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 text-slate-950 shadow-lg shadow-amber-400/30 ring-1 ring-amber-200">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>{slide.categoryTag || 'Prime Landmark Listing'}</span>
                  </span>

                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-xl text-white border border-white/25 shadow-lg">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{slide.society || 'Faisal Hills, Taxila'}</span>
                    {slide.location && (
                      <span className="text-slate-400 font-normal">• {slide.location}</span>
                    )}
                  </div>

                  <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Watermark Verified</span>
                  </div>
                </div>

                {/* Cinematic Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] font-serif drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                  {slide.title}
                </h1>

                {/* Subtitle / Description */}
                <p className="text-sm sm:text-base md:text-lg text-slate-100/90 max-w-2xl leading-relaxed drop-shadow-sm font-normal">
                  {slide.description || slide.subtitle}
                </p>

                {/* Price & Feature Pills */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <div className="px-4 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-amber-400/40 shadow-xl flex items-center gap-3">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-amber-200/80 font-bold">
                        Starting / Asking Price
                      </span>
                      <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent font-mono tracking-tight">
                        {slide.price}
                      </span>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-200 font-sans font-bold">
                      Verified Rate
                    </span>
                  </div>

                  {slide.features && slide.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {slide.features.slice(0, 4).map((feat, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-900/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-slate-100 font-medium shadow-md flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center gap-3.5 pt-3">
                  <button
                    id="hero-explore-listings-btn"
                    onClick={onExploreClick}
                    className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:scale-[1.03] flex items-center gap-2.5 border border-blue-400/40 cursor-pointer"
                  >
                    <span>Explore Verified Listings</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    id="hero-launch-3d-tour-btn"
                    onClick={() => onOpen3DTour(slide.samplePropertyData || { title: slide.title })}
                    className="px-5 py-4 rounded-xl bg-slate-900/85 hover:bg-slate-800/95 text-white font-bold text-xs sm:text-sm backdrop-blur-xl border border-amber-400/60 hover:border-amber-300 transition-all shadow-xl flex items-center gap-2.5 group hover:scale-[1.03] cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                    <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent font-extrabold">
                      Launch 3D Virtual Tour
                    </span>
                  </button>

                  <button
                    id="hero-contact-agent-btn"
                    onClick={onContactAgentClick}
                    className="px-5 py-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm border border-emerald-400/50 transition-all flex items-center gap-2 shadow-xl hover:scale-[1.03] cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Connect Agent</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Cinematic Interactive Spotlight Deck */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="bg-slate-950/75 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Live Cinematic Deck
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPaused(prev => !prev)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
                    title={isPaused ? 'Resume Autoplay' : 'Pause Autoplay'}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/15 px-2.5 py-1 rounded-full border border-amber-400/30">
                    0{currentIdx + 1} / 0{activeSlides.length}
                  </span>
                </div>
              </div>

              {/* Interactive Slide Switcher Cards */}
              <div className="space-y-2.5">
                {activeSlides.slice(0, 4).map((s, idx) => {
                  const isCurrent = currentIdx === idx;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`relative overflow-hidden p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 group ${
                        isCurrent
                          ? 'bg-gradient-to-r from-blue-600/35 via-indigo-600/25 to-slate-900/80 border-amber-400/70 text-white shadow-lg scale-[1.01]'
                          : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/25'
                      }`}
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/15">
                        <img
                          src={s.imageUrl}
                          alt={s.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter saturate-125"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 truncate">
                          {s.society}
                        </div>
                        <div className="text-xs font-bold text-white truncate">{s.title}</div>
                        <div className="text-[11px] text-amber-300 font-mono font-bold">{s.price}</div>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                          Live
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>RDA & CDA Approved</span>
                </span>
                <span className="text-cyan-300 font-semibold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{slide.tourRoomsCount || 4} Interactive 360° Rooms</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bottom Widescreen Progress Bar & Navigation Controls */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/65 hover:bg-amber-400 hover:text-slate-950 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/65 hover:bg-amber-400 hover:text-slate-950 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cinematic Slide Progress Segments */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 backdrop-blur-xl p-3 rounded-2xl border border-white/15">
              {activeSlides.map((item, idx) => {
                const isCurrent = currentIdx === idx;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIdx(idx)}
                    className="text-left group cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className={`font-bold truncate transition-colors ${
                          isCurrent ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        0{idx + 1}. {item.society || item.categoryTag}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">
                        {item.price}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
                      {isCurrent ? (
                        <motion.div
                          key={`${item.id}-${isPaused ? 'paused' : 'playing'}`}
                          initial={{ width: '0%' }}
                          animate={{ width: isPaused ? '65%' : '100%' }}
                          transition={{
                            duration: isPaused ? 0.3 : SLIDE_DURATION_MS / 1000,
                            ease: 'linear'
                          }}
                          className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 rounded-full"
                        />
                      ) : (
                        <div
                          className={`h-full rounded-full transition-all ${
                            idx < currentIdx ? 'w-full bg-white/40' : 'w-0'
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;
