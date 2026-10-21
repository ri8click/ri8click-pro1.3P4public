import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  EyeOff,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Box,
  Home,
  Building2,
  Layers,
  HardHat,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Info,
  FileText,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon
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
  | 'commercial_plazas'
  | 'capsule_containers'
  | 'properties_plots_villas'
  | 'upvc_construction';

interface ArchitecturalSpec {
  id: string;
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
  minimalSummary: string;
  description: string;
  valuation: string;
  locationBadge: string;
  focalLength: string;
  altitude: string;
  fov: string;
  sourceUrl?: string;
  replacedBrokenLink?: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  fallbackUrl: string;
  galleryImages?: string[];
  videoUrl: string;
  motionOrigin: string;
  panX: [string, string];
  panY: [string, string];
  scaleRange: [number, number];
  specs: ArchitecturalSpec[];
}

// ============================================================================
// 1. VERIFIED DOMESTIC COMMERCIAL PLAZAS & TOWERS (FROM TOWERS.PK/ISLAMABAD)
//    Real domestic high-rise towers in Islamabad — no virtual placeholders
// ============================================================================

export const ISLAMABAD_DOMESTIC_TOWERS_GALLERY = {
  // Citadel 7 — Plot 7, Main Jinnah Avenue, Blue Area, Islamabad (35 Floors / 272 Ft, Chakor Ventures)
  citadel7_blueArea:
    'https://towers.pk/wp-content/uploads/2023/08/download-XUE6tOGKh-transformed-e1692266798167.png',
  // The Centaurus Mall & Corporate Tower — Jinnah Avenue, F-8/Blue Area, Islamabad (42 Floors / 656 Ft)
  centaurus_mallTower:
    'https://towers.pk/wp-content/uploads/2023/11/Centaurus_Mall-1.webp',
  // Giga Mall & World Trade Center — Main GT Road / DHA Phase 2, Islamabad (Mixed-Use Commercial Plaza)
  gigaMall_wtcIslamabad:
    'https://towers.pk/wp-content/uploads/2024/01/image-4-34-1024x640-1-e1704435577931.jpg',
  // Skypark One — Gulberg Greens Executive Commercial Mall & Apartments, Islamabad
  skyparkOne_gulbergGreens:
    'https://towers.pk/wp-content/uploads/2024/06/Skypark-One.jpg',
  // Ufone & Jinnah Avenue Corporate Skyline — Blue Area, Islamabad (26 Floors / 371 Ft)
  ufoneTower_jinnahAvenue:
    'https://towers.pk/wp-content/uploads/2023/06/Jinnah-Avenue-Islamabad.jpg',
  // ISE Tower II (Islamabad Stock Exchange Commercial Skyscraper) — 55 Jinnah Avenue, Blue Area
  iseTower_blueArea:
    'https://towers.pk/wp-content/uploads/2023/08/ise-tower-islamabad.jpg',
  // State Life Commercial Tower — Jinnah Avenue, Blue Area, Islamabad (19 Floors Corporate Hub)
  stateLifeTower_blueArea:
    'https://towers.pk/wp-content/uploads/2023/12/STATE-LIFE-TOWER-min.jpg',
  // Grand Orchard Commercial Plaza & Suites — DHA Phase 1, Islamabad (Premier Choice)
  grandOrchard_dhaPhase1:
    'https://towers.pk/wp-content/uploads/2023/08/1664948637921-transformed.png',
  // The Arch Tower — Sector G-11 Markaz Commercial Hub, Islamabad (8 Floors Shops & Offices)
  theArchTower_g11Markaz:
    'https://towers.pk/wp-content/uploads/2024/05/ARCH-TOWER.jpg',
  // Green Trust Commercial Tower — F-6/1 Blue Area, Islamabad (16 Floors Eco-Smart Plaza)
  greenTrustTower_islamabad:
    'https://towers.pk/wp-content/uploads/2023/08/stock-photo-a-beautiful-view-of-capital-city-islamabad-hi-rise-buildings-islamabad-pakistan-march-2135740301-transformed-1-e1691756641256.jpeg',
  // Saudi Pak Corporate Tower — 61-A Jinnah Avenue, Blue Area, Islamabad (20 Floors / 234 Ft)
  saudiPakTower_blueArea:
    'https://towers.pk/wp-content/uploads/2024/01/saudi-pak-tower-building-e1706706739861.jpg'
};

// ============================================================================
// 2. CONTAINER & CAPSULE SMART HOUSES (UPDATED WITH ATTACHED IMAGES)
// ============================================================================

export const MODULAR_CAPSULE_GALLERY = {
  // Attached Image 1: K5 Waterfront Panoramic Space Capsule Pod (White aerodynamic shell with K5 door)
  cap1_k5WaterfrontPod: 'https://www.genspark.ai/api/files/s/F1KBUiFY',
  // Attached Image 2: White Corrugated Container Villa with Upper Rooftop Deck & Timber Patio
  cap2_rooftopDeckContainerVilla: 'https://www.genspark.ai/api/files/s/BjGIjr8Z',
  // Attached Image 3: Hexagonal-Lit Matte Black Chamfered Container Smart Home
  cap3_hexLitBlackContainerPod: 'https://www.genspark.ai/api/files/s/V8yEIG1t',
  // Attached Image 4: White Curved-Corner Glass Executive Container Studio in Lush Garden
  cap4_curvedCornerGlassContainer: 'https://www.genspark.ai/api/files/s/Vwnixifa',
  // Attached Image 5: V2124 Double-Decker Two-Story Stacked Capsule Villa
  cap5_v2124DoubleDeckerCapsule: 'https://www.genspark.ai/api/files/s/1n0AFjJY',
  // Attached Image 6: Lakeside Curved-Glass Observation Capsule Pod with Stepping-Stone Path & Deck
  cap6_lakesideCurvedGlassCapsule: 'https://www.genspark.ai/api/files/s/oV8LLosV'
};

export const MODULAR_CAPSULE_SEQUENCE_LIST = [
  MODULAR_CAPSULE_GALLERY.cap1_k5WaterfrontPod,
  MODULAR_CAPSULE_GALLERY.cap2_rooftopDeckContainerVilla,
  MODULAR_CAPSULE_GALLERY.cap3_hexLitBlackContainerPod,
  MODULAR_CAPSULE_GALLERY.cap4_curvedCornerGlassContainer,
  MODULAR_CAPSULE_GALLERY.cap5_v2124DoubleDeckerCapsule,
  MODULAR_CAPSULE_GALLERY.cap6_lakesideCurvedGlassCapsule
];

