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
  Video,
  Camera,
  Maximize2,
  Minimize2,
  Eye,
  Gauge,
  Volume2,
  VolumeX,
  Orbit,
  SlidersHorizontal,
  Box,
  Check
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

// Curated Modular Capsule Houses & Luxury Container Homes from uploaded reference assets
export const MODULAR_CAPSULE_GALLERY = {
  steelmarkPorchPod: 'https://www.genspark.ai/api/files/s/HAmfo7QM',
  structuralSteelFrame: 'https://www.genspark.ai/api/files/s/DDW2MLLa',
  q3ForestCabinPod: 'https://www.genspark.ai/api/files/s/luCdoedD',
  k5WaterfrontCapsule: 'https://www.genspark.ai/api/files/s/s26UbDNC',
  isometricLoftContainer: 'https://www.genspark.ai/api/files/s/KSqT7J8S',
  rooftopDeckContainerVilla: 'https://www.genspark.ai/api/files/s/YFGxmldy',
  hexLedSmartContainer: 'https://www.genspark.ai/api/files/s/Lp3EKXTg',
  tropicalGlassOfficePod: 'https://www.genspark.ai/api/files/s/kECDRwcq',
  doubleDeckerV2124Pod: 'https://www.genspark.ai/api/files/s/4ynMEAPe',
  lakesidePanoramaPod: 'https://www.genspark.ai/api/files/s/8TL1rFy9'
};

// Multi-angle virtual tour banks featuring Modular Capsule Houses, Container Villas & Landmark Architecture
const ARCHITECTURAL_CAMERA_BANKS: string[][] = [
  // Bank 1: Flagship Modular Capsule Pods (K5 Waterfront, Lakeside, Double-Decker V2124, Q3 Forest)
  [
    MODULAR_CAPSULE_GALLERY.k5WaterfrontCapsule,
    MODULAR_CAPSULE_GALLERY.lakesidePanoramaPod,
    MODULAR_CAPSULE_GALLERY.doubleDeckerV2124Pod,
    MODULAR_CAPSULE_GALLERY.q3ForestCabinPod
  ],
  // Bank 2: Designer Container Homes & Smart LED Studios
  [
    MODULAR_CAPSULE_GALLERY.rooftopDeckContainerVilla,
    MODULAR_CAPSULE_GALLERY.hexLedSmartContainer,
    MODULAR_CAPSULE_GALLERY.tropicalGlassOfficePod,
    MODULAR_CAPSULE_GALLERY.isometricLoftContainer
  ],
  // Bank 3: Turnkey Prefab Engineering & Steelmark Capsule Production
  [
    MODULAR_CAPSULE_GALLERY.steelmarkPorchPod,
    MODULAR_CAPSULE_GALLERY.structuralSteelFrame,
    MODULAR_CAPSULE_GALLERY.doubleDeckerV2124Pod,
    MODULAR_CAPSULE_GALLERY.lakesidePanoramaPod
  ],
  // Bank 4: High-Vibrancy Contemporary Villas & Penthouses
  [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=95',
    MODULAR_CAPSULE_GALLERY.rooftopDeckContainerVilla,
    MODULAR_CAPSULE_GALLERY.tropicalGlassOfficePod,
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=95'
  ]
];

