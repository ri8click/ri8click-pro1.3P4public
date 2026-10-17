import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Play,
  Pause,
  Award,
  Layers,
  Sun,
  Film,
  Video,
  Camera,
  Maximize2,
  Minimize2,
  Eye,
  Gauge,
  Radio,
  Volume2,
  VolumeX,
  Crosshair,
  Orbit
} from 'lucide-react';
import { HeroSlide, PropertyCategory } from '../types';

interface HeroSectionProps {
  slides: HeroSlide[];
  onExploreClick: () => void;
  onContactAgentClick: () => void;
  onSelectCategoryFilter: (category: PropertyCategory) => void;
  onOpen3DTour: (sample: any) => void;
}

interface CameraWaypoint {
  id: string;
  code: string;
  label: string;
  subLabel: string;
  focalLength: string;
  altitude: string;
  imageUrl: string;
  motionOrigin: string;
  panX: [string, string];
  panY: [string, string];
  scaleRange: [number, number];
}

// High-vibrancy architectural gallery for multi-angle drone & interior tours
const ARCHITECTURAL_CAMERA_BANKS: string[][] = [
  [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2400&q=90'
  ],
  [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=90'
  ],
  [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=2400&q=90'
  ],
  [
    'https://images.unsplash.com/photo-1555636222-cae831e670b3?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=2400&q=90',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=90'
  ]
];

// Curated HD architectural showcase video streams for live video tour reel
const CINEMATIC_TOUR_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-on-a-sunny-day-41465-large.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
];

type AtmosphereGrade = 'golden_hdr' | 'midnight_noir' | 'solar_studio';

const SLIDE_DURATION_MS = 10000;
const WAYPOINT_DURATION_MS = 3200;

