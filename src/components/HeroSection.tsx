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
  Home,
  Building2,
  Layers,
  Crosshair,
  Disc,
  Zap,
  HardHat,
  PanelTop,
  CheckCircle2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { HeroSlide, PropertyCategory } from '../types';

interface HeroSectionProps {
  slides: HeroSlide[];
  onExploreClick: () => void;
  onContactAgentClick: () => void;
  onSelectCategoryFilter: (category: PropertyCategory) => void;
  onOpen3DTour: (sample: any) => void;
}

export type TourDeckCategory =
  | 'all_showroom'
  | 'properties_plots_villas'
  | 'commercial_plazas'
  | 'capsule_containers'
  | 'upvc_construction';

interface SpatialHotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  spec: string;
}

interface CameraWaypoint {
  id: string;
  tourCategory: TourDeckCategory;
  propertyCategory: PropertyCategory;
  divisionTag: string;
  code: string;
  label: string;
  subLabel: string;
  headline: string;
  description: string;
  valuation: string;
  locationBadge: string;
  focalLength: string;
  altitude: string;
  fov: string;
  imageUrl: string;
  fallbackUrl: string;
  videoUrl: string;
  motionOrigin: string;
  panX: [string, string];
  panY: [string, string];
  scaleRange: [number, number];
  hotspots: SpatialHotspot[];
}

// ============================================================================
// 1. VERIFIED HIGH-RESOLUTION CAPSULE & CONTAINERIZED HOUSE GALLERY
//    (Updated with the 5 new user-provided capsule/container house assets)
// ============================================================================

export const MODULAR_CAPSULE_GALLERY = {
  // 1. Lakeside 270-degree curved glass panoramic capsule pod with timber deck
  cap1_lakesidePanoramaPod: 'https://www.genspark.ai/api/files/s/IEOFqhM7',
  // 2. V2124 Double-Decker stacked white curved-glass luxury capsule villa
  cap2_doubleDeckerV2124Pod: 'https://www.genspark.ai/api/files/s/W2Z5zFao',
  // 3. Matte-black futuristic container smart house with warm amber Hex-LED portal
  cap3_hexLedSmartContainer: 'https://www.genspark.ai/api/files/s/xBNmbfCQ',
  // 4. White luxury shipping container villa with upper rooftop deck & wrap-around wood patio
  cap4_rooftopDeckContainerVilla: 'https://www.genspark.ai/api/files/s/Iswmh2Gk',
  // 5. Q3 white pitched-roof modular alpine capsule house in pine forest
  cap5_q3ForestCabinPod: 'https://www.genspark.ai/api/files/s/JycQaAWz',
  // Additional verified capsule & modular assets
  cap6_k5WaterfrontCapsule: 'https://www.genspark.ai/api/files/s/NC8JX3DY',
  cap7_tropicalGlassOfficePod: 'https://www.genspark.ai/api/files/s/sLJbA0cn',
  cap8_steelmarkPorchPod: 'https://www.genspark.ai/api/files/s/qkpwDNgf'
};

export const CONSTRUCTED_HOUSES_GALLERY = {
  house1_whiteSupercarVilla: 'https://www.genspark.ai/api/files/s/YZr3409c',
  house2_charcoalGarageVilla: 'https://www.genspark.ai/api/files/s/7QO0W212',
  house3_stoneGlassMansion: 'https://www.genspark.ai/api/files/s/G0HfpG8n',
  house4_obsidianTerraceVilla: 'https://www.genspark.ai/api/files/s/MaqwqSX0',
  house5_whitePillaredEstate: 'https://www.genspark.ai/api/files/s/oARmbiwI'
};

export const UPVC_AND_INTERIOR_GALLERY = {
  upvc1_glassRoofConservatory: 'https://www.genspark.ai/api/files/s/ymhFeOsA',
  upvc2_woodSlatTvPartition: 'https://www.genspark.ai/api/files/s/jgeipCWH',
  upvc3_floatingStaircaseAtrium: 'https://www.genspark.ai/api/files/s/glbQm2cO',
  upvc4_circularZenTvWall: 'https://www.genspark.ai/api/files/s/mnJLBmSM',
  upvc5_koiPondCourtyard: 'https://www.genspark.ai/api/files/s/QhWCNmTo'
};

// High-availability 4K UHD architectural backups
const UHD_ARCHITECTURAL_BACKUPS = {
  capsuleLakeside: 'https://www.genspark.ai/api/files/s/IEOFqhM7',
  capsuleDoubleDecker: 'https://www.genspark.ai/api/files/s/W2Z5zFao',
  capsuleHexLed: 'https://www.genspark.ai/api/files/s/xBNmbfCQ',
  capsuleRooftopDeck: 'https://www.genspark.ai/api/files/s/Iswmh2Gk',
  capsuleQ3Alpine: 'https://www.genspark.ai/api/files/s/JycQaAWz',
  villaWhite: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=95',
  villaModern: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95',
  villaTwilight: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=95',
  commercialTower: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=95',
  commercialAtrium: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=95',
  upvcCurtainWall: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2400&q=95',
  upvcPartitions: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=95'
};

const SHOWROOM_VIDEOS = {
  architecturalFlyover: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-on-a-sunny-day-41465-large.mp4',
  luxuryInteriorWalk: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  villaDroneOrbit: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
};

// ============================================================================
// 2. MASTER WAYPOINTS COVERING ALL RI8CLICK CONSORTIUM BUSINESS PILLARS:
//    - Properties (Plots & Constructed Houses)
//    - Commercial Plazas & Corporate Centers (High-Rise, Shops & Flats)
//    - Container & Capsule Smart Houses (Updated with new verified images)
//    - UPVC Doors, Windows, Partitions, Panels & Turnkey Construction
// ============================================================================