// Dedicated 9-Stop Virtual Tour Preset for Modular Capsule & Container Homes
const MODULAR_CAPSULE_TOUR_WAYPOINTS: CameraWaypoint[] = [
  {
    id: 'capsule-wp-1',
    code: 'POD 01 // K5 COASTAL CAPSULE',
    label: 'K5 Waterfront Pod',
    subLabel: 'Aerospace Aluminum Shell & Panoramic Bay Glazing',
    focalLength: '24MM HDR PRIME',
    altitude: 'COASTAL DECK',
    imageUrl: MODULAR_CAPSULE_GALLERY.k5WaterfrontCapsule,
    motionOrigin: 'center center',
    panX: ['0%', '-1.5%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.02, 1.09]
  },
  {
    id: 'capsule-wp-2',
    code: 'POD 02 // V2124 DOUBLE-DECKER',
    label: 'Dual-Level Glass Villa',
    subLabel: 'Stacked Modular Capsule with Warm Cove Lighting',
    focalLength: '20MM ARCHITECTURAL',
    altitude: '2-STORY DUPLEX',
    imageUrl: MODULAR_CAPSULE_GALLERY.doubleDeckerV2124Pod,
    motionOrigin: 'center center',
    panX: ['-1%', '1%'],
    panY: ['0.5%', '-0.5%'],
    scaleRange: [1.03, 1.1]
  },
  {
    id: 'capsule-wp-3',
    code: 'POD 03 // LAKESIDE SANCTUARY',
    label: 'Lakeside Glass Capsule',
    subLabel: '270-Degree Curved Thermal Glass & Private Patio',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'WATERFRONT',
    imageUrl: MODULAR_CAPSULE_GALLERY.lakesidePanoramaPod,
    motionOrigin: 'left center',
    panX: ['-1.5%', '1%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.08, 1.02]
  },
  {
    id: 'capsule-wp-4',
    code: 'POD 04 // ROOFTOP CONTAINER',
    label: '2-Story Container Deck',
    subLabel: 'Expandable Shipping Container Villa with Sky Terrace',
    focalLength: '28MM DAYLIGHT',
    altitude: 'ROOFTOP LOUNGE',
    imageUrl: MODULAR_CAPSULE_GALLERY.rooftopDeckContainerVilla,
    motionOrigin: 'right center',
    panX: ['1%', '-1.5%'],
    panY: ['-0.5%', '0.5%'],
    scaleRange: [1.02, 1.09]
  },
  {
    id: 'capsule-wp-5',
    code: 'POD 05 // HEX-LED SMART POD',
    label: 'Cyber-Hex Container',
    subLabel: 'Smart Ambient Perimeter Lighting & Acoustic Glass',
    focalLength: '24MM f/1.4 CINE',
    altitude: 'SMART GARDEN',
    imageUrl: MODULAR_CAPSULE_GALLERY.hexLedSmartContainer,
    motionOrigin: 'center bottom',
    panX: ['-1%', '1%'],
    panY: ['1%', '-0.5%'],
    scaleRange: [1.09, 1.02]
  },
  {
    id: 'capsule-wp-6',
    code: 'POD 06 // Q3 ALPINE CABIN',
    label: 'Q3 pitched-Roof Pod',
    subLabel: 'Nordic A-Frame Modular Capsule for Pine Estates',
    focalLength: '35MM NATURAL',
    altitude: 'FOREST RIDGE',
    imageUrl: MODULAR_CAPSULE_GALLERY.q3ForestCabinPod,
    motionOrigin: 'center center',
    panX: ['0%', '-1.5%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.02, 1.08]
  },
  {
    id: 'capsule-wp-7',
    code: 'POD 07 // TROPICAL STUDIO',
    label: 'Garden Glass Container',
    subLabel: 'Turnkey Executive Resort Suite & Home Office',
    focalLength: '24MM PRIME',
    altitude: 'GARDEN LEVEL',
    imageUrl: MODULAR_CAPSULE_GALLERY.tropicalGlassOfficePod,
    motionOrigin: 'left center',
    panX: ['-1%', '1.5%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.03, 1.09]
  },
  {
    id: 'capsule-wp-8',
    code: 'POD 08 // 3D LOFT CUTAWAY',
    label: 'Isometric Loft Layout',
    subLabel: 'Mezzanine Bedroom, Full Kitchen & Luxury Bath',
    focalLength: 'ISOMETRIC BIM',
    altitude: 'INTERIOR PLAN',
    imageUrl: MODULAR_CAPSULE_GALLERY.isometricLoftContainer,
    motionOrigin: 'center center',
    panX: ['0%', '0%'],
    panY: ['-1%', '1%'],
    scaleRange: [1.02, 1.07]
  },
  {
    id: 'capsule-wp-9',
    code: 'POD 09 // STEELMARK FACTORY',
    label: 'Steel Frame & Veranda',
    subLabel: 'Heavy-Gauge Galvanized Chassis & Timber Pergola',
    focalLength: '28MM WORKSHOP',
    altitude: 'FACTORY QA',
    imageUrl: MODULAR_CAPSULE_GALLERY.steelmarkPorchPod,
    motionOrigin: 'center center',
    panX: ['-1%', '1%'],
    panY: ['0%', '0%'],
    scaleRange: [1.04, 1.01]
  }
];

const CINEMATIC_TOUR_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-on-a-sunny-day-41465-large.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
];

type AtmosphereGrade = 'crystal_daylight' | 'solar_vivid' | 'golden_hdr';

const SLIDE_DURATION_MS = 10000;
const WAYPOINT_DURATION_MS = 4200;

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

  // Default to Modular Capsule & Container Virtual Tour so the new imagery shines immediately
  const [isCapsuleTourMode, setIsCapsuleTourMode] = useState(true);

  // Brighter, sharper default optical preset
  const [atmosphere, setAtmosphere] = useState<AtmosphereGrade>('crystal_daylight');
  const [isUltraSharp, setIsUltraSharp] = useState(true);

  // De-cluttering UI Slider Toggles (Director's Tour Deck defaults to OFF for a clean, airy banner)
  const [showDirectorDeck, setShowDirectorDeck] = useState(false);
  const [showCameraSwitcher, setShowCameraSwitcher] = useState(true);
  const [showTelemetryStrip, setShowTelemetryStrip] = useState(false);
  const [isHudMenuOpen, setIsHudMenuOpen] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [videoFailed, setVideoFailed] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const slide = activeSlides[currentIdx] || activeSlides[0];

  // Build camera waypoints: either the 9-stop Modular Capsule & Container Tour or slide-specific angles
  const cameraWaypoints: CameraWaypoint[] = useMemo(() => {
    if (isCapsuleTourMode) {
      return MODULAR_CAPSULE_TOUR_WAYPOINTS;
    }
    if (!slide) return MODULAR_CAPSULE_TOUR_WAYPOINTS;

    const bank = ARCHITECTURAL_CAMERA_BANKS[currentIdx % ARCHITECTURAL_CAMERA_BANKS.length];
    const isModularSlide =
      slide.categoryTag?.toLowerCase().includes('modular') ||
      slide.title?.toLowerCase().includes('capsule') ||
      slide.title?.toLowerCase().includes('container');

    const primaryImg = isModularSlide
      ? MODULAR_CAPSULE_GALLERY.k5WaterfrontCapsule
      : slide.imageUrl || bank[0];

    return [
      {
        id: `${slide.id}-cam-1`,
        code: 'CAM 01 // EXTERIOR ELEVATION',
        label: 'Primary Facade',
        subLabel: 'Ultra-Sharp Daylight Perspective',
        focalLength: '24MM f/1.4 PRIME',
        altitude: 'MAIN VIEW',
        imageUrl: primaryImg,
        motionOrigin: 'center center',
        panX: ['0%', '-1.5%'],
        panY: ['0%', '-1%'],
        scaleRange: [1.02, 1.1]
      },
      {
        id: `${slide.id}-cam-2`,
        code: 'CAM 02 // CAPSULE & DECK',
        label: 'Modular Glass Suite',
        subLabel: 'Panoramic Thermal Glazing & Terrace',
        focalLength: '35MM f/1.8 HDR',
        altitude: 'TERRACE LEVEL',
        imageUrl: bank[1],
        motionOrigin: 'left center',
        panX: ['-1.5%', '1%'],
        panY: ['0.5%', '-0.5%'],
        scaleRange: [1.09, 1.02]
      },
      {
        id: `${slide.id}-cam-3`,
        code: 'CAM 03 // INTERIOR & LOFT',
        label: 'Spatial Walkthrough',
        subLabel: 'Bespoke Smart Living & Automation',
        focalLength: '18MM ULTRA-WIDE',
        altitude: 'INTERIOR SUITE',
        imageUrl: bank[2],
        motionOrigin: 'right center',
        panX: ['1%', '-1.5%'],
        panY: ['-0.5%', '0.5%'],
        scaleRange: [1.03, 1.11]
      },
      {
        id: `${slide.id}-cam-4`,
        code: 'CAM 04 // STRUCTURAL & SITE',
        label: 'Engineering & Horizon',
        subLabel: 'Galvanized Steel Core & Outdoor Deck',
        focalLength: '50MM CINE',
        altitude: 'SITE OVERVIEW',
        imageUrl: bank[3],
        motionOrigin: 'center bottom',
        panX: ['-1%', '1%'],
        panY: ['1%', '-1%'],
        scaleRange: [1.1, 1.02]
      }
    ];
  }, [slide, currentIdx, isCapsuleTourMode]);

  const activeWaypoint = cameraWaypoints[waypointIdx] || cameraWaypoints[0];

  useEffect(() => {
    setWaypointIdx(0);
    setVideoFailed(false);
  }, [currentIdx, isCapsuleTourMode]);

  // Auto-cycle camera waypoints
  useEffect(() => {
    if (isPaused) return;
    const wpTimer = setInterval(() => {
      setWaypointIdx(prev => (prev + 1) % cameraWaypoints.length);
    }, WAYPOINT_DURATION_MS);
    return () => clearInterval(wpTimer);
  }, [isPaused, cameraWaypoints.length, currentIdx, isCapsuleTourMode]);

  // Auto-advance project slide when not locked in Capsule Tour, Cinema Theater, or Video mode
  useEffect(() => {
    if (
      activeSlides.length <= 1 ||
      isPaused ||
      isVideoTourActive ||
      isCinemaTheaterMode ||
      isCapsuleTourMode
    ) {
      return;
    }
    const slideTimer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % activeSlides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(slideTimer);
  }, [
    activeSlides.length,
    isPaused,
    isVideoTourActive,
    isCinemaTheaterMode,
    isCapsuleTourMode,
    currentIdx
  ]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  if (activeSlides.length === 0) return null;

  const handlePrev = () => {
    if (isCapsuleTourMode) {
      setWaypointIdx(prev => (prev - 1 + cameraWaypoints.length) % cameraWaypoints.length);
    } else {
      setCurrentIdx(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
  };

  const handleNext = () => {
    if (isCapsuleTourMode) {
      setWaypointIdx(prev => (prev + 1) % cameraWaypoints.length);
    } else {
      setCurrentIdx(prev => (prev + 1) % activeSlides.length);
    }
  };

  const quickCategories: { label: string; value: PropertyCategory }[] = [
    { label: 'All Portfolios', value: 'all' },
    { label: 'Modular Smart Pods', value: 'modular' },
    { label: 'Luxury Residential', value: 'residential' },
    { label: 'Commercial Plazas', value: 'commercial' },
    { label: 'Mega Projects', value: 'projects' }
  ];

  // Brighter, high-clarity optical color grades for a luminous site experience
  const atmosphereFilterClass =
    atmosphere === 'crystal_daylight'
      ? 'brightness-[1.12] contrast-[1.14] saturate-[1.22]'
      : atmosphere === 'solar_vivid'
      ? 'brightness-[1.16] contrast-[1.10] saturate-[1.30]'
      : 'brightness-[1.08] contrast-[1.16] saturate-[1.35]';

  // Reusable UI Slider Switch component for de-cluttering controls
  const ToggleSwitch = ({
    label,
    description,
    checked,
    onChange
  }: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      onClick={onChange}
      className="w-full flex items-center justify-between gap-3 py-2 px-2.5 rounded-xl hover:bg-white/10 transition-colors text-left cursor-pointer"
    >
      <div>
        <div className="text-xs font-bold text-white leading-tight">{label}</div>
        {description && <div className="text-[10px] text-slate-300">{description}</div>}
      </div>
      <div
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${
          checked ? 'bg-amber-400' : 'bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-slate-950 shadow-md transform transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-900 text-white select-none shadow-[0_20px_70px_rgba(15,23,42,0.45)] border-b border-white/15"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      {/* Inline SVG Unsharp-Mask Filter for Razor-Sharp Architectural Edges */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="hero-crisp-sharpen">
            <feConvolveMatrix
              order="3 3"
              preserveAlpha="true"
              kernelMatrix="0 -0.35 0 -0.35 2.4 -0.35 0 -0.35 0"
            />
          </filter>
        </defs>
      </svg>

      {/* 1. ULTRA-SHARP, BRIGHT ARCHITECTURAL & CAPSULE BACKDROP */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        <AnimatePresence mode="sync">
          {isVideoTourActive && !videoFailed ? (
            <motion.div
              key={`video-reel-${slide.id}`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
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
                  transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -8}px, 0) scale(1.03)`
                }}
                className={`w-full h-full object-cover object-center transition-transform duration-300 ease-out ${atmosphereFilterClass}`}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeWaypoint.id}
              initial={{
                opacity: 0,
                scale: activeWaypoint.scaleRange[0]
              }}
              animate={{
                opacity: 1,
                scale: activeWaypoint.scaleRange[1],
                x: activeWaypoint.panX,
                y: activeWaypoint.panY
              }}
              exit={{
                opacity: 0
              }}
              transition={{
                opacity: { duration: 0.75, ease: 'easeOut' },
                scale: { duration: WAYPOINT_DURATION_MS / 1000 + 1.2, ease: 'linear' },
                x: { duration: WAYPOINT_DURATION_MS / 1000 + 1.2, ease: 'linear' },
                y: { duration: WAYPOINT_DURATION_MS / 1000 + 1.2, ease: 'linear' }
              }}
              style={{ transformOrigin: activeWaypoint.motionOrigin }}
              className="absolute inset-0 w-full h-full will-change-transform"
            >
              <img
                src={activeWaypoint.imageUrl}
                alt={`${slide.title} - ${activeWaypoint.label}`}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    MODULAR_CAPSULE_GALLERY.k5WaterfrontCapsule;
                }}
                style={{
                  transform: `translate3d(${mousePos.x * -12}px, ${mousePos.y * -8}px, 0)`,
                  filter: isUltraSharp ? 'url(#hero-crisp-sharpen)' : undefined,
                  imageRendering: 'auto'
                }}
                className={`w-full h-full object-cover object-center transition-transform duration-300 ease-out ${atmosphereFilterClass}`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightened, Crystal-Clear Scrims (Keeps images bright & vivid while preserving text legibility) */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isCinemaTheaterMode
              ? 'bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20'
              : 'bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/25 pointer-events-none" />

        {/* Subtle Daylight Sunbeam Glow */}
        <div className="absolute -top-24 right-1/4 w-[36rem] h-[36rem] rounded-full bg-amber-300/15 blur-[130px] pointer-events-none mix-blend-screen" />
      </div>

      {/* 2. STREAMLINED TOP CONTROL BAR WITH SLIDER TOGGLES */}
      <div className="relative z-30 border-b border-white/15 bg-slate-950/45 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Virtual Tour Mode Switcher & Quick Categories */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {/* Capsule & Container Virtual Tour Mode Toggle */}
            <button
              onClick={() => setIsCapsuleTourMode(prev => !prev)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer border ${
                isCapsuleTourMode
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.45)]'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
              title="Toggle Modular Capsule & Container Homes Virtual Tour"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Capsule &amp; Container Tour</span>
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] ${
                  isCapsuleTourMode ? 'bg-slate-950 text-amber-300' : 'bg-white/20 text-white'
                }`}
              >
                {isCapsuleTourMode ? 'ON' : 'OFF'}
              </span>
            </button>

            <div className="h-4 w-[1px] bg-white/20 mx-1 shrink-0" />

            {quickCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  if (cat.value === 'modular') setIsCapsuleTourMode(true);
                  onSelectCategoryFilter(cat.value);
                }}
                className="px-3 py-1 rounded-full text-[11px] font-semibold text-white/90 hover:text-slate-950 hover:bg-amber-300 bg-white/10 border border-white/15 transition-all shrink-0 cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right: Direct Slider Toggle for Director's Tour Deck, Brightness & HUD Customizer */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Direct Quick-Slider Pill for "Director's Tour Deck" */}
            <label
              onClick={() => setShowDirectorDeck(prev => !prev)}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/75 border border-white/20 hover:border-amber-300/60 cursor-pointer transition-all"
              title="Show or hide the Director's Tour Deck panel to reduce banner clutter"
            >
              <span className="text-[11px] font-bold text-slate-100">Director&apos;s Tour Deck</span>
              <div
                className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${
                  showDirectorDeck ? 'bg-amber-400' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-slate-950 transition-transform duration-200 ${
                    showDirectorDeck ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>

            {/* Bright Optical Grade Selector */}
            <div className="hidden xl:flex items-center bg-slate-900/75 p-0.5 rounded-full border border-white/15">
              {(
                [
                  { id: 'crystal_daylight', label: 'Crystal Daylight' },
                  { id: 'solar_vivid', label: 'Solar Vivid' },
                  { id: 'golden_hdr', label: 'Golden HDR' }
                ] as { id: AtmosphereGrade; label: string }[]
              ).map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => setAtmosphere(grade.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    atmosphere === grade.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {grade.label}
                </button>
              ))}
            </div>

            {/* HUD & Clutter Control Popover Button */}
            <div className="relative">
              <button
                onClick={() => setIsHudMenuOpen(prev => !prev)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isHudMenuOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-900/75 border-white/20 text-white hover:bg-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>View Options</span>
              </button>

              <AnimatePresence>
                {isHudMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/20 p-3.5 shadow-2xl z-50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/10">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                        Banner Display Controls
                      </span>
                      <button
                        onClick={() => setIsHudMenuOpen(false)}
                        className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                      >
                        Done
                      </button>
                    </div>

                    <ToggleSwitch
                      label="Director's Tour Deck"
                      description="Right-side project & camera monitor"
                      checked={showDirectorDeck}
                      onChange={() => setShowDirectorDeck(prev => !prev)}
                    />

                    <ToggleSwitch
                      label="Camera Angle Switcher"
                      description="Top multi-angle virtual tour bar"
                      checked={showCameraSwitcher}
                      onChange={() => setShowCameraSwitcher(prev => !prev)}
                    />

                    <ToggleSwitch
                      label="Telemetry & Valuation Strip"
                      description="Detailed 4-card specification boxes"
                      checked={showTelemetryStrip}
                      onChange={() => setShowTelemetryStrip(prev => !prev)}
                    />

                    <ToggleSwitch
                      label="Capsule & Container Tour"
                      description="9-stop modular pod virtual tour"
                      checked={isCapsuleTourMode}
                      onChange={() => setIsCapsuleTourMode(prev => !prev)}
                    />

                    <ToggleSwitch
                      label="Ultra-Crisp Sharpening"
                      description="Optical edge clarity filter"
                      checked={isUltraSharp}
                      onChange={() => setIsUltraSharp(prev => !prev)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pure Showcase Mode Button */}
            <button
              onClick={() => setIsCinemaTheaterMode(prev => !prev)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isCinemaTheaterMode
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-lg'
                  : 'bg-slate-900/75 border-white/20 text-white hover:bg-slate-900'
              }`}
              title="Hide all text for an unobstructed view of the architecture"
            >
              {isCinemaTheaterMode ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">
                {isCinemaTheaterMode ? 'Exit Full View' : 'Clean View'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN FOREGROUND STAGE */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 min-h-[540px] sm:min-h-[620px] flex flex-col justify-between">
        {/* Optional Top Camera Waypoint Selector (Can be toggled off via slider) */}
        <AnimatePresence>
          {showCameraSwitcher && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/65 backdrop-blur-xl border border-white/20 shadow-xl overflow-x-auto max-w-full no-scrollbar">
                <button
                  onClick={() => setIsVideoTourActive(prev => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isVideoTourActive
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-amber-300'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{isVideoTourActive ? 'Video: ON' : 'Video Reel'}</span>
                </button>

                {isVideoTourActive && (
                  <button
                    onClick={() => setIsMuted(prev => !prev)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    )}
                  </button>
                )}

                <div className="h-4 w-[1px] bg-white/20 mx-0.5 shrink-0" />

                {cameraWaypoints.map((wp, idx) => {
                  const isSelected = !isVideoTourActive && waypointIdx === idx;
                  return (
                    <button
                      key={wp.id}
                      onClick={() => {
                        setIsVideoTourActive(false);
                        setWaypointIdx(idx);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-white text-slate-950 font-extrabold shadow-sm'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Camera
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-slate-950' : 'text-amber-300'
                        }`}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                        0{idx + 1}. {wp.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Compact Pause/Play Pill */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-950/65 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-white/20">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-medium text-white">
                  {activeWaypoint.subLabel}
                </span>
                <button
                  onClick={() => setIsPaused(prev => !prev)}
                  className="ml-1 p-1 rounded-lg bg-white/15 hover:bg-amber-400 hover:text-slate-950 text-white transition-all cursor-pointer"
                  title={isPaused ? 'Resume Tour' : 'Pause Frame'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Main Content Area */}
        <AnimatePresence mode="wait">
          {!isCinemaTheaterMode ? (
            <motion.div
              key="foreground-content"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6"
            >
              {/* Left Column: Expands cleanly when Director's Tour Deck is toggled OFF */}
              <div className={showDirectorDeck ? 'lg:col-span-8' : 'lg:col-span-10'}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isCapsuleTourMode ? activeWaypoint.id : slide.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                  >
                    {/* Clean Location & Category Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-400 text-slate-950 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {isCapsuleTourMode
                            ? activeWaypoint.code
                            : slide.categoryTag || 'Featured Architecture'}
                        </span>
                      </span>

                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-950/70 backdrop-blur-md text-white border border-white/25">
                        <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span>
                          {isCapsuleTourMode
                            ? 'Turnkey Nationwide Delivery & Installation'
                            : slide.society || 'Faisal Hills, Taxila'}
                        </span>
                      </div>

                      <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 backdrop-blur-md">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Verified Quality</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.06] font-serif drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)]">
                      {isCapsuleTourMode
                        ? `${activeWaypoint.label} — Modular Smart Living`
                        : slide.title}
                    </h1>

                    {/* Subtitle / Description */}
                    <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-2xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-medium">
                      {isCapsuleTourMode
                        ? `${activeWaypoint.subLabel}. Engineered with galvanized steel framing, double-glazed tempered acoustic glass, smart climate automation, and rapid turnkey installation.`
                        : slide.description || slide.subtitle}
                    </p>

                    {/* Compact Price Pill (Always visible) + Optional Telemetry Strip (Controlled by Slider) */}
                    {!showTelemetryStrip ? (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-amber-400/50">
                          <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                            Starting Valuation
                          </span>
                          <span className="text-lg font-black text-white font-mono">
                            {isCapsuleTourMode ? 'PKR 45 Lakh - 1.85 Crore' : slide.price}
                          </span>
                        </div>

                        <button
                          onClick={() => setShowTelemetryStrip(true)}
                          className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Gauge className="w-3.5 h-3.5 text-amber-300" />
                          <span>Show Specs</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-3xl">
                        <div className="p-3 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-amber-400/50">
                          <span className="block text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                            Valuation
                          </span>
                          <span className="text-base sm:text-lg font-black text-white font-mono">
                            {isCapsuleTourMode ? 'PKR 45L - 1.85Cr' : slide.price}
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/20">
                          <span className="block text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                            Virtual Tour
                          </span>
                          <span className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                            <Orbit className="w-4 h-4 text-cyan-300" />
                            <span>{cameraWaypoints.length} HD Angles</span>
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/20">
                          <span className="block text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                            Optics
                          </span>
                          <span className="text-sm font-extrabold text-amber-300 flex items-center gap-1.5 mt-0.5">
                            <Gauge className="w-4 h-4 text-amber-300" />
                            <span>{activeWaypoint.focalLength}</span>
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-white/20">
                          <span className="block text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                            Structure
                          </span>
                          <span className="text-sm font-extrabold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>ISO / CE Certified</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Primary Call-To-Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        id="hero-launch-3d-tour-btn"
                        onClick={() =>
                          onOpen3DTour(
                            slide.samplePropertyData || {
                              title: isCapsuleTourMode
                                ? activeWaypoint.label
                                : slide.title,
                              category: isCapsuleTourMode ? 'modular' : 'residential'
                            }
                          )
                        }
                        className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-slate-950" />
                        <span>Launch 3D Virtual Tour</span>
                      </button>

                      <button
                        id="hero-explore-listings-btn"
                        onClick={onExploreClick}
                        className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xl text-white font-extrabold text-xs sm:text-sm transition-all border border-white/30 flex items-center gap-2 cursor-pointer"
                      >
                        <span>Explore Portfolio</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        id="hero-contact-agent-btn"
                        onClick={onContactAgentClick}
                        className="px-5 py-3.5 rounded-xl bg-slate-950/75 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm border border-white/25 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                        <span>Book Consultation</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column: Director's Tour Deck (Only rendered when toggled ON via Slider) */}
              <AnimatePresence>
                {showDirectorDeck && (
                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-4"
                  >
                    <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/25 rounded-3xl p-5 shadow-2xl space-y-4">
                      {/* Header with Quick Close Slider */}
                      <div className="flex items-center justify-between border-b border-white/15 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-xs font-black text-white uppercase tracking-widest">
                            Director&apos;s Tour Deck
                          </span>
                        </div>
                        <button
                          onClick={() => setShowDirectorDeck(false)}
                          className="text-[10px] font-bold text-slate-300 hover:text-amber-300 bg-white/10 px-2.5 py-1 rounded-full cursor-pointer"
                        >
                          Hide Deck
                        </button>
                      </div>

                      {/* Capsule & Container Multi-Angle Thumbnail Grid */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          <span>
                            {isCapsuleTourMode ? 'Capsule & Container Angles' : 'Building Angles'}
                          </span>
                          <span className="text-amber-300">{activeWaypoint.label}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                          {cameraWaypoints.map((wp, i) => (
                            <button
                              key={wp.id}
                              onClick={() => {
                                setIsVideoTourActive(false);
                                setWaypointIdx(i);
                              }}
                              className={`relative h-14 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                                !isVideoTourActive && waypointIdx === i
                                  ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02]'
                                  : 'border-white/20 opacity-75 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={wp.imageUrl}
                                alt={wp.label}
                                className="w-full h-full object-cover brightness-110 contrast-110"
                              />
                              <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-black text-white bg-slate-950/70 px-1 rounded">
                                0{i + 1}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Project Switcher List */}
                      <div className="space-y-2 pt-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          Featured Portfolios
                        </div>
                        {activeSlides.slice(0, 3).map((s, idx) => {
                          const isCurrent = !isCapsuleTourMode && currentIdx === idx;
                          return (
                            <div
                              key={s.id}
                              onClick={() => {
                                setIsCapsuleTourMode(false);
                                setCurrentIdx(idx);
                              }}
                              className={`p-2 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                                isCurrent
                                  ? 'bg-amber-400/20 border-amber-400 text-white'
                                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <img
                                src={s.imageUrl}
                                alt={s.title}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-bold uppercase text-amber-300 truncate">
                                  {s.society}
                                </div>
                                <div className="text-xs font-bold text-white truncate">
                                  {s.title}
                                </div>
                                <div className="text-[11px] text-slate-200 font-mono">
                                  {s.price}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Minimalist Floating Bar when in Clean Full-Screen View */
            <motion.div
              key="showcase-minimal-hud"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-auto bg-slate-950/75 backdrop-blur-xl border border-white/25 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xl"
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                  {activeWaypoint.code}
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white font-serif">
                  {isCapsuleTourMode ? activeWaypoint.label : slide.title}
                </h2>
                <p className="text-xs text-slate-200">{activeWaypoint.subLabel}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() =>
                    onOpen3DTour(
                      slide.samplePropertyData || { title: activeWaypoint.label }
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>3D Tour</span>
                </button>
                <button
                  onClick={() => setIsCinemaTheaterMode(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Restore Details</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. CLEAN BOTTOM THUMBNAIL & NAVIGATION BAR */}
        <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
          {/* Quick Thumbnail Strip for Instant Virtual Touring */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {cameraWaypoints.map((wp, idx) => {
              const isSelected = !isVideoTourActive && waypointIdx === idx;
              return (
                <button
                  key={wp.id}
                  onClick={() => {
                    setIsVideoTourActive(false);
                    setWaypointIdx(idx);
                  }}
                  className={`group relative h-11 sm:h-12 w-16 sm:w-20 rounded-xl overflow-hidden border transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/60 scale-105'
                      : 'border-white/25 opacity-75 hover:opacity-100'
                  }`}
                  title={wp.label}
                >
                  <img
                    src={wp.imageUrl}
                    alt={wp.label}
                    className="w-full h-full object-cover brightness-110 contrast-110 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-1 py-0.5">
                    <span className="block text-[8px] font-bold text-white truncate">
                      {wp.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Prev / Next Navigation Controls */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-mono text-white/90 mr-1">
              0{waypointIdx + 1} / 0{cameraWaypoints.length}
            </span>
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-slate-950/70 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/25 transition-all cursor-pointer"
              aria-label="Previous View"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-slate-950/70 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/25 transition-all cursor-pointer"
              aria-label="Next View"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
