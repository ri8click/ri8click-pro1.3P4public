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
  Info
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
// 1. VERIFIED DOMESTIC COMMERCIAL TOWERS (TOWERS.PK/ISLAMABAD + ATTACHED ASSETS)
// ============================================================================

export const ISLAMABAD_DOMESTIC_TOWERS_GALLERY = {
  // Attached Reference Images: Citadel 7 (Blue Area, Jinnah Avenue, Islamabad)
  citadel7_nightElevation: 'https://www.genspark.ai/api/files/s/5pSqZ7Q4',
  citadel7_podiumLookup: 'https://www.genspark.ai/api/files/s/J81GM3Ue',
  citadel7_daylightTower: 'https://www.genspark.ai/api/files/s/xME9HQHe',
  citadel7_realSiteDrone: 'https://www.genspark.ai/api/files/s/lEF4t1rs',

  // Attached Reference Images: J7 Emporium (Sector B-17 Multi Gardens, Islamabad)
  j7Emporium_boulevardView: 'https://www.genspark.ai/api/files/s/oJkK6Tiq',
  j7Emporium_skybridgeElevation: 'https://www.genspark.ai/api/files/s/q82Lhceq',
  j7Emporium_cornerPerspective: 'https://www.genspark.ai/api/files/s/dy5c0Eqs',

  // Attached Reference Image: Executive Glass Podium & Corporate Office Tower
  executiveCommercialTower: 'https://www.genspark.ai/api/files/s/KOmaR4pY',

  // Verified Towers.pk/Islamabad Domestic High-Rise Assets
  towersPk_citadel7: 'https://towers.pk/wp-content/uploads/2023/11/citadel-7.webp',
  towersPk_emporium: 'https://towers.pk/wp-content/uploads/2024/02/2021-06-18-02-02-33-5655-1623981753_960x718.5_91.webp',
  towersPk_centaurus: 'https://towers.pk/wp-content/uploads/2023/11/Centaurus_Mall-1.webp',
  towersPk_mallOfIslamabad: 'https://towers.pk/wp-content/uploads/2025/09/Mall-of-Islamabad-1.jpg',
  towersPk_gigaMall: 'https://towers.pk/wp-content/uploads/2025/04/giga-mall-islamabad.jpg',
  towersPk_skyparkOne: 'https://towers.pk/wp-content/uploads/2024/06/Skypark-One.jpg',
  towersPk_ufoneTower: 'https://towers.pk/wp-content/uploads/2025/01/ufone-tower-islamabad-scaled.jpeg',
  towersPk_iseTower: 'https://towers.pk/wp-content/uploads/2023/08/ise-tower-islamabad.jpg',
  towersPk_navalAnchorage: 'https://towers.pk/wp-content/uploads/2026/07/Naval-anchorage-phase2-islamabad.png'
};

export const MODULAR_CAPSULE_GALLERY = {
  cap1_lakesidePanoramaPod:
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=2400&q=95',
  cap2_doubleDeckerV2124Pod:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=95',
  cap3_forestCabinPod:
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=2400&q=95'
};

export const CONSTRUCTED_HOUSES_GALLERY = {
  house1_whiteSupercarVilla: 'https://www.genspark.ai/api/files/s/YZr3409c',
  house2_charcoalGarageVilla: 'https://www.genspark.ai/api/files/s/7QO0W212',
  house3_stoneGlassMansion: 'https://www.genspark.ai/api/files/s/G0HfpG8n',
  house4_whitePillaredEstate: 'https://www.genspark.ai/api/files/s/oARmbiwI'
};

export const UPVC_AND_INTERIOR_GALLERY = {
  upvc1_glassRoofConservatory:
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2400&q=95',
  upvc2_woodSlatTvPartition:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=95'
};