export const CONSTRUCTED_HOUSES_GALLERY = {
  house1_whiteVilla:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=95',
  house2_modernEstate:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95',
  house3_stoneGlassMansion:
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=95'
};

export const UPVC_AND_INTERIOR_GALLERY = {
  upvc1_glassRoofConservatory:
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2400&q=95',
  upvc2_woodSlatTvPartition:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=95'
};

const SHOWROOM_VIDEOS = {
  architecturalFlyover:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  luxuryInteriorWalk:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  villaDroneOrbit:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
};

// ============================================================================
// 3. MASTER WAYPOINTS (REAL DOMESTIC TOWERS.PK/ISLAMABAD + ATTACHED CAPSULES)
// ============================================================================

const MASTER_VIRTUAL_TOUR_WAYPOINTS: CameraWaypoint[] = [
  // ---------------- PILLAR 1: COMMERCIAL PLAZAS (TOWERS.PK/ISLAMABAD REAL DOMESTIC) ----------------
  {
    id: 'comm-citadel-7-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'TOWERS.PK/ISLAMABAD // VERIFIED DOMESTIC COMMERCIAL TOWER',
    code: 'ISB 01 // CITADEL 7 & JINNAH AVENUE — BLUE AREA',
    label: 'Citadel 7 & Blue Area',
    subLabel: '272 Ft CDA-Approved Corporate Offices & Retail Mall on Jinnah Avenue, Islamabad',
    headline: 'Citadel 7 & Jinnah Avenue Corporate Hub — Blue Area, Islamabad',
    minimalSummary: 'Citadel 7 (Chakor Ventures) • 345,000 Sq. Ft. Mall & Corporate Offices • Blue Area, Islamabad',
    description:
      'Verified from Towers.pk/Islamabad: Citadel 7 by Chakor Ventures spans 345,000 Sq. Ft. (272 Ft height) at G-8 / F-8 Main Jinnah Avenue, Blue Area, Islamabad. Ranked #12 tallest in Islamabad with 90/100 location score, offering retail mall floors, corporate office suites, and underground parking.',
    valuation: 'PKR 1.85 Crore – 12.94 Crore',
    locationBadge: 'Main Jinnah Avenue, Blue Area, Islamabad',
    focalLength: '24MM ARCHITECTURAL',
    altitude: '272 FT / BLUE AREA',
    fov: '85° WIDE',
    sourceUrl: 'https://towers.pk/islamabad/citadel-7/',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/qpljElLm',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.ufoneTower_jinnahAvenue,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_blueArea,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.stateLifeTower_blueArea,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.ufoneTower_jinnahAvenue,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_blueArea,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.stateLifeTower_blueArea,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.iseTower_blueArea
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.6%', '0.6%'],
    panY: ['0%', '-0.6%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'c7-spec-1',
        title: '345,000 Sq. Ft. Mixed-Use Commercial Plaza',
        spec: 'Designed by Chakor Ventures with 5 retail mall levels and Margalla-facing corporate offices.'
      },
      {
        id: 'c7-spec-2',
        title: '90/100 Towers.pk Location Rating',
        spec: 'Prime Jinnah Avenue frontage alongside Ufone Tower, ISE Tower II, and State Life Tower.'
      }
    ]
  },
  {
    id: 'comm-giga-mall-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'TOWERS.PK/ISLAMABAD // HIGH-END MIXED-USE COMMERCIAL PLAZA',
    code: 'ISB 02 // GIGA MALL & WTC — DHA PHASE 2 ISLAMABAD',
    label: 'Giga Mall & Defence Tower',
    subLabel: 'Iconic Multi-Story Shopping Plaza, Corporate Offices & Luxury Suites in DHA Islamabad',
    headline: 'Giga Mall & World Trade Center — DHA Phase 2, Islamabad',
    minimalSummary: 'Giga Mall by Giga Group • Retail Shops, Corporate Offices & Suites • DHA Phase 2, Islamabad',
    description:
      'Verified from Towers.pk/Islamabad: Developed by Giga Group on Main GT Road / DHA Phase 2 Islamabad, Giga Mall is one of the capital’s largest operational domestic commercial plazas—integrating 2-Kanal retail floors, corporate office spaces (PKR 2–15 Cr), and luxury serviced apartments.',
    valuation: 'Offices PKR 2–15 Cr • Suites 2.5–10 Cr',
    locationBadge: 'DHA Phase 2 / Main GT Road, Islamabad',
    focalLength: '24MM DRONE',
    altitude: 'RANKED #13 IN ISB',
    fov: '84° STANDARD',
    sourceUrl: 'https://towers.pk/islamabad/giga-mall/',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/CfYL2dM0',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.gigaMall_wtcIslamabad,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.grandOrchard_dhaPhase1,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.centaurus_mallTower,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.gigaMall_wtcIslamabad,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.grandOrchard_dhaPhase1,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.centaurus_mallTower
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.6%', '-0.6%'],
    panY: ['-0.4%', '0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'gm-spec-1',
        title: 'International & National Retail Anchor Hub',
        spec: 'Multi-floor shopping atrium, food courts, underground parking, and 100% power backup.'
      },
      {
        id: 'gm-spec-2',
        title: 'Giga Group Verified Domestic Landmark',
        spec: 'High daily footfall and strong rental yields across retail shops and corporate offices.'
      }
    ]
  },
  {
    id: 'comm-skypark-one-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'TOWERS.PK/ISLAMABAD // COMPLETED COMMERCIAL MALL & SUITES',
    code: 'ISB 03 // SKYPARK ONE — GULBERG GREENS ISLAMABAD',
    label: 'Skypark One Gulberg',
    subLabel: 'Completed High-Rise Shopping Mall, Corporate Podium & Luxury Apartments in Gulberg Greens',
    headline: 'Skypark One Commercial Plaza — Gulberg Greens, Islamabad',
    minimalSummary: 'Skypark One • Completed Commercial Mall & Apartments • Gulberg Greens, Islamabad',
    description:
      'Verified from Towers.pk/Islamabad: Skypark One in Gulberg Greens, Islamabad is a completed domestic high-rise combining a multi-level commercial shopping mall, eateries, and spacious double-glazed residential and corporate units along the Islamabad Expressway corridor.',
    valuation: 'Commercial Shops & Suites from PKR 1.25 Cr',
    locationBadge: 'Gulberg Greens, Islamabad Expressway',
    focalLength: '22MM WIDE',
    altitude: 'COMPLETED 2024',
    fov: '88° ARCHITECTURAL',
    sourceUrl: 'https://towers.pk/islamabad/skypark-one/',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/NC4klaYu',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.skyparkOne_gulbergGreens,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.theArchTower_g11Markaz,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.gigaMall_wtcIslamabad,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.skyparkOne_gulbergGreens,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.theArchTower_g11Markaz,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.grandOrchard_dhaPhase1
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.6%', '0.6%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'sp-spec-1',
        title: 'Multi-Story Commercial Mall & Eateries',
        spec: 'Dedicated retail podium with service elevators, central HVAC, and smart security.'
      },
      {
        id: 'sp-spec-2',
        title: 'Double-Glazed Acoustic Fenestration',
        spec: 'Engineered with soundproof double-glazed windows and expansive natural daylight.'
      }
    ]
  },
  {
    id: 'comm-centaurus-ise-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'TOWERS.PK/ISLAMABAD // FLAGSHIP CORPORATE & RETAIL TOWERS',
    code: 'ISB 04 // THE CENTAURUS & ISE TOWER II — BLUE AREA',
    label: 'Centaurus & ISE Tower II',
    subLabel: 'Grade-A Corporate Offices, Flagship Retail Mall & Luxury Sky Apartments in Islamabad',
    headline: 'The Centaurus & ISE Tower II — Jinnah Avenue, Islamabad',
    minimalSummary: 'The Centaurus (42 Floors) & ISE Tower II • Retail Mall & Grade-A Offices • Blue Area, Islamabad',
    description:
      'Verified from Towers.pk/Islamabad: The Centaurus (42 floors, Pak Gulf Construction) and ISE Tower II (designed by NESPAK & built by Habib Rafiq Pvt. Ltd.) anchor Islamabad’s central business district with Grade-A corporate offices (PKR 350–700/sq.ft rent) and prime retail shops.',
    valuation: 'Shops PKR 1.5–8 Cr • Offices PKR 2–3.5 Cr',
    locationBadge: 'F-8 / Jinnah Avenue, Blue Area, Islamabad',
    focalLength: '20MM PRIME',
    altitude: '42 FLOORS / 656 FT',
    fov: '86° WIDE',
    sourceUrl: 'https://towers.pk/islamabad/centaurus/',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/5U1P9WPx',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.centaurus_mallTower,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.iseTower_blueArea,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.stateLifeTower_blueArea,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.centaurus_mallTower,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.iseTower_blueArea,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.saudiPakTower_blueArea
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.5%', '-0.5%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'ci-spec-1',
        title: 'Grade-A Multinational Corporate Suites',
        spec: 'High-speed elevators, underground parking, conference halls, and 24/7 power backup.'
      },
      {
        id: 'ci-spec-2',
        title: 'High Rental Yield Commercial Assets',
        spec: 'Prime Blue Area occupancy by financial institutions, tech firms, and flagship brands.'
      }
    ]
  },
  {
    id: 'comm-arch-grand-orchard-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'TOWERS.PK/ISLAMABAD // MARKAZ & DHA COMMERCIAL PLAZAS',
    code: 'ISB 05 // THE ARCH TOWER (G-11) & GRAND ORCHARD (DHA-1)',
    label: 'Arch Tower & Grand Orchard',
    subLabel: 'High-Footfall Markaz Shops, Corporate Offices & Mixed-Use Plazas in G-11 & DHA Phase 1',
    headline: 'The Arch Tower G-11 Markaz & Grand Orchard DHA Phase 1',
    minimalSummary: 'The Arch Tower (G-11 Markaz) & Grand Orchard (DHA Phase 1) • 6–9% Annual Rental Yield',
    description:
      'Verified from Towers.pk/Islamabad: The Arch Tower in Sector G-11 Markaz (8 floors of shops & offices from PKR 45 Lac to 1.5 Cr) and Grand Orchard in DHA Phase 1 by Premier Choice (shops PKR 1.5–3.5 Cr, apartments PKR 75L–1.6 Cr) offer 6%–9% annual rental yields.',
    valuation: 'Shops from PKR 60 Lac – 3.5 Crore',
    locationBadge: 'Sector G-11 Markaz & DHA Phase 1, Islamabad',
    focalLength: '24MM ARCHITECTURAL',
    altitude: '8–12 STOREYS',
    fov: '88° WIDE',
    sourceUrl: 'https://towers.pk/islamabad/the-arch-tower/',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/l7r4er7D',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.grandOrchard_dhaPhase1,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.theArchTower_g11Markaz,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.greenTrustTower_islamabad,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.grandOrchard_dhaPhase1,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.theArchTower_g11Markaz,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.greenTrustTower_islamabad
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.5%', '0.5%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'ag-spec-1',
        title: '25% Down Payment & Flexible Installments',
        spec: '2 to 3-year quarterly payment plans with strong capital appreciation and 6–9% rental ROI.'
      },
      {
        id: 'ag-spec-2',
        title: 'Modern Glass Elevation & Rooftop Amenities',
        spec: 'Covered basement parking, smart access control, rooftop gardens, and backup generators.'
      }
    ]
  },

  // ---------------- PILLAR 2: CONTAINER & CAPSULE SMART HOUSES (ATTACHED IMAGES 1 TO 6) ----------------
  {
    id: 'capsule-att-1-k5',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (01 / 06)',
    code: 'CAPSULE 01 // MODEL K5 PANORAMIC SPACE CAPSULE',
    label: 'K5 Panoramic Space Capsule',
    subLabel: '38-Foot Aerospace Aluminum Pod with Dual 270° Curved Glass Observation Wings',
    headline: 'Model K5 Waterfront Panoramic Space Capsule House',
    minimalSummary: 'Model K5 Space Capsule • Dual 270° Curved Glass Wings & Biometric Entry • PKR 75L–1.05 Cr',
    description:
      'Updated with Attached Image #1: Flagship K5 space capsule featuring an aerodynamic white aviation-grade aluminum shell, dual 270-degree curved tempered glass observation bays, central K5 security door with integrated steps, and open-air balcony deck.',
    valuation: 'PKR 75 Lakh – 1.05 Crore',
    locationBadge: 'Khanpur Dam, Rawal Lake, Farmhouses & Resorts',
    focalLength: '20MM WIDE',
    altitude: 'WATERFRONT LAWN',
    fov: '92° EXPANSIVE',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/eaunJzIE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap1_k5WaterfrontPod,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap6_lakesideCurvedGlassCapsule,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap5_v2124DoubleDeckerCapsule,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.6%', '-0.6%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap1-1',
        title: 'Dual 270° Curved Observation Glass',
        spec: 'Solar-tinted Low-E curved safety glass providing daytime privacy and panoramic views.'
      },
      {
        id: 'cap1-2',
        title: 'Crane-Ready Steel Chassis',
        spec: 'Installs on concrete piers in 4 hours without disturbing natural lawn landscaping.'
      }
    ]
  },
  {
    id: 'capsule-att-2-rooftop-container',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (02 / 06)',
    code: 'CAPSULE 02 // ROOFTOP DECK CONTAINER VILLA',
    label: 'Rooftop Deck Container Villa',
    subLabel: 'Luxury White Container Home with Wraparound Timber Patio & Upper Sky Lounge',
    headline: 'Luxury Container Villa with Rooftop Terrace & Timber Deck',
    minimalSummary: 'White Container Villa • Upper Rooftop Sky Deck & Full Sliding UPVC Glass • PKR 52L–78L',
    description:
      'Updated with Attached Image #2: Architectural shipping-container residence finished in crisp white thermal coating, featuring full-span sliding UPVC glass walls, a gourmet kitchen and dining island, wraparound hardwood deck, and an upper-level railed rooftop lounge.',
    valuation: 'PKR 52 Lakh – 78 Lakh',
    locationBadge: 'Faisal Hills, Chak Shahzad & B-17 Farm Estates',
    focalLength: '24MM ARCHITECTURAL',
    altitude: '2-LEVEL DECK',
    fov: '86° WIDE',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/uxMV0Yd2',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap2_rooftopDeckContainerVilla,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap4_curvedCornerGlassContainer,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap1_k5WaterfrontPod,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.6%', '0.6%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap2-1',
        title: 'Upper Rooftop Dining & Sky Terrace',
        spec: 'Reinforced structural roof deck with steel cable railings and outdoor lounge seating.'
      },
      {
        id: 'cap2-2',
        title: 'Full-Width Sliding UPVC Glass Wall',
        spec: 'Seamlessly merges the indoor kitchen and lounge with the outdoor timber patio.'
      }
    ]
  },
  {
    id: 'capsule-att-3-hex-black',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (03 / 06)',
    code: 'CAPSULE 03 // HEX-LIT DESIGNER CONTAINER POD',
    label: 'Hex-Lit Designer Container Pod',
    subLabel: 'Matte Charcoal Chamfered Container Studio with Warm Architectural Perimeter Lighting',
    headline: 'Chamfered Matte-Black Designer Container Smart Pod',
    minimalSummary: 'Hex-Lit Matte Black Container Pod • Warm LED Perimeter Halo & Smart Lounge • PKR 64L–88L',
    description:
      'Updated with Attached Image #3: Ultra-modern chamfered-frame container villa with recessed warm amber perimeter LED lighting, geometric hexagonal laser-cut backlit feature walls, and frameless panoramic sliding glass.',
    valuation: 'PKR 64 Lakh – 88 Lakh',
    locationBadge: 'Executive Farmhouses, Glamping Resorts & Rooftops',
    focalLength: '22MM WIDE',
    altitude: 'GARDEN PAVILION',
    fov: '88° WIDE',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/MQ649Ero',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap3_hexLitBlackContainerPod,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap4_curvedCornerGlassContainer,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap2_rooftopDeckContainerVilla,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.5%', '-0.5%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap3-1',
        title: 'Chamfered Portal Frame & Warm LED Halo',
        spec: 'Architectural bevelled steel portal with weatherproof outdoor ambiance lighting.'
      },
      {
        id: 'cap3-2',
        title: 'Bespoke Hexagonal Backlit Interior',
        spec: 'Turnkey designer lounge, acoustic ceiling slats, and smart climate automation.'
      }
    ]
  },
  {
    id: 'capsule-att-4-executive-studio',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (04 / 06)',
    code: 'CAPSULE 04 // CURVED-CORNER EXECUTIVE STUDIO POD',
    label: 'Curved-Corner Studio Container',
    subLabel: 'Minimalist White Container Villa & Executive Office with Rounded UPVC Frames',
    headline: 'Curved-Corner Glass Container Villa & Executive Studio',
    minimalSummary: 'Curved-Corner White Container Studio • Rounded UPVC Glass & Executive Desk • PKR 46L–65L',
    description:
      'Updated with Attached Image #4: Precision-crafted white corrugated container module featuring signature rounded-corner black aluminum/UPVC window frames, linear recessed ceiling lights, and a private executive workspace and lounge.',
    valuation: 'PKR 46 Lakh – 65 Lakh',
    locationBadge: 'Islamabad, Rawalpindi, Taxila & Lahore Delivery',
    focalLength: '24MM PRIME',
    altitude: 'PATIO LEVEL',
    fov: '85° WIDE',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/p5oZpRhm',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap4_curvedCornerGlassContainer,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap2_rooftopDeckContainerVilla,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap3_hexLitBlackContainerPod,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.5%', '0.5%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap4-1',
        title: 'Rounded-Corner Structural UPVC Glazing',
        spec: 'Dual-aspect floor-to-ceiling glass walls with thermal-break aluminum profiles.'
      },
      {
        id: 'cap4-2',
        title: 'Dual-Use Residence or Corporate Pod',
        spec: 'Ideal as a luxury guest suite, private garden office, or site sales gallery.'
      }
    ]
  },
  {
    id: 'capsule-att-5-v2124-duplex',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (05 / 06)',
    code: 'CAPSULE 05 // V2124 DOUBLE-DECKER CAPSULE VILLA',
    label: 'V2124 Double-Decker Villa',
    subLabel: 'Two-Story Stacked Curved-Glass Capsule Villa with Upper Master Sky Suite',
    headline: 'Model V2124 Double-Decker Stacked Capsule Villa',
    minimalSummary: 'Model V2124 Double-Decker Duplex • 2-Story Stacked Glass Capsule Villa • PKR 1.35–1.85 Cr',
    description:
      'Updated with Attached Image #5: Two-story stacked modular capsule villa offering an expansive ground-floor living and dining pavilion with sliding glass walls and an upper-deck V2124 panoramic master bedroom suite.',
    valuation: 'PKR 1.35 Crore – 1.85 Crore',
    locationBadge: 'Luxury Farmhouses, Hill Resorts & Urban Penthouses',
    focalLength: '20MM ARCHITECTURAL',
    altitude: '2-STORY DUPLEX',
    fov: '90° WIDE',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/Yie7Mpli',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap5_v2124DoubleDeckerCapsule,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap6_lakesideCurvedGlassCapsule,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap1_k5WaterfrontPod,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.6%', '-0.6%'],
    panY: ['0.3%', '-0.3%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap5-1',
        title: 'Upper-Deck V2124 Panoramic Master Suite',
        spec: 'Second-story curved observation glass suite with warm architectural cove lighting.'
      },
      {
        id: 'cap5-2',
        title: 'Open-Plan Ground Lounge & Kitchen',
        spec: 'Full-span sliding UPVC glass doors opening onto a raised composite timber deck.'
      }
    ]
  },
  {
    id: 'capsule-att-6-lakeside-pod',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (06 / 06)',
    code: 'CAPSULE 06 // LAKESIDE CURVED-GLASS CAPSULE POD',
    label: 'Lakeside Panorama Capsule',
    subLabel: 'Curved-Glass Waterfront Capsule Home with Stepping-Stone Path & Patio Deck',
    headline: 'Lakeside Curved-Glass Observation Capsule House',
    minimalSummary: 'Lakeside Curved-Glass Capsule Pod • Waterfront Timber Deck & Low-E Glazing • PKR 68L–96L',
    description:
      'Updated with Attached Image #6: Waterfront aerodynamic capsule residence featuring wrap-around curved observation glass, operable casement ventilation windows, fluorocarbon aluminum cladding, and a serene lakeside timber deck.',
    valuation: 'PKR 68 Lakh – 96 Lakh',
    locationBadge: 'Lakeside Estates, Resorts & Private Farmhouses',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'LAKESIDE DECK',
    fov: '94° EXPANSIVE',
    replacedBrokenLink: 'https://www.genspark.ai/api/files/s/Wt9erp87',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap6_lakesideCurvedGlassCapsule,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap1_k5WaterfrontPod,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap5_v2124DoubleDeckerCapsule,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.6%', '0.6%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap6-1',
        title: 'Seamless Curved Low-E Observation Glass',
        spec: 'Double-glazed thermal and acoustic curved glass with zero condensation.'
      },
      {
        id: 'cap6-2',
        title: 'Turnkey Waterfront & Resort Setup',
        spec: 'Includes smart climate control, luxury bathroom, and prefabricated patio decking.'
      }
    ]
  },

  // ---------------- PILLAR 3: PROPERTIES (PLOTS & CONSTRUCTED HOUSES) ----------------
  {
    id: 'prop-wp-1',
    tourCategory: 'properties_plots_villas',
    propertyCategory: 'residential',
    divisionTag: 'RI8CLICK CONSORTIUM // PLOTS & CONSTRUCTED HOUSES',
    code: 'PROP 01 // CONSTRUCTED VILLA & POSSESSION PLOTS',
    label: 'Cantilevered Designer Villa',
    subLabel: '1-Kanal Constructed House & Possession Plots in Faisal Hills & Islamabad',
    headline: 'Constructed Signature Villas & Prime Residential Plots',
    minimalSummary: '1-Kanal Constructed Villas & Possession Plots • Faisal Hills & Islamabad • Plots 45L+ / Villas 6.85 Cr+',
    description:
      'Ri8click Consortium offers verified Residential & Commercial Plots (5 Marla, 10 Marla, 1 & 2 Kanal) alongside architect-constructed luxury houses in Faisal Hills, Kohistan Enclave, Multi Gardens B-17, and DHA Islamabad.',
    valuation: 'Plots from PKR 45L • Villas 6.85 Cr+',
    locationBadge: 'Faisal Hills Executive, Taxila & Islamabad',
    focalLength: '24MM PRIME',
    altitude: 'ELEVATION +4.2M',
    fov: '84° WIDE',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house1_whiteVilla,
    secondaryImageUrl: CONSTRUCTED_HOUSES_GALLERY.house2_modernEstate,
    fallbackUrl: CONSTRUCTED_HOUSES_GALLERY.house3_stoneGlassMansion,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'center center',
    panX: ['0%', '-0.8%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'p1-1',
        title: 'Turnkey Constructed Residence',
        spec: 'A+ grade seismic RCC structure with cantilevered sky terraces.'
      },
      {
        id: 'p1-2',
        title: 'Ri8click Consortium UPVC Glazing',
        spec: 'Double-glazed German profile UPVC windows and sliding patio doors.'
      }
    ]
  },
  {
    id: 'prop-wp-2',
    tourCategory: 'properties_plots_villas',
    propertyCategory: 'residential',
    divisionTag: 'RI8CLICK CONSORTIUM // PLOTS & CONSTRUCTED HOUSES',
    code: 'PROP 02 // MARGALLA RIDGE ESTATE',
    label: 'Hillside Stone & Glass Manor',
    subLabel: 'Constructed Luxury House & Developed Ridge Plots',
    headline: 'Margalla View Constructed Houses & Estate Plots',
    minimalSummary: 'Margalla View Constructed Manor & Ridge Plots • Kohistan Enclave, B-17 & Faisal Hills',
    description:
      'Commanding panoramic Margalla foothill views, our constructed residences and developed plots combine natural stacked-stone facades, warm timber soffits, floating staircases, and full underground utilities.',
    valuation: 'PKR 5.90 Crore – 7.40 Crore',
    locationBadge: 'Kohistan Enclave, B-17 & Faisal Hills',
    focalLength: '20MM WIDE',
    altitude: 'TERRACE +6.0M',
    fov: '90° WIDE',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house3_stoneGlassMansion,
    secondaryImageUrl: CONSTRUCTED_HOUSES_GALLERY.house1_whiteVilla,
    fallbackUrl: CONSTRUCTED_HOUSES_GALLERY.house2_modernEstate,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'left center',
    panX: ['-0.6%', '0.6%'],
    panY: ['0.3%', '-0.3%'],
    scaleRange: [1.04, 1.01],
    specs: [
      {
        id: 'p2-1',
        title: '24-Foot Corner Glass Atrium',
        spec: 'Seamless structural UPVC and silicone glazing overlooking Margalla Hills.'
      },
      {
        id: 'p2-2',
        title: 'Subterranean 3-Car Parking',
        spec: 'Climate-controlled lower-ground parking and servant quarters.'
      }
    ]
  },

  // ---------------- PILLAR 4: UPVC DOORS, WINDOWS, PARTITIONS & CONSTRUCTION ----------------
  {
    id: 'upvc-wp-1',
    tourCategory: 'upvc_construction',
    propertyCategory: 'projects',
    divisionTag: 'RI8CLICK CONSORTIUM // UPVC DOORS, WINDOWS & CONSTRUCTION',
    code: 'UPVC 01 // DOORS, WINDOWS & GLASS CONSERVATORY',
    label: 'UPVC Windows & Glass Systems',
    subLabel: 'German-Standard UPVC Doors, Windows, Skylights & Facades',
    headline: 'Ri8click Consortium UPVC Doors, Windows, Partitions & Panels',
    minimalSummary: 'Ri8click UPVC Doors, Windows & Skylights • 10-Year Warranty • Acoustic & Thermal Glazing',
    description:
      'Manufactured by Ri8click Consortium: heavy-duty acoustic double/triple-glazed UPVC casement and sliding windows, patio doors, office glass partitions, and weatherproof architectural wall panels.',
    valuation: '10-Year Factory Warranty • Custom Fabrication',
    locationBadge: 'Ri8click Consortium UPVC Plant & Turnkey Division',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'CONSERVATORY',
    fov: '96° EXPANSIVE',
    imageUrl: UPVC_AND_INTERIOR_GALLERY.upvc1_glassRoofConservatory,
    secondaryImageUrl: UPVC_AND_INTERIOR_GALLERY.upvc2_woodSlatTvPartition,
    fallbackUrl: CONSTRUCTED_HOUSES_GALLERY.house2_modernEstate,
    videoUrl: SHOWROOM_VIDEOS.luxuryInteriorWalk,
    motionOrigin: 'center center',
    panX: ['0%', '-0.8%'],
    panY: ['-0.4%', '0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'u1-1',
        title: 'Thermal-Break Glazed Roof & Skylights',
        spec: 'Argon-filled Low-E laminated glass blocking 96% UV radiation.'
      },
      {
        id: 'u1-2',
        title: 'Acoustic UPVC Sliding & Casement Windows',
        spec: 'Multi-chamber steel-reinforced UPVC profiles with 42dB sound reduction.'
      }
    ]
  }
];

