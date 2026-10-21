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
  FileText
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
  description: string;
  valuation: string;
  locationBadge: string;
  focalLength: string;
  altitude: string;
  fov: string;
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
// 1. VERIFIED DOMESTIC COMMERCIAL TOWERS (ATTACHMENTS 1 TO 7 + TOWERS.PK/ISLAMABAD)
// ============================================================================

export const ISLAMABAD_DOMESTIC_TOWERS_GALLERY = {
  // Attachment 1: Regent One & Regent Mall — Night Aerial View (DHA Phase 3 / Islamabad)
  tower1_regentOneNightAerial: 'https://www.genspark.ai/api/files/s/CfYL2dM0',
  // Attachment 2: Multi-Block High-Rise Commercial & Corporate Complex (Islamabad Expressway / GT Road)
  tower2_parksideHighriseComplex: 'https://www.genspark.ai/api/files/s/NC4klaYu',
  // Attachment 3: Classical Stone & Arched Podium Commercial Galleria (DHA / Gulberg Islamabad)
  tower3_florenceGalleriaPodium: 'https://www.genspark.ai/api/files/s/5U1P9WPx',
  // Attachment 4: Citadel 7 Corporate & Retail Tower — Twilight Elevation (Blue Area, Jinnah Avenue, Islamabad)
  tower4_citadel7Twilight: 'https://www.genspark.ai/api/files/s/qpljElLm',
  // Attachment 5: Citadel 7 Corporate Tower — Skyline View (Blue Area, Islamabad)
  tower5_citadel7Skyline: 'https://www.genspark.ai/api/files/s/6C54AO5M',
  // Attachment 6: High-Street Branded Retail & Corporate Plaza (Blue Area / Faisal Hills Islamabad)
  tower6_brandedRetailPlaza: 'https://www.genspark.ai/api/files/s/l7r4er7D',
  // Attachment 7: Regent One & Regent Mall — Daylight Aerial View (DHA Phase 3 / Islamabad)
  tower7_regentOneDaylightAerial: 'https://www.genspark.ai/api/files/s/JBLytyZd',

  // Active Domestic High-Resolution Architectural Backups
  backup_citadel7: 'https://www.genspark.ai/api/files/s/qpljElLm',
  backup_regentOne: 'https://www.genspark.ai/api/files/s/JBLytyZd',
  backup_retailPlaza: 'https://www.genspark.ai/api/files/s/l7r4er7D'
};

// ============================================================================
// 2. CONTAINER & CAPSULE SMART HOUSES (ATTACHMENTS 8 TO 14 IN EXACT SEQUENCE)
// ============================================================================

export const MODULAR_CAPSULE_GALLERY = {
  // Attachment 8 (1st Capsule in sequence): Q3 Pitched-Roof Modular Forest Cabin Pod
  cap8_q3ForestCabinPod: 'https://www.genspark.ai/api/files/s/BbrzM6xL',
  // Attachment 9 (2nd Capsule in sequence): K5 Waterfront Panoramic Space Capsule Pod
  cap9_k5WaterfrontPod: 'https://www.genspark.ai/api/files/s/eaunJzIE',
  // Attachment 10 (3rd Capsule in sequence): White Corrugated Container Villa with Rooftop Deck & Patio
  cap10_rooftopDeckContainerVilla: 'https://www.genspark.ai/api/files/s/uxMV0Yd2',
  // Attachment 11 (4th Capsule in sequence): Hexagonal-Lit Matte Black Designer Container Smart Home
  cap11_hexLitBlackContainerPod: 'https://www.genspark.ai/api/files/s/MQ649Ero',
  // Attachment 12 (5th Capsule in sequence): White Curved-Corner Glass Executive Container Studio
  cap12_curvedCornerGlassContainer: 'https://www.genspark.ai/api/files/s/p5oZpRhm',
  // Attachment 13 (6th Capsule in sequence): V2124 Double-Decker Two-Story Stacked Capsule Villa
  cap13_v2124DoubleDeckerCapsule: 'https://www.genspark.ai/api/files/s/Yie7Mpli',
  // Attachment 14 (7th Capsule in sequence): Lakeside Curved-Glass Observation Capsule Pod with Timber Deck
  cap14_lakesideCurvedGlassCapsule: 'https://www.genspark.ai/api/files/s/Wt9erp87'
};