const MASTER_VIRTUAL_TOUR_WAYPOINTS: CameraWaypoint[] = [
  // ---------------- PILLAR 1: PROPERTIES (PLOTS & CONSTRUCTED HOUSES) ----------------
  {
    id: 'prop-wp-1',
    tourCategory: 'properties_plots_villas',
    propertyCategory: 'residential',
    divisionTag: 'PROPERTIES // PLOTS & CONSTRUCTED HOUSES',
    code: 'PROP 01 // CONSTRUCTED VILLA & PLOTS',
    label: 'Cantilevered Designer Villa',
    subLabel: '1-Kanal Constructed House & Possession Plots in Faisal Hills',
    headline: 'Constructed Signature Villas & Prime Residential Plots',
    description:
      'ri8click Properties offers 100% watermark-verified Residential & Commercial Plots (5 Marla, 10 Marla, 1 & 2 Kanal) alongside architect-constructed luxury houses in Faisal Hills, Kohistan Enclave, Multi Gardens B-17, and DHA Islamabad.',
    valuation: 'Plots from PKR 45L • Villas 6.85 Cr+',
    locationBadge: 'Faisal Hills Executive, Taxila & Islamabad',
    focalLength: '24MM f/1.4 MASTER PRIME',
    altitude: 'ELEVATION +4.2M',
    fov: '84° WIDE',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house1_whiteSupercarVilla,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.villaWhite,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'center center',
    panX: ['0%', '-1.8%'],
    panY: ['0%', '-1.2%'],
    scaleRange: [1.02, 1.1],
    hotspots: [
      { id: 'p1-1', x: 54, y: 28, title: 'Turnkey Constructed Residence', spec: 'A+ grade seismic RCC structure with cantilevered sky terraces.' },
      { id: 'p1-2', x: 24, y: 42, title: 'ri8click UPVC Thermal Glazing', spec: 'Double-glazed German profile UPVC windows & sliding doors.' },
      { id: 'p1-3', x: 68, y: 68, title: 'Verified Plot & Villa Inventory', spec: 'Direct allotment & possession plots available across Blocks A, B, C & Executive.' }
    ]
  },
  {
    id: 'prop-wp-2',
    tourCategory: 'properties_plots_villas',
    propertyCategory: 'residential',
    divisionTag: 'PROPERTIES // PLOTS & CONSTRUCTED HOUSES',
    code: 'PROP 02 // MARGALLA RIDGE ESTATE',
    label: 'Hillside Stone & Glass Manor',
    subLabel: 'Constructed Luxury House & Developed Ridge Plots',
    headline: 'Margalla View Constructed Houses & Estate Plots',
    description:
      'Commanding panoramic Margalla foothill views, our constructed residences and developed plots combine natural stacked-stone facades, warm timber soffits, floating LED staircases, and full underground utilities.',
    valuation: 'PKR 7.40 Crore - 8.50 Crore',
    locationBadge: 'Kohistan Enclave, B-17 & Faisal Hills',
    focalLength: '20MM ANAMORPHIC',
    altitude: 'TERRACE +6.0M',
    fov: '92° ULTRA',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house3_stoneGlassMansion,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.villaTwilight,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'left center',
    panX: ['-1.5%', '1.2%'],
    panY: ['0.6%', '-0.8%'],
    scaleRange: [1.08, 1.02],
    hotspots: [
      { id: 'p2-1', x: 32, y: 38, title: '24-Foot Corner Glass Atrium', spec: 'Seamless structural UPVC & silicone glazing overlooking Margalla Hills.' },
      { id: 'p2-2', x: 58, y: 74, title: 'Subterranean 3-Car Showroom', spec: 'Climate-controlled lower-ground parking & servant quarters.' }
    ]
  },
  {
    id: 'prop-wp-3',
    tourCategory: 'properties_plots_villas',
    propertyCategory: 'residential',
    divisionTag: 'PROPERTIES // PLOTS & CONSTRUCTED HOUSES',
    code: 'PROP 03 // MODERN PODIUM RESIDENCE',
    label: 'Charcoal Podium Villa',
    subLabel: 'Smart Constructed Villa & High-ROI Residential Plots',
    headline: 'Contemporary Podium Villas & Master-Planned Plots',
    description:
      'Explore verified residential plots and turnkey constructed podium villas featuring biophilic hanging gardens, smart home automation, and flexible installment or ready-possession options.',
    valuation: 'PKR 5.95 Crore - 6.95 Crore',
    locationBadge: 'Multi Gardens B-17 & Bahria Enclave',
    focalLength: '28MM CINE PRIME',
    altitude: 'PODIUM +3.5M',
    fov: '78° CINE',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house2_charcoalGarageVilla,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.villaModern,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'right center',
    panX: ['1.2%', '-1.5%'],
    panY: ['-0.5%', '0.8%'],
    scaleRange: [1.02, 1.09],
    hotspots: [
      { id: 'p3-1', x: 62, y: 55, title: 'Biophilic Cascading Terrace', spec: 'Automated drip-irrigated balcony planters integrated into slab edge.' },
      { id: 'p3-2', x: 52, y: 72, title: 'Triple-Bay Garage & Plot Access', spec: 'Situated on 60ft to 150ft wide carpeted society boulevards.' }
    ]
  },

  // ---------------- PILLAR 2: COMMERCIAL PLAZAS & CORPORATE CENTERS ----------------
  {
    id: 'comm-wp-1',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'COMMERCIAL PLAZAS // HIGH-RISE, SHOPS & FLATS',
    code: 'COMM 01 // HIGH-RISE CORPORATE CENTER',
    label: 'Corporate Financial Tower',
    subLabel: 'High-Rise Corporate Offices, Retail Shops & Luxury Flats',
    headline: 'High-Rise Corporate Centers & Commercial Plazas',
    description:
      'High-visibility commercial plazas and high-rise corporate centers featuring ground-floor brand retail shops, mezzanine showrooms, corporate office floors, and luxury serviced apartments with high rental yields.',
    valuation: 'Shops from PKR 35L • Plazas 18 Cr+',
    locationBadge: 'Faisal Hills Broadway, Blue Area & DHA',
    focalLength: '24MM ANAMORPHIC',
    altitude: 'SKYLINE +18M',
    fov: '88° CINE',
    imageUrl: UHD_ARCHITECTURAL_BACKUPS.commercialTower,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.commercialAtrium,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-1%', '1%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.02, 1.09],
    hotspots: [
      { id: 'cm1-1', x: 48, y: 34, title: 'Corporate Office & Apartment Floors', spec: 'Open-plan corporate suites and executive 1, 2 & 3-bed luxury flats.' },
      { id: 'cm1-2', x: 52, y: 70, title: 'Commercial Plaza Retail & Food Court', spec: 'High-footfall boulevard retail shops with double basement parking.' }
    ]
  },
  {
    id: 'comm-wp-2',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'COMMERCIAL PLAZAS // HIGH-RISE, SHOPS & FLATS',
    code: 'COMM 02 // MEGA MALL & SERVICED FLATS',
    label: 'Commercial Plaza & Flats',
    subLabel: 'Boulevard Retail Outlets, Food Courts & Executive Apartments',
    headline: 'Mixed-Use Commercial Plazas, Shops & Luxury Flats',
    description:
      'Invest in CDA & RDA approved commercial plazas on Main Commercial Broadway and GT Road corridors—combining flagship retail shops, corporate floor plates, and high-yield residential flats.',
    valuation: 'Easy 3-5 Year Installment Plans',
    locationBadge: 'Taxila GT Road, Faisal Hills & Lahore Ring Road',
    focalLength: '20MM ARCHITECTURAL',
    altitude: 'PLAZA PODIUM',
    fov: '90° WIDE',
    imageUrl: UHD_ARCHITECTURAL_BACKUPS.commercialAtrium,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.commercialTower,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['1%', '-1%'],
    panY: ['-0.5%', '0.5%'],
    scaleRange: [1.03, 1.09],
    hotspots: [
      { id: 'cm2-1', x: 44, y: 40, title: 'Luxury Residential & Studio Flats', spec: 'Dedicated residential lobby, high-speed capsule lifts & backup generators.' },
      { id: 'cm2-2', x: 60, y: 72, title: 'Anchor Retail & Banking Frontage', spec: 'Triple-height glazed commercial atrium engineered by ri8click Consortium.' }
    ]
  },

  // ---------------- PILLAR 3: CONTAINER & CAPSULE SMART HOUSES (NEW IMAGES) ----------------
  {
    id: 'capsule-wp-1',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'CAPSULE & CONTAINER HOUSES // MODULAR LIVING',
    code: 'CAPSULE 01 // LAKESIDE CURVED GLASS POD',
    label: 'Lakeside Panorama Capsule',
    subLabel: '270° Curved Thermal Glass, UPVC Seals & Timber Patio Deck',
    headline: 'Panoramic Curved-Glass Container Capsule House',
    description:
      'Factory-engineered aerodynamic space capsule house featuring 270-degree curved tempered Low-E observation glass, fluorocarbon aviation aluminum shell, smart IoT climate/lighting automation, and rapid crane installation.',
    valuation: 'PKR 58 Lakh - 98 Lakh',
    locationBadge: 'Turnkey Nationwide Delivery (Farms, Lakes & Hills)',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'WATERFRONT DECK',
    fov: '98° EXPANSIVE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap1_lakesidePanoramaPod,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleLakeside,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-1.2%', '1.2%'],
    panY: ['0%', '-0.8%'],
    scaleRange: [1.02, 1.09],
    hotspots: [
      { id: 'c1-1', x: 35, y: 48, title: '270° Curved Low-E Observation Glass', spec: 'Double-glazed thermal & acoustic curved glass with zero condensation.' },
      { id: 'c1-2', x: 73, y: 52, title: 'Smart Biometric Entry & UPVC Seal', spec: 'Weatherproof marine-grade gasket sealing with keyless smart lock.' },
      { id: 'c1-3', x: 62, y: 74, title: 'All-Weather WPC Viewing Deck', spec: 'Modular composite deck with step-stone garden integration.' }
    ]
  },
  {
    id: 'capsule-wp-2',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'CAPSULE & CONTAINER HOUSES // MODULAR LIVING',
    code: 'CAPSULE 02 // V2124 DOUBLE-DECKER VILLA',
    label: 'V2124 Double-Decker Pod',
    subLabel: '2-Story Stacked Curved Glass Capsule Villa with Lounge & Sky Suite',
    headline: 'V2124 Double-Decker Stacked Capsule Villa',
    description:
      'Two-story stacked modular capsule architecture offering an expansive ground-floor living and dining pavilion with full-height sliding glass walls and an upper-deck panoramic master suite.',
    valuation: 'PKR 1.35 Crore - 1.85 Crore',
    locationBadge: 'Luxury Farmhouses, Resorts & Urban Rooftops',
    focalLength: '20MM ARCHITECTURAL',
    altitude: '2-STORY DUPLEX',
    fov: '92° ULTRA',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap2_doubleDeckerV2124Pod,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleDoubleDecker,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-1%', '1%'],
    panY: ['0.5%', '-0.5%'],
    scaleRange: [1.02, 1.09],
    hotspots: [
      { id: 'c2-1', x: 56, y: 28, title: 'Upper-Deck V2124 Sky Suite', spec: 'Second-story curved glass master bedroom with warm LED cove lighting.' },
      { id: 'c2-2', x: 48, y: 66, title: 'Open-Plan Ground Lounge & Kitchen', spec: 'Full-span sliding UPVC/aluminum thermal glass doors opening to timber deck.' }
    ]
  },
  {
    id: 'capsule-wp-3',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'CAPSULE & CONTAINER HOUSES // MODULAR LIVING',
    code: 'CAPSULE 03 // HEX-LED SMART CONTAINER',
    label: 'Hex-LED Smart Container',
    subLabel: 'Chamfered Matte-Black Container Villa with Amber Perimeter LED',
    headline: 'Futuristic Hex-LED Containerized Smart House',
    description:
      'Architectural containerized smart home finished in matte graphite with chamfered amber LED portal framing, hexagonal acoustic interior feature walls, and floor-to-ceiling UPVC sliding glass.',
    valuation: 'PKR 55 Lakh - 90 Lakh',
    locationBadge: 'Executive Lawns, Studios & Private Estates',
    focalLength: '24MM f/1.4 CINE',
    altitude: 'SMART GARDEN',
    fov: '84° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap3_hexLedSmartContainer,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleHexLed,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center bottom',
    panX: ['-1%', '1%'],
    panY: ['0.8%', '-0.5%'],
    scaleRange: [1.08, 1.02],
    hotspots: [
      { id: 'c3-1', x: 54, y: 50, title: 'Hexagonal Acoustic Backlit Matrix', spec: 'Bespoke CNC geometric wall panels with integrated warm DALI lighting.' },
      { id: 'c3-2', x: 82, y: 42, title: 'Chamfered Architectural LED Bezel', spec: 'Weatherproof exterior structural steel & composite framing.' }
    ]
  },
  {
    id: 'capsule-wp-4',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'CAPSULE & CONTAINER HOUSES // MODULAR LIVING',
    code: 'CAPSULE 04 // ROOFTOP DECK CONTAINER HOME',
    label: 'Rooftop Deck Container',
    subLabel: 'High-Cube Container Villa with Upper Sky-Deck & Wood Patio',
    headline: 'Containerized Luxury Villa with Rooftop Lounge',
    description:
      'Engineered from reinforced high-cube Corten steel containers with an upper-level fenced sky terrace, expansive wrap-around timber veranda, full chef kitchen, and ri8click UPVC sliding glass walls.',
    valuation: 'PKR 48 Lakh - 82 Lakh',
    locationBadge: 'Chak Shahzad, Taxila, Murree & Farmhouses',
    focalLength: '28MM DAYLIGHT',
    altitude: 'ROOFTOP LOUNGE',
    fov: '80° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap4_rooftopDeckContainerVilla,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleRooftopDeck,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'right center',
    panX: ['1%', '-1.2%'],
    panY: ['-0.5%', '0.5%'],
    scaleRange: [1.02, 1.09],
    hotspots: [
      { id: 'c4-1', x: 48, y: 26, title: 'Structural Rooftop Sky-Deck', spec: 'Steel-railed upper observation deck for outdoor dining & entertaining.' },
      { id: 'c4-2', x: 52, y: 56, title: 'Full-Span UPVC Sliding Patio Doors', spec: 'Multi-track thermal break sliding doors connecting lounge to deck.' }
    ]
  },
  {
    id: 'capsule-wp-5',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'CAPSULE & CONTAINER HOUSES // MODULAR LIVING',
    code: 'CAPSULE 05 // Q3 ALPINE FOREST CABIN',
    label: 'Q3 Pitched-Roof Capsule',
    subLabel: 'Nordic Pitched-Roof Containerized Cabin for Hill Stations',
    headline: 'Q3 Alpine Pitched-Roof Modular Capsule Cabin',
    description:
      'Purpose-built for pine forests and snowfall regions, the Q3 modular cabin pairs a snow-shedding pitched roof with curved insulated composite corners and triple-glazed UPVC doors and windows.',
    valuation: 'PKR 52 Lakh - 78 Lakh',
    locationBadge: 'Murree, Nathia Gali, Swat & Northern Estates',
    focalLength: '35MM NATURAL',
    altitude: 'PINE RIDGE',
    fov: '76° NATURAL',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap5_q3ForestCabinPod,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleQ3Alpine,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0%', '-1.2%'],
    panY: ['0%', '-0.8%'],
    scaleRange: [1.02, 1.08],
    hotspots: [
      { id: 'c5-1', x: 32, y: 32, title: 'Alpine Snow-Shedding Pitched Roof', spec: 'High-density polyurethane core rated for sub-zero mountain climates.' },
      { id: 'c5-2', x: 25, y: 62, title: 'ri8click UPVC Double-Glazed Entry Door', spec: 'Airtight multi-point locking UPVC french door with recessed porch.' }
    ]
  },

  // ---------------- PILLAR 4: UPVC DOORS, WINDOWS, PARTITIONS, PANELS & CONSTRUCTION ----------------
  {
    id: 'upvc-wp-1',
    tourCategory: 'upvc_construction',
    propertyCategory: 'projects',
    divisionTag: 'CONSORTIUM // UPVC DOORS, WINDOWS, PARTITIONS & CONSTRUCTION',
    code: 'UPVC 01 // DOORS, WINDOWS & GLASS CONSERVATORY',
    label: 'UPVC Windows & Glass Systems',
    subLabel: 'German-Standard UPVC Doors, Windows, Skylights & Facades',
    headline: 'ri8click UPVC Doors, Windows, Partitions & Panels',
    description:
      'Manufactured by the ri8click UPVC & Construction Consortium: heavy-duty acoustic double/triple-glazed UPVC casement & sliding windows, patio doors, office glass partitions, and weatherproof architectural wall panels.',
    valuation: '10-Year Factory Warranty • Custom Fabrication',
    locationBadge: 'ri8click UPVC Manufacturing Plant & Turnkey Division',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'CONSERVATORY',
    fov: '96° EXPANSIVE',
    imageUrl: UPVC_AND_INTERIOR_GALLERY.upvc1_glassRoofConservatory,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.upvcCurtainWall,
    videoUrl: SHOWROOM_VIDEOS.luxuryInteriorWalk,
    motionOrigin: 'center center',
    panX: ['0%', '-1.4%'],
    panY: ['-0.8%', '0.8%'],
    scaleRange: [1.02, 1.09],
    hotspots: [
      { id: 'u1-1', x: 52, y: 24, title: 'Thermal-Break Glazed Roof & Skylights', spec: 'Argon-filled Low-E laminated glass blocking 96% UV radiation.' },
      { id: 'u1-2', x: 28, y: 54, title: 'Acoustic UPVC Sliding & Casement Windows', spec: 'Multi-chamber steel-reinforced UPVC profiles with 42dB sound reduction.' }
    ]
  },
  {
    id: 'upvc-wp-2',
    tourCategory: 'upvc_construction',
    propertyCategory: 'projects',
    divisionTag: 'CONSORTIUM // UPVC DOORS, WINDOWS, PARTITIONS & CONSTRUCTION',
    code: 'UPVC 02 // INTERIOR PARTITIONS & WALL PANELS',
    label: 'Partitions, Panels & Turnkey Fitout',
    subLabel: 'Architectural Louver Partitions, Wall Panels & Civil Construction',
    headline: 'Architectural Partitions, Wall Panels & Turnkey Construction',
    description:
      'Complete grey-structure civil construction and bespoke interior fit-outs by ri8click Consortium—featuring acoustic UPVC/glass room partitions, WPC/fluted wall panels, and LED media portals.',
    valuation: 'Turnkey Grey + Finishing Packages',
    locationBadge: 'Taxila, Faisal Hills, Rawalpindi & Islamabad',
    focalLength: '24MM PRIME',
    altitude: 'INTERIOR FITOUT',
    fov: '84° WIDE',
    imageUrl: UPVC_AND_INTERIOR_GALLERY.upvc2_woodSlatTvPartition,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.upvcPartitions,
    videoUrl: SHOWROOM_VIDEOS.luxuryInteriorWalk,
    motionOrigin: 'center center',
    panX: ['-1%', '1%'],
    panY: ['0%', '-0.8%'],
    scaleRange: [1.02, 1.08],
    hotspots: [
      { id: 'u2-1', x: 35, y: 52, title: 'Modular Room Partition & Portal', spec: 'Precision-milled acoustic partition dividers for villas & corporate offices.' },
      { id: 'u2-2', x: 68, y: 45, title: 'Architectural Wall Panels & LED Framing', spec: 'Moisture-proof composite wall cladding & turnkey electrical integration.' }
    ]
  }
];

