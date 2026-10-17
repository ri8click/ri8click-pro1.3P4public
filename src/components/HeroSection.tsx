import React, { useState, useEffect } from 'react';
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
  Eye,
  Award
} from 'lucide-react';
import { HeroSlide, PropertyCategory } from '../types';

interface HeroSectionProps {
  slides: HeroSlide[];
  onExploreClick: () => void;
  onContactAgentClick: () => void;
  onSelectCategoryFilter: (category: PropertyCategory) => void;
  onOpen3DTour: (sample: any) => void;
}

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

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % activeSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused]);

  if (activeSlides.length === 0) return null;
  const slide = activeSlides[currentIdx] || activeSlides[0];

  const handlePrev = () => {
    setCurrentIdx(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIdx(prev => (prev + 1) % activeSlides.length);
  };

  return (
    <div 
      className="relative w-full overflow-hidden bg-slate-950 text-white select-none shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with vivid saturation and vibrant light transitions */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          key={slide.id}
          src={slide.imageUrl}
          alt={slide.title}
          className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-100 filter brightness-105 contrast-105 saturate-110"
        />
        {/* Luminous Architectural Gradient Overlay - Bright, Radiant & High-Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-slate-900/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/25" />
        
        {/* Radiant Ambient Light Blooms */}
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none mix-blend-screen" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 min-h-[540px] sm:min-h-[600px] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines, Highlights & Action CTAs */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Tag & Society Pill */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 shadow-lg shadow-amber-400/25 ring-1 ring-amber-300">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>{slide.categoryTag || 'Prime Landmark Listing'}</span>
              </span>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-slate-100 border border-white/20 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{slide.society || 'Faisal Hills, Taxila'}</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 backdrop-blur-md shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Watermark Verified</span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-serif drop-shadow-md">
              {slide.title}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow-xs font-normal">
              {slide.description || slide.subtitle}
            </p>

            {/* Price & Features */}
            <div className="flex flex-wrap items-center gap-4 py-1">
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight drop-shadow-sm flex items-center gap-2">
                <span>{slide.price}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-200 font-sans font-bold">
                  Verified Price
                </span>
              </div>

              {slide.features && slide.features.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {slide.features.slice(0, 3).map((feat, idx) => (
                    <span 
                      key={idx} 
                      className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-medium shadow-xs"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-listings-btn"
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.02] flex items-center gap-2 border border-blue-400/30"
              >
                <span>Explore Verified Listings</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-launch-3d-tour-btn"
                onClick={() => onOpen3DTour(slide.samplePropertyData || { title: slide.title })}
                className="px-5 py-3.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-amber-400/50 hover:border-amber-400 transition-all shadow-lg flex items-center gap-2 group hover:scale-[1.02]"
              >
                <Compass className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                <span className="text-amber-300">Launch 3D Virtual Tour</span>
              </button>

              <button
                id="hero-contact-agent-btn"
                onClick={onContactAgentClick}
                className="px-4 py-3.5 rounded-xl bg-emerald-600/85 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm border border-emerald-400/40 transition-colors flex items-center gap-2 shadow-lg"
              >
                <PhoneCall className="w-4 h-4" />
                <span className="hidden sm:inline">Connect Agent</span>
              </button>
            </div>

          </div>

          {/* Right Column: Quick Slide Preview Card & Counter */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Spotlight</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/25">
                  0{currentIdx + 1} / 0{activeSlides.length}
                </span>
              </div>

              {/* Mini Slides Switcher */}
              <div className="space-y-2">
                {activeSlides.slice(0, 4).map((s, idx) => (
                  <div
                    key={s.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      currentIdx === idx
                        ? 'bg-blue-600/30 border-blue-400 text-white shadow-md'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <img 
                      src={s.imageUrl} 
                      alt={s.title} 
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{s.title}</div>
                      <div className="text-[10px] text-amber-300 font-mono">{s.price}</div>
                    </div>
                    {currentIdx === idx && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">Active</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>RDA Approved Societies</span>
                </span>
                <span className="text-blue-400 font-semibold">{slide.tourRoomsCount || 4} 360° Rooms</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Slider Controls (Arrows & Pagination Dots) */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator & Auto-play status */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`h-2.5 rounded-full transition-all ${currentIdx === idx ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50' : 'w-2.5 bg-white/40 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSection;