export const MODULAR_CAPSULE_SEQUENCE_LIST = [
  MODULAR_CAPSULE_GALLERY.cap8_q3ForestCabinPod,
  MODULAR_CAPSULE_GALLERY.cap9_k5WaterfrontPod,
  MODULAR_CAPSULE_GALLERY.cap10_rooftopDeckContainerVilla,
  MODULAR_CAPSULE_GALLERY.cap11_hexLitBlackContainerPod,
  MODULAR_CAPSULE_GALLERY.cap12_curvedCornerGlassContainer,
  MODULAR_CAPSULE_GALLERY.cap13_v2124DoubleDeckerCapsule,
  MODULAR_CAPSULE_GALLERY.cap14_lakesideCurvedGlassCapsule
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
// 3. MASTER WAYPOINTS (DOMESTIC ISLAMABAD TOWERS + CAPSULES 8-14 IN SEQUENCE)
// ============================================================================

const MASTER_VIRTUAL_TOUR_WAYPOINTS: CameraWaypoint[] = [
  // ---------------- PILLAR 1: COMMERCIAL PLAZAS (TOWERS.PK/ISLAMABAD + ATTACHMENTS 1–7) ----------------
  {
    id: 'comm-citadel-7-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'RI8CLICK CONSORTIUM // TOWERS.PK ISLAMABAD VERIFIED LANDMARK',
    code: 'ISB 01 // CITADEL 7 CORPORATE TOWER — BLUE AREA',
    label: 'Citadel 7 Blue Area',
    subLabel: '20-Storey CDA Approved Corporate & Retail Mall on Main Jinnah Avenue, Islamabad',
    headline: 'Citadel 7 Corporate & Retail Tower — Blue Area, Islamabad',
    description:
      'Featured on Towers.pk/Islamabad: Citadel 7 by Chakor Ventures rises 20 storeys (272 ft / 345,000 Sq. Ft.) at Plot 7, Main Jinnah Avenue, Blue Area, Islamabad. Engineered with 4 basement parking levels, a 5-floor luxury retail mall, and 14 floors of Margalla-facing corporate offices.',
    valuation: 'PKR 1.85 Crore – 14.5 Crore',
    locationBadge: 'Plot 7, Jinnah Avenue, Blue Area, Islamabad',
    focalLength: '24MM ARCHITECTURAL',
    altitude: '272 FT / 20 FLOORS',
    fov: '85° WIDE',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower4_citadel7Twilight,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower5_citadel7Skyline,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower6_brandedRetailPlaza,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower4_citadel7Twilight,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower5_citadel7Skyline,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower6_brandedRetailPlaza
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.6%', '0.6%'],
    panY: ['0%', '-0.6%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'c7-spec-1',
        title: '5-Storey Retail Podium & 14 Corporate Floors',
        spec: 'CDA-approved Blue Area commercial high-rise with double-glazed acoustic curtain wall.'
      },
      {
        id: 'c7-spec-2',
        title: 'Prime Jinnah Avenue Frontage',
        spec: 'Located in Islamabad financial hub alongside Centaurus Mall, Ufone Tower, and ISE Tower.'
      }
    ]
  },
  {
    id: 'comm-regent-one-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'RI8CLICK CONSORTIUM // TOWERS.PK ISLAMABAD COMMERCIAL & SUITES',
    code: 'ISB 02 // REGENT ONE & REGENT MALL — DHA ISLAMABAD',
    label: 'Regent One & Mall',
    subLabel: 'Twin High-Rise Commercial Plaza, Rooftop Sky Lounge & Serviced Apartments in Islamabad',
    headline: 'Regent One & Regent Mall — DHA Phase 3, Islamabad',
    description:
      'Listed on Towers.pk/Islamabad: Regent One and Regent Mall deliver a modern twin-block domestic commercial plaza and luxury apartment complex in DHA Phase 3, Islamabad, featuring rooftop recreational gardens, swimming pool deck, and dedicated boulevard parking.',
    valuation: 'Shops & Suites from PKR 1.45 Crore',
    locationBadge: 'Main Boulevard, DHA Phase 3, Islamabad',
    focalLength: '28MM DRONE',
    altitude: 'ROOFTOP SKY DECK',
    fov: '82° STANDARD',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower7_regentOneDaylightAerial,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower1_regentOneNightAerial,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower4_citadel7Twilight,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower7_regentOneDaylightAerial,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower1_regentOneNightAerial
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.6%', '-0.6%'],
    panY: ['-0.4%', '0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'ro-spec-1',
        title: 'Twin-Tower Commercial & Residential Hub',
        spec: 'Direct boulevard access with ground/mezzanine retail showrooms and rooftop amenities.'
      },
      {
        id: 'ro-spec-2',
        title: 'Day & Night Architectural Illumination',
        spec: 'Energy-efficient UPVC thermal glazing and dedicated underground resident parking.'
      }
    ]
  },
  {
    id: 'comm-expressway-highrise-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'RI8CLICK CONSORTIUM // ISLAMABAD HIGH-RISE COMMERCIAL COMPLEX',
    code: 'ISB 03 // SKYPARK & MULTI-TOWER COMMERCIAL ATRIUM',
    label: 'Islamabad Multi-Tower Complex',
    subLabel: '16-Storey Linked Commercial Podium, Corporate Offices & Margalla-Facing Suites',
    headline: 'Multi-Tower Commercial & Corporate Complex — Islamabad',
    description:
      'Verified domestic high-rise architecture from Towers.pk/Islamabad featuring interconnected commercial atrium levels, landscaped green embankments, vertical retail zones, and panoramic Margalla Hills orientation.',
    valuation: 'Commercial Units from PKR 1.25 Crore',
    locationBadge: 'Gulberg Greens / Islamabad Expressway Corridor',
    focalLength: '22MM WIDE',
    altitude: '16 STOREYS / 225 FT',
    fov: '88° ARCHITECTURAL',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower2_parksideHighriseComplex,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower3_florenceGalleriaPodium,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower7_regentOneDaylightAerial,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower2_parksideHighriseComplex,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower3_florenceGalleriaPodium
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.6%', '0.6%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'eh-spec-1',
        title: '4-Level Commercial Podium & Retail Mall',
        spec: 'High-footfall retail atrium connecting three residential and corporate office towers.'
      },
      {
        id: 'eh-spec-2',
        title: 'Eco-Smart Domestic Engineering',
        spec: 'Solar backup arrays, rainwater harvesting, and German UPVC soundproof fenestration.'
      }
    ]
  },
  {
    id: 'comm-florence-galleria-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'RI8CLICK CONSORTIUM // LUXURY BOUTIQUE MALL & GALLERIA',
    code: 'ISB 04 // GRAND ARCHED PODIUM & COMMERCIAL GALLERIA',
    label: 'Grand Commercial Galleria',
    subLabel: 'Neoclassical Arched Retail Podium, Fine Dining Terrace & Hospitality Suites in Islamabad',
    headline: 'Grand Arched Commercial Galleria & Executive Suites — Islamabad',
    description:
      'Domestic landmark plaza in Islamabad combining a double-height arched stone commercial podium with twin 10-storey luxury hospitality and corporate wings along the main expressway.',
    valuation: 'Retail & Suites from PKR 1.60 Crore',
    locationBadge: 'DHA Phase 2 / Islamabad Expressway',
    focalLength: '24MM PRIME',
    altitude: '12 STOREYS',
    fov: '84° WIDE',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower3_florenceGalleriaPodium,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower6_brandedRetailPlaza,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower2_parksideHighriseComplex,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower3_florenceGalleriaPodium,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower6_brandedRetailPlaza
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.5%', '-0.5%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'fg-spec-1',
        title: 'Double-Height Arched Retail Frontage',
        spec: 'Designed for flagship banks, designer brands, and fine-dining restaurants.'
      },
      {
        id: 'fg-spec-2',
        title: 'Landscaped Podium Roof Terrace',
        spec: 'Open-air courtyard dining and skybridge connecting the upper residential wings.'
      }
    ]
  },
  {
    id: 'comm-branded-retail-plaza-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'RI8CLICK CONSORTIUM // ISLAMABAD & FAISAL HILLS COMMERCIAL HUB',
    code: 'ISB 05 // EXECUTIVE BRANDED RETAIL & CORPORATE PLAZA',
    label: 'Executive Retail & Office Plaza',
    subLabel: 'Double-Height Flagship Brand Showrooms & 6 Corporate Office Floors',
    headline: 'Executive Retail & Corporate Office Tower — Islamabad',
    description:
      'High-visibility domestic commercial plaza hosting international and national retail flagship outlets on the lower podium with 6 storeys of curtain-wall corporate offices above.',
    valuation: 'Shops from PKR 2.20 Cr • Offices from 1.15 Cr',
    locationBadge: 'Blue Area, New Blue Area & Faisal Hills Commercial Broadway',
    focalLength: '20MM ARCHITECTURAL',
    altitude: '10 STOREYS',
    fov: '90° WIDE',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower6_brandedRetailPlaza,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower4_citadel7Twilight,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower5_citadel7Skyline,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower6_brandedRetailPlaza,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower4_citadel7Twilight,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower5_citadel7Skyline,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower1_regentOneNightAerial
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.5%', '0.5%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'brp-spec-1',
        title: 'Triple-Height Commercial Atrium',
        spec: 'Dedicated display windows for anchor fashion brands, cafes, and corporate banks.'
      },
      {
        id: 'brp-spec-2',
        title: 'Ri8click Turnkey UPVC Glazing',
        spec: 'Solar-reflective structural glass facade with high-speed capsule elevators.'
      }
    ]
  },

  // ---------------- PILLAR 2: CONTAINER & CAPSULE SMART HOUSES (ATTACHMENTS 8 TO 14 IN SEQUENCE) ----------------
  {
    id: 'capsule-seq-8-q3',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (01 / 07)',
    code: 'CAPSULE 01 (ATTACHMENT #8) // MODEL Q3 PITCHED-ROOF CABIN POD',
    label: 'Q3 Modular Cabin Pod',
    subLabel: 'Aerodynamic Pitched-Roof Smart Cabin with UPVC French Doors & Panoramic Window',
    headline: 'Model Q3 Pitched-Roof Modular Smart Cabin House',
    description:
      'Attachment #8 in sequence: The Q3 prefabricated modular cabin pod combines a pitched alpine roof profile with curved aviation-grade aluminum panels, matte-black UPVC double-glazed French entry doors, and floor-to-ceiling forest-view glazing.',
    valuation: 'PKR 48 Lakh – 68 Lakh',
    locationBadge: 'Turnkey Delivery: Murree, Nathia Gali, Taxila & Islamabad Farms',
    focalLength: '24MM PRIME',
    altitude: 'FOREST DECK',
    fov: '86° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap8_q3ForestCabinPod,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap9_k5WaterfrontPod,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap14_lakesideCurvedGlassCapsule,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.6%', '0.6%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap8-1',
        title: 'Q3 Pitched-Roof All-Weather Shell',
        spec: 'Engineered for snowfall and mountain rain with polyurethane thermal insulation.'
      },
      {
        id: 'cap8-2',
        title: 'Ri8click UPVC Double-Glazed Framing',
        spec: 'Acoustic Low-E tempered glass windows and integrated composite entrance porch.'
      }
    ]
  },
  {
    id: 'capsule-seq-9-k5',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (02 / 07)',
    code: 'CAPSULE 02 (ATTACHMENT #9) // MODEL K5 PANORAMIC SPACE CAPSULE',
    label: 'K5 Panoramic Space Capsule',
    subLabel: '38-Foot Aerospace Aluminum Pod with Dual 270° Curved Glass Observation Wings',
    headline: 'Model K5 Waterfront Panoramic Space Capsule House',
    description:
      'Attachment #9 in sequence: Flagship K5 space capsule featuring dual 270-degree curved tempered glass observation bays, central biometric security door with integrated steps, and open-air balcony deck.',
    valuation: 'PKR 75 Lakh – 1.05 Crore',
    locationBadge: 'Khanpur Dam, Rawal Lake, Farmhouses & Resorts',
    focalLength: '20MM WIDE',
    altitude: 'WATERFRONT LAWN',
    fov: '92° EXPANSIVE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap9_k5WaterfrontPod,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap10_rooftopDeckContainerVilla,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap8_q3ForestCabinPod,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.6%', '-0.6%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap9-1',
        title: 'Dual 270° Curved Observation Glass',
        spec: 'Solar-tinted Low-E curved safety glass providing privacy and panoramic views.'
      },
      {
        id: 'cap9-2',
        title: 'Crane-Ready Steel Chassis',
        spec: 'Installs on concrete piers in 4 hours without disturbing natural landscaping.'
      }
    ]
  },
  {
    id: 'capsule-seq-10-container-deck',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (03 / 07)',
    code: 'CAPSULE 03 (ATTACHMENT #10) // ROOFTOP DECK CONTAINER VILLA',
    label: 'Rooftop Deck Container Villa',
    subLabel: 'Luxury White Container Home with Wraparound Timber Patio & Upper Sky Lounge',
    headline: 'Luxury Container Villa with Rooftop Terrace & Timber Deck',
    description:
      'Attachment #10 in sequence: Architectural shipping-container residence finished in crisp white thermal coating, featuring full-span sliding UPVC glass walls, a gourmet kitchen island, wraparound hardwood deck, and an upper-level railed rooftop lounge.',
    valuation: 'PKR 52 Lakh – 78 Lakh',
    locationBadge: 'Faisal Hills, Chak Shahzad & B-17 Farm Estates',
    focalLength: '24MM ARCHITECTURAL',
    altitude: '2-LEVEL DECK',
    fov: '86° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap10_rooftopDeckContainerVilla,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap11_hexLitBlackContainerPod,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap9_k5WaterfrontPod,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.6%', '0.6%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap10-1',
        title: 'Upper Rooftop Dining & Sky Terrace',
        spec: 'Reinforced structural roof deck with steel cable railings and outdoor seating.'
      },
      {
        id: 'cap10-2',
        title: 'Full-Width Sliding UPVC Glass Wall',
        spec: 'Seamlessly merges the indoor kitchen and lounge with the outdoor timber patio.'
      }
    ]
  },
  {
    id: 'capsule-seq-11-hex-black',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (04 / 07)',
    code: 'CAPSULE 04 (ATTACHMENT #11) // HEX-LIT DESIGNER CONTAINER POD',
    label: 'Hex-Lit Designer Container Pod',
    subLabel: 'Matte Charcoal Chamfered Container Studio with Warm Architectural Perimeter Lighting',
    headline: 'Chamfered Matte-Black Designer Container Smart Pod',
    description:
      'Attachment #11 in sequence: Ultra-modern chamfered-frame container villa with recessed warm amber perimeter LED lighting, geometric laser-cut backlit feature walls, and frameless panoramic sliding glass.',
    valuation: 'PKR 64 Lakh – 88 Lakh',
    locationBadge: 'Executive Farmhouses, Glamping Resorts & Rooftops',
    focalLength: '22MM WIDE',
    altitude: 'GARDEN PAVILION',
    fov: '88° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap11_hexLitBlackContainerPod,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap12_curvedCornerGlassContainer,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap10_rooftopDeckContainerVilla,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.5%', '-0.5%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap11-1',
        title: 'Chamfered Portal Frame & Warm LED Halo',
        spec: 'Architectural bevelled steel portal with weatherproof outdoor ambiance lighting.'
      },
      {
        id: 'cap11-2',
        title: 'Bespoke Hexagonal Backlit Interior',
        spec: 'Turnkey designer lounge, acoustic ceiling slats, and smart climate automation.'
      }
    ]
  },
  {
    id: 'capsule-seq-12-executive-studio',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (05 / 07)',
    code: 'CAPSULE 05 (ATTACHMENT #12) // CURVED-CORNER EXECUTIVE STUDIO POD',
    label: 'Curved-Corner Studio Container',
    subLabel: 'Minimalist White Container Villa & Executive Office with Rounded UPVC Frames',
    headline: 'Curved-Corner Glass Container Villa & Executive Studio',
    description:
      'Attachment #12 in sequence: Precision-crafted white corrugated container module featuring signature rounded-corner black aluminum/UPVC window frames, linear recessed ceiling lights, and a private executive workspace and lounge.',
    valuation: 'PKR 46 Lakh – 65 Lakh',
    locationBadge: 'Islamabad, Rawalpindi, Taxila & Lahore Delivery',
    focalLength: '24MM PRIME',
    altitude: 'PATIO LEVEL',
    fov: '85° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap12_curvedCornerGlassContainer,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap13_v2124DoubleDeckerCapsule,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap11_hexLitBlackContainerPod,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.5%', '0.5%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap12-1',
        title: 'Rounded-Corner Structural UPVC Glazing',
        spec: 'Dual-aspect floor-to-ceiling glass walls with thermal-break aluminum profiles.'
      },
      {
        id: 'cap12-2',
        title: 'Dual-Use Residence or Corporate Pod',
        spec: 'Ideal as a luxury guest suite, private garden office, or site sales gallery.'
      }
    ]
  },
  {
    id: 'capsule-seq-13-v2124-duplex',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (06 / 07)',
    code: 'CAPSULE 06 (ATTACHMENT #13) // V2124 DOUBLE-DECKER CAPSULE VILLA',
    label: 'V2124 Double-Decker Villa',
    subLabel: 'Two-Story Stacked Curved-Glass Capsule Villa with Upper Master Sky Suite',
    headline: 'Model V2124 Double-Decker Stacked Capsule Villa',
    description:
      'Attachment #13 in sequence: Two-story stacked modular capsule villa offering an expansive ground-floor living and dining pavilion with sliding glass walls and an upper-deck V2124 panoramic master bedroom suite.',
    valuation: 'PKR 1.35 Crore – 1.85 Crore',
    locationBadge: 'Luxury Farmhouses, Hill Resorts & Urban Penthouses',
    focalLength: '20MM ARCHITECTURAL',
    altitude: '2-STORY DUPLEX',
    fov: '90° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap13_v2124DoubleDeckerCapsule,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap14_lakesideCurvedGlassCapsule,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap12_curvedCornerGlassContainer,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.6%', '-0.6%'],
    panY: ['0.3%', '-0.3%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap13-1',
        title: 'Upper-Deck V2124 Panoramic Master Suite',
        spec: 'Second-story curved observation glass suite with warm architectural cove lighting.'
      },
      {
        id: 'cap13-2',
        title: 'Open-Plan Ground Lounge & Kitchen',
        spec: 'Full-span sliding UPVC glass doors opening onto a raised composite timber deck.'
      }
    ]
  },
  {
    id: 'capsule-seq-14-lakeside-pod',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES (07 / 07)',
    code: 'CAPSULE 07 (ATTACHMENT #14) // LAKESIDE CURVED-GLASS CAPSULE POD',
    label: 'Lakeside Panorama Capsule',
    subLabel: 'Curved-Glass Waterfront Capsule Home with Stepping-Stone Path & Patio Deck',
    headline: 'Lakeside Curved-Glass Observation Capsule House',
    description:
      'Attachment #14 in sequence: Waterfront aerodynamic capsule residence featuring wrap-around curved observation glass, operable casement ventilation windows, fluorocarbon aluminum cladding, and a serene lakeside timber deck.',
    valuation: 'PKR 68 Lakh – 96 Lakh',
    locationBadge: 'Lakeside Estates, Resorts & Private Farmhouses',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'LAKESIDE DECK',
    fov: '94° EXPANSIVE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap14_lakesideCurvedGlassCapsule,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap8_q3ForestCabinPod,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.cap9_k5WaterfrontPod,
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.6%', '0.6%'],
    panY: ['0%', '-0.4%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'cap14-1',
        title: 'Seamless Curved Low-E Observation Glass',
        spec: 'Double-glazed thermal and acoustic curved glass with zero condensation.'
      },
      {
        id: 'cap14-2',
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

  // Optical clarity grade (Professional clean look — no gaming glow circles)
  const [atmosphere, setAtmosphere] = useState<AtmosphereGrade>('crystal_daylight');

  // UI Visibility States:
  // Option to remove left-side text description while keeping "Portfolio Deck" visible
  const [showLeftDescription, setShowLeftDescription] = useState(true);
  const [showDirectorDeck, setShowDirectorDeck] = useState(true);
  const [showSpecCards, setShowSpecCards] = useState(true);
  const [showCategoryBar, setShowCategoryBar] = useState(false);
  const [showConsortiumRibbon, setShowConsortiumRibbon] = useState(false);
  const [showShowroomTourBar, setShowShowroomTourBar] = useState(false);
  const [isHudMenuOpen, setIsHudMenuOpen] = useState(false);

  const [videoFailed, setVideoFailed] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [customActiveImageOverride, setCustomActiveImageOverride] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const sanitizeConsortiumText = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/ri8click\s+Group\s+of\s+Companies\s+Consortium/gi, 'Ri8click Consortium')
      .replace(/ri8click\s+Real\s+Estate\s+Consortium\s+Group/gi, 'Ri8click Consortium')
      .replace(/ri8click\s+Group\s+of\s+Companies/gi, 'Ri8click Consortium')
      .replace(/Group\s+of\s+Companies/gi, 'Ri8click Consortium')
      .replace(/Consortium\s+Group/gi, 'Ri8click Consortium');
  };

  // Convert CMS commercial slides into domestic Islamabad waypoints using attached reference images 1-7
  const cmsCommercialWaypoints: CameraWaypoint[] = useMemo(() => {
    const domesticTowerAttachments = [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower1_regentOneNightAerial,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower2_parksideHighriseComplex,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower3_florenceGalleriaPodium,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower4_citadel7Twilight,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower5_citadel7Skyline,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower6_brandedRetailPlaza,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower7_regentOneDaylightAerial
    ];

    return activeSlides
      .filter(s => s.samplePropertyData?.category === 'commercial')
      .map((s, idx) => {
        const domesticImg = domesticTowerAttachments[idx % domesticTowerAttachments.length];
        const secondaryImg = domesticTowerAttachments[(idx + 1) % domesticTowerAttachments.length];

        return {
          id: `cms-wp-${s.id}`,
          tourCategory: 'commercial_plazas' as TourDeckCategory,
          propertyCategory: 'commercial' as PropertyCategory,
          divisionTag: 'RI8CLICK CONSORTIUM // ISLAMABAD COMMERCIAL PLAZAS',
          code: `ISB 0${idx + 6} // ${sanitizeConsortiumText(s.categoryTag || 'COMMERCIAL PLAZA').toUpperCase()}`,
          label: sanitizeConsortiumText(s.title).split(' ').slice(0, 3).join(' '),
          subLabel: sanitizeConsortiumText(
            s.subtitle || 'High-Rise Commercial Plaza, Retail Shops & Corporate Suites'
          ),
          headline: sanitizeConsortiumText(s.title),
          description: sanitizeConsortiumText(s.description || s.subtitle),
          valuation: s.price || 'PKR 3.5 Crore+',
          locationBadge: s.society || s.location || 'Blue Area & Faisal Hills, Islamabad',
          focalLength: '24MM ARCHITECTURAL',
          altitude: 'SKYLINE +18M',
          fov: '86° WIDE',
          imageUrl: domesticImg,
          secondaryImageUrl: secondaryImg,
          fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.tower4_citadel7Twilight,
          galleryImages: domesticTowerAttachments,
          videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
          motionOrigin: 'center center',
          panX: ['-0.6%', '0.6%'] as [string, string],
          panY: ['0%', '-0.5%'] as [string, string],
          scaleRange: [1.01, 1.05] as [number, number],
          specs: [
            {
              id: `cms-spec-${idx}-1`,
              title: s.features?.[0] || 'Double-Glazed UPVC Curtain Wall',
              spec: 'High-visibility domestic commercial frontage with capsule elevators and basement parking.'
            },
            {
              id: `cms-spec-${idx}-2`,
              title: s.features?.[1] || 'High-Yield Commercial Shops & Suites',
              spec: `Located in ${s.society || 'Islamabad prime commercial corridor'} with verified NOC & Ri8click Consortium management.`
            }
          ]
        };
      });
  }, [activeSlides]);

  // Filter waypoints based on selected category; preserve exact 8-to-14 sequence for capsule_containers
  const cameraWaypoints: CameraWaypoint[] = useMemo(() => {
    const combined = [...MASTER_VIRTUAL_TOUR_WAYPOINTS, ...cmsCommercialWaypoints];
    if (tourCategory === 'all_showroom') {
      const commList = combined.filter(w => w.tourCategory === 'commercial_plazas');
      const capList = combined.filter(w => w.tourCategory === 'capsule_containers');
      const propsList = combined.filter(w => w.tourCategory === 'properties_plots_villas');
      const upvcList = combined.filter(w => w.tourCategory === 'upvc_construction');

      const interleaved: CameraWaypoint[] = [];
      const maxLen = Math.max(commList.length, capList.length, propsList.length, upvcList.length);
      for (let i = 0; i < maxLen; i++) {
        if (commList[i]) interleaved.push(commList[i]);
        if (capList[i]) interleaved.push(capList[i]);
        if (propsList[i]) interleaved.push(propsList[i]);
        if (upvcList[i]) interleaved.push(upvcList[i]);
      }
      return interleaved;
    }
    const filtered = combined.filter(wp => wp.tourCategory === tourCategory);
    return filtered.length > 0 ? filtered : MASTER_VIRTUAL_TOUR_WAYPOINTS;
  }, [tourCategory, cmsCommercialWaypoints]);

  const activeWaypoint = cameraWaypoints[waypointIdx] || cameraWaypoints[0];

  // Resolve broken or missing image links automatically through 3 tiers
  const resolveImageWithFallback = (wp: CameraWaypoint): string => {
    if (!failedUrls[wp.imageUrl]) return wp.imageUrl;
    if (wp.secondaryImageUrl && !failedUrls[wp.secondaryImageUrl]) return wp.secondaryImageUrl;
    return wp.fallbackUrl;
  };

  const resolvedImageUrl =
    customActiveImageOverride && !failedUrls[customActiveImageOverride]
      ? customActiveImageOverride
      : resolveImageWithFallback(activeWaypoint);

  const handleImageError = (urlThatFailed: string) => {
    setFailedUrls(prev => {
      if (prev[urlThatFailed]) return prev;
      return { ...prev, [urlThatFailed]: true };
    });
  };

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
      img.src = resolveImageWithFallback(wp);
    });
  }, [waypointIdx, cameraWaypoints, failedUrls]);

  useEffect(() => {
    setWaypointIdx(0);
    setVideoFailed(false);
    setCustomActiveImageOverride(null);
  }, [tourCategory]);

  useEffect(() => {
    setCustomActiveImageOverride(null);
  }, [waypointIdx]);

  // Auto-cycle camera waypoints
  useEffect(() => {
    if (isPaused || isVideoTourActive) return;
    const wpTimer = setInterval(() => {
      setWaypointIdx(prev => (prev + 1) % cameraWaypoints.length);
    }, WAYPOINT_DURATION_MS);
    return () => clearInterval(wpTimer);
  }, [isPaused, isVideoTourActive, cameraWaypoints.length]);

  const handlePrev = () => {
    setWaypointIdx(prev => (prev - 1 + cameraWaypoints.length) % cameraWaypoints.length);
  };

  const handleNext = () => {
    setWaypointIdx(prev => (prev + 1) % cameraWaypoints.length);
  };

  // Ri8click Consortium Categories
  const tourCategories: {
    id: TourDeckCategory;
    label: string;
    shortLabel: string;
    count: number;
    filterCategory: PropertyCategory;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'all_showroom',
      label: 'Ri8click Consortium Portfolio',
      shortLabel: 'Consortium Portfolio',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.length + cmsCommercialWaypoints.length,
      filterCategory: 'all',
      icon: <Compass className="w-3.5 h-3.5" />
    },
    {
      id: 'commercial_plazas',
      label: 'Commercial Plazas (Islamabad)',
      shortLabel: 'Commercial Plazas',
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
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'capsule_containers')
        .length,
      filterCategory: 'modular',
      icon: <Box className="w-3.5 h-3.5" />
    },
    {
      id: 'properties_plots_villas',
      label: 'Properties (Plots & Houses)',
      shortLabel: 'Plots & Houses',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'properties_plots_villas')
        .length,
      filterCategory: 'residential',
      icon: <Home className="w-3.5 h-3.5" />
    },
    {
      id: 'upvc_construction',
      label: 'Ri8click Consortium & UPVC',
      shortLabel: 'UPVC & Construction',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'upvc_construction')
        .length,
      filterCategory: 'projects',
      icon: <Layers className="w-3.5 h-3.5" />
    }
  ];

  const consortiumPillars = [
    {
      id: 'commercial_plazas' as TourDeckCategory,
      category: 'commercial' as PropertyCategory,
      title: 'Islamabad Commercial Plazas',
      detail: 'Citadel 7, Regent One, Multi-Tower & Blue Area Plazas',
      icon: Building2,
      accent: 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10'
    },
    {
      id: 'capsule_containers' as TourDeckCategory,
      category: 'modular' as PropertyCategory,
      title: 'Container Capsule Houses',
      detail: 'Q3, K5, V2124 Duplex & Curved Glass Container Pods',
      icon: Box,
      accent: 'text-amber-300 border-amber-400/30 bg-amber-500/10'
    },
    {
      id: 'properties_plots_villas' as TourDeckCategory,
      category: 'residential' as PropertyCategory,
      title: 'Properties: Plots & Houses',
      detail: '5M, 10M, 1-2 Kanal Plots & Constructed Villas',
      icon: Home,
      accent: 'text-sky-300 border-sky-400/30 bg-sky-500/10'
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

  // Clean professional optical grades (zero gaming glow)
  const atmosphereStyle: React.CSSProperties = useMemo(() => {
    const baseFilter =
      atmosphere === 'crystal_daylight'
        ? 'brightness(1.04) contrast(1.06) saturate(1.06)'
        : atmosphere === 'solar_vivid'
        ? 'brightness(1.08) contrast(1.08) saturate(1.12)'
        : 'brightness(1.03) contrast(1.10) saturate(1.08)';

    return {
      filter: baseFilter
    };
  }, [atmosphere]);

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
    <section className="relative w-full overflow-hidden bg-slate-950 text-white select-none border-b border-slate-800">
      {/* =====================================================================
          1. PROFESSIONAL ARCHITECTURAL STAGE & IMAGE / VIDEO CANVAS
             (No gaming glow circles, no radar crosshairs, no watermark badge)
         ===================================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        {/* Subtle static underlay so transitions never flash dark */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105 transition-all duration-700"
          style={{ backgroundImage: `url(${resolvedImageUrl})` }}
        />

        <AnimatePresence initial={false} mode="sync">
          {isVideoTourActive && !videoFailed ? (
            <motion.div
              key={`video-reel-${activeWaypoint.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
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
                style={atmosphereStyle}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`${activeWaypoint.id}-${resolvedImageUrl}`}
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
                onError={() => handleImageError(resolvedImageUrl)}
                style={{
                  ...atmosphereStyle,
                  imageRendering: 'high-quality' as any
                }}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clean Executive Gradient Scrims — Lighter when Left Description is hidden so full image shines */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isCinemaTheaterMode || !showLeftDescription
              ? 'bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/25'
              : 'bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/25 pointer-events-none" />
      </div>

      {/* =====================================================================
          2. OPTIONAL CATEGORY BAR
         ===================================================================== */}
      <AnimatePresence>
        {showCategoryBar && !isCinemaTheaterMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative z-30 border-b border-white/15 bg-slate-950/70 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
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
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-white/5 text-white border-white/15 hover:bg-white/15'
                      }`}
                    >
                      {cat.icon}
                      <span className="hidden xl:inline">{cat.label}</span>
                      <span className="xl:hidden">{cat.shortLabel}</span>
                      <span
                        className={`ml-0.5 px-1.5 py-0.2 rounded text-[9px] font-black ${
                          isSelected ? 'bg-slate-950 text-amber-300' : 'bg-white/15 text-white'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowCategoryBar(false)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <span>Hide Bar</span>
                <ChevronUp className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          3. OPTIONAL CAMERA WAYPOINTS BAR
         ===================================================================== */}
      <AnimatePresence>
        {showShowroomTourBar && !isCinemaTheaterMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="relative z-20 border-b border-white/15 bg-slate-900/70 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => setIsVideoTourActive(prev => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                    isVideoTourActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-white/10 hover:bg-white/15 text-amber-200 border-white/20'
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>{isVideoTourActive ? 'Video Active' : 'Play Video'}</span>
                </button>

                <div className="h-4 w-[1px] bg-white/20 mx-0.5 shrink-0" />

                {cameraWaypoints.map((wp, idx) => {
                  const isSelected = !isVideoTourActive && waypointIdx === idx;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => {
                        setIsVideoTourActive(false);
                        setWaypointIdx(idx);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-left transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-white text-slate-950 border-white font-bold'
                          : 'bg-white/5 text-white/90 border-white/15 hover:bg-white/15'
                      }`}
                    >
                      <Camera
                        className={`w-3 h-3 ${isSelected ? 'text-amber-600' : 'text-amber-300'}`}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}. {wp.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowShowroomTourBar(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all cursor-pointer shrink-0"
                title="Hide Tour Bar"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          4. MAIN FOREGROUND STAGE & CRYSTAL TRANSPARENT PORTFOLIO DECK
         ===================================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 min-h-[540px] sm:min-h-[610px] flex flex-col justify-between">
        {/* Top Executive Header Utility Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-semibold text-slate-100 shadow-sm">
            <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Ri8click Consortium • Domestic Islamabad Towers & Modular Living</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-auto">
            {/* Direct Quick Button: Toggle Left-Side Text Description while keeping Portfolio Deck visible */}
            <button
              type="button"
              onClick={() => {
                setShowLeftDescription(prev => !prev);
                if (!showDirectorDeck) setShowDirectorDeck(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer backdrop-blur-xl ${
                !showLeftDescription
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
              title="Toggle Left-Side Text Description while keeping Portfolio Deck visible"
            >
              {showLeftDescription ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-300" />
                  <span>Hide Description</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Show Description</span>
                </>
              )}
            </button>

            {/* Video Tour Toggle */}
            <button
              type="button"
              onClick={() => setIsVideoTourActive(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer backdrop-blur-xl ${
                isVideoTourActive
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-white/10 text-slate-100 border-white/20 hover:bg-white/20'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isVideoTourActive ? 'Video: ON' : 'Video Walkthrough'}</span>
            </button>

            {isVideoTourActive && (
              <button
                type="button"
                onClick={() => setIsMuted(prev => !prev)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                )}
              </button>
            )}

            {/* View Controls Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsHudMenuOpen(prev => !prev)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xl ${
                  isHudMenuOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Controls</span>
              </button>

              <AnimatePresence>
                {isHudMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-950/85 backdrop-blur-2xl border border-white/25 p-4 shadow-2xl z-50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/15">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                        Banner Display Controls
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsHudMenuOpen(false)}
                        className="text-[10px] text-slate-300 hover:text-white cursor-pointer"
                      >
                        Done
                      </button>
                    </div>

                    <div className="py-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Daylight Grade
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(
                          [
                            { id: 'crystal_daylight', label: 'Natural' },
                            { id: 'solar_vivid', label: 'Vivid' },
                            { id: 'showroom_hdr', label: 'Crisp HDR' }
                          ] as { id: AtmosphereGrade; label: string }[]
                        ).map(grade => (
                          <button
                            key={grade.id}
                            type="button"
                            onClick={() => setAtmosphere(grade.id)}
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-center border transition-all cursor-pointer ${
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
                        label="Left-Side Text Description"
                        description="Show/hide left narrative while keeping Portfolio Deck"
                        checked={showLeftDescription}
                        onChange={() => setShowLeftDescription(prev => !prev)}
                      />
                      <ToggleSwitch
                        label="Portfolio Deck (Crystal Panel)"
                        description="Right-hand transparent project navigator"
                        checked={showDirectorDeck}
                        onChange={() => setShowDirectorDeck(prev => !prev)}
                      />
                      <ToggleSwitch
                        label="Architectural Spec Badges"
                        description="Key engineering & project highlights"
                        checked={showSpecCards}
                        onChange={() => setShowSpecCards(prev => !prev)}
                      />
                      <ToggleSwitch
                        label="Ri8click Consortium Pillars Bar"
                        description="Show 4 business pillars ribbon"
                        checked={showConsortiumRibbon}
                        onChange={() => setShowConsortiumRibbon(prev => !prev)}
                      />
                      <ToggleSwitch
                        label="Category Filter Bar"
                        description="Show top category filter buttons"
                        checked={showCategoryBar}
                        onChange={() => setShowCategoryBar(prev => !prev)}
                      />
                      <ToggleSwitch
                        label="Camera Waypoints Bar"
                        description="Show top camera waypoint switcher"
                        checked={showShowroomTourBar}
                        onChange={() => setShowShowroomTourBar(prev => !prev)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clean View Toggle */}
            <button
              type="button"
              onClick={() => setIsCinemaTheaterMode(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xl ${
                isCinemaTheaterMode
                  ? 'bg-white text-slate-950 border-white'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title="Toggle Clean Architectural View"
            >
              {isCinemaTheaterMode ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">
                {isCinemaTheaterMode ? 'Standard View' : 'Clean View'}
              </span>
            </button>
          </div>
        </div>

        {/* OPTIONAL RI8CLICK CONSORTIUM PILLARS RIBBON */}
        <AnimatePresence>
          {showConsortiumRibbon && !isCinemaTheaterMode && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4"
            >
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/25 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                      Ri8click Consortium
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-white/95">
                      Integrated Real Estate, Islamabad Plazas, Turnkey Construction, Capsule Homes &amp; German UPVC
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConsortiumRibbon(false)}
                    className="text-[10px] font-bold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
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
                        className={`group p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isActivePillar
                            ? 'bg-white/20 border-amber-300'
                            : 'bg-white/5 border-white/15 hover:bg-white/15'
                        }`}
                      >
                        <div className={`p-2 rounded-lg border shrink-0 ${pillar.accent}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-white group-hover:text-amber-300 transition-colors truncate">
                            {pillar.title}
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

        {/* Center Main Content & Crystal Transparent Portfolio Deck */}
        <AnimatePresence mode="wait">
          {!isCinemaTheaterMode ? (
            <motion.div
              key="foreground-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-3"
            >
              {/* Left Column: Architectural Narrative & Actions (Can be hidden while keeping Portfolio Deck) */}
              {showLeftDescription && (
                <div className={showDirectorDeck ? 'lg:col-span-7' : 'lg:col-span-11'}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeWaypoint.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-3.5"
                    >
                      {/* Division & Location Badges (Removed "Watermark Verified" badge as requested) */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black tracking-wider uppercase bg-amber-400 text-slate-950 shadow-sm">
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                          <span>{activeWaypoint.divisionTag}</span>
                        </span>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white/10 backdrop-blur-xl text-white border border-white/25">
                          <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <span>{activeWaypoint.locationBadge}</span>
                        </div>
                      </div>

                      {/* Headline */}
                      <h1 className="text-3xl sm:text-5xl lg:text-[44px] font-black tracking-tight text-white leading-[1.1] font-serif drop-shadow-sm">
                        {activeWaypoint.headline}
                      </h1>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-slate-100 max-w-2xl leading-relaxed font-medium drop-shadow-xs">
                        {activeWaypoint.description}
                      </p>

                      {/* Clean Architectural Specification Cards */}
                      {showSpecCards && activeWaypoint.specs.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 max-w-2xl">
                          {activeWaypoint.specs.map(item => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-start gap-2.5"
                            >
                              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-xs font-bold text-white">{item.title}</div>
                                <div className="text-[11px] text-slate-200 leading-snug mt-0.5">
                                  {item.spec}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Valuation Pill & Multi-Angle Sub-Gallery */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-amber-400/50">
                          <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                            Valuation / Price
                          </span>
                          <span className="text-base sm:text-lg font-black text-white">
                            {activeWaypoint.valuation}
                          </span>
                        </div>

                        {activeWaypoint.galleryImages && activeWaypoint.galleryImages.length > 1 && (
                          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl p-1.5 rounded-xl border border-white/20">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200 px-1.5">
                              Views:
                            </span>
                            {activeWaypoint.galleryImages.map((imgUrl, gIdx) => {
                              if (failedUrls[imgUrl]) return null;
                              const isCurrentView = resolvedImageUrl === imgUrl;
                              return (
                                <button
                                  key={gIdx}
                                  type="button"
                                  onClick={() => setCustomActiveImageOverride(imgUrl)}
                                  className={`w-9 h-7 rounded-md overflow-hidden border transition-all cursor-pointer shrink-0 ${
                                    isCurrentView
                                      ? 'border-amber-400 ring-2 ring-amber-400/60'
                                      : 'border-white/30 hover:border-amber-400'
                                  }`}
                                  title={`Switch to View ${gIdx + 1}`}
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`View ${gIdx + 1}`}
                                    onError={() => handleImageError(imgUrl)}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

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
                                city: 'Islamabad / Taxila',
                                society: activeWaypoint.locationBadge,
                                province: 'Islamabad Capital Territory'
                              },
                              images: activeWaypoint.galleryImages || [resolvedImageUrl],
                              virtualTourVideoUrl: activeWaypoint.videoUrl,
                              virtualTourVideoTitle: `${activeWaypoint.headline} - Ri8click Consortium Walkthrough`
                            })
                          }
                          className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                        >
                          <Compass className="w-4 h-4" />
                          <span>Launch 360° Virtual Walkthrough</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={onExploreClick}
                          className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white hover:text-slate-950 text-white border border-white/30 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 backdrop-blur-xl transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-amber-300" />
                          <span>Explore Listings</span>
                        </button>

                        <button
                          type="button"
                          onClick={onContactAgentClick}
                          className="px-4 py-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-400/50 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span>Ri8click Consortium Inquiry</span>
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {/* Right Column: CRYSTAL TRANSPARENT PORTFOLIO DECK */}
              {showDirectorDeck && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`${
                    showLeftDescription ? 'lg:col-span-5' : 'lg:col-span-6 lg:col-start-7'
                  } bg-white/[0.08] backdrop-blur-2xl rounded-3xl border border-white/25 p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] ring-1 ring-white/15 space-y-3.5 transition-all`}
                >
                  {/* Panel Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-3">
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <span>Portfolio Deck</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/15 border border-white/25 text-[9px] text-amber-300 font-bold">
                          Crystal View
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-200 font-semibold mt-0.5">
                        Islamabad Plazas (1–7) • Capsule Pods (8–14) • Villas
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowLeftDescription(prev => !prev)}
                        className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-[10px] font-bold text-white cursor-pointer transition-colors"
                        title={
                          showLeftDescription
                            ? 'Hide Left Text Description'
                            : 'Show Left Text Description'
                        }
                      >
                        {showLeftDescription ? 'Hide Text' : 'Show Text'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsVideoTourActive(prev => !prev)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all border ${
                          isVideoTourActive
                            ? 'bg-amber-400 text-slate-950 border-amber-300'
                            : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                        }`}
                      >
                        {isVideoTourActive ? 'Photos' : 'Video'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDirectorDeck(false)}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] font-bold text-slate-200 hover:text-white cursor-pointer"
                        title="Minimize Portfolio Deck"
                      >
                        Hide
                      </button>
                    </div>
                  </div>

                  {/* Crystal Category Tabs */}
                  <div className="grid grid-cols-5 gap-1 bg-slate-950/35 backdrop-blur-md p-1 rounded-xl border border-white/20">
                    {(
                      [
                        { id: 'all_showroom', label: 'All' },
                        { id: 'commercial_plazas', label: 'Plazas' },
                        { id: 'capsule_containers', label: 'Capsules' },
                        { id: 'properties_plots_villas', label: 'Plots/Villas' },
                        { id: 'upvc_construction', label: 'UPVC' }
                      ] as { id: TourDeckCategory; label: string }[]
                    ).map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTourCategory(tab.id)}
                        className={`py-1.5 px-1.5 rounded-lg text-[9.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer truncate ${
                          tourCategory === tab.id
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'text-white/90 hover:text-white hover:bg-white/15'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Interactive Thumbnail Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin">
                    {cameraWaypoints.map((wp, idx) => {
                      const active = waypointIdx === idx;
                      const thumbSrc = resolveImageWithFallback(wp);
                      return (
                        <button
                          key={wp.id}
                          type="button"
                          onClick={() => {
                            setIsVideoTourActive(false);
                            setWaypointIdx(idx);
                          }}
                          className={`group relative rounded-xl overflow-hidden border text-left transition-all cursor-pointer h-20 ${
                            active
                              ? 'border-amber-400 ring-2 ring-amber-400/60 shadow-md'
                              : 'border-white/25 opacity-90 hover:opacity-100 hover:border-white/60'
                          }`}
                        >
                          <img
                            src={thumbSrc}
                            alt={wp.label}
                            loading="lazy"
                            onError={() => handleImageError(thumbSrc)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
                          <div className="absolute top-1 left-1.5 px-1.5 py-0.2 rounded bg-slate-950/70 backdrop-blur-xs text-[8px] font-mono font-bold text-amber-300 border border-white/20">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </div>
                          <div className="absolute bottom-1 left-1.5 right-1.5">
                            <div className="text-[10px] font-extrabold text-white truncate leading-tight drop-shadow-xs">
                              {wp.label}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Compact Active Item Summary when Left Text Description is hidden */}
                  {!showLeftDescription && (
                    <div className="p-3 rounded-2xl bg-slate-950/40 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider truncate">
                          {activeWaypoint.locationBadge}
                        </div>
                        <div className="text-xs font-extrabold text-white truncate">
                          {activeWaypoint.headline}
                        </div>
                        <div className="text-[11px] font-bold text-emerald-300">
                          {activeWaypoint.valuation}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onExploreClick}
                        className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0 cursor-pointer"
                      >
                        Explore
                      </button>
                    </div>
                  )}

                  {/* Panel Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[11px]">
                    <div className="flex items-center gap-1.5 text-white/90">
                      <Info className="w-3.5 h-3.5 text-amber-300" />
                      <span>Towers.pk Islamabad &amp; Capsule Pods</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTourCategory('commercial_plazas');
                          onSelectCategoryFilter('commercial');
                        }}
                        className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
                      >
                        Plazas
                      </button>
                      <span className="text-white/40">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setTourCategory('capsule_containers');
                          onSelectCategoryFilter('modular');
                        }}
                        className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
                      >
                        Capsules
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Clean View Minimal Card */
            <motion.div
              key="clean-view-hud"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="my-auto flex items-end justify-between"
            >
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/25 max-w-md shadow-2xl">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block">
                  {activeWaypoint.code}
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  {activeWaypoint.headline}
                </h2>
                <p className="text-xs text-slate-100 mt-1">{activeWaypoint.subLabel}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================
            5. BOTTOM TIMELINE & SLIDE NAVIGATION CONTROLS
           =================================================================== */}
        <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Waypoint Progress Scrubber */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
            {cameraWaypoints.map((wp, idx) => {
              const isCurrent = waypointIdx === idx;
              return (
                <button
                  key={wp.id}
                  type="button"
                  onClick={() => {
                    setIsVideoTourActive(false);
                    setWaypointIdx(idx);
                  }}
                  className="group flex flex-col gap-1 text-left cursor-pointer shrink-0"
                  title={`${wp.label} — ${wp.subLabel}`}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] font-mono font-bold transition-colors ${
                        isCurrent
                          ? 'text-amber-300'
                          : 'text-white/60 group-hover:text-white/90'
                      }`}
                    >
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold truncate max-w-[105px] transition-colors ${
                        isCurrent ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                      }`}
                    >
                      {wp.label}
                    </span>
                  </div>
                  <div className="w-16 sm:w-20 h-1 rounded-full bg-white/20 overflow-hidden">
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

          {/* Previous / Pause / Next Controls */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {!showLeftDescription && (
              <button
                type="button"
                onClick={() => setShowLeftDescription(true)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/25 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>Show Description</span>
              </button>
            )}

            {!showDirectorDeck && (
              <button
                type="button"
                onClick={() => setShowDirectorDeck(true)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl text-amber-300 border border-white/25 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Show Portfolio Deck</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 backdrop-blur-xl text-white border border-white/25 transition-all cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused(prev => !prev)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/25 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-300" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 backdrop-blur-xl text-white border border-white/25 transition-all cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