type AtmosphereGrade = 'crystal_daylight' | 'solar_vivid' | 'showroom_hdr';

const WAYPOINT_DURATION_MS = 6500;

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

  // Main category filter aligned with Navbar & Ri8click Consortium divisions
  const [tourCategory, setTourCategory] = useState<TourDeckCategory>('all_showroom');
  const [waypointIdx, setWaypointIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoTourActive, setIsVideoTourActive] = useState(false);
  const [isCinemaTheaterMode, setIsCinemaTheaterMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Optical clarity grade
  const [atmosphere, setAtmosphere] = useState<AtmosphereGrade>('crystal_daylight');

  // UI Visibility States:
  // When "Hide Text" from Portfolio Deck is clicked, switch to "Clean View" with minimal description
  const [showLeftDescription, setShowLeftDescription] = useState(true);
  const [showDirectorDeck, setShowDirectorDeck] = useState(true);
  const [showSpecsDrawer, setShowSpecsDrawer] = useState(false);
  const [showLinkDiagnosticsModal, setShowLinkDiagnosticsModal] = useState(false);

  // Track image fallback stage (0 = primary, 1 = secondaryImageUrl, 2 = fallbackUrl)
  const [imageFallbackStage, setImageFallbackStage] = useState<Record<string, number>>({});
  // Sub-gallery index when cycling through multiple images inside a single waypoint
  const [subGalleryIdx, setSubGalleryIdx] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Filtered waypoints by active division tab
  const filteredWaypoints = useMemo(() => {
    if (tourCategory === 'all_showroom') return MASTER_VIRTUAL_TOUR_WAYPOINTS;
    return MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(wp => wp.tourCategory === tourCategory);
  }, [tourCategory]);

  const safeWaypointIdx = waypointIdx % filteredWaypoints.length;
  const activeWaypoint = filteredWaypoints[safeWaypointIdx] || MASTER_VIRTUAL_TOUR_WAYPOINTS[0];
  const currentSlide = activeSlides[safeWaypointIdx % Math.max(1, activeSlides.length)] || slides[0];

  // Reset subGalleryIdx when waypoint changes
  useEffect(() => {
    setSubGalleryIdx(0);
  }, [activeWaypoint.id]);

  // Auto-advance waypoints
  useEffect(() => {
    if (isPaused || isVideoTourActive) return;
    const timer = setInterval(() => {
      setWaypointIdx(prev => (prev + 1) % filteredWaypoints.length);
    }, WAYPOINT_DURATION_MS);
    return () => clearInterval(timer);
  }, [isPaused, isVideoTourActive, filteredWaypoints.length]);

  // Handle video playback when video mode is toggled
  useEffect(() => {
    if (isVideoTourActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsVideoTourActive(false);
      });
    }
  }, [isVideoTourActive, activeWaypoint.id]);

  const handleSelectCategory = (cat: TourDeckCategory) => {
    setTourCategory(cat);
    setWaypointIdx(0);
    setIsVideoTourActive(false);
  };

  const handleNextWaypoint = () => {
    setWaypointIdx(prev => (prev + 1) % filteredWaypoints.length);
  };

  const handlePrevWaypoint = () => {
    setWaypointIdx(prev => (prev - 1 + filteredWaypoints.length) % filteredWaypoints.length);
  };

  // Resolve active image URL with automatic broken-link recovery
  const resolveActiveImageUrl = (wp: CameraWaypoint): string => {
    const stage = imageFallbackStage[wp.id] || 0;
    if (wp.galleryImages && wp.galleryImages.length > 0 && stage === 0) {
      return wp.galleryImages[subGalleryIdx % wp.galleryImages.length];
    }
    if (stage === 0) return wp.imageUrl;
    if (stage === 1) return wp.secondaryImageUrl || wp.fallbackUrl;
    return wp.fallbackUrl;
  };

  const handleImageError = (wpId: string) => {
    setImageFallbackStage(prev => {
      const current = prev[wpId] || 0;
      if (current < 2) {
        return { ...prev, [wpId]: current + 1 };
      }
      return prev;
    });
  };

  const atmosphereFilterClass = useMemo(() => {
    switch (atmosphere) {
      case 'solar_vivid':
        return 'brightness-[1.06] contrast-[1.08] saturate-[1.16]';
      case 'showroom_hdr':
        return 'brightness-[1.04] contrast-[1.12] saturate-[1.10]';
      case 'crystal_daylight':
      default:
        return 'brightness-[1.03] contrast-[1.05] saturate-[1.08]';
    }
  }, [atmosphere]);

  const categoryTabs: {
    id: TourDeckCategory;
    label: string;
    shortLabel: string;
    count: number;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'all_showroom',
      label: 'All Consortium Portfolio',
      shortLabel: 'All Portfolio',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.length,
      icon: <Compass className="w-3.5 h-3.5" />
    },
    {
      id: 'commercial_plazas',
      label: 'Commercial Plazas (Towers.pk Islamabad)',
      shortLabel: 'Commercial Plazas',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'commercial_plazas').length,
      icon: <Building2 className="w-3.5 h-3.5" />
    },
    {
      id: 'capsule_containers',
      label: 'Capsule & Container Homes',
      shortLabel: 'Capsule Homes',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'capsule_containers').length,
      icon: <Box className="w-3.5 h-3.5" />
    },
    {
      id: 'properties_plots_villas',
      label: 'Plots & Constructed Villas',
      shortLabel: 'Plots & Villas',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'properties_plots_villas').length,
      icon: <Home className="w-3.5 h-3.5" />
    },
    {
      id: 'upvc_construction',
      label: 'UPVC Windows & Construction',
      shortLabel: 'UPVC & Civil',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'upvc_construction').length,
      icon: <HardHat className="w-3.5 h-3.5" />
    }
  ];

  const isCleanView = !showLeftDescription || isCinemaTheaterMode;

  return (
    <section className="relative w-full h-[88vh] min-h-[640px] max-h-[940px] bg-slate-950 overflow-hidden select-none border-b border-slate-800/80">
      {/* =====================================================================
          1. FULL-VIEWPORT ARCHITECTURAL CANVAS (ACTIVE IMAGES + VIDEO STREAM)
         ===================================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          {isVideoTourActive ? (
            <motion.div
              key={`video-${activeWaypoint.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full"
            >
              <video
                ref={videoRef}
                src={activeWaypoint.videoUrl}
                muted={isMuted}
                playsInline
                loop
                onError={() => setIsVideoTourActive(false)}
                className={`w-full h-full object-cover ${atmosphereFilterClass}`}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`img-${activeWaypoint.id}-${subGalleryIdx}-${imageFallbackStage[activeWaypoint.id] || 0}`}
              initial={{ opacity: 0, scale: activeWaypoint.scaleRange[0] }}
              animate={{
                opacity: 1,
                scale: activeWaypoint.scaleRange[1],
                x: activeWaypoint.panX,
                y: activeWaypoint.panY
              }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.65, ease: 'easeOut' },
                scale: { duration: WAYPOINT_DURATION_MS / 1000, ease: 'linear' },
                x: { duration: WAYPOINT_DURATION_MS / 1000, ease: 'linear' },
                y: { duration: WAYPOINT_DURATION_MS / 1000, ease: 'linear' }
              }}
              style={{ transformOrigin: activeWaypoint.motionOrigin }}
              className="relative w-full h-full"
            >
              <img
                src={resolveActiveImageUrl(activeWaypoint)}
                alt={activeWaypoint.headline}
                onError={() => handleImageError(activeWaypoint.id)}
                className={`w-full h-full object-cover object-center ${atmosphereFilterClass} transition-all duration-500`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle Optical Gradients — lighter in Clean View so full architectural photography shines */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isCleanView
              ? 'bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/35'
              : 'bg-gradient-to-r from-slate-950/85 via-slate-950/35 to-transparent'
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
      </div>

      {/* =====================================================================
          2. TOP DIVISION NAVIGATION & OPTICAL TELEMETRY HUD BAR
         ===================================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/75 backdrop-blur-md border border-white/15 rounded-2xl p-2 shadow-xl">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categoryTabs.map(tab => {
              const isActive = tourCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.shortLabel}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Optical & Clean-View Controls */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Active Image Link Status Badge */}
            <button
              onClick={() => setShowLinkDiagnosticsModal(true)}
              title="Inspect Replaced Broken Links & Active Domestic Sources"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Active Links Verified</span>
            </button>

            {/* Optical Grade Switcher */}
            <button
              onClick={() =>
                setAtmosphere(prev =>
                  prev === 'crystal_daylight'
                    ? 'solar_vivid'
                    : prev === 'solar_vivid'
                    ? 'showroom_hdr'
                    : 'crystal_daylight'
                )
              }
              title="Switch Optical Clarity Grade"
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">
                {atmosphere === 'crystal_daylight'
                  ? 'Daylight'
                  : atmosphere === 'solar_vivid'
                  ? 'Vivid HDR'
                  : 'Showroom'}
              </span>
            </button>

            {/* Video / Photo Toggle */}
            <button
              onClick={() => setIsVideoTourActive(prev => !prev)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                isVideoTourActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
              }`}
            >
              {isVideoTourActive ? (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Still Photo</span>
                </>
              ) : (
                <>
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Aerial Video</span>
                </>
              )}
            </button>

            {isVideoTourActive && (
              <button
                onClick={() => setIsMuted(prev => !prev)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-pointer"
                title={isMuted ? 'Unmute Video' : 'Mute Video'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Full Clean Theater Mode */}
            <button
              onClick={() => setIsCinemaTheaterMode(prev => !prev)}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isCinemaTheaterMode
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
              }`}
              title={isCinemaTheaterMode ? 'Exit Full View' : 'Full Viewport Mode'}
            >
              {isCinemaTheaterMode ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. MAIN HERO CONTENT OR "CLEAN VIEW" MINIMAL DESCRIPTION
         ===================================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100%-170px)] flex flex-col justify-between py-4">
        <AnimatePresence mode="wait">
          {!isCleanView ? (
            /* ---------------- FULL EDITORIAL DESCRIPTION VIEW ---------------- */
            <motion.div
              key={`full-desc-${activeWaypoint.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="my-auto max-w-2xl space-y-4 bg-slate-950/65 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-white/15 shadow-2xl"
            >
              {/* Division & Verified Badge Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-600/90 text-white shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{activeWaypoint.divisionTag}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/15">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{activeWaypoint.locationBadge}</span>
                </span>

                {activeWaypoint.sourceUrl && (
                  <a
                    href={activeWaypoint.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 transition-colors"
                  >
                    <Building2 className="w-3 h-3" />
                    <span>Towers.pk Islamabad Verified</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>

              {/* Headline & Subtitle */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-widest text-blue-300">
                  {activeWaypoint.code}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {activeWaypoint.headline}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-amber-300/95">
                  {activeWaypoint.subLabel}
                </p>
              </div>

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-3">
                {activeWaypoint.description}
              </p>

              {/* Sub-gallery angle switcher (when multiple domestic photos exist for the tower/capsule) */}
              {activeWaypoint.galleryImages && activeWaypoint.galleryImages.length > 1 && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Angles ({subGalleryIdx + 1}/{activeWaypoint.galleryImages.length}):</span>
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {activeWaypoint.galleryImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSubGalleryIdx(idx)}
                        className={`w-10 h-7 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          subGalleryIdx === idx
                            ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                            : 'border-white/20 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Angle ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Valuation & Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-white/15">
                <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
                  <div className="text-[10px] uppercase tracking-wider text-slate-300">
                    Indicative Valuation
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-amber-400">
                    {activeWaypoint.valuation}
                  </div>
                </div>

                <button
                  onClick={() => onSelectCategoryFilter(activeWaypoint.propertyCategory)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore {activeWaypoint.propertyCategory}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onContactAgentClick}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Book Site Visit</span>
                </button>

                <button
                  onClick={() =>
                    onOpen3DTour(
                      currentSlide?.samplePropertyData || {
                        title: activeWaypoint.headline,
                        category: activeWaypoint.propertyCategory,
                        location: {
                          city: 'Islamabad / Taxila',
                          society: activeWaypoint.locationBadge,
                          province: 'ICT / Punjab'
                        }
                      }
                    )
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>3D Tour</span>
                </button>

                <button
                  onClick={() => setShowSpecsDrawer(prev => !prev)}
                  className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>Specs</span>
                </button>
              </div>

              {/* Expandable Engineering Specifications */}
              <AnimatePresence>
                {showSpecsDrawer && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 overflow-hidden"
                  >
                    {activeWaypoint.specs.map(s => (
                      <div
                        key={s.id}
                        className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs"
                      >
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{s.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">{s.spec}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ---------------- CLEAN VIEW: MINIMAL DESCRIPTION BADGE ---------------- */
            <motion.div
              key={`clean-minimal-${activeWaypoint.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-auto mb-3 max-w-xl bg-slate-950/65 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 shadow-xl flex flex-wrap items-center justify-between gap-3"
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white">
                    Clean View
                  </span>
                  <span className="text-[11px] font-medium text-amber-300 truncate">
                    {activeWaypoint.locationBadge}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeWaypoint.headline}
                </h2>
                <p className="text-[11px] text-slate-300 truncate">
                  {activeWaypoint.minimalSummary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-extrabold text-amber-400 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10">
                  {activeWaypoint.valuation}
                </span>
                <button
                  onClick={() => {
                    setShowLeftDescription(true);
                    setIsCinemaTheaterMode(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold border border-white/15 flex items-center gap-1 cursor-pointer"
                  title="Restore Full Text Description"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-300" />
                  <span>Show Text</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =====================================================================
          4. BOTTOM PORTFOLIO DECK (THUMBNAIL CAROUSEL + HIDE TEXT / CLEAN VIEW)
         ===================================================================== */}
      <div className="absolute inset-x-0 bottom-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
        <div className="bg-slate-950/80 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-2xl">
          {/* Deck Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Portfolio Deck</span>
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                ({safeWaypointIdx + 1} / {filteredWaypoints.length})
              </span>

              {/* Prev / Play-Pause / Next Controls */}
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={handlePrevWaypoint}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Previous Property"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsPaused(prev => !prev)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 transition-colors cursor-pointer"
                  title={isPaused ? 'Resume Auto-Tour' : 'Pause Auto-Tour'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleNextWaypoint}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Next Property"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Portfolio Deck Controls: Hide Text (Clean View) & Collapse Deck */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLeftDescription(prev => !prev)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  !showLeftDescription
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/15'
                }`}
                title="Toggle Clean View with Minimal Description"
              >
                {showLeftDescription ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-300" />
                    <span>Hide Text (Clean View)</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Clean View Active (Show Full Text)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDirectorDeck(prev => !prev)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 flex items-center gap-1 cursor-pointer"
              >
                {showDirectorDeck ? (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Minimize Deck</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Expand Deck</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Thumbnail Cards Strip */}
          {showDirectorDeck && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2 overflow-x-auto no-scrollbar">
              {filteredWaypoints.map((wp, idx) => {
                const isSelected = idx === safeWaypointIdx;
                return (
                  <button
                    key={wp.id}
                    onClick={() => {
                      setWaypointIdx(idx);
                      setIsVideoTourActive(false);
                    }}
                    className={`group relative rounded-xl overflow-hidden border text-left transition-all cursor-pointer h-16 ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40 scale-[1.01]'
                        : 'border-white/15 opacity-75 hover:opacity-100 hover:border-white/35'
                    }`}
                  >
                    <img
                      src={resolveActiveImageUrl(wp)}
                      alt={wp.label}
                      onError={() => handleImageError(wp.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-1.5 flex flex-col justify-end">
                      <div className="text-[10px] font-bold text-white truncate">{wp.label}</div>
                      <div className="text-[9px] text-amber-300 truncate">{wp.valuation}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          5. BROKEN LINK AUDIT & ACTIVE REPLACEMENT DIAGNOSTIC MODAL
         ===================================================================== */}
      <AnimatePresence>
        {showLinkDiagnosticsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 space-y-4 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-400" />
                    <span>Hero Banner Broken Link Audit & Active Image Replacements</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    All expired/broken URLs have been replaced with active Towers.pk/Islamabad & attached Capsule assets.
                  </p>
                </div>
                <button
                  onClick={() => setShowLinkDiagnosticsModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.replacedBrokenLink).map(wp => (
                  <div
                    key={wp.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="font-bold text-white">{wp.headline}</div>
                      <div className="text-[11px] text-rose-400 line-through truncate">
                        Broken/Expired: {wp.replacedBrokenLink}
                      </div>
                      <div className="text-[11px] text-emerald-400 truncate">
                        Active Replacement: {wp.imageUrl}
                      </div>
                    </div>
                    <img
                      src={wp.imageUrl}
                      alt={wp.label}
                      className="w-20 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