export const HeroSection: React.FC<HeroSectionProps> = ({
  slides,
  onExploreClick,
  onContactAgentClick,
  onSelectCategoryFilter,
  onOpen3DTour
}) => {
  const activeSlides = useMemo(
    () => slides.filter(s => s.isActive).sort((a, b) => a.order - b.order),
    [slides]
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [waypointIdx, setWaypointIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoTourActive, setIsVideoTourActive] = useState(false);
  const [isCinemaTheaterMode, setIsCinemaTheaterMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [atmosphere, setAtmosphere] = useState<AtmosphereGrade>('golden_hdr');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [videoFailed, setVideoFailed] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const slide = activeSlides[currentIdx] || activeSlides[0];

  // Build 4-waypoint cinematic drone & interior tour for the active project
  const cameraWaypoints: CameraWaypoint[] = useMemo(() => {
    if (!slide) return [];
    const bank = ARCHITECTURAL_CAMERA_BANKS[currentIdx % ARCHITECTURAL_CAMERA_BANKS.length];
    const primaryImg = slide.imageUrl || bank[0];

    return [
      {
        id: `${slide.id}-cam-1`,
        code: 'CAM 01 // DRONE ORBIT',
        label: 'Aerial Approach',
        subLabel: 'High-Altitude Skyline Vector',
        focalLength: '24MM f/1.4 ANAMORPHIC',
        altitude: '+145.0M ASL',
        imageUrl: primaryImg,
        motionOrigin: 'center center',
        panX: ['0%', '-2.5%'],
        panY: ['0%', '-1.5%'],
        scaleRange: [1.04, 1.18]
      },
      {
        id: `${slide.id}-cam-2`,
        code: 'CAM 02 // FACADE GLIDE',
        label: 'Architectural Elevation',
        subLabel: 'Structural Glass & Cladding',
        focalLength: '35MM f/1.8 PRIME',
        altitude: '+42.5M ASL',
        imageUrl: bank[1],
        motionOrigin: 'left center',
        panX: ['-2%', '1.5%'],
        panY: ['1%', '-1%'],
        scaleRange: [1.15, 1.03]
      },
      {
        id: `${slide.id}-cam-3`,
        code: 'CAM 03 // ATRIUM DOLLY',
        label: 'Grand Interior Suite',
        subLabel: 'Bespoke Spatial Walkthrough',
        focalLength: '18MM f/2.0 ULTRA-WIDE',
        altitude: '+12.0M INT',
        imageUrl: bank[2],
        motionOrigin: 'right center',
        panX: ['1.5%', '-2%'],
        panY: ['-1%', '1%'],
        scaleRange: [1.05, 1.19]
      },
      {
        id: `${slide.id}-cam-4`,
        code: 'CAM 04 // PENTHOUSE DECK',
        label: 'Sky Terrace & Horizon',
        subLabel: 'Panoramic Dusk Perspective',
        focalLength: '50MM f/1.2 CINE',
        altitude: '+180.0M APEX',
        imageUrl: bank[3],
        motionOrigin: 'center bottom',
        panX: ['-1.5%', '1.5%'],
        panY: ['1.5%', '-1.5%'],
        scaleRange: [1.16, 1.04]
      }
    ];
  }, [slide, currentIdx]);

  const activeWaypoint = cameraWaypoints[waypointIdx] || cameraWaypoints[0];

  // Reset camera waypoint when switching projects
  useEffect(() => {
    setWaypointIdx(0);
    setVideoFailed(false);
  }, [currentIdx]);

  // Auto-cycle camera waypoints during tour (like Ferrari/Jaguar multi-angle showcase)
  useEffect(() => {
    if (isPaused) return;
    const wpTimer = setInterval(() => {
      setWaypointIdx(prev => (prev + 1) % cameraWaypoints.length);
    }, WAYPOINT_DURATION_MS);
    return () => clearInterval(wpTimer);
  }, [isPaused, cameraWaypoints.length, currentIdx]);

  // Auto-advance main project slide when not locked in Cinema Theater or Video Reel mode
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused || isVideoTourActive || isCinemaTheaterMode) return;
    const slideTimer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % activeSlides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(slideTimer);
  }, [activeSlides.length, isPaused, isVideoTourActive, isCinemaTheaterMode, currentIdx]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  }, []);

  if (activeSlides.length === 0) return null;

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

  // Dynamic CSS filter recipes for automotive-grade color grading
  const atmosphereFilterClass =
    atmosphere === 'golden_hdr'
      ? 'filter saturate-[1.42] contrast-[1.14] brightness-[1.05]'
      : atmosphere === 'midnight_noir'
      ? 'filter saturate-[1.18] contrast-[1.28] brightness-[0.86] hue-rotate-[-6deg]'
      : 'filter saturate-[1.15] contrast-[1.06] brightness-[1.1]';

  // Simulated telemetry numbers that respond to cursor gimbal
  const gimbalYaw = (mousePos.x * 18.4).toFixed(1);
  const gimbalPitch = (mousePos.y * -12.2).toFixed(1);

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950 text-white select-none shadow-[0_30px_90px_rgba(0,0,0,0.85)] border-b border-white/10"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      {/* ANAMORPHIC WIDESCREEN LETTERBOX BARS (Jaguar / Ferrari Film Reveal) */}
      <motion.div
        initial={false}
        animate={{ height: isCinemaTheaterMode || isVideoTourActive ? 38 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-black z-30 relative pointer-events-none border-b border-white/5"
      />

      {/* 1. CINEMATIC 3D CAMERA & VIDEO ENGINE BACKDROP */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        <AnimatePresence mode="sync">
          {isVideoTourActive && !videoFailed ? (
            <motion.div
              key={`video-reel-${slide.id}`}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1.01 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <video
                ref={videoRef}
                src={CINEMATIC_TOUR_VIDEOS[currentIdx % CINEMATIC_TOUR_VIDEOS.length]}
                poster={activeWaypoint.imageUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onError={() => setVideoFailed(true)}
                style={{
                  transform: `translate3d(${mousePos.x * -14}px, ${mousePos.y * -10}px, 0) scale(1.05)`
                }}
                className={`w-full h-full object-cover object-center transition-transform duration-300 ease-out ${atmosphereFilterClass}`}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeWaypoint.id}
              initial={{
                opacity: 0,
                scale: activeWaypoint.scaleRange[0],
                filter: 'blur(8px) brightness(1.3)'
              }}
              animate={{
                opacity: 1,
                scale: activeWaypoint.scaleRange[1],
                x: activeWaypoint.panX,
                y: activeWaypoint.panY,
                filter: 'blur(0px) brightness(1)'
              }}
              exit={{
                opacity: 0,
                scale: 1.22,
                filter: 'blur(6px) brightness(0.7)'
              }}
              transition={{
                opacity: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
                filter: { duration: 0.9, ease: 'easeOut' },
                scale: { duration: WAYPOINT_DURATION_MS / 1000 + 1.5, ease: 'linear' },
                x: { duration: WAYPOINT_DURATION_MS / 1000 + 1.5, ease: 'linear' },
                y: { duration: WAYPOINT_DURATION_MS / 1000 + 1.5, ease: 'linear' }
              }}
              style={{ transformOrigin: activeWaypoint.motionOrigin }}
              className="absolute inset-0 w-full h-full will-change-transform"
            >
              <img
                src={activeWaypoint.imageUrl}
                alt={`${slide.title} - ${activeWaypoint.label}`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    ARCHITECTURAL_CAMERA_BANKS[0][waypointIdx % 4];
                }}
                style={{
                  transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -12}px, 0) rotateX(${mousePos.y * 1.5}deg) rotateY(${mousePos.x * -1.5}deg)`
                }}
                className={`w-full h-full object-cover object-center transition-transform duration-300 ease-out ${atmosphereFilterClass}`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Automotive Showroom Vignette & Multi-Stop Gradients */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
            isCinemaTheaterMode
              ? 'bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40'
              : 'bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-slate-950/15'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 pointer-events-none" />

        {/* Subtle Architectural Blueprint / Telemetry Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }}
        />

        {/* Anamorphic Horizontal Lens Flare Sweep on Camera Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`flare-${activeWaypoint.id}-${isVideoTourActive}`}
            initial={{ x: '-120%', opacity: 0 }}
            animate={{ x: '140%', opacity: [0, 0.85, 0] }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            className="absolute top-1/3 left-0 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_35px_8px_rgba(251,191,36,0.45)] pointer-events-none mix-blend-screen"
          />
        </AnimatePresence>

        {/* Dynamic Atmospheric Light Blooms */}
        <motion.div
          animate={{
            x: mousePos.x * 45,
            y: mousePos.y * 30,
            scale: [1, 1.18, 1]
          }}
          transition={{ scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
          className={`absolute -top-20 left-1/4 w-[32rem] h-[32rem] rounded-full blur-[130px] pointer-events-none mix-blend-screen ${
            atmosphere === 'golden_hdr'
              ? 'bg-amber-500/25'
              : atmosphere === 'midnight_noir'
              ? 'bg-indigo-500/25'
              : 'bg-cyan-400/20'
          }`}
        />
        <motion.div
          animate={{
            x: mousePos.x * -45,
            y: mousePos.y * -30,
            scale: [1.1, 0.92, 1.1]
          }}
          transition={{ scale: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute -bottom-24 right-1/4 w-[34rem] h-[34rem] rounded-full bg-cyan-500/20 blur-[140px] pointer-events-none mix-blend-screen"
        />

        {/* Corner Viewfinder Brackets (Ferrari / Drone HUD Framing) */}
        <div className="hidden sm:block absolute top-16 left-6 w-6 h-6 border-t-2 border-l-2 border-amber-400/40 pointer-events-none" />
        <div className="hidden sm:block absolute top-16 right-6 w-6 h-6 border-t-2 border-r-2 border-amber-400/40 pointer-events-none" />
        <div className="hidden sm:block absolute bottom-24 left-6 w-6 h-6 border-b-2 border-l-2 border-amber-400/40 pointer-events-none" />
        <div className="hidden sm:block absolute bottom-24 right-6 w-6 h-6 border-b-2 border-r-2 border-amber-400/40 pointer-events-none" />
      </div>

      {/* 2. TOP TELEMETRY & DIRECTOR CONTROL RIBBON */}
      <div className="relative z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Live Telemetry Indicator & Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 flex items-center gap-2 pr-3 border-r border-white/15 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>{isVideoTourActive ? 'LIVE TOUR REEL' : activeWaypoint.code}</span>
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

          {/* Right: Automotive Lighting Shaders, Video Reel Toggle & Theater Mode */}
          <div className="hidden md:flex items-center gap-2">
            {/* Gimbal Readout */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/50 border border-white/10 text-[10px] font-mono text-slate-300">
              <Crosshair className="w-3 h-3 text-cyan-400" />
              <span>YAW {gimbalYaw}°</span>
              <span className="text-white/20">|</span>
              <span>PITCH {gimbalPitch}°</span>
              <span className="text-white/20">|</span>
              <span className="text-amber-300">{activeWaypoint.focalLength}</span>
            </div>

            {/* Atmosphere Color Grade Switcher */}
            <div className="flex items-center bg-slate-900/80 p-0.5 rounded-full border border-white/15">
              {(
                [
                  { id: 'golden_hdr', label: 'Golden HDR' },
                  { id: 'midnight_noir', label: 'Midnight Noir' },
                  { id: 'solar_studio', label: 'Solar Studio' }
                ] as { id: AtmosphereGrade; label: string }[]
              ).map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => setAtmosphere(grade.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    atmosphere === grade.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {grade.label}
                </button>
              ))}
            </div>

            {/* Cinema Theater Mode Toggle (Hides Foreground Text for Pure Building Showcase) */}
            <button
              onClick={() => setIsCinemaTheaterMode(prev => !prev)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isCinemaTheaterMode
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-900/70 border-white/15 text-slate-300 hover:text-white'
              }`}
              title="Toggle Pure Architectural Showcase Mode"
            >
              {isCinemaTheaterMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isCinemaTheaterMode ? 'Exit Showcase' : 'Pure Showcase'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN FOREGROUND STAGE */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 min-h-[590px] sm:min-h-[670px] flex flex-col justify-between">
        
        {/* Top Floating Camera Waypoint Selector (Jaguar / Ferrari Angle Switcher) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/75 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-x-auto max-w-full">
            <button
              onClick={() => setIsVideoTourActive(prev => !prev)}
              className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                isVideoTourActive
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white/5 hover:bg-white/15 text-amber-300 border border-amber-400/30'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isVideoTourActive ? 'Video Reel: ON' : 'Play Video Reel'}</span>
            </button>

            {isVideoTourActive && (
              <button
                onClick={() => setIsMuted(prev => !prev)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                title={isMuted ? 'Unmute Ambient Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
              </button>
            )}

            <div className="h-5 w-[1px] bg-white/15 mx-1 shrink-0" />

            {cameraWaypoints.map((wp, idx) => {
              const isSelected = !isVideoTourActive && waypointIdx === idx;
              return (
                <button
                  key={wp.id}
                  onClick={() => {
                    setIsVideoTourActive(false);
                    setWaypointIdx(idx);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-left transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-white text-slate-950 font-extrabold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Camera className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider leading-none">
                      0{idx + 1}. {wp.label}
                    </div>
                    <div className={`text-[9px] leading-tight ${isSelected ? 'text-slate-700' : 'text-slate-400'}`}>
                      {wp.altitude}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Playback & Live Status */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-950/75 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-white/15">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-200">
              {activeWaypoint.subLabel}
            </span>
            <button
              onClick={() => setIsPaused(prev => !prev)}
              className="ml-2 p-1.5 rounded-lg bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white transition-all cursor-pointer"
              title={isPaused ? 'Resume Camera Tour' : 'Freeze Camera Angle'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Center Main Grid (Retracts cleanly when Pure Showcase / Cinema Theater Mode is active) */}
        <AnimatePresence mode="wait">
          {!isCinemaTheaterMode ? (
            <motion.div
              key="foreground-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center my-auto py-6"
            >
              {/* Left Column: Staggered Editorial Headlines, Telemetry Specs & CTAs */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-5"
                  >
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 text-slate-950 shadow-lg shadow-amber-400/30 ring-1 ring-amber-200">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>{slide.categoryTag || 'Flagship Architectural Edition'}</span>
                      </span>

                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900/85 backdrop-blur-xl text-white border border-white/25 shadow-lg">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{slide.society || 'Faisal Hills, Taxila'}</span>
                        {slide.location && (
                          <span className="text-slate-400 font-normal">| {slide.location}</span>
                        )}
                      </div>

                      <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>100% Watermark Verified</span>
                      </div>
                    </div>

                    {/* Monumental Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05] font-serif drop-shadow-[0_8px_30px_rgba(0,0,0,0.85)]">
                      {slide.title}
                    </h1>

                    {/* Editorial Description */}
                    <p className="text-sm sm:text-base md:text-lg text-slate-100/95 max-w-2xl leading-relaxed drop-shadow-md font-normal">
                      {slide.description || slide.subtitle}
                    </p>

                    {/* Ferrari-Style Performance & Valuation Telemetry Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-3xl">
                      <div className="p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-amber-400/50 shadow-xl">
                        <span className="block text-[10px] uppercase tracking-widest text-amber-300/90 font-bold">
                          Asking Valuation
                        </span>
                        <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent font-mono tracking-tight">
                          {slide.price}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/15">
                        <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                          Spatial Tour
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                          <Orbit className="w-4 h-4 text-cyan-400" />
                          <span>{slide.tourRoomsCount || 4} 360° Zones</span>
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/15">
                        <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                          Camera Feed
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-amber-300 flex items-center gap-1.5 mt-0.5">
                          <Gauge className="w-4 h-4 text-amber-400" />
                          <span>4K 60FPS HDR</span>
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/15">
                        <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                          NOC & Title
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                          <Award className="w-4 h-4 text-emerald-400" />
                          <span>Tier-1 Verified</span>
                        </span>
                      </div>
                    </div>

                    {/* Key Architectural Features */}
                    {slide.features && slide.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs pt-0.5">
                        {slide.features.slice(0, 4).map((feat, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-slate-100 font-medium shadow-md flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action CTAs */}
                    <div className="flex flex-wrap items-center gap-3.5 pt-2">
                      <button
                        id="hero-launch-3d-tour-btn"
                        onClick={() => onOpen3DTour(slide.samplePropertyData || { title: slide.title })}
                        className="px-6 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-[0_0_35px_rgba(251,191,36,0.45)] hover:shadow-[0_0_50px_rgba(251,191,36,0.75)] hover:scale-[1.03] flex items-center gap-2.5 group cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-90 transition-transform duration-500" />
                        <span>Launch 3D & Video Walkthrough</span>
                      </button>

                      <button
                        id="hero-explore-listings-btn"
                        onClick={onExploreClick}
                        className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-blue-600/35 hover:scale-[1.03] flex items-center gap-2.5 border border-blue-400/40 cursor-pointer"
                      >
                        <span>Explore Portfolio</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        id="hero-contact-agent-btn"
                        onClick={onContactAgentClick}
                        className="px-5 py-4 rounded-xl bg-slate-900/85 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm border border-white/25 hover:border-emerald-400 transition-all flex items-center gap-2 shadow-xl hover:scale-[1.03] cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                        <span>VIP Concierge</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column: Interactive Cockpit Project Deck & Angle Preview */}
              <div className="hidden lg:block lg:col-span-4">
                <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-[0_25px_70px_rgba(0,0,0,0.85)] space-y-4">
                  
                  {/* Live Camera Monitor Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">
                        Director&apos;s Tour Deck
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/15 px-2.5 py-1 rounded-full border border-amber-400/30">
                      0{currentIdx + 1} / 0{activeSlides.length}
                    </span>
                  </div>

                  {/* Active Project Multi-Angle Mini Strip */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Active Building Angles</span>
                      <span className="text-cyan-300">{activeWaypoint.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {cameraWaypoints.map((wp, i) => (
                        <button
                          key={wp.id}
                          onClick={() => {
                            setIsVideoTourActive(false);
                            setWaypointIdx(i);
                          }}
                          className={`relative h-12 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                            !isVideoTourActive && waypointIdx === i
                              ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 z-10'
                              : 'border-white/15 opacity-65 hover:opacity-100'
                          }`}
                        >
                          <img src={wp.imageUrl} alt={wp.label} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-black text-white drop-shadow">
                            C{i + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Project Switcher Cards */}
                  <div className="space-y-2 pt-1">
                    {activeSlides.slice(0, 4).map((s, idx) => {
                      const isCurrent = currentIdx === idx;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setCurrentIdx(idx)}
                          className={`relative overflow-hidden p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 group ${
                            isCurrent
                              ? 'bg-gradient-to-r from-amber-500/25 via-indigo-600/20 to-slate-900/90 border-amber-400/80 text-white shadow-lg scale-[1.01]'
                              : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/25'
                          }`}
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/15">
                            <img
                              src={s.imageUrl}
                              alt={s.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter saturate-125"
                            />
                            {isCurrent && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Eye className="w-4 h-4 text-amber-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 truncate">
                              {s.society}
                            </div>
                            <div className="text-xs font-bold text-white truncate">{s.title}</div>
                            <div className="text-[11px] text-amber-300 font-mono font-bold">{s.price}</div>
                          </div>
                          {isCurrent && (
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                              On Screen
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Deck Footer */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-white/10">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>RDA & CDA Approved</span>
                    </span>
                    <button
                      onClick={() => setIsCinemaTheaterMode(true)}
                      className="text-cyan-300 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Full-Screen Inspection</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Minimalist HUD Bar when in Pure Architectural Showcase Mode */
            <motion.div
              key="showcase-minimal-hud"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-auto bg-slate-950/80 backdrop-blur-2xl border border-amber-400/40 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xl"
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                  PURE ARCHITECTURAL SHOWCASE // {activeWaypoint.code}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-serif">{slide.title}</h2>
                <p className="text-xs text-slate-300">
                  {slide.society} — <span className="text-amber-300 font-mono font-bold">{slide.price}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpen3DTour(slide.samplePropertyData || { title: slide.title })}
                  className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Open 360° Interactive Modal</span>
                </button>
                <button
                  onClick={() => setIsCinemaTheaterMode(false)}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Restore Details</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. BOTTOM WIDESCREEN PROGRESS TIMELINE & NAVIGATION CONTROLS */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/70 hover:bg-amber-400 hover:text-slate-950 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/70 hover:bg-amber-400 hover:text-slate-950 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/75 backdrop-blur-2xl p-3 rounded-2xl border border-white/15">
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
                          key={`${item.id}-${isPaused ? 'paused' : 'playing'}-${waypointIdx}`}
                          initial={{ width: `${(waypointIdx / cameraWaypoints.length) * 100}%` }}
                          animate={{
                            width: isPaused
                              ? `${((waypointIdx + 0.5) / cameraWaypoints.length) * 100}%`
                              : `${((waypointIdx + 1) / cameraWaypoints.length) * 100}%`
                          }}
                          transition={{
                            duration: isPaused ? 0.3 : WAYPOINT_DURATION_MS / 1000,
                            ease: 'linear'
                          }}
                          className="h-full bg-gradient-to-r from-amber-400 via-red-500 to-cyan-400 rounded-full"
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

      {/* BOTTOM ANAMORPHIC WIDESCREEN LETTERBOX BAR */}
      <motion.div
        initial={false}
        animate={{ height: isCinemaTheaterMode || isVideoTourActive ? 38 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-black z-30 relative pointer-events-none border-t border-white/5"
      />
    </section>
  );
};

export default HeroSection;