const UHD_ARCHITECTURAL_BACKUPS = {
  commercialCitadel: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_daylightTower,
  commercialEmporium: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.j7Emporium_boulevardView,
  commercialExecutive: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.executiveCommercialTower,
  commercialCentaurus: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_centaurus,
  villaWhite:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=95',
  villaModern:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95',
  villaTwilight:
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=95',
  capsuleLakeside: MODULAR_CAPSULE_GALLERY.cap1_lakesidePanoramaPod,
  capsuleDoubleDecker: MODULAR_CAPSULE_GALLERY.cap2_doubleDeckerV2124Pod,
  upvcCurtainWall: UPVC_AND_INTERIOR_GALLERY.upvc1_glassRoofConservatory
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
// 2. MASTER WAYPOINTS COVERING ALL RI8CLICK CONSORTIUM PILLARS
// ============================================================================

const MASTER_VIRTUAL_TOUR_WAYPOINTS: CameraWaypoint[] = [
  // ---------------- PILLAR 1: COMMERCIAL PLAZAS (REAL DOMESTIC ISLAMABAD TOWERS) ----------------
  {
    id: 'comm-citadel-7-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'RI8CLICK CONSORTIUM // ISLAMABAD COMMERCIAL PLAZAS & TOWERS',
    code: 'ISB 01 // CITADEL 7 BLUE AREA ISLAMABAD',
    label: 'Citadel 7 Blue Area',
    subLabel: '20-Storey CDA Approved Corporate & Retail Tower on Jinnah Avenue, Islamabad',
    headline: 'Citadel 7 Corporate & Retail Tower — Blue Area, Islamabad',
    description:
      'Featured on Towers.pk/Islamabad: Citadel 7 by Chakor Ventures rises 20 storeys (345,000 Sq. Ft.) on Main Jinnah Avenue, Blue Area, Islamabad. Comprising 4 basement parking levels, a 5-floor luxury retail mall, and 14 floors of Margalla-facing corporate office suites.',
    valuation: 'PKR 1.85 Crore – 14.5 Crore',
    locationBadge: 'Plot 7, Jinnah Avenue, Blue Area, Islamabad',
    focalLength: '24MM ARCHITECTURAL',
    altitude: '272 FT SKYLINE',
    fov: '85° WIDE',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_nightElevation,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_daylightTower,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_citadel7,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_nightElevation,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_podiumLookup,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_daylightTower,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_realSiteDrone
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.8%', '0.8%'],
    panY: ['0%', '-0.8%'],
    scaleRange: [1.01, 1.06],
    specs: [
      {
        id: 'c7-spec-1',
        title: '5-Storey Retail Mall & 14 Corporate Floors',
        spec: '345,000 Sq. Ft. CDA-approved commercial skyscraper with double-glazed thermal facade.'
      },
      {
        id: 'c7-spec-2',
        title: 'Live On-Ground Construction Progress',
        spec: 'Structural grey-frame and curtain-wall glazing actively progressing on Main Jinnah Avenue.'
      }
    ]
  },
  {
    id: 'comm-citadel-7-site-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'RI8CLICK CONSORTIUM // VERIFIED DOMESTIC SITE PROGRESS',
    code: 'ISB 02 // CITADEL 7 DRONE & PODIUM VIEW',
    label: 'Citadel 7 Real Site & Podium',
    subLabel: 'On-Ground Curtain Wall Glazing & Podium Retail Frontage on Jinnah Avenue',
    headline: 'Real Domestic High-Rise Development — Jinnah Avenue Blue Area',
    description:
      'Authentic domestic commercial development in Islamabad with zero virtual placeholders. Direct frontage along the Metro Bus corridor and Jinnah Avenue, offering high-yield retail outlets, corporate floor plates, and 4-level underground parking.',
    valuation: 'Shops from PKR 3.15 Cr • Offices from 2.45 Cr',
    locationBadge: 'G-7 / F-7 Blue Area, Islamabad (Towers.pk Verified)',
    focalLength: '28MM DRONE',
    altitude: '20 STOREYS',
    fov: '80° STANDARD',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_realSiteDrone,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_podiumLookup,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_daylightTower,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_realSiteDrone,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_podiumLookup,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_daylightTower
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.8%', '-0.8%'],
    panY: ['-0.5%', '0.5%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'c7s-spec-1',
        title: 'Real Domestic Structure & Glazing',
        spec: 'Full-height structural glass facade overlooking Margalla Hills and Blue Area.'
      },
      {
        id: 'c7s-spec-2',
        title: 'High Rental Yield Corporate Hub',
        spec: 'Positioned beside ISE Tower, Ufone Tower, and The Centaurus on Jinnah Avenue.'
      }
    ]
  },
  {
    id: 'comm-j7-emporium-isb',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'RI8CLICK CONSORTIUM // MULTI GARDENS B-17 & GT ROAD CORRIDOR',
    code: 'ISB 03 // J7 EMPORIUM MALL & RESIDENCIA',
    label: 'J7 Emporium Islamabad',
    subLabel: '30-Storey Iconic Mega Mall, Skybridge Suites & Corporate Tower in Sector B-17',
    headline: 'J7 Emporium Commercial Mall & High-Rise Tower — Islamabad',
    description:
      'Listed on Towers.pk/Islamabad: J7 Emporium in Sector B-17 Multi Gardens (adjacent to GT Road & M-1 C-18 Interchange) spans 46 Kanals with a sculpted commercial podium mall, skybridge corporate offices, and luxury serviced hotel suites.',
    valuation: 'Commercial Shops & Suites from PKR 85 Lakh',
    locationBadge: 'Sector B-17 Multi Gardens, Islamabad / Taxila Link',
    focalLength: '20MM WIDE',
    altitude: '30 STOREYS / 361 FT',
    fov: '90° ARCHITECTURAL',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.j7Emporium_boulevardView,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.j7Emporium_cornerPerspective,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_emporium,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.j7Emporium_boulevardView,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.j7Emporium_skybridgeElevation,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.j7Emporium_cornerPerspective
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.8%', '0.8%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.01, 1.06],
    specs: [
      {
        id: 'j7-spec-1',
        title: 'Cantilevered Skybridge & Multi-Story Atrium',
        spec: 'Distinctive angular podium mall hosting national retail brands, multiplex, and food court.'
      },
      {
        id: 'j7-spec-2',
        title: 'Strategic Islamabad–Taxila Gateway',
        spec: 'Direct connectivity to Faisal Hills, Taxila GT Road, and M-1 Motorway.'
      }
    ]
  },
  {
    id: 'comm-islamabad-skyline-plazas',
    tourCategory: 'commercial_plazas',
    propertyCategory: 'commercial',
    divisionTag: 'RI8CLICK CONSORTIUM // ISLAMABAD & FAISAL HILLS COMMERCIAL HUB',
    code: 'ISB 04 // SKYPARK ONE, GIGA MALL & BLUE AREA PLAZAS',
    label: 'Executive Commercial Tower',
    subLabel: 'High-Footfall Retail Plazas, Corporate Suites & Towers.pk Verified Landmarks',
    headline: 'Executive Commercial Plazas — Blue Area, Gulberg & Faisal Hills',
    description:
      'Ri8click Consortium markets and constructs high-ROI domestic commercial plazas across Islamabad (Blue Area, Gulberg Greens Skypark One, DHA Giga Mall corridor) and Faisal Hills Commercial Broadway—engineered with acoustic UPVC facades and capsule elevators.',
    valuation: 'Plazas & Retail Units from PKR 1.50 Crore',
    locationBadge: 'Islamabad Blue Area, Gulberg Greens & Faisal Hills',
    focalLength: '24MM PRIME',
    altitude: 'COMMERCIAL PODIUM',
    fov: '84° WIDE',
    imageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.executiveCommercialTower,
    secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_skyparkOne,
    fallbackUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_centaurus,
    galleryImages: [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.executiveCommercialTower,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_skyparkOne,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_gigaMall,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_mallOfIslamabad
    ],
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0.6%', '-0.6%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.01, 1.05],
    specs: [
      {
        id: 'isp-spec-1',
        title: 'Towers.pk Islamabad Verified Portfolio',
        spec: 'Includes Skypark One (Gulberg Greens), Mall of Islamabad (Blue Area), and Giga Mall (DHA).'
      },
      {
        id: 'isp-spec-2',
        title: 'Ri8click Consortium Turnkey Engineering',
        spec: 'German UPVC double-glazed curtain walls, HVAC climate control, and dedicated basement parking.'
      }
    ]
  },

  // ---------------- PILLAR 2: PROPERTIES (PLOTS & CONSTRUCTED HOUSES) ----------------
  {
    id: 'prop-wp-1',
    tourCategory: 'properties_plots_villas',
    propertyCategory: 'residential',
    divisionTag: 'RI8CLICK CONSORTIUM // PLOTS & CONSTRUCTED HOUSES',
    code: 'PROP 01 // CONSTRUCTED VILLA & PLOTS',
    label: 'Cantilevered Designer Villa',
    subLabel: '1-Kanal Constructed House & Possession Plots in Faisal Hills',
    headline: 'Constructed Signature Villas & Prime Residential Plots',
    description:
      'Ri8click Consortium offers 100% watermark-verified Residential & Commercial Plots (5 Marla, 10 Marla, 1 & 2 Kanal) alongside architect-constructed luxury houses in Faisal Hills, Kohistan Enclave, Multi Gardens B-17, and DHA Islamabad.',
    valuation: 'Plots from PKR 45L • Villas 6.85 Cr+',
    locationBadge: 'Faisal Hills Executive, Taxila & Islamabad',
    focalLength: '24MM PRIME',
    altitude: 'ELEVATION +4.2M',
    fov: '84° WIDE',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house1_whiteSupercarVilla,
    secondaryImageUrl: CONSTRUCTED_HOUSES_GALLERY.house3_stoneGlassMansion,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.villaWhite,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'center center',
    panX: ['0%', '-1.2%'],
    panY: ['0%', '-0.8%'],
    scaleRange: [1.01, 1.06],
    specs: [
      {
        id: 'p1-1',
        title: 'Turnkey Constructed Residence',
        spec: 'A+ grade seismic RCC structure with cantilevered sky terraces.'
      },
      {
        id: 'p1-2',
        title: 'Ri8click Consortium UPVC Glazing',
        spec: 'Double-glazed German profile UPVC windows & sliding doors.'
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
    secondaryImageUrl: CONSTRUCTED_HOUSES_GALLERY.house2_charcoalGarageVilla,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.villaTwilight,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'left center',
    panX: ['-1.0%', '1.0%'],
    panY: ['0.4%', '-0.5%'],
    scaleRange: [1.05, 1.01],
    specs: [
      {
        id: 'p2-1',
        title: '24-Foot Corner Glass Atrium',
        spec: 'Seamless structural UPVC & silicone glazing overlooking Margalla Hills.'
      },
      {
        id: 'p2-2',
        title: 'Subterranean 3-Car Parking',
        spec: 'Climate-controlled lower-ground parking & servant quarters.'
      }
    ]
  },

  // ---------------- PILLAR 3: CONTAINER & CAPSULE SMART HOUSES ----------------
  {
    id: 'capsule-wp-1',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES',
    code: 'CAPSULE 01 // LAKESIDE CURVED GLASS POD',
    label: 'Lakeside Panorama Capsule',
    subLabel: '270° Curved Thermal Glass, UPVC Seals & Timber Patio Deck',
    headline: 'Panoramic Curved-Glass Container Capsule House',
    description:
      'Engineered by Ri8click Consortium: aerodynamic space capsule house featuring 270-degree curved tempered Low-E observation glass, fluorocarbon aviation aluminum shell, smart IoT climate automation, and rapid crane installation.',
    valuation: 'PKR 58 Lakh – 98 Lakh',
    locationBadge: 'Turnkey Nationwide Delivery (Farms, Lakes & Hills)',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'WATERFRONT DECK',
    fov: '96° EXPANSIVE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap1_lakesidePanoramaPod,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap2_doubleDeckerV2124Pod,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleLakeside,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-1.0%', '1.0%'],
    panY: ['0%', '-0.6%'],
    scaleRange: [1.01, 1.06],
    specs: [
      {
        id: 'c1-1',
        title: '270° Curved Low-E Observation Glass',
        spec: 'Double-glazed thermal & acoustic curved glass with zero condensation.'
      },
      {
        id: 'c1-2',
        title: 'Smart Biometric Entry & UPVC Seal',
        spec: 'Weatherproof marine-grade gasket sealing with keyless smart lock.'
      }
    ]
  },
  {
    id: 'capsule-wp-2',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'RI8CLICK CONSORTIUM // CAPSULE & CONTAINER SMART HOUSES',
    code: 'CAPSULE 02 // V2124 DOUBLE-DECKER VILLA',
    label: 'V2124 Double-Decker Pod',
    subLabel: '2-Story Stacked Curved Glass Capsule Villa with Sky Suite',
    headline: 'V2124 Double-Decker Stacked Capsule Villa',
    description:
      'Two-story stacked modular capsule architecture offering an expansive ground-floor living and dining pavilion with full-height sliding glass walls and an upper-deck panoramic master suite.',
    valuation: 'PKR 1.35 Crore – 1.85 Crore',
    locationBadge: 'Luxury Farmhouses, Resorts & Urban Rooftops',
    focalLength: '20MM ARCHITECTURAL',
    altitude: '2-STORY DUPLEX',
    fov: '92° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap2_doubleDeckerV2124Pod,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap3_forestCabinPod,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleDoubleDecker,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-0.8%', '0.8%'],
    panY: ['0.4%', '-0.4%'],
    scaleRange: [1.01, 1.06],
    specs: [
      {
        id: 'c2-1',
        title: 'Upper-Deck V2124 Sky Suite',
        spec: 'Second-story curved glass master bedroom with warm cove lighting.'
      },
      {
        id: 'c2-2',
        title: 'Open-Plan Ground Lounge & Kitchen',
        spec: 'Full-span sliding UPVC/aluminum thermal glass doors opening to timber deck.'
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
      'Manufactured by Ri8click Consortium: heavy-duty acoustic double/triple-glazed UPVC casement & sliding windows, patio doors, office glass partitions, and weatherproof architectural wall panels.',
    valuation: '10-Year Factory Warranty • Custom Fabrication',
    locationBadge: 'Ri8click Consortium UPVC Plant & Turnkey Division',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'CONSERVATORY',
    fov: '96° EXPANSIVE',
    imageUrl: UPVC_AND_INTERIOR_GALLERY.upvc1_glassRoofConservatory,
    secondaryImageUrl: UPVC_AND_INTERIOR_GALLERY.upvc2_woodSlatTvPartition,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.upvcCurtainWall,
    videoUrl: SHOWROOM_VIDEOS.luxuryInteriorWalk,
    motionOrigin: 'center center',
    panX: ['0%', '-1.0%'],
    panY: ['-0.5%', '0.5%'],
    scaleRange: [1.01, 1.06],
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

const WAYPOINT_DURATION_MS = 6000;

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
  const [isUltraSharp, setIsUltraSharp] = useState(true);

  // Bars & Ribbons HIDDEN BY DEFAULT as requested ("Remove by default display of Bars All Consortium portfolio and 3D showroom tour")
  const [showCategoryBar, setShowCategoryBar] = useState(false);
  const [showConsortiumRibbon, setShowConsortiumRibbon] = useState(false);
  const [showShowroomTourBar, setShowShowroomTourBar] = useState(false);
  const [showDirectorDeck, setShowDirectorDeck] = useState(true);
  const [showSpecCards, setShowSpecCards] = useState(true);
  const [isHudMenuOpen, setIsHudMenuOpen] = useState(false);

  const [videoFailed, setVideoFailed] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sanitize any legacy "Group of Companies" text from CMS slides into "Ri8click Consortium"
  const sanitizeConsortiumText = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/ri8click\s+Group\s+of\s+Companies\s+Consortium/gi, 'Ri8click Consortium')
      .replace(/ri8click\s+Real\s+Estate\s+Consortium\s+Group/gi, 'Ri8click Consortium')
      .replace(/ri8click\s+Group\s+of\s+Companies/gi, 'Ri8click Consortium')
      .replace(/Group\s+of\s+Companies/gi, 'Ri8click Consortium')
      .replace(/Consortium\s+Group/gi, 'Ri8click Consortium');
  };

  // Convert CMS commercial slides into domestic Islamabad waypoints with multi-tier fallback protection
  const cmsCommercialWaypoints: CameraWaypoint[] = useMemo(() => {
    const domesticFallbacks = [
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.citadel7_nightElevation,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.j7Emporium_boulevardView,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_centaurus,
      ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_skyparkOne
    ];

    return activeSlides
      .filter(s => s.samplePropertyData?.category === 'commercial')
      .map((s, idx) => {
        const fallbackImg = domesticFallbacks[idx % domesticFallbacks.length];
        // Replace any broken or virtual/foreign URLs with verified domestic Islamabad tower images
        const cleanPrimaryImg =
          s.imageUrl && !s.imageUrl.includes('unsplash.com')
            ? s.imageUrl
            : fallbackImg;

        return {
          id: `cms-wp-${s.id}`,
          tourCategory: 'commercial_plazas' as TourDeckCategory,
          propertyCategory: 'commercial' as PropertyCategory,
          divisionTag: 'RI8CLICK CONSORTIUM // ISLAMABAD COMMERCIAL PLAZAS',
          code: `ISB 0${idx + 5} // ${sanitizeConsortiumText(s.categoryTag || 'COMMERCIAL PLAZA').toUpperCase()}`,
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
          imageUrl: cleanPrimaryImg,
          secondaryImageUrl: ISLAMABAD_DOMESTIC_TOWERS_GALLERY.towersPk_centaurus,
          fallbackUrl: fallbackImg,
          videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
          motionOrigin: 'center center',
          panX: ['-0.8%', '0.8%'] as [string, string],
          panY: ['0%', '-0.6%'] as [string, string],
          scaleRange: [1.01, 1.06] as [number, number],
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

  // Filter waypoints based on selected category
  const cameraWaypoints: CameraWaypoint[] = useMemo(() => {
    const combined = [...MASTER_VIRTUAL_TOUR_WAYPOINTS, ...cmsCommercialWaypoints];
    if (tourCategory === 'all_showroom') {
      const commList = combined.filter(w => w.tourCategory === 'commercial_plazas');
      const propsList = combined.filter(w => w.tourCategory === 'properties_plots_villas');
      const capList = combined.filter(w => w.tourCategory === 'capsule_containers');
      const upvcList = combined.filter(w => w.tourCategory === 'upvc_construction');

      const interleaved: CameraWaypoint[] = [];
      const maxLen = Math.max(commList.length, propsList.length, capList.length, upvcList.length);
      for (let i = 0; i < maxLen; i++) {
        if (commList[i]) interleaved.push(commList[i]);
        if (propsList[i]) interleaved.push(propsList[i]);
        if (capList[i]) interleaved.push(capList[i]);
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

  const resolvedImageUrl = resolveImageWithFallback(activeWaypoint);

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
  }, [tourCategory]);

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
      id: 'properties_plots_villas',
      label: 'Properties (Plots & Houses)',
      shortLabel: 'Plots & Houses',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'properties_plots_villas')
        .length,
      filterCategory: 'residential',
      icon: <Home className="w-3.5 h-3.5" />
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
      id: 'upvc_construction',
      label: 'Ri8click Consortium & UPVC',
      shortLabel: 'UPVC & Construction',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'upvc_construction')
        .length,
      filterCategory: 'projects',
      icon: <Layers className="w-3.5 h-3.5" />
    }
  ];

  // Ri8click Consortium Business Pillars
  const consortiumPillars = [
    {
      id: 'commercial_plazas' as TourDeckCategory,
      category: 'commercial' as PropertyCategory,
      title: 'Islamabad Commercial Plazas',
      detail: 'Citadel 7, J7 Emporium, Skypark One & Blue Area Towers',
      icon: Building2,
      accent: 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10'
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

  // Clean professional optical grades (no gaming glow)
  const atmosphereStyle: React.CSSProperties = useMemo(() => {
    const baseFilter =
      atmosphere === 'crystal_daylight'
        ? 'brightness(1.06) contrast(1.08) saturate(1.08)'
        : atmosphere === 'solar_vivid'
        ? 'brightness(1.10) contrast(1.10) saturate(1.14)'
        : 'brightness(1.04) contrast(1.12) saturate(1.10)';

    return {
      filter: baseFilter
    };
  }, [atmosphere, isUltraSharp]);

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
             (Removed gaming glow circles, crosshair radar pins & neon blooms)
         ===================================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        {/* Subtle Static Underlay so transitions never flash dark */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 blur-md scale-105 transition-all duration-700"
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

        {/* Clean Executive Gradient Scrims for Typography Legibility (No Neon Glow Circles) */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isCinemaTheaterMode
              ? 'bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/25'
              : 'bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/15'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />
      </div>

      {/* =====================================================================
          2. OPTIONAL CATEGORY BAR (HIDDEN BY DEFAULT)
         ===================================================================== */}
      <AnimatePresence>
        {showCategoryBar && !isCinemaTheaterMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative z-30 border-b border-white/15 bg-slate-950/80 backdrop-blur-md"
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
          3. OPTIONAL "3D SHOWROOM TOUR" BAR (HIDDEN BY DEFAULT)
         ===================================================================== */}
      <AnimatePresence>
        {showShowroomTourBar && !isCinemaTheaterMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="relative z-20 border-b border-white/15 bg-slate-900/80 backdrop-blur-md"
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
          4. MAIN FOREGROUND STAGE & EXECUTIVE SHOWCASE DECK
         ===================================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 min-h-[540px] sm:min-h-[610px] flex flex-col justify-between">
        {/* Top Executive Header Utility Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-white/15 text-xs font-semibold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Ri8click Consortium • Verified Domestic Portfolio</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Video Tour Toggle */}
            <button
              type="button"
              onClick={() => setIsVideoTourActive(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isVideoTourActive
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-slate-900/75 text-slate-200 border-white/20 hover:bg-slate-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isVideoTourActive ? 'Video: ON' : 'Video Walkthrough'}</span>
            </button>

            {isVideoTourActive && (
              <button
                type="button"
                onClick={() => setIsMuted(prev => !prev)}
                className="p-1.5 rounded-lg bg-slate-900/75 hover:bg-slate-800 border border-white/20 text-white transition-colors cursor-pointer"
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
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isHudMenuOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-900/75 border-white/20 text-white hover:bg-slate-800'
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
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-white/25 p-4 shadow-2xl z-50 space-y-2.5"
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
                        label="Portfolio Selector Panel"
                        description="Right-hand project thumbnail navigator"
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
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isCinemaTheaterMode
                  ? 'bg-white text-slate-950 border-white'
                  : 'bg-slate-900/75 border-white/20 text-white hover:bg-slate-800'
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

        {/* OPTIONAL RI8CLICK CONSORTIUM PILLARS RIBBON (HIDDEN BY DEFAULT) */}
        <AnimatePresence>
          {showConsortiumRibbon && !isCinemaTheaterMode && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4"
            >
              <div className="p-3 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                      Ri8click Consortium
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-white/95">
                      Integrated Real Estate, Commercial Plazas, Turnkey Construction, Container Capsule Homes &amp; German UPVC
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
                        className={`group p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isActivePillar
                            ? 'bg-white/15 border-amber-300'
                            : 'bg-white/5 border-white/15 hover:bg-white/10'
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

        {/* Center Main Content & Executive Portfolio Navigator */}
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
              {/* Left Column: Architectural Narrative & Actions */}
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
                    {/* Division & Location Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black tracking-wider uppercase bg-amber-400 text-slate-950 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>{activeWaypoint.divisionTag}</span>
                      </span>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                        <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span>{activeWaypoint.locationBadge}</span>
                      </div>

                      <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-950/80 text-emerald-200 border border-emerald-400/40">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Watermark Verified</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-black tracking-tight text-white leading-[1.1] font-serif">
                      {activeWaypoint.headline}
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-100 max-w-2xl leading-relaxed font-medium">
                      {activeWaypoint.description}
                    </p>

                    {/* Clean Architectural Specification Cards (Replaces Gaming Glow Hotspots) */}
                    {showSpecCards && activeWaypoint.specs.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 max-w-2xl">
                        {activeWaypoint.specs.map(item => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 flex items-start gap-2.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-bold text-white">{item.title}</div>
                              <div className="text-[11px] text-slate-300 leading-snug mt-0.5">
                                {item.spec}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Valuation Pill & Multi-Angle Sub-Gallery (if available) */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-amber-400/50">
                        <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                          Valuation / Price
                        </span>
                        <span className="text-base sm:text-lg font-black text-white">
                          {activeWaypoint.valuation}
                        </span>
                      </div>

                      {activeWaypoint.galleryImages && activeWaypoint.galleryImages.length > 1 && (
                        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-white/15">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-1.5">
                            Views:
                          </span>
                          {activeWaypoint.galleryImages.map((imgUrl, gIdx) => {
                            if (failedUrls[imgUrl]) return null;
                            return (
                              <button
                                key={gIdx}
                                type="button"
                                onClick={() => {
                                  activeWaypoint.imageUrl = imgUrl;
                                  setFailedUrls(prev => ({ ...prev }));
                                }}
                                className="w-9 h-7 rounded-md overflow-hidden border border-white/30 hover:border-amber-400 transition-all cursor-pointer shrink-0"
                                title={`Switch to Tower View ${gIdx + 1}`}
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
                        className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-white hover:text-slate-950 text-white border border-white/30 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer"
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

              {/* Right Column: EXECUTIVE PORTFOLIO NAVIGATOR */}
              {showDirectorDeck && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="lg:col-span-5 bg-slate-950/85 backdrop-blur-xl rounded-2xl border border-white/20 p-4 sm:p-5 shadow-2xl space-y-3.5"
                >
                  {/* Panel Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-3">
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider text-white">
                        Ri8click Consortium Showcase
                      </div>
                      <div className="text-[10px] text-amber-300 font-semibold">
                        Islamabad Plazas • Plots &amp; Villas • Capsule Pods • UPVC
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsVideoTourActive(prev => !prev)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all border ${
                          isVideoTourActive
                            ? 'bg-amber-400 text-slate-950 border-amber-300'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {isVideoTourActive ? 'Show Photos' : 'Video Reel'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDirectorDeck(false)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] font-bold text-slate-200 hover:text-white cursor-pointer"
                        title="Minimize Panel"
                      >
                        Hide
                      </button>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-xl border border-white/15">
                    {(
                      [
                        { id: 'all_showroom', label: 'All' },
                        { id: 'commercial_plazas', label: 'Plazas' },
                        { id: 'properties_plots_villas', label: 'Plots/Villas' },
                        { id: 'capsule_containers', label: 'Capsules' },
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
                            : 'text-slate-200 hover:text-white hover:bg-white/10'
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
                              ? 'border-amber-400 ring-2 ring-amber-400/50'
                              : 'border-white/20 opacity-85 hover:opacity-100 hover:border-white/50'
                          }`}
                        >
                          <img
                            src={thumbSrc}
                            alt={wp.label}
                            loading="lazy"
                            onError={() => handleImageError(thumbSrc)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                          <div className="absolute top-1 left-1.5 px-1.5 py-0.2 rounded bg-slate-950/80 text-[8px] font-mono font-bold text-amber-300 border border-white/15">
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

                  {/* Panel Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Info className="w-3.5 h-3.5 text-amber-300" />
                      <span>Domestic Verified Towers &amp; Estates</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTourCategory('commercial_plazas');
                        onSelectCategoryFilter('commercial');
                      }}
                      className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
                    >
                      View Islamabad Plazas
                    </button>
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
              <div className="p-4 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/25 max-w-md">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block">
                  {activeWaypoint.code}
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  {activeWaypoint.headline}
                </h2>
                <p className="text-xs text-slate-200 mt-1">{activeWaypoint.subLabel}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================================
            5. BOTTOM TIMELINE & SLIDE NAVIGATION CONTROLS
           ===================================================================== */}
        <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
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
            {!showDirectorDeck && (
              <button
                type="button"
                onClick={() => setShowDirectorDeck(true)}
                className="px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-white/20 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Show Portfolio Deck</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 transition-all cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused(prev => !prev)}
              className="px-3.5 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
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
              className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 transition-all cursor-pointer"
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