type AtmosphereGrade = 'crystal_daylight' | 'solar_vivid' | 'showroom_hdr';

const WAYPOINT_DURATION_MS = 5600;

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

  // Main category filter aligned with Navbar & Consortium businesses
  const [tourCategory, setTourCategory] = useState<TourDeckCategory>('all_showroom');
  const [waypointIdx, setWaypointIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoTourActive, setIsVideoTourActive] = useState(false);
  const [isCinemaTheaterMode, setIsCinemaTheaterMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // 3D Spatial Perspective & Hotspot overlays
  const [is3DShowroomRig, setIs3DShowroomRig] = useState(true);
  const [showSpatialHotspots, setShowSpatialHotspots] = useState(true);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  // Optical clarity grade
  const [atmosphere, setAtmosphere] = useState<AtmosphereGrade>('crystal_daylight');
  const [isUltraSharp, setIsUltraSharp] = useState(true);

  // Unified Crystal Bar Toggles (Prevents clutter between Video Reel, 3D Showroom Tour & Director's Tour Deck)
  const [showConsortiumRibbon, setShowConsortiumRibbon] = useState(true);
  const [showShowroomTourBar, setShowShowroomTourBar] = useState(true);
  const [showDirectorDeck, setShowDirectorDeck] = useState(true);
  const [showTelemetryStrip, setShowTelemetryStrip] = useState(false);
  const [isHudMenuOpen, setIsHudMenuOpen] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [videoFailed, setVideoFailed] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Convert CMS commercial/project slides into waypoints (excluding outdated capsule images)
  const cmsCommercialWaypoints: CameraWaypoint[] = useMemo(() => {
    return activeSlides
      .filter(s => s.samplePropertyData?.category === 'commercial')
      .map((s, idx) => ({
        id: `cms-wp-${s.id}`,
        tourCategory: 'commercial_plazas' as TourDeckCategory,
        propertyCategory: 'commercial' as PropertyCategory,
        divisionTag: 'COMMERCIAL PLAZAS // HIGH-RISE, SHOPS & FLATS',
        code: `COMM 0${idx + 3} // ${(s.categoryTag || 'COMMERCIAL PLAZA').toUpperCase()}`,
        label: s.title.split(' ').slice(0, 3).join(' '),
        subLabel: s.subtitle || 'High-Rise Commercial Plaza, Retail Shops & Corporate Flats',
        headline: s.title,
        description: s.description || s.subtitle,
        valuation: s.price || 'PKR 3.5 Crore+',
        locationBadge: s.society || s.location || 'Faisal Hills & Islamabad',
        focalLength: '24MM ANAMORPHIC',
        altitude: 'SKYLINE +18M',
        fov: '88° CINE',
        imageUrl: s.imageUrl || UHD_ARCHITECTURAL_BACKUPS.commercialTower,
        fallbackUrl:
          idx % 2 === 0
            ? UHD_ARCHITECTURAL_BACKUPS.commercialTower
            : UHD_ARCHITECTURAL_BACKUPS.commercialAtrium,
        videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
        motionOrigin: 'center center',
        panX: ['-1%', '1%'] as [string, string],
        panY: ['0%', '-1%'] as [string, string],
        scaleRange: [1.02, 1.09] as [number, number],
        hotspots: [
          {
            id: `cms-hs-${idx}-1`,
            x: 48,
            y: 38,
            title: s.features?.[0] || 'Double-Glazed UPVC Curtain Wall',
            spec: 'High-visibility commercial frontage with capsule elevators & dedicated underground parking.'
          },
          {
            id: `cms-hs-${idx}-2`,
            x: 68,
            y: 62,
            title: s.features?.[1] || 'High-Yield Commercial Shops & Flats',
            spec: `Located in ${s.society || 'prime corridor'} with verified NOC & turnkey management.`
          }
        ]
      }));
  }, [activeSlides]);

  // Filter waypoints based on selected category
  const cameraWaypoints: CameraWaypoint[] = useMemo(() => {
    const combined = [...MASTER_VIRTUAL_TOUR_WAYPOINTS, ...cmsCommercialWaypoints];
    if (tourCategory === 'all_showroom') {
      // Interleave so all 4 consortium areas are immediately showcased at the top
      const propsList = combined.filter(w => w.tourCategory === 'properties_plots_villas');
      const commList = combined.filter(w => w.tourCategory === 'commercial_plazas');
      const capList = combined.filter(w => w.tourCategory === 'capsule_containers');
      const upvcList = combined.filter(w => w.tourCategory === 'upvc_construction');

      const interleaved: CameraWaypoint[] = [];
      const maxLen = Math.max(propsList.length, commList.length, capList.length, upvcList.length);
      for (let i = 0; i < maxLen; i++) {
        if (capList[i]) interleaved.push(capList[i]);
        if (propsList[i]) interleaved.push(propsList[i]);
        if (commList[i]) interleaved.push(commList[i]);
        if (upvcList[i]) interleaved.push(upvcList[i]);
      }
      return interleaved;
    }
    const filtered = combined.filter(wp => wp.tourCategory === tourCategory);
    return filtered.length > 0 ? filtered : MASTER_VIRTUAL_TOUR_WAYPOINTS;
  }, [tourCategory, cmsCommercialWaypoints]);

  const activeWaypoint = cameraWaypoints[waypointIdx] || cameraWaypoints[0];

  // Preload current and upcoming waypoint images for zero-flicker transitions
  useEffect(() => {
    if (cameraWaypoints.length === 0) return;
    const indicesToPreload = [
      waypointIdx,
      (waypointIdx + 1) % cameraWaypoints.length,
      (waypointIdx + 2) % cameraWaypoints.length
    ];
    indicesToPreload.forEach(i => {
      const wp = cameraWaypoints[i];
      if (!wp) return;
      const img = new Image();
      img.src = failedUrls[wp.imageUrl] ? wp.fallbackUrl : wp.imageUrl;
    });
  }, [waypointIdx, cameraWaypoints, failedUrls]);

  useEffect(() => {
    setWaypointIdx(0);
    setActiveHotspotId(null);
    setVideoFailed(false);
  }, [tourCategory]);

  // Auto-cycle camera waypoints
  useEffect(() => {
    if (isPaused || isVideoTourActive || activeHotspotId) return;
    const wpTimer = setInterval(() => {
      setWaypointIdx(prev => (prev + 1) % cameraWaypoints.length);
    }, WAYPOINT_DURATION_MS);
    return () => clearInterval(wpTimer);
  }, [isPaused, isVideoTourActive, activeHotspotId, cameraWaypoints.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  const handlePrev = () => {
    setActiveHotspotId(null);
    setWaypointIdx(prev => (prev - 1 + cameraWaypoints.length) % cameraWaypoints.length);
  };

  const handleNext = () => {
    setActiveHotspotId(null);
    setWaypointIdx(prev => (prev + 1) % cameraWaypoints.length);
  };

  const resolvedImageUrl = failedUrls[activeWaypoint.imageUrl]
    ? activeWaypoint.fallbackUrl
    : activeWaypoint.imageUrl;

  // Complete Consortium Categories mirroring the Main Menu
  const tourCategories: {
    id: TourDeckCategory;
    label: string;
    shortLabel: string;
    subtext: string;
    count: number;
    filterCategory: PropertyCategory;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'all_showroom',
      label: 'All Consortium Portfolio',
      shortLabel: 'All Portfolio',
      subtext: 'Plots, Plazas, Capsules & UPVC',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.length + cmsCommercialWaypoints.length,
      filterCategory: 'all',
      icon: <Orbit className="w-3.5 h-3.5" />
    },
    {
      id: 'properties_plots_villas',
      label: 'Properties (Plots & Houses)',
      shortLabel: 'Plots & Houses',
      subtext: 'Residential Plots & Constructed Villas',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'properties_plots_villas').length,
      filterCategory: 'residential',
      icon: <Home className="w-3.5 h-3.5" />
    },
    {
      id: 'commercial_plazas',
      label: 'Commercial Plazas & Centers',
      shortLabel: 'Commercial Plazas',
      subtext: 'High-Rise Towers, Shops & Flats',
      count:
        MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'commercial_plazas').length +
        cmsCommercialWaypoints.length,
      filterCategory: 'commercial',
      icon: <Building2 className="w-3.5 h-3.5" />
    },
    {
      id: 'capsule_containers',
      label: 'Container & Capsule Houses',
      shortLabel: 'Capsule Houses',
      subtext: 'Smart Pods & Container Villas',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'capsule_containers').length,
      filterCategory: 'modular',
      icon: <Box className="w-3.5 h-3.5" />
    },
    {
      id: 'upvc_construction',
      label: 'Consortium, Construction & UPVC',
      shortLabel: 'UPVC & Construction',
      subtext: 'Doors, Windows, Partitions & Panels',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'upvc_construction').length,
      filterCategory: 'projects',
      icon: <Layers className="w-3.5 h-3.5" />
    }
  ];

  // Consortium Business Pillars Strip (Directly reflects main menu & corporate scope)
  const consortiumPillars = [
    {
      id: 'properties_plots_villas' as TourDeckCategory,
      category: 'residential' as PropertyCategory,
      title: 'Properties: Plots & Houses',
      detail: '5M, 10M, 1-2 Kanal Plots & Constructed Villas',
      icon: Home,
      accent: 'text-sky-300 border-sky-400/30 bg-sky-500/10'
    },
    {
      id: 'commercial_plazas' as TourDeckCategory,
      category: 'commercial' as PropertyCategory,
      title: 'Commercial Plazas & Centers',
      detail: 'High-Rise Towers, Plaza Shops & Luxury Flats',
      icon: Building2,
      accent: 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10'
    },
    {
      id: 'capsule_containers' as TourDeckCategory,
      category: 'modular' as PropertyCategory,
      title: 'Container Capsule Houses',
      detail: 'Curved Glass Pods & Rooftop Container Villas',
      icon: Box,
      accent: 'text-amber-300 border-amber-400/30 bg-amber-500/10'
    },
    {
      id: 'upvc_construction' as TourDeckCategory,
      category: 'projects' as PropertyCategory,
      title: 'Construction & UPVC Systems',
      detail: 'UPVC Doors, Windows, Partitions, Panels & Civil Works',
      icon: HardHat,
      accent: 'text-purple-300 border-purple-400/30 bg-purple-500/10'
    }
  ];

  // High-clarity optical grades
  const atmosphereStyle: React.CSSProperties = useMemo(() => {
    const baseFilter =
      atmosphere === 'crystal_daylight'
        ? 'brightness(1.14) contrast(1.12) saturate(1.18)'
        : atmosphere === 'solar_vivid'
        ? 'brightness(1.20) contrast(1.12) saturate(1.28)'
        : 'brightness(1.10) contrast(1.18) saturate(1.30)';

    return {
      filter: isUltraSharp
        ? `${baseFilter} drop-shadow(0 0 1px rgba(255,255,255,0.15))`
        : baseFilter
    };
  }, [atmosphere, isUltraSharp]);

  // Reusable Toggle Switch for View Options Popover
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
          checked ? 'bg-amber-400' : 'bg-white/20'
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
      className="relative w-full overflow-hidden bg-slate-950 text-white select-none shadow-[0_25px_80px_rgba(15,23,42,0.55)] border-b border-white/20"
      style={{ perspective: '1400px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      {/* =====================================================================
          1. 3D SPATIAL STAGE & ANIMATED IMAGE / VIDEO CANVAS
         ===================================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        {/* Instant Background Underlay so transitions never flash dark */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110 transition-all duration-700"
          style={{ backgroundImage: `url(${resolvedImageUrl})` }}
        />

        <AnimatePresence initial={false} mode="sync">
          {isVideoTourActive && !videoFailed ? (
            <motion.div
              key={`video-reel-${activeWaypoint.id}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <video
                ref={videoRef}
                src={activeWaypoint.videoUrl}
                poster={resolvedImageUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onError={() => setVideoFailed(true)}
                style={{
                  ...atmosphereStyle,
                  transform: is3DShowroomRig
                    ? `translate3d(${mousePos.x * -14}px, ${mousePos.y * -10}px, 0) rotateY(${
                        mousePos.x * 2.2
                      }deg) rotateX(${mousePos.y * -1.8}deg) scale(1.05)`
                    : 'scale(1.02)'
                }}
                className="w-full h-full object-cover object-center transition-transform duration-300 ease-out"
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
                opacity: { duration: 0.65, ease: 'easeOut' },
                scale: { duration: WAYPOINT_DURATION_MS / 1000 + 1.0, ease: 'linear' },
                x: { duration: WAYPOINT_DURATION_MS / 1000 + 1.0, ease: 'linear' },
                y: { duration: WAYPOINT_DURATION_MS / 1000 + 1.0, ease: 'linear' }
              }}
              style={{
                transformOrigin: activeWaypoint.motionOrigin
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={resolvedImageUrl}
                alt={`${activeWaypoint.headline} - ${activeWaypoint.label}`}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={() => {
                  if (!failedUrls[activeWaypoint.imageUrl]) {
                    setFailedUrls(prev => ({ ...prev, [activeWaypoint.imageUrl]: true }));
                  }
                }}
                style={{
                  ...atmosphereStyle,
                  transform: is3DShowroomRig
                    ? `translate3d(${mousePos.x * -16}px, ${mousePos.y * -10}px, 0) rotateY(${
                        mousePos.x * 2.5
                      }deg) rotateX(${mousePos.y * -2}deg)`
                    : undefined,
                  imageRendering: 'high-quality' as any
                }}
                className="w-full h-full object-cover object-center transition-transform duration-300 ease-out"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* INTERACTIVE 3D SPATIAL HOTSPOT PINS ON THE STAGE */}
        {showSpatialHotspots && !isVideoTourActive && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {activeWaypoint.hotspots.map(spot => {
              const isOpen = activeHotspotId === spot.id;
              return (
                <div
                  key={spot.id}
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    transform: `translate3d(${mousePos.x * -8}px, ${mousePos.y * -5}px, 0)`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setActiveHotspotId(isOpen ? null : spot.id)}
                    className="group relative flex items-center justify-center cursor-pointer focus:outline-none"
                    title={spot.title}
                  >
                    <span className="absolute w-9 h-9 rounded-full bg-amber-400/35 animate-ping" />
                    <span className="relative w-7 h-7 rounded-full bg-slate-950/70 backdrop-blur-md border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.65)] group-hover:scale-125 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
                      <Crosshair className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.92 }}
                        className="absolute bottom-9 left-1/2 -translate-x-1/2 w-64 p-3 rounded-2xl bg-slate-950/75 backdrop-blur-2xl border border-amber-300/60 shadow-2xl text-left z-30"
                      >
                        <div className="flex items-center justify-between gap-2 pb-1.5 mb-1 border-b border-white/15">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                            3D Architectural Spec
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveHotspotId(null)}
                            className="text-[10px] text-slate-300 hover:text-white cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                        <div className="text-xs font-extrabold text-white">{spot.title}</div>
                        <p className="text-[11px] text-slate-200 mt-1 leading-relaxed">
                          {spot.spec}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Luminous Crystal Scrims (Keeps images ultra-clear while anchoring white text) */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isCinemaTheaterMode
              ? 'bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/15'
              : 'bg-gradient-to-r from-slate-950/60 via-slate-950/20 to-transparent'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/20 pointer-events-none" />

        {/* Subtle Crystal Specular Highlight */}
        <div className="absolute -top-28 right-1/4 w-[38rem] h-[38rem] rounded-full bg-cyan-300/10 blur-[140px] pointer-events-none mix-blend-screen" />
      </div>

      {/* =====================================================================
          2. UNIFIED CRYSTAL TOP CONTROL BAR
             (Combines Category Tabs, 3D Showroom Tour Toggle, Video Reel Toggle,
              and Director's Tour Deck Toggle in a sleek translucent crystal bar)
         ===================================================================== */}
      <div className="relative z-30 border-b border-white/25 bg-gradient-to-r from-slate-900/35 via-white/[0.08] to-slate-900/35 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_32px_rgba(0,0,0,0.25)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Left: Main Menu-Aligned Category Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {tourCategories.map(cat => {
              const isSelected = tourCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setTourCategory(cat.id);
                    onSelectCategoryFilter(cat.filterCategory);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer border backdrop-blur-xl ${
                    isSelected
                      ? 'bg-amber-400/95 text-slate-950 border-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.5),inset_0_1px_1px_rgba(255,255,255,0.8)]'
                      : 'bg-white/[0.08] text-white border-white/25 hover:bg-white/[0.18] hover:border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
                  }`}
                >
                  {cat.icon}
                  <span className="hidden xl:inline">{cat.label}</span>
                  <span className="xl:hidden">{cat.shortLabel}</span>
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                      isSelected ? 'bg-slate-950 text-amber-300' : 'bg-white/20 text-white'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Unified Crystal Toggles for 3D Showroom Tour, Video Reel & Director's Tour Deck */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            
            {/* Crystal Toggle 1: 3D Showroom Tour Bar */}
            <button
              type="button"
              onClick={() => setShowShowroomTourBar(prev => !prev)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border backdrop-blur-2xl transition-all cursor-pointer ${
                showShowroomTourBar
                  ? 'bg-cyan-400/20 text-cyan-100 border-cyan-300/60 shadow-[0_0_16px_rgba(34,211,238,0.28),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                  : 'bg-white/[0.06] text-slate-300 border-white/20 hover:bg-white/[0.14] hover:text-white'
              }`}
              title="Toggle 3D Showroom Tour & Video Reel Dock"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">3D Showroom Tour</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  showShowroomTourBar ? 'bg-cyan-300 shadow-[0_0_8px_#67e8f9]' : 'bg-slate-500'
                }`}
              />
            </button>

            {/* Crystal Toggle 2: Video Reel Mode (Integrated cleanly alongside the top bars) */}
            <button
              type="button"
              onClick={() => setIsVideoTourActive(prev => !prev)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border backdrop-blur-2xl transition-all cursor-pointer ${
                isVideoTourActive
                  ? 'bg-amber-400/90 text-slate-950 border-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.45)]'
                  : 'bg-white/[0.08] text-amber-200 border-white/25 hover:bg-white/[0.16] hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]'
              }`}
              title="Toggle 4K Video Reel Mode"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isVideoTourActive ? 'Video Reel: ON' : 'Video Reel'}</span>
            </button>

            {isVideoTourActive && (
              <button
                type="button"
                onClick={() => setIsMuted(prev => !prev)}
                className="p-1.5 rounded-full bg-white/[0.12] hover:bg-white/[0.22] border border-white/25 text-white backdrop-blur-xl transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                )}
              </button>
            )}

            {/* Crystal Toggle 3: Director's Tour Deck */}
            <button
              type="button"
              onClick={() => setShowDirectorDeck(prev => !prev)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border backdrop-blur-2xl transition-all cursor-pointer ${
                showDirectorDeck
                  ? 'bg-emerald-400/20 text-emerald-100 border-emerald-300/60 shadow-[0_0_16px_rgba(52,211,153,0.28),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                  : 'bg-white/[0.06] text-slate-300 border-white/20 hover:bg-white/[0.14] hover:text-white'
              }`}
              title="Toggle Director's Tour Deck"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden md:inline">Director&apos;s Tour Deck</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  showDirectorDeck ? 'bg-emerald-300 shadow-[0_0_8px_#6ee7b7]' : 'bg-slate-500'
                }`}
              />
            </button>

            {/* HUD View Options Popover Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsHudMenuOpen(prev => !prev)}
                className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-2xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isHudMenuOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-200'
                    : 'bg-white/[0.08] border-white/25 text-white hover:bg-white/[0.18]'
                }`}
                title="Customize Crystal Bars & 3D Optics"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Bars &amp; Optics</span>
              </button>

              <AnimatePresence>
                {isHudMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-950/80 backdrop-blur-2xl border border-white/30 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.3)] z-50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/15">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                        Crystal Bar &amp; 3D Showroom Controls
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsHudMenuOpen(false)}
                        className="text-[10px] text-slate-300 hover:text-white cursor-pointer"
                      >
                        Done
                      </button>
                    </div>

                    {/* Optical Grade Selector */}
                    <div className="py-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Crystal Optical Grade
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(
                          [
                            { id: 'crystal_daylight', label: 'Crystal' },
                            { id: 'solar_vivid', label: 'Solar Vivid' },
                            { id: 'showroom_hdr', label: 'HDR Studio' }
                          ] as { id: AtmosphereGrade; label: string }[]
                        ).map(grade => (
                          <button
                            key={grade.id}
                            type="button"
                            onClick={() => setAtmosphere(grade.id)}
                            className={`px-2 py-1.5 rounded-xl text-[10px] font-bold text-center border transition-all cursor-pointer ${
                              atmosphere === grade.id
                                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                                : 'bg-white/10 text-slate-200 border-white/15 hover:bg-white/20'
                            }`}
                          >
                            {grade.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/15 pt-1.5 space-y-1">
                      <ToggleSwitch
                        label="3D Showroom Tour & Video Bar"
                        description="Crystal camera angle & video reel dock"
                        checked={showShowroomTourBar}
                        onChange={() => setShowShowroomTourBar(prev => !prev)}
                      />

                      <ToggleSwitch
                        label="Director's Tour Deck"
                        description="Interactive right-hand thumbnail monitor"
                        checked={showDirectorDeck}
                        onChange={() => setShowDirectorDeck(prev => !prev)}
                      />

                      <ToggleSwitch
                        label="Consortium Business Ribbon"
                        description="Properties, Plazas, Capsules & UPVC bar"
                        checked={showConsortiumRibbon}
                        onChange={() => setShowConsortiumRibbon(prev => !prev)}
                      />

                      <ToggleSwitch
                        label="4K Video Reel Mode"
                        description="Play live architectural video walkthrough"
                        checked={isVideoTourActive}
                        onChange={() => setIsVideoTourActive(prev => !prev)}
                      />

                      <ToggleSwitch
                        label="3D Spatial Hotspots"
                        description="Interactive specification pins on stage"
                        checked={showSpatialHotspots}
                        onChange={() => setShowSpatialHotspots(prev => !prev)}
                      />

                      <ToggleSwitch
                        label="3D Parallax Camera Rig"
                        description="6-DOF spatial mouse tilt perspective"
                        checked={is3DShowroomRig}
                        onChange={() => setIs3DShowroomRig(prev => !prev)}
                      />

                      <ToggleSwitch
                        label="Ultra-Crisp Optical Boost"
                        description="High-luminance daylight sharpening"
                        checked={isUltraSharp}
                        onChange={() => setIsUltraSharp(prev => !prev)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clean Theater View Button */}
            <button
              type="button"
              onClick={() => setIsCinemaTheaterMode(prev => !prev)}
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-2xl transition-all flex items-center gap-1.5 cursor-pointer ${
                isCinemaTheaterMode
                  ? 'bg-cyan-400 text-slate-950 border-cyan-200 shadow-lg'
                  : 'bg-white/[0.08] border-white/25 text-white hover:bg-white/[0.18]'
              }`}
              title="Hide overlays for an unobstructed crystal view"
            >
              {isCinemaTheaterMode ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">
                {isCinemaTheaterMode ? 'Exit Clean' : 'Clean View'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. UNIFIED CRYSTAL "3D SHOWROOM TOUR & VIDEO REEL" BAR
             (Translucent crystal look, non-cluttered, collapsible via toggle)
         ===================================================================== */}
      <AnimatePresence>
        {showShowroomTourBar && !isCinemaTheaterMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="relative z-20 border-b border-white/20 bg-white/[0.06] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
              
              {/* Left Label + Integrated Video Reel & Waypoint Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-400/15 border border-cyan-300/40 text-cyan-200 text-[10px] font-black uppercase tracking-wider shrink-0">
                  <Orbit className="w-3 h-3 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>3D Showroom Tour</span>
                </div>

                {/* Integrated Video Reel Pill inside the 3D Showroom Bar */}
                <button
                  type="button"
                  onClick={() => setIsVideoTourActive(prev => !prev)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                    isVideoTourActive
                      ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-sm'
                      : 'bg-white/[0.08] hover:bg-white/[0.16] text-amber-200 border-white/20'
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>{isVideoTourActive ? 'Cinema Reel Active' : 'Play Video Reel'}</span>
                </button>

                <div className="h-4 w-[1px] bg-white/25 mx-0.5 shrink-0" />

                {/* Waypoint Camera Pills */}
                {cameraWaypoints.map((wp, idx) => {
                  const isSelected = !isVideoTourActive && waypointIdx === idx;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => {
                        setIsVideoTourActive(false);
                        setActiveHotspotId(null);
                        setWaypointIdx(idx);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-left transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border backdrop-blur-md ${
                        isSelected
                          ? 'bg-white/95 text-slate-950 border-white font-extrabold shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                          : 'bg-white/[0.07] text-white/90 border-white/15 hover:bg-white/[0.16] hover:border-white/30'
                      }`}
                    >
                      <Camera
                        className={`w-3 h-3 ${
                          isSelected ? 'text-amber-600' : 'text-amber-300'
                        }`}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}. {wp.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right: Optical Telemetry & Collapse Bar Toggle */}
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-xl px-3 py-1 rounded-xl border border-white/20">
                  <Disc
                    className="w-3 h-3 text-emerald-300 animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200">
                    {activeWaypoint.focalLength} • {activeWaypoint.fov}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPaused(prev => !prev)}
                    className="ml-1 p-1 rounded-lg bg-white/15 hover:bg-amber-400 hover:text-slate-950 text-white transition-all cursor-pointer"
                    title={isPaused ? 'Resume Auto-Pilot Tour' : 'Hold Camera Frame'}
                  >
                    {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowShowroomTourBar(false)}
                  className="p-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] border border-white/20 text-slate-200 hover:text-white transition-all cursor-pointer"
                  title="Minimize 3D Showroom Tour Bar"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          4. MAIN FOREGROUND STAGE & UNIVERSAL DIRECTOR'S TOUR DECK
         ===================================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10 min-h-[540px] sm:min-h-[620px] flex flex-col justify-between">
        
        {/* RI8CLICK GROUP OF COMPANIES CONSORTIUM BUSINESS PILLARS RIBBON */}
        <AnimatePresence>
          {showConsortiumRibbon && !isCinemaTheaterMode && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4"
            >
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_12px_32px_rgba(0,0,0,0.25)]">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                      ri8click Group of Companies Consortium
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-white/95">
                      Integrated Real Estate, Turnkey Construction, Container Capsule Homes &amp; German UPVC Manufacturing
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConsortiumRibbon(false)}
                    className="text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Hide Pillars</span>
                    <ChevronUp className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {consortiumPillars.map(pillar => {
                    const Icon = pillar.icon;
                    const isActivePillar = tourCategory === pillar.id;
                    return (
                      <button
                        key={pillar.id}
                        type="button"
                        onClick={() => {
                          setTourCategory(pillar.id);
                          onSelectCategoryFilter(pillar.category);
                        }}
                        className={`group p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 backdrop-blur-xl ${
                          isActivePillar
                            ? 'bg-white/20 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.25)]'
                            : 'bg-white/[0.06] border-white/20 hover:bg-white/[0.14] hover:border-white/35'
                        }`}
                      >
                        <div className={`p-2 rounded-lg border shrink-0 ${pillar.accent}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-white group-hover:text-amber-300 transition-colors truncate flex items-center gap-1">
                            <span>{pillar.title}</span>
                          </div>
                          <div className="text-[10.5px] text-slate-200/90 leading-snug line-clamp-1 mt-0.5">
                            {pillar.detail}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Restore Pill when top bars are minimized */}
        {(!showConsortiumRibbon || !showShowroomTourBar || !showDirectorDeck) && !isCinemaTheaterMode && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {!showConsortiumRibbon && (
              <button
                type="button"
                onClick={() => setShowConsortiumRibbon(true)}
                className="px-3 py-1 rounded-full bg-white/[0.10] hover:bg-white/[0.20] backdrop-blur-xl border border-white/25 text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer"
              >
                <ChevronDown className="w-3 h-3 text-amber-300" />
                <span>Show Consortium Pillars</span>
              </button>
            )}
            {!showShowroomTourBar && (
              <button
                type="button"
                onClick={() => setShowShowroomTourBar(true)}
                className="px-3 py-1 rounded-full bg-white/[0.10] hover:bg-white/[0.20] backdrop-blur-xl border border-white/25 text-[10px] font-bold text-cyan-200 flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3 h-3 text-cyan-300" />
                <span>Show 3D Showroom Tour &amp; Video Reel Bar</span>
              </button>
            )}
            {!showDirectorDeck && (
              <button
                type="button"
                onClick={() => setShowDirectorDeck(true)}
                className="px-3 py-1 rounded-full bg-white/[0.10] hover:bg-white/[0.20] backdrop-blur-xl border border-white/25 text-[10px] font-bold text-emerald-200 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <span>Show Director&apos;s Tour Deck</span>
              </button>
            )}
          </div>
        )}

        {/* Center Main Content & Universal Crystal Director's Tour Deck */}
        <AnimatePresence mode="wait">
          {!isCinemaTheaterMode ? (
            <motion.div
              key="foreground-content"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-3"
            >
              {/* Left Column: Architectural Narrative & Interactive Actions */}
              <div className={showDirectorDeck ? 'lg:col-span-7' : 'lg:col-span-11'}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWaypoint.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3.5"
                  >
                    {/* Division & Location Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-amber-400 text-slate-950 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>{activeWaypoint.divisionTag}</span>
                      </span>

                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/[0.12] backdrop-blur-xl text-white border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                        <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span>{activeWaypoint.locationBadge}</span>
                      </div>

                      <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-100 border border-emerald-300/40 backdrop-blur-xl">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Watermark Verified</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-black tracking-tight text-white leading-[1.08] font-serif drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
                      {activeWaypoint.headline}
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] font-medium">
                      {activeWaypoint.description}
                    </p>

                    {/* Quick Consortium Feature Chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      {[
                        'Plots & Constructed Villas',
                        'High-Rise Commercial Plazas, Shops & Flats',
                        'Container Capsule Smart Homes',
                        'UPVC Doors, Windows, Partitions & Panels'
                      ].map((chip, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.09] backdrop-blur-md border border-white/20 text-[11px] font-semibold text-slate-100"
                        >
                          <CheckCircle2 className="w-3 h-3 text-amber-300 shrink-0" />
                          <span>{chip}</span>
                        </span>
                      ))}
                    </div>

                    {/* Valuation Pill & Optional 4-Card Telemetry Strip */}
                    {!showTelemetryStrip ? (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/[0.12] backdrop-blur-2xl border border-amber-300/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_10px_25px_rgba(0,0,0,0.3)]">
                          <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                            Valuation / Spec
                          </span>
                          <span className="text-base sm:text-lg font-black text-white font-mono">
                            {activeWaypoint.valuation}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowTelemetryStrip(true)}
                          className="px-3.5 py-2 rounded-2xl bg-white/[0.12] hover:bg-white/[0.22] backdrop-blur-xl border border-white/25 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Gauge className="w-3.5 h-3.5 text-amber-300" />
                          <span>Telemetry Specs</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-3xl">
                        <div className="p-3 rounded-2xl bg-white/[0.12] backdrop-blur-2xl border border-amber-300/50">
                          <span className="block text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                            Valuation
                          </span>
                          <span className="text-sm sm:text-base font-black text-white font-mono">
                            {activeWaypoint.valuation}
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-white/[0.12] backdrop-blur-2xl border border-white/25">
                          <span className="block text-[10px] uppercase tracking-widest text-slate-200 font-bold">
                            Camera Rig
                          </span>
                          <span className="text-xs font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                            <Orbit className="w-3.5 h-3.5 text-cyan-300" />
                            <span>{activeWaypoint.focalLength}</span>
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-white/[0.12] backdrop-blur-2xl border border-white/25">
                          <span className="block text-[10px] uppercase tracking-widest text-slate-200 font-bold">
                            Elevation
                          </span>
                          <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5 mt-0.5">
                            <Zap className="w-3.5 h-3.5" />
                            <span>{activeWaypoint.altitude}</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowTelemetryStrip(false)}
                          className="p-3 rounded-2xl bg-white/[0.12] hover:bg-white/[0.22] backdrop-blur-2xl border border-white/25 text-left cursor-pointer"
                        >
                          <span className="block text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                            Display
                          </span>
                          <span className="text-xs font-bold text-white underline mt-0.5 block">
                            Compact View
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Primary Call-To-Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          onOpen3DTour({
                            id: activeWaypoint.id,
                            title: activeWaypoint.headline,
                            category: activeWaypoint.propertyCategory,
                            priceFormatted: activeWaypoint.valuation,
                            location: {
                              city: 'Taxila / Islamabad',
                              society: activeWaypoint.locationBadge,
                              province: 'Punjab'
                            },
                            images: [resolvedImageUrl],
                            virtualTourVideoUrl: activeWaypoint.videoUrl,
                            virtualTourVideoTitle: `${activeWaypoint.headline} - 3D Showroom Tour`
                          })
                        }
                        className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_10px_30px_rgba(251,191,36,0.45)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                      >
                        <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '7s' }} />
                        <span>Launch 360° Virtual Walkthrough</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={onExploreClick}
                        className="px-5 py-3 rounded-2xl bg-white/[0.12] hover:bg-white hover:text-slate-950 text-white border border-white/35 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-amber-300" />
                        <span>Explore Listings</span>
                      </button>

                      <button
                        type="button"
                        onClick={onContactAgentClick}
                        className="px-4 py-3 rounded-2xl bg-emerald-500/25 hover:bg-emerald-400 hover:text-slate-950 text-emerald-100 border border-emerald-300/45 font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-2xl transition-all cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Consortium Inquiry</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column: CRYSTAL TRANSLUCENT DIRECTOR'S TOUR DECK */}
              {showDirectorDeck && (
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  className="lg:col-span-5 bg-gradient-to-br from-white/[0.14] via-slate-900/45 to-slate-950/55 backdrop-blur-2xl rounded-3xl border border-white/30 p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.4)] space-y-3.5"
                >
                  {/* Crystal Deck Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_#fbbf24]" />
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-white">
                          Director&apos;s Tour Deck
                        </div>
                        <div className="text-[10px] text-amber-200 font-semibold">
                          Properties • Plazas • Capsule Pods • UPVC
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsVideoTourActive(prev => !prev)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all border ${
                          isVideoTourActive
                            ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-sm'
                            : 'bg-white/[0.12] text-white border-white/25 hover:bg-white/[0.22]'
                        }`}
                      >
                        {isVideoTourActive ? '2D/3D Stills' : 'Video Reel'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDirectorDeck(false)}
                        className="px-2.5 py-1 rounded-xl bg-white/[0.10] hover:bg-white/[0.20] border border-white/20 text-[10px] font-bold text-slate-200 hover:text-white cursor-pointer"
                        title="Minimize Director's Tour Deck"
                      >
                        Hide
                      </button>
                    </div>
                  </div>

                  {/* Category Tabs inside Director's Tour Deck (All 5 Menu-Aligned Scopes) */}
                  <div className="grid grid-cols-5 gap-1 bg-slate-950/35 backdrop-blur-xl p-1 rounded-2xl border border-white/20">
                    {(
                      [
                        { id: 'all_showroom', label: 'All' },
                        { id: 'properties_plots_villas', label: 'Plots/Villas' },
                        { id: 'commercial_plazas', label: 'Plazas' },
                        { id: 'capsule_containers', label: 'Capsules' },
                        { id: 'upvc_construction', label: 'UPVC' }
                      ] as { id: TourDeckCategory; label: string }[]
                    ).map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTourCategory(tab.id)}
                        className={`py-1.5 px-1.5 rounded-xl text-[9.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer truncate ${
                          tourCategory === tab.id
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'text-slate-200 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Interactive Thumbnail Matrix for Active Category */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[235px] overflow-y-auto pr-1 scrollbar-thin">
                    {cameraWaypoints.map((wp, idx) => {
                      const active = waypointIdx === idx;
                      const thumbSrc = failedUrls[wp.imageUrl] ? wp.fallbackUrl : wp.imageUrl;
                      return (
                        <button
                          key={wp.id}
                          type="button"
                          onClick={() => {
                            setIsVideoTourActive(false);
                            setActiveHotspotId(null);
                            setWaypointIdx(idx);
                          }}
                          className={`group relative rounded-xl overflow-hidden border text-left transition-all cursor-pointer h-20 ${
                            active
                              ? 'border-amber-300 ring-2 ring-amber-400/60 scale-[1.02] shadow-lg'
                              : 'border-white/25 opacity-85 hover:opacity-100 hover:border-white/50'
                          }`}
                        >
                          <img
                            src={thumbSrc}
                            alt={wp.label}
                            loading="lazy"
                            onError={() => {
                              if (!failedUrls[wp.imageUrl]) {
                                setFailedUrls(prev => ({ ...prev, [wp.imageUrl]: true }));
                              }
                            }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 brightness-110 contrast-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
                          <div className="absolute top-1 left-1.5 px-1.5 py-0.2 rounded bg-slate-950/65 backdrop-blur-md text-[8px] font-mono font-bold text-amber-300 border border-white/15">
                            0{idx + 1}
                          </div>
                          <div className="absolute bottom-1 left-1.5 right-1.5">
                            <div className="text-[10px] font-extrabold text-white truncate leading-tight">
                              {wp.label}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Deck Footer Telemetry & Hotspot Quick-Trigger */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-100">
                      <Crosshair className="w-3.5 h-3.5 text-amber-300" />
                      <span>
                        {activeWaypoint.hotspots.length} Spatial Hotspots Active
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const firstSpot = activeWaypoint.hotspots[0];
                        if (firstSpot) {
                          setActiveHotspotId(prev => (prev ? null : firstSpot.id));
                        }
                      }}
                      className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
                    >
                      {activeHotspotId ? 'Hide Spec Pin' : 'Inspect Spec Pin'}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Clean View Minimal Crystal Floating Pill */
            <motion.div
              key="clean-view-hud"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="my-auto flex items-end justify-between"
            >
              <div className="p-4 rounded-2xl bg-white/[0.12] backdrop-blur-2xl border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] max-w-md">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block">
                  {activeWaypoint.code}
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">{activeWaypoint.headline}</h2>
                <p className="text-xs text-slate-100 mt-1">{activeWaypoint.subLabel}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================================
            5. BOTTOM CRYSTAL TIMELINE & CAMERA SCRUBBER
           ===================================================================== */}
        <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Waypoint Progress Scrubber Bars */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
            {cameraWaypoints.map((wp, idx) => {
              const isCurrent = waypointIdx === idx;
              return (
                <button
                  key={wp.id}
                  type="button"
                  onClick={() => {
                    setIsVideoTourActive(false);
                    setActiveHotspotId(null);
                    setWaypointIdx(idx);
                  }}
                  className="group flex flex-col gap-1 text-left cursor-pointer shrink-0"
                  title={`${wp.label} — ${wp.subLabel}`}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] font-mono font-bold transition-colors ${
                        isCurrent ? 'text-amber-300' : 'text-white/60 group-hover:text-white/90'
                      }`}
                    >
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold truncate max-w-[95px] transition-colors ${
                        isCurrent ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                      }`}
                    >
                      {wp.label}
                    </span>
                  </div>
                  <div className="w-16 sm:w-20 h-1 rounded-full bg-white/25 overflow-hidden">
                    {isCurrent ? (
                      <motion.div
                        key={`progress-${wp.id}-${isPaused}`}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{
                          duration: isPaused ? 0.2 : WAYPOINT_DURATION_MS / 1000,
                          ease: 'linear'
                        }}
                        className="h-full bg-amber-400"
                      />
                    ) : (
                      <div className="h-full w-0 group-hover:w-full bg-white/60 transition-all duration-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Previous / Pause / Next Crystal Rig Controls */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/[0.10] hover:bg-amber-400 hover:text-slate-950 text-white border border-white/25 backdrop-blur-xl transition-all cursor-pointer"
              title="Previous Camera Waypoint"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused(prev => !prev)}
              className="px-3.5 py-2 rounded-full bg-white/[0.10] hover:bg-white/[0.22] text-white border border-white/25 backdrop-blur-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-300" />
                  <span>Resume Tour</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-300" />
                  <span>Hold Frame</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/[0.10] hover:bg-amber-400 hover:text-slate-950 text-white border border-white/25 backdrop-blur-xl transition-all cursor-pointer"
              title="Next Camera Waypoint"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
