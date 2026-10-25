import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  PhoneCall,
  MapPin,
  ArrowRight,
  Building2,
  Play,
  Pause,
  Layers,
  Video,
  Camera,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Box,
  Check,
  Home,
  HardHat,
  PanelTop,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  GripHorizontal,
  RotateCcw,
  ImageOff,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Users,
  BadgeCheck,
} from 'lucide-react';
import { HeroSlide, PropertyCategory } from '../types';

interface HeroSectionProps {
  slides: HeroSlide[];
  onExploreClick: () => void;
  onContactAgentClick: () => void;
  onSelectCategoryFilter?: (category: PropertyCategory) => void;
  onOpen3DTour?: (property?: any) => void;
}

export type TourDeckCategory =
  | 'all_showroom'
  | 'real_estate'
  | 'construction_engineering'
  | 'capsule_containers'
  | 'upvc_solutions'
  | 'tech_sols';

export interface ArchitecturalSpec {
  id: string;
  label: string;
  value: string;
  subtext: string;
}

export interface BrokenImageRecord {
  brokenUrl: string;
  replacedWithUrl: string;
  waypointLabel: string;
  timestamp: string;
}

export interface CameraWaypoint {
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
  legacyBrokenUrl?: string;
  galleryImages?: string[];
  videoUrl: string;
  motionOrigin: string;
  panX: [string, string];
  panY: [string, string];
  scaleRange: [number, number];
  specs: ArchitecturalSpec[];
}

// ============================================================================
// LOCAL PAKISTAN REGION CERTIFIED REAL ESTATE AGENTS & AGENCIES GALLERY
// Genuine Pakistani regional agent portraits (Islamabad, Lahore, Multan, Taxila)
// No foreign/Western stock avatars — authentic national agency network look
// ============================================================================
export const PAKISTAN_LOCAL_AGENT_PORTRAITS = {
  islamabadExecutiveSuit:
    'https://images.pexels.com/photos/30533513/pexels-photo-30533513.jpeg?auto=compress&cs=tinysrgb&w=600',
  lahoreCorporateAdvisor:
    'https://images.pexels.com/photos/13568786/pexels-photo-13568786.jpeg?auto=compress&cs=tinysrgb&w=600',
  multanSeniorDirector:
    'https://images.pexels.com/photos/10580183/pexels-photo-10580183.jpeg?auto=compress&cs=tinysrgb&w=600',
  rawalpindiEstateConsultant:
    'https://images.pexels.com/photos/15200105/pexels-photo-15200105.jpeg?auto=compress&cs=tinysrgb&w=600',
  islamabadRealtorWhiteSuit:
    'https://images.pexels.com/photos/30331913/pexels-photo-30331913.jpeg?auto=compress&cs=tinysrgb&w=600',
  taxilaNationalAdvisor:
    'https://images.pexels.com/photos/35565657/pexels-photo-35565657.jpeg?auto=compress&cs=tinysrgb&w=600',
  punjabRegionalPartner:
    'https://images.pexels.com/photos/35491619/pexels-photo-35491619.jpeg?auto=compress&cs=tinysrgb&w=600',
  capitalCommercialSpecialist:
    'https://images.pexels.com/photos/30465933/pexels-photo-30465933.jpeg?auto=compress&cs=tinysrgb&w=600',
};

export const CERTIFIED_PAKISTAN_AGENCIES_NETWORK = [
  {
    id: 'agency-1',
    name: 'Al-Mairaj Real Estate & Builders',
    agentName: 'Malik Zeeshan Ahmed',
    designation: 'CEO & Senior Regional Advisor',
    city: 'Taxila / Faisal Hills',
    society: 'Faisal Hills Executive & Block A',
    license: 'RDA-TAX-AG-2024-889',
    rating: 4.9,
    totalPosts: 48,
    phone: '+92 336-5666727',
    whatsapp: '923365666727',
    verified: true,
    avatar: PAKISTAN_LOCAL_AGENT_PORTRAITS.islamabadExecutiveSuit,
  },
  {
    id: 'agency-2',
    name: 'Faisal Hills Property Advisors',
    agentName: 'Chaudhry Bilal Hassan',
    designation: 'Managing Director (Taxila & GT Road)',
    city: 'Taxila / Rawalpindi',
    society: 'Faisal Hills Commercial Broadway',
    license: 'ICT-ISB-AG-2025-412',
    rating: 4.88,
    totalPosts: 39,
    phone: '+92 336-5666727',
    whatsapp: '923365666727',
    verified: true,
    avatar: PAKISTAN_LOCAL_AGENT_PORTRAITS.lahoreCorporateAdvisor,
  },
  {
    id: 'agency-3',
    name: 'Beacon Prime Commercial Estates',
    agentName: 'Engr. Haris Farooq',
    designation: 'Director High-Rise & Blue Area',
    city: 'Islamabad',
    society: 'Blue Area & CDA Sectors',
    license: 'CDA-ISB-COM-2024-301',
    rating: 4.95,
    totalPosts: 62,
    phone: '+92 336-5666727',
    whatsapp: '923365666727',
    verified: true,
    avatar: PAKISTAN_LOCAL_AGENT_PORTRAITS.multanSeniorDirector,
  },
  {
    id: 'agency-4',
    name: 'Taxila City Realtors & Consultants',
    agentName: 'Haji Muhammad Aslam Khan',
    designation: 'Patron-in-Chief & Regional Head',
    city: 'Taxila / Wah Cantt',
    society: 'Kohistan Enclave & B-17 Multi Gardens',
    license: 'RDA-TAX-AG-2024-105',
    rating: 4.82,
    totalPosts: 34,
    phone: '+92 336-5666727',
    whatsapp: '923365666727',
    verified: true,
    avatar: PAKISTAN_LOCAL_AGENT_PORTRAITS.taxilaNationalAdvisor,
  },
  {
    id: 'agency-sapphire',
    name: 'Sapphire Properties & Associates',
    agentName: 'Mian Athar Mehmood',
    designation: 'Regional Head Punjab & Lahore',
    city: 'Lahore / Islamabad',
    society: 'Bahria Town & DHA Phases',
    license: 'LDA-LHR-AG-2024-512',
    rating: 4.98,
    totalPosts: 74,
    phone: '+92 336-5666727',
    whatsapp: '923365666727',
    verified: true,
    avatar: PAKISTAN_LOCAL_AGENT_PORTRAITS.rawalpindiEstateConsultant,
  },
  {
    id: 'agency-capital',
    name: 'Margalla National Estate Syndicate',
    agentName: 'Sardar Usman Sikandar',
    designation: 'National Investment Advisor',
    city: 'Islamabad / Peshawar',
    society: 'Gulberg Greens & Eighteen Islamabad',
    license: 'CDA-ISB-AG-2025-774',
    rating: 4.91,
    totalPosts: 41,
    phone: '+92 336-5666727',
    whatsapp: '923365666727',
    verified: true,
    avatar: PAKISTAN_LOCAL_AGENT_PORTRAITS.islamabadRealtorWhiteSuit,
  },
];

// ============================================================================
// THE 5 CORPORATE CONSORTIUM PILLARS
// 1. Real Estate | 2. Construction & Engineering Services | 3. Modular/Capsule Houses
// 4. UPVC Solutions | 5. Tech Sols
// ============================================================================
export const CONSORTIUM_FIVE_PILLARS = [
  {
    id: 'div-realestate',
    pillarNumber: '01',
    tourCategory: 'real_estate' as TourDeckCategory,
    propertyCategory: 'residential' as PropertyCategory,
    title: 'Real Estate Advisory & Master Developments',
    shortName: '1. Real Estate',
    tagline: 'RDA & CDA Approved Societies, Plots, Villas & Commercial Plazas',
    badge: 'Pillar 01 • Real Estate',
    iconName: 'Building2',
    image: 'https://towers.pk/wp-content/uploads/2023/11/Centaurus_Mall-1.webp',
    description:
      'National-level real estate consortium network across Islamabad, Rawalpindi, Taxila (Faisal Hills), and Lahore offering verified residential plots, luxury villas, and high-yield commercial plazas.',
    capabilities: [
      'RDA, CDA & LDA Verified Land Banks & Plots',
      'Commercial Plazas, High-Rise Towers & Retail Shops',
      'Certified Local Pakistan Agency & Realtor Network',
    ],
    contactPerson: 'Malik Zeeshan Ahmed (Head of Real Estate)',
    contactPhone: '+92 336 5666727',
    contactWhatsApp: '923365666727',
  },
  {
    id: 'div-construction',
    pillarNumber: '02',
    tourCategory: 'construction_engineering' as TourDeckCategory,
    propertyCategory: 'projects' as PropertyCategory,
    title: 'Construction & Engineering Services',
    shortName: '2. Construction & Engineering',
    tagline: 'PEC-Certified Turnkey Civil, Structural & MEP Engineering',
    badge: 'Pillar 02 • Engineering',
    iconName: 'HardHat',
    image:
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=1600&q=85',
    description:
      'End-to-end civil construction, seismic structural engineering, soil testing, and A+ turnkey residential villa and commercial plaza execution under strict PEC compliance.',
    capabilities: [
      'A+ Grey Structure & Turnkey Villa Construction',
      'Seismic Structural Design, BIM & MEP Engineering',
      'High-Rise Piling, Retaining Walls & Project Management',
    ],
    contactPerson: 'Engr. Haris Farooq (Chief Structural Engineer)',
    contactPhone: '+92 336 5666727',
    contactWhatsApp: '923365666727',
  },
  {
    id: 'div-modular',
    pillarNumber: '03',
    tourCategory: 'capsule_containers' as TourDeckCategory,
    propertyCategory: 'modular' as PropertyCategory,
    title: 'Modular & Space Capsule Houses',
    shortName: '3. Modular/Capsule Houses',
    tagline: 'Readymade Aerospace Capsule Pods & Designer Container Villas',
    badge: 'Pillar 03 • Capsule & Container',
    iconName: 'Maximize',
    image:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=85',
    description:
      'Factory-engineered space capsule smart pods and heavy-duty corrugated container villas with 30-day rapid crane installation for farmhouses, resorts, and hilly terrains.',
    capabilities: [
      'Aerospace Aluminum Space Capsule Pods (T40 / V2124 / Q3)',
      'Insulated Corrugated Steel Container Homes & Cafes',
      '30-Day Rapid Delivery with Off-Grid Solar & Smart IoT',
    ],
    contactPerson: 'Chaudhry Bilal Hassan (Modular Division Head)',
    contactPhone: '+92 336 5666727',
    contactWhatsApp: '923365666727',
  },
  {
    id: 'div-upvc',
    pillarNumber: '04',
    tourCategory: 'upvc_solutions' as TourDeckCategory,
    propertyCategory: 'commercial' as PropertyCategory,
    title: 'UPVC Windows, Doors & Glazing Solutions',
    shortName: '4. UPVC Solutions',
    tagline: 'German-Engineered Thermal & Acoustic Multi-Chamber UPVC Systems',
    badge: 'Pillar 04 • UPVC Solutions',
    iconName: 'Layers',
    image:
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85',
    description:
      'Precision-extruded UV-stabilized UPVC profiles with double and triple tempered argon-filled glazing, EPDM weather seals, and 42dB soundproofing for Pakistan’s extreme climate.',
    capabilities: [
      'Multi-Chamber UPVC Sliding, Casement & Tilt-Turn Windows',
      'Double/Triple Tempered Low-E Acoustic Glass Facades',
      'Weatherproof Sunrooms, Skylights & Office Partitions',
    ],
    contactPerson: 'Mian Athar Mehmood (UPVC & Fenestration Director)',
    contactPhone: '+92 336 5666727',
    contactWhatsApp: '923365666727',
  },
  {
    id: 'div-techsols',
    pillarNumber: '05',
    tourCategory: 'tech_sols' as TourDeckCategory,
    propertyCategory: 'all' as PropertyCategory,
    title: 'Tech Sols (PropTech, AI, Smart IoT & GIS)',
    shortName: '5. Tech Sols',
    tagline: '3D Digital Twins, Smart Home Automation & Real Estate ERP/AI',
    badge: 'Pillar 05 • Tech Sols',
    iconName: 'Cpu',
    image:
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=85',
    description:
      'Advanced PropTech software suite, interactive 360° 3D spatial walkthroughs, GIS society masterplan mapping, automated CRM portals, and voice-controlled smart building IoT.',
    capabilities: [
      '360° 3D Virtual Reality Tours & Interactive GIS Masterplans',
      'Smart Home Voice/App Automation, CCTV & Biometric Access',
      'Real Estate Agency CRM, AI Valuation & Digital Marketing',
    ],
    contactPerson: 'Sardar Usman Sikandar (CTO Tech Sols)',
    contactPhone: '+92 336 5666727',
    contactWhatsApp: '923365666727',
  },
];

// ============================================================================
// ISLAMABAD & PAKISTAN HIGHRISE / REAL ESTATE GALLERY (ACTIVE VERIFIED LINKS)
// ============================================================================
export const ISLAMABAD_HIGHRISE_PROJECTS_GALLERY = {
  centaurusTower: 'https://towers.pk/wp-content/uploads/2023/11/Centaurus_Mall-1.webp',
  stateLifeTower: 'https://towers.pk/wp-content/uploads/2023/12/STATE-LIFE-TOWER-min.jpg',
  ufoneJinnahAvenue: 'https://towers.pk/wp-content/uploads/2023/06/Jinnah-Avenue-Islamabad.jpg',
  iseTowerBlueArea: 'https://towers.pk/wp-content/uploads/2023/08/ise-tower-islamabad.jpg',
  gigaMallTower:
    'https://towers.pk/wp-content/uploads/2024/01/image-4-34-1024x640-1-e1704435577931.jpg',
  skyparkOneGulberg: 'https://towers.pk/wp-content/uploads/2024/06/Skypark-One.jpg',
  oneConstitutionAve:
    'https://towers.pk/wp-content/uploads/2023/08/1662987394346-transformed-1.jpeg',
  grandOrchardDha:
    'https://towers.pk/wp-content/uploads/2023/08/1664948637921-transformed.png',
  greenTrustTower:
    'https://towers.pk/wp-content/uploads/2023/08/stock-photo-a-beautiful-view-of-capital-city-islamabad-hi-rise-buildings-islamabad-pakistan-march-2135740301-transformed-1-e1691756641256.jpeg',
  saudiPakTower:
    'https://towers.pk/wp-content/uploads/2024/01/saudi-pak-tower-building-e1706706739861.jpg',
  ogdclTower: 'https://towers.pk/wp-content/uploads/2023/12/OGDCL-Tower-Islamabad.jpg',
  lignumTower: 'https://towers.pk/wp-content/uploads/2023/08/Lignum-Tower-DHA-2-Islamabad.jpg',
  fallbackHighrise1:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=95',
  fallbackHighrise2:
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=95',
  fallbackHighrise3:
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=2400&q=95',
  fallbackHighrise4:
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2400&q=95',
};

// ============================================================================
// ACTIVE CONTAINER & CAPSULE HOUSES GALLERY
// All broken genspark.ai/api/files/s/* links replaced with active 4K HD media
// ============================================================================
export const MODULAR_CAPSULE_GALLERY = {
  cap1_q3ForestCabinPod:
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2400&q=95',
  cap2_rooftopDeckContainerVilla:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=95',
  cap3_hexLitBlackContainerPod:
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=95',
  cap4_curvedCornerGlassContainer:
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=95',
  cap5_v2124DoubleDeckerCapsule:
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2400&q=95',
  cap6_lakesideCurvedGlassCapsule:
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=2400&q=95',
  fallbackCapsule1:
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2400&q=95',
  fallbackCapsule2:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=95',
  fallbackCapsule3:
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=95',
  fallbackCapsule4:
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=95',
  fallbackCapsule5:
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2400&q=95',
  fallbackCapsule6:
    'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=2400&q=95',
};

export const MODULAR_CAPSULE_SEQUENCE_LIST = [
  MODULAR_CAPSULE_GALLERY.cap1_q3ForestCabinPod,
  MODULAR_CAPSULE_GALLERY.cap2_rooftopDeckContainerVilla,
  MODULAR_CAPSULE_GALLERY.cap3_hexLitBlackContainerPod,
  MODULAR_CAPSULE_GALLERY.cap4_curvedCornerGlassContainer,
  MODULAR_CAPSULE_GALLERY.cap5_v2124DoubleDeckerCapsule,
  MODULAR_CAPSULE_GALLERY.cap6_lakesideCurvedGlassCapsule,
];

export const CONSTRUCTED_HOUSES_GALLERY = {
  house1_faisalHillsVilla:
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=95',
  house2_modernCornerElevation:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95',
  house3_SpanishContemporaryVilla:
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=95',
};

export const CONSTRUCTION_ENGINEERING_GALLERY = {
  eng1_highriseStructuralSite:
    'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=2400&q=95',
  eng2_civilEngineeringBlueprint:
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2400&q=95',
  eng3_steelReinforcementWork:
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=2400&q=95',
};

export const UPVC_AND_INTERIOR_GALLERY = {
  upvc1_glassRoofConservatory:
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2400&q=95',
  upvc2_woodSlatTvPartition:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=95',
};

export const TECH_SOLS_GALLERY = {
  tech1_smartHomeIoTDashboard:
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=2400&q=95',
  tech2_digitalTwin3DMapping:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=95',
};

const SHOWROOM_VIDEOS = {
  aerialCity:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  luxuryWalkthrough:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  capsuleShowcase:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4',
};

export const INITIAL_REPLACED_BROKEN_LINKS: BrokenImageRecord[] = [
  {
    brokenUrl: 'https://www.genspark.ai/api/files/s/JiXHuX5q',
    replacedWithUrl: MODULAR_CAPSULE_GALLERY.cap1_q3ForestCabinPod,
    waypointLabel: 'CAPSULE 01 • Q3 Forest Cabin Pod (Replaced with Active HD Media)',
    timestamp: 'Active Verified',
  },
  {
    brokenUrl: 'https://www.genspark.ai/api/files/s/lWAIzX5V',
    replacedWithUrl: MODULAR_CAPSULE_GALLERY.cap2_rooftopDeckContainerVilla,
    waypointLabel: 'CAPSULE 02 • Rooftop Deck Container Villa (Replaced with Active HD Media)',
    timestamp: 'Active Verified',
  },
  {
    brokenUrl: 'https://www.genspark.ai/api/files/s/z7eAt7YP',
    replacedWithUrl: MODULAR_CAPSULE_GALLERY.cap3_hexLitBlackContainerPod,
    waypointLabel: 'CAPSULE 03 • Hex-Lit Black Container Pod (Replaced with Active HD Media)',
    timestamp: 'Active Verified',
  },
  {
    brokenUrl: 'https://www.genspark.ai/api/files/s/2vjK02Ry',
    replacedWithUrl: MODULAR_CAPSULE_GALLERY.cap4_curvedCornerGlassContainer,
    waypointLabel: 'CAPSULE 04 • Curved-Corner Glass Container (Replaced with Active HD Media)',
    timestamp: 'Active Verified',
  },
  {
    brokenUrl: 'https://www.genspark.ai/api/files/s/9ouiqrSa',
    replacedWithUrl: MODULAR_CAPSULE_GALLERY.cap5_v2124DoubleDeckerCapsule,
    waypointLabel: 'CAPSULE 05 • V2124 Double-Decker Capsule (Replaced with Active HD Media)',
    timestamp: 'Active Verified',
  },
  {
    brokenUrl: 'https://www.genspark.ai/api/files/s/OWGBsKEp',
    replacedWithUrl: MODULAR_CAPSULE_GALLERY.cap6_lakesideCurvedGlassCapsule,
    waypointLabel: 'CAPSULE 06 • Lakeside Curved-Glass Capsule (Replaced with Active HD Media)',
    timestamp: 'Active Verified',
  },
];

// ============================================================================
// MASTER VIRTUAL TOUR WAYPOINTS BASED ON THE 5 CONSORTIUM PILLARS
// ============================================================================
export const MASTER_VIRTUAL_TOUR_WAYPOINTS: CameraWaypoint[] = [
  // --------------------------------------------------------------------------
  // PILLAR 1: REAL ESTATE (High-Rise Commercial, Plots & Constructed Villas)
  // --------------------------------------------------------------------------
  {
    id: 're-centaurus-citadel-isb',
    tourCategory: 'real_estate',
    propertyCategory: 'commercial',
    divisionTag: 'Pillar 1 • Real Estate (Commercial & High-Rise)',
    code: 'RE 01',
    label: 'The Centaurus & Blue Area Towers',
    subLabel: '42 Floors • 656 FT Mixed-Use Corporate & Retail Landmark',
    headline: '1. Real Estate — Blue Area Islamabad & Taxila Commercial',
    description:
      'Premier commercial real estate portfolio across Jinnah Avenue Blue Area Islamabad and Faisal Hills Commercial Broadway. Verified corporate offices, retail outlets, and luxury serviced apartments handled by local Pakistan certified agencies.',
    valuation: 'PKR 3.50 Cr - 45.0 Cr',
    locationBadge: 'Blue Area, Jinnah Avenue, Islamabad',
    focalLength: '24mm Tilt-Shift',
    altitude: 'EL +145.0m',
    fov: '110°',
    imageUrl: ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.centaurusTower,
    secondaryImageUrl: ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.iseTowerBlueArea,
    fallbackUrl: ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.fallbackHighrise1,
    galleryImages: [
      ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.centaurusTower,
      ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.iseTowerBlueArea,
      ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.ufoneJinnahAvenue,
      ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.saudiPakTower,
    ],
    videoUrl: SHOWROOM_VIDEOS.aerialCity,
    motionOrigin: 'center center',
    panX: ['0%', '-2%'],
    panY: ['0%', '-1.5%'],
    scaleRange: [1.0, 1.07],
    specs: [
      { id: 'sp-1', label: 'Consortium Pillar', value: '1. Real Estate', subtext: 'Commercial & Residential' },
      { id: 'sp-2', label: 'Approval Status', value: 'CDA & RDA NOC', subtext: '100% Verified Title' },
      { id: 'sp-3', label: 'Rental Yield', value: '9% - 12% Annually', subtext: 'Corporate Tenants' },
    ],
  },
  {
    id: 're-faisal-hills-villas-plots',
    tourCategory: 'real_estate',
    propertyCategory: 'residential',
    divisionTag: 'Pillar 1 • Real Estate (Plots & Luxury Villas)',
    code: 'RE 02',
    label: 'Faisal Hills & CDA Sector Villas',
    subLabel: '5/10 Marla & 1-2 Kanal Designer Houses & Plots',
    headline: 'RDA & CDA Approved Residential Plots & Designer Villas',
    description:
      'Prime residential plots and constructed double-storey modern villas in Faisal Hills (Executive, Block A, B, C), B-17 Multi Gardens, Bahria Town, and DHA Islamabad/Lahore backed by our national agency network.',
    valuation: 'Plots 45L+ | Villas 4.25 Cr+',
    locationBadge: 'Faisal Hills, Taxila / Sector B-17, Islamabad',
    focalLength: '24mm Wide',
    altitude: 'EL +12.0m',
    fov: '105°',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house1_faisalHillsVilla,
    secondaryImageUrl: CONSTRUCTED_HOUSES_GALLERY.house2_modernCornerElevation,
    fallbackUrl: CONSTRUCTED_HOUSES_GALLERY.house3_SpanishContemporaryVilla,
    galleryImages: [
      CONSTRUCTED_HOUSES_GALLERY.house1_faisalHillsVilla,
      CONSTRUCTED_HOUSES_GALLERY.house2_modernCornerElevation,
      CONSTRUCTED_HOUSES_GALLERY.house3_SpanishContemporaryVilla,
      ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.gigaMallTower,
    ],
    videoUrl: SHOWROOM_VIDEOS.luxuryWalkthrough,
    motionOrigin: 'center center',
    panX: ['0%', '2%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.0, 1.06],
    specs: [
      { id: 'sp-1', label: 'Plot Categories', value: '5, 10 Marla & 1 Kanal', subtext: 'Immediate Possession' },
      { id: 'sp-2', label: 'Agency Network', value: 'Pakistan Local Agents', subtext: 'Direct Owner Deals' },
      { id: 'sp-3', label: 'Locations', value: 'Taxila, ISB, RWP, LHR', subtext: 'Prime GT Road & Motorway' },
    ],
  },

  // --------------------------------------------------------------------------
  // PILLAR 2: CONSTRUCTION & ENGINEERING SERVICES
  // --------------------------------------------------------------------------
  {
    id: 'eng-turnkey-civil-structural',
    tourCategory: 'construction_engineering',
    propertyCategory: 'projects',
    divisionTag: 'Pillar 2 • Construction & Engineering Services',
    code: 'ENG 01',
    label: 'Turnkey Civil & Structural Engineering',
    subLabel: 'PEC-Certified Grey Structure, Seismic High-Rise & MEP Works',
    headline: '2. Construction & Engineering Services — PEC Certified',
    description:
      'Complete architectural design, soil geotechnical investigation, seismic Zone-2B structural engineering, A+ grey structure, and turnkey finishing for commercial plazas and luxury villas across Pakistan.',
    valuation: 'Grey PKR 2,850/Sq.Ft | Turnkey 5,400/Sq.Ft',
    locationBadge: 'Faisal Hills, Taxila & Islamabad Capital Territory',
    focalLength: '28mm Architectural',
    altitude: 'EL +42.0m',
    fov: '100°',
    imageUrl: CONSTRUCTION_ENGINEERING_GALLERY.eng1_highriseStructuralSite,
    secondaryImageUrl: CONSTRUCTION_ENGINEERING_GALLERY.eng2_civilEngineeringBlueprint,
    fallbackUrl: CONSTRUCTION_ENGINEERING_GALLERY.eng3_steelReinforcementWork,
    galleryImages: [
      CONSTRUCTION_ENGINEERING_GALLERY.eng1_highriseStructuralSite,
      CONSTRUCTION_ENGINEERING_GALLERY.eng2_civilEngineeringBlueprint,
      CONSTRUCTION_ENGINEERING_GALLERY.eng3_steelReinforcementWork,
      ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.skyparkOneGulberg,
    ],
    videoUrl: SHOWROOM_VIDEOS.aerialCity,
    motionOrigin: 'center center',
    panX: ['-1%', '1.5%'],
    panY: ['0%', '-1.5%'],
    scaleRange: [1.0, 1.07],
    specs: [
      { id: 'sp-1', label: 'Engineering Grade', value: 'PEC Category C-A', subtext: 'Seismic Zone-2B Rated' },
      { id: 'sp-2', label: 'Steel & Concrete', value: 'Grade-60 Deformed Bar', subtext: '4000+ PSI Ready-Mix' },
      { id: 'sp-3', label: 'Project Warranty', value: '15-Year Structural', subtext: 'Stage-Wise BOQ Billing' },
    ],
  },

  // --------------------------------------------------------------------------
  // PILLAR 3: MODULAR / CAPSULE HOUSES (ACTIVE CONTAINER & CAPSULE PICTURES)
  // --------------------------------------------------------------------------
  {
    id: 'capsule-seq-1-q3-forest',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'Pillar 3 • Modular/Capsule Houses',
    code: 'CAPSULE 01',
    label: 'Q3 Pitched-Roof Forest Cabin Pod',
    subLabel: 'Galvanized Steel Frame • Triple-Glazed Skylight Facade',
    headline: '3. Modular/Capsule Houses — Q3 Alpine Forest Cabin Pod',
    description:
      'Factory-built Q3 pitched-roof modular cabin featuring hot-dip galvanized structural steel, polyurethane thermal insulation, floor-to-ceiling Low-E tempered glass, and rapid 30-day crane-set installation.',
    valuation: 'PKR 55 Lakh - 78 Lakh',
    locationBadge: 'Murree Hills / Khanpur Lake / Faisal Hills Resort',
    focalLength: '24mm Wide',
    altitude: 'EL +8.5m',
    fov: '108°',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap1_q3ForestCabinPod,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap2_rooftopDeckContainerVilla,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.fallbackCapsule1,
    legacyBrokenUrl: 'https://www.genspark.ai/api/files/s/JiXHuX5q',
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.capsuleShowcase,
    motionOrigin: 'center center',
    panX: ['0%', '-2%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.0, 1.07],
    specs: [
      { id: 'sp-1', label: 'Footprint & Size', value: '380 Sq.Ft (1-Bed Loft)', subtext: 'Crane-Ready Chassis' },
      { id: 'sp-2', label: 'Shell Material', value: 'Fluorocarbon Aluminum', subtext: '50-Year Anti-Corrosion' },
      { id: 'sp-3', label: 'Delivery Time', value: '30 Days Turnkey', subtext: 'Pre-Wired Smart IoT' },
    ],
  },
  {
    id: 'capsule-seq-2-rooftop-container',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'Pillar 3 • Modular/Capsule Houses',
    code: 'CAPSULE 02',
    label: 'Rooftop Deck Shipping Container Villa',
    subLabel: '40FT HC Corrugated Corten Steel • Exterior Spiral Staircase',
    headline: 'Designer Rooftop-Deck Container Villa & Resort Suite',
    description:
      'Engineered from reinforced 40-foot High-Cube Corten steel containers with an upper WPC timber observation deck, ri8click UPVC sliding glass walls, rockwool acoustic insulation, and complete kitchen/bath fit-out.',
    valuation: 'PKR 48 Lakh - 72 Lakh',
    locationBadge: 'Taxila Farmhouses / Chak Shahzad / Gulberg Greens',
    focalLength: '28mm Standard',
    altitude: 'EL +6.2m',
    fov: '102°',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap2_rooftopDeckContainerVilla,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap3_hexLitBlackContainerPod,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.fallbackCapsule2,
    legacyBrokenUrl: 'https://www.genspark.ai/api/files/s/lWAIzX5V',
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.capsuleShowcase,
    motionOrigin: 'center center',
    panX: ['1%', '-1.5%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.0, 1.06],
    specs: [
      { id: 'sp-1', label: 'Container Spec', value: 'Dual 40FT High-Cube', subtext: '640 Sq.Ft + Roof Deck' },
      { id: 'sp-2', label: 'Insulation', value: '100mm Closed-Cell PU', subtext: '-15°C to +50°C Rated' },
      { id: 'sp-3', label: 'Glazing', value: 'Ri8click UPVC Double', subtext: 'Argon Gas Filled' },
    ],
  },
  {
    id: 'capsule-seq-3-hex-black-container',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'Pillar 3 • Modular/Capsule Houses',
    code: 'CAPSULE 03',
    label: 'Hex-Lit Matte-Black Smart Container Pod',
    subLabel: 'Architectural Matte-Black Cladding • Hexagonal LED Ceiling',
    headline: 'Executive Matte-Black Smart Container Office & Studio Pod',
    description:
      'Ultra-modern matte-black corrugated container suite featuring integrated hexagonal LED ceiling arrays, panoramic corner glass walls, smart climate control, and plug-and-play solar readiness.',
    valuation: 'PKR 42 Lakh - 64 Lakh',
    locationBadge: 'Faisal Hills Broadway / DHA Islamabad / Nathia Gali',
    focalLength: '24mm Wide',
    altitude: 'EL +5.0m',
    fov: '106°',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap3_hexLitBlackContainerPod,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap4_curvedCornerGlassContainer,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.fallbackCapsule3,
    legacyBrokenUrl: 'https://www.genspark.ai/api/files/s/z7eAt7YP',
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.capsuleShowcase,
    motionOrigin: 'center center',
    panX: ['-1.5%', '1%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.0, 1.07],
    specs: [
      { id: 'sp-1', label: 'Configuration', value: 'Executive Pod / Studio', subtext: '320 - 480 Sq.Ft' },
      { id: 'sp-2', label: 'Smart Systems', value: 'Voice & App Control', subtext: 'Automated Curtains & HVAC' },
      { id: 'sp-3', label: 'Foundation', value: 'Zero-Excavation Pier', subtext: 'Relocatable Asset' },
    ],
  },
  {
    id: 'capsule-seq-4-lakeside-capsule',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    divisionTag: 'Pillar 3 • Modular/Capsule Houses',
    code: 'CAPSULE 04',
    label: 'V2124 & Lakeside Curved-Glass Space Capsule',
    subLabel: '270° Bent Tempered Panorama Glass • Aerospace Shell',
    headline: 'Aerospace Curved-Glass Space Capsule Smart Pod (Model X-100)',
    description:
      'Futuristic 270-degree curved tempered glass observation capsule pod with aviation-grade aluminum shell, smart biometric entry, starlight skylight roof, and full luxury hotel-grade interior.',
    valuation: 'PKR 68 Lakh - 1.15 Crore',
    locationBadge: 'Khanpur Dam Waterfront / Malam Jabba / Skardu Resorts',
    focalLength: '20mm Ultra-Wide',
    altitude: 'EL +9.0m',
    fov: '114°',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap6_lakesideCurvedGlassCapsule,
    secondaryImageUrl: MODULAR_CAPSULE_GALLERY.cap5_v2124DoubleDeckerCapsule,
    fallbackUrl: MODULAR_CAPSULE_GALLERY.fallbackCapsule5,
    legacyBrokenUrl: 'https://www.genspark.ai/api/files/s/OWGBsKEp',
    galleryImages: MODULAR_CAPSULE_SEQUENCE_LIST,
    videoUrl: SHOWROOM_VIDEOS.capsuleShowcase,
    motionOrigin: 'center center',
    panX: ['0%', '-2%'],
    panY: ['0%', '-1.5%'],
    scaleRange: [1.0, 1.08],
    specs: [
      { id: 'sp-1', label: 'Dimensions', value: '38ft × 11ft × 11ft', subtext: '418 Sq.Ft Luxury Suite' },
      { id: 'sp-2', label: 'Panorama Glass', value: '6+12A+6mm Low-E Bent', subtext: 'UV & Thermal Shield' },
      { id: 'sp-3', label: 'Seismic & Wind', value: 'Level 12 Typhoon', subtext: 'Magnitude 8 Earthquake' },
    ],
  },

  // --------------------------------------------------------------------------
  // PILLAR 4: UPVC SOLUTIONS (Windows, Doors, Thermal & Acoustic Glazing)
  // --------------------------------------------------------------------------
  {
    id: 'upvc-german-thermal-glazing',
    tourCategory: 'upvc_solutions',
    propertyCategory: 'commercial',
    divisionTag: 'Pillar 4 • UPVC Solutions',
    code: 'UPVC 01',
    label: 'Ri8click UPVC Windows, Doors & Skylights',
    subLabel: 'Multi-Chamber German UPVC Profiles • 42dB Acoustic Insulation',
    headline: '4. UPVC Solutions — Acoustic & Thermal Fenestration Systems',
    description:
      'Factory-fabricated UV-resistant UPVC sliding patio doors, tilt-and-turn casement windows, glass conservatories, and soundproof commercial facades engineered for Pakistani summer heat and monsoon rain.',
    valuation: 'PKR 1,450 - 2,650 / Sq.Ft',
    locationBadge: 'Factory & Showroom: GT Road Taxila / Islamabad',
    focalLength: '24mm Interior',
    altitude: 'EL +3.5m',
    fov: '104°',
    imageUrl: UPVC_AND_INTERIOR_GALLERY.upvc1_glassRoofConservatory,
    secondaryImageUrl: UPVC_AND_INTERIOR_GALLERY.upvc2_woodSlatTvPartition,
    fallbackUrl: ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.fallbackHighrise4,
    galleryImages: [
      UPVC_AND_INTERIOR_GALLERY.upvc1_glassRoofConservatory,
      UPVC_AND_INTERIOR_GALLERY.upvc2_woodSlatTvPartition,
      CONSTRUCTED_HOUSES_GALLERY.house2_modernCornerElevation,
    ],
    videoUrl: SHOWROOM_VIDEOS.luxuryWalkthrough,
    motionOrigin: 'center center',
    panX: ['0%', '1.5%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.0, 1.06],
    specs: [
      { id: 'sp-1', label: 'Profile Reinforcement', value: '1.5mm - 2.0mm GI Steel', subtext: 'Multi-Point Locking' },
      { id: 'sp-2', label: 'Sound Reduction', value: 'Up to 42 dB Rating', subtext: 'EPDM Dual Weather Seals' },
      { id: 'sp-3', label: 'Energy Saving', value: '35% Lower HVAC Load', subtext: '10-Year Profile Warranty' },
    ],
  },

  // --------------------------------------------------------------------------
  // PILLAR 5: TECH SOLS (PropTech AI, 3D Digital Twins, Smart Home IoT)
  // --------------------------------------------------------------------------
  {
    id: 'tech-sols-proptech-iot',
    tourCategory: 'tech_sols',
    propertyCategory: 'all',
    divisionTag: 'Pillar 5 • Tech Sols (PropTech & Smart IoT)',
    code: 'TECH 01',
    label: 'PropTech AI, 3D Digital Twins & Smart IoT',
    subLabel: 'Interactive GIS Society Maps • Smart Building Automation & CRM',
    headline: '5. Tech Sols — Real Estate Digital Twins, AI & Smart Home IoT',
    description:
      'Powering Pakistan’s real estate and modular housing ecosystem with 360° 3D virtual walkthroughs, interactive GIS plot-status masterplans, automated agency CRM portals, and smart home IoT hardware.',
    valuation: 'Enterprise SaaS & Smart Home Packages',
    locationBadge: 'Ri8click Tech Sols Hub • Islamabad & Taxila',
    focalLength: '22mm Digital Twin',
    altitude: 'EL +18.0m',
    fov: '112°',
    imageUrl: TECH_SOLS_GALLERY.tech1_smartHomeIoTDashboard,
    secondaryImageUrl: TECH_SOLS_GALLERY.tech2_digitalTwin3DMapping,
    fallbackUrl: ISLAMABAD_HIGHRISE_PROJECTS_GALLERY.centaurusTower,
    galleryImages: [
      TECH_SOLS_GALLERY.tech1_smartHomeIoTDashboard,
      TECH_SOLS_GALLERY.tech2_digitalTwin3DMapping,
      MODULAR_CAPSULE_GALLERY.cap3_hexLitBlackContainerPod,
    ],
    videoUrl: SHOWROOM_VIDEOS.aerialCity,
    motionOrigin: 'center center',
    panX: ['-1%', '1%'],
    panY: ['0%', '-1.5%'],
    scaleRange: [1.0, 1.07],
    specs: [
      { id: 'sp-1', label: 'Digital Twin Engine', value: '360° WebGL & Kuula', subtext: 'Interactive Plot Hotspots' },
      { id: 'sp-2', label: 'Smart IoT Suite', value: 'Biometric & Voice AI', subtext: 'Solar & BMS Telemetry' },
      { id: 'sp-3', label: 'Agency Portal', value: 'Verified Realtor Cloud', subtext: 'Lead & Inventory ERP' },
    ],
  },
];

type AtmosphereGrade = 'crystal_daylight' | 'solar_vivid' | 'golden_hdr';

const WAYPOINT_DURATION_MS = 6500;

export const HeroSection: React.FC<HeroSectionProps> = ({
  slides,
  onExploreClick,
  onContactAgentClick,
  onSelectCategoryFilter,
  onOpen3DTour,
}) => {
  const [selectedTourCategory, setSelectedTourCategory] =
    useState<TourDeckCategory>('all_showroom');
  const [waypointIdx, setWaypointIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoTourActive, setIsVideoTourActive] = useState(false);
  const [isCinemaTheaterMode, setIsCinemaTheaterMode] = useState(false);
  const [atmosphere, setAtmosphere] = useState<AtmosphereGrade>('crystal_daylight');
  const [isUltraSharp, setIsUltraSharp] = useState(true);

  // HUD Visibility States
  const [showLeftDescription, setShowLeftDescription] = useState(false);
  const [showDirectorDeck, setShowDirectorDeck] = useState(true);
  const [showConsortiumRibbon, setShowConsortiumRibbon] = useState(true);
  const [showLocalAgentsModal, setShowLocalAgentsModal] = useState(false);
  const [isHudMenuOpen, setIsHudMenuOpen] = useState(false);

  const [customActiveImageOverride, setCustomActiveImageOverride] = useState<string | null>(null);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [replacedLinksLog, setReplacedLinksLog] = useState<BrokenImageRecord[]>(
    INITIAL_REPLACED_BROKEN_LINKS
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const directorDragControls = useDragControls();

  // ============================================================================
  // AUTO-SYNC LOCAL PAKISTAN AGENCIES, 5 CONSORTIUM PILLARS & ACTIVE CAPSULE IMAGES
  // Ensures AgenciesSection, ConsortiumShowcase & ModularHomesShowcase reflect
  // genuine local Pakistani agent portraits, active capsule URLs, and 5 pillars.
  // ============================================================================
  useEffect(() => {
    try {
      // 1. Update Certified Agencies in localStorage to Local Pakistan Agent Pictures
      localStorage.setItem(
        'ri8click_agencies_data',
        JSON.stringify(CERTIFIED_PAKISTAN_AGENCIES_NETWORK)
      );

      // 2. Update User Accounts Avatars to Local Pakistan Agent Pictures
      const rawUsers = localStorage.getItem('ri8click_user_accounts');
      if (rawUsers) {
        const parsedUsers = JSON.parse(rawUsers);
        if (Array.isArray(parsedUsers)) {
          const localAvatarCycle = [
            PAKISTAN_LOCAL_AGENT_PORTRAITS.islamabadExecutiveSuit,
            PAKISTAN_LOCAL_AGENT_PORTRAITS.lahoreCorporateAdvisor,
            PAKISTAN_LOCAL_AGENT_PORTRAITS.multanSeniorDirector,
            PAKISTAN_LOCAL_AGENT_PORTRAITS.rawalpindiEstateConsultant,
            PAKISTAN_LOCAL_AGENT_PORTRAITS.taxilaNationalAdvisor,
            PAKISTAN_LOCAL_AGENT_PORTRAITS.islamabadRealtorWhiteSuit,
          ];
          const updatedUsers = parsedUsers.map((u: any, idx: number) => ({
            ...u,
            avatar: localAvatarCycle[idx % localAvatarCycle.length],
          }));
          localStorage.setItem('ri8click_user_accounts', JSON.stringify(updatedUsers));
        }
      }

      // 3. Update Consortium Divisions to the 5 Core Pillars
      localStorage.setItem(
        'ri8click_consortium_divisions',
        JSON.stringify(CONSORTIUM_FIVE_PILLARS)
      );

      // 4. Repair any broken genspark.ai capsule/container image links & foreign agent avatars in Properties
      const rawProps = localStorage.getItem('ri8click_properties_data');
      if (rawProps) {
        const parsedProps = JSON.parse(rawProps);
        if (Array.isArray(parsedProps)) {
          let changed = false;
          const repairedProps = parsedProps.map((prop: any, idx: number) => {
            const isModular =
              prop.category === 'modular' ||
              (prop.type && String(prop.type).toLowerCase().includes('capsule'));
            let newImages = Array.isArray(prop.images) ? [...prop.images] : [];
            newImages = newImages.map((imgUrl: string, imgIdx: number) => {
              if (!imgUrl || imgUrl.includes('genspark.ai/api/files/s/')) {
                changed = true;
                return MODULAR_CAPSULE_SEQUENCE_LIST[
                  (idx + imgIdx) % MODULAR_CAPSULE_SEQUENCE_LIST.length
                ];
              }
              return imgUrl;
            });
            if (isModular && newImages.length === 0) {
              changed = true;
              newImages = [...MODULAR_CAPSULE_SEQUENCE_LIST.slice(0, 3)];
            }
            const localAgentAvatar =
              CERTIFIED_PAKISTAN_AGENCIES_NETWORK[
                idx % CERTIFIED_PAKISTAN_AGENCIES_NETWORK.length
              ].avatar;
            if (
              !prop.agentAvatar ||
              prop.agentAvatar.includes('images.unsplash.com/photo-1560250097') ||
              prop.agentAvatar.includes('images.unsplash.com/photo-1573496359142') ||
              prop.agentAvatar.includes('images.unsplash.com/photo-1580489944761') ||
              prop.agentAvatar.includes('images.unsplash.com/photo-1519085360753') ||
              prop.agentAvatar.includes('images.unsplash.com/photo-1507003211169')
            ) {
              changed = true;
              return { ...prop, images: newImages, agentAvatar: localAgentAvatar };
            }
            return { ...prop, images: newImages };
          });
          if (changed) {
            localStorage.setItem('ri8click_properties_data', JSON.stringify(repairedProps));
          }
        }
      }
    } catch (err) {
      // Non-blocking storage sync
    }
  }, []);

  const filteredWaypoints = useMemo(() => {
    if (selectedTourCategory === 'all_showroom') {
      return MASTER_VIRTUAL_TOUR_WAYPOINTS;
    }
    const list = MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(
      (wp) => wp.tourCategory === selectedTourCategory
    );
    return list.length > 0 ? list : MASTER_VIRTUAL_TOUR_WAYPOINTS;
  }, [selectedTourCategory]);

  useEffect(() => {
    setWaypointIdx(0);
    setCustomActiveImageOverride(null);
  }, [selectedTourCategory]);

  const activeWaypoint = useMemo(() => {
    return filteredWaypoints[waypointIdx % filteredWaypoints.length] || MASTER_VIRTUAL_TOUR_WAYPOINTS[0];
  }, [filteredWaypoints, waypointIdx]);

  useEffect(() => {
    if (isPaused || isVideoTourActive || isCinemaTheaterMode) return;
    const timer = setInterval(() => {
      setCustomActiveImageOverride(null);
      setWaypointIdx((prev) => (prev + 1) % filteredWaypoints.length);
    }, WAYPOINT_DURATION_MS);
    return () => clearInterval(timer);
  }, [isPaused, isVideoTourActive, isCinemaTheaterMode, filteredWaypoints.length]);

  const resolveImageUrl = (wp: CameraWaypoint): string => {
    if (customActiveImageOverride && !failedUrls[customActiveImageOverride]) {
      return customActiveImageOverride;
    }
    if (!failedUrls[wp.imageUrl] && !wp.imageUrl.includes('genspark.ai/api/files/s/')) {
      return wp.imageUrl;
    }
    if (
      wp.secondaryImageUrl &&
      !failedUrls[wp.secondaryImageUrl] &&
      !wp.secondaryImageUrl.includes('genspark.ai/api/files/s/')
    ) {
      return wp.secondaryImageUrl;
    }
    return wp.fallbackUrl;
  };

  const resolvedImageUrl = resolveImageUrl(activeWaypoint);

  const handleImageError = (failedUrl: string, wp: CameraWaypoint) => {
    setFailedUrls((prev) => ({ ...prev, [failedUrl]: true }));
    setReplacedLinksLog((prev) => {
      if (prev.some((r) => r.brokenUrl === failedUrl)) return prev;
      return [
        {
          brokenUrl: failedUrl,
          replacedWithUrl: wp.fallbackUrl,
          waypointLabel: `${wp.code} • ${wp.label}`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ];
    });
  };

  const handlePrevWaypoint = () => {
    setCustomActiveImageOverride(null);
    setWaypointIdx((prev) => (prev - 1 + filteredWaypoints.length) % filteredWaypoints.length);
  };

  const handleNextWaypoint = () => {
    setCustomActiveImageOverride(null);
    setWaypointIdx((prev) => (prev + 1) % filteredWaypoints.length);
  };

  const handleSelectPillar = (
    tourCat: TourDeckCategory,
    propCat?: PropertyCategory
  ) => {
    setSelectedTourCategory(tourCat);
    if (propCat && onSelectCategoryFilter) {
      onSelectCategoryFilter(propCat);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const atmosphereFilterStyle = useMemo(() => {
    switch (atmosphere) {
      case 'solar_vivid':
        return 'contrast(1.08) saturate(1.18) brightness(1.03)';
      case 'golden_hdr':
        return 'contrast(1.1) saturate(1.22) sepia(0.08) brightness(1.02)';
      case 'crystal_daylight':
      default:
        return 'contrast(1.05) saturate(1.1) brightness(1.02)';
    }
  }, [atmosphere]);

  return (
    <section
      aria-label="Ri8click 5-Pillar Corporate Consortium & Architectural Virtual Tour"
      className={`relative w-full overflow-hidden bg-slate-950 text-white select-none transition-all duration-500 ${
        isCinemaTheaterMode
          ? 'min-h-[92vh] lg:min-h-[94vh]'
          : 'min-h-[680px] sm:min-h-[760px] lg:min-h-[850px]'
      }`}
    >
      {/* Crisp SVG Unsharp Mask Filter */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="hero-crisp-sharpen">
            <feConvolveMatrix
              order="3"
              preserveAlpha="true"
              kernelMatrix="0 -0.4 0 -0.4 2.6 -0.4 0 -0.4 0"
            />
          </filter>
        </defs>
      </svg>

      {/* ====================================================================
          BACKGROUND CINEMATIC CANVAS (ACTIVE IMAGES / VIDEO)
          ==================================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
        {isVideoTourActive ? (
          <video
            ref={videoRef}
            key={activeWaypoint.videoUrl}
            src={activeWaypoint.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeWaypoint.id}-${resolvedImageUrl}`}
              initial={{ opacity: 0.25, scale: activeWaypoint.scaleRange[0] }}
              animate={{
                opacity: 1,
                scale: activeWaypoint.scaleRange[1],
                x: activeWaypoint.panX,
                y: activeWaypoint.panY,
              }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.65, ease: 'easeOut' },
                scale: { duration: 10, ease: 'linear' },
                x: { duration: 10, ease: 'linear' },
                y: { duration: 10, ease: 'linear' },
              }}
              style={{
                transformOrigin: activeWaypoint.motionOrigin,
                filter: atmosphereFilterStyle,
              }}
              className="w-full h-full"
            >
              <img
                src={resolvedImageUrl}
                alt={activeWaypoint.headline}
                onError={() => handleImageError(resolvedImageUrl, activeWaypoint)}
                style={isUltraSharp ? { filter: 'url(#hero-crisp-sharpen)' } : undefined}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Balanced Gradients preserving daylight architectural clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-slate-950/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-transparent to-slate-950/60 pointer-events-none" />
      </div>

      {/* ====================================================================
          TOP CONSORTIUM 5-PILLAR RIBBON & PAKISTAN AGENCY NETWORK BAR
          1. Real Estate | 2. Construction & Engineering | 3. Modular/Capsule Houses
          4. UPVC Solutions | 5. Tech Sols
          ==================================================================== */}
      <div className="relative z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
          {/* 5 Consortium Pillars Quick Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 whitespace-nowrap flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              5-Pillar Consortium:
            </span>

            <button
              type="button"
              onClick={() => handleSelectPillar('all_showroom', 'all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                selectedTourCategory === 'all_showroom'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-200 hover:bg-white/15'
              }`}
            >
              All 5 Pillars
            </button>

            <button
              type="button"
              onClick={() => handleSelectPillar('real_estate', 'residential')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1 ${
                selectedTourCategory === 'real_estate'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-200 hover:bg-white/15'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              1. Real Estate
            </button>

            <button
              type="button"
              onClick={() => handleSelectPillar('construction_engineering', 'projects')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1 ${
                selectedTourCategory === 'construction_engineering'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-200 hover:bg-white/15'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              2. Construction & Engineering
            </button>

            <button
              type="button"
              onClick={() => handleSelectPillar('capsule_containers', 'modular')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1 ${
                selectedTourCategory === 'capsule_containers'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-200 hover:bg-white/15'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              3. Modular/Capsule Houses
            </button>

            <button
              type="button"
              onClick={() => handleSelectPillar('upvc_solutions', 'commercial')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1 ${
                selectedTourCategory === 'upvc_solutions'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-200 hover:bg-white/15'
              }`}
            >
              <PanelTop className="w-3.5 h-3.5" />
              4. UPVC Solutions
            </button>

            <button
              type="button"
              onClick={() => handleSelectPillar('tech_sols', 'all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1 ${
                selectedTourCategory === 'tech_sols'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-200 hover:bg-white/15'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              5. Tech Sols
            </button>
          </div>

          {/* Local Pakistan Certified Agencies Badge & HUD Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLocalAgentsModal((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold transition"
              title="View Certified Local Pakistan Real Estate Agencies & Agents"
            >
              <div className="flex -space-x-1.5">
                {CERTIFIED_PAKISTAN_AGENCIES_NETWORK.slice(0, 4).map((ag) => (
                  <img
                    key={ag.id}
                    src={ag.avatar}
                    alt={ag.agentName}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-400"
                  />
                ))}
              </div>
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Pakistan Certified Agents</span>
            </button>

            <button
              type="button"
              onClick={() => setIsVideoTourActive((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1 ${
                isVideoTourActive
                  ? 'bg-rose-600 border-rose-400 text-white'
                  : 'bg-white/10 border-white/15 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isVideoTourActive ? 'Image Deck' : 'Video Tour'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsCinemaTheaterMode((prev) => !prev)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition"
              title={isCinemaTheaterMode ? 'Exit Full Theater' : 'Full Theater View'}
            >
              {isCinemaTheaterMode ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsHudMenuOpen((prev) => !prev)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition"
                title="Showroom Display Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>

              {isHudMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/20 p-3.5 shadow-2xl z-50 text-xs space-y-2.5">
                  <div className="font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                    <span>HUD View Controls</span>
                    <button
                      type="button"
                      onClick={() => setIsHudMenuOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-slate-200">Full Narrative Text</span>
                    <input
                      type="checkbox"
                      checked={showLeftDescription}
                      onChange={(e) => setShowLeftDescription(e.target.checked)}
                      className="accent-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-slate-200">Director Deck (Right)</span>
                    <input
                      type="checkbox"
                      checked={showDirectorDeck}
                      onChange={(e) => setShowDirectorDeck(e.target.checked)}
                      className="accent-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-slate-200">5-Pillar Consortium Block</span>
                    <input
                      type="checkbox"
                      checked={showConsortiumRibbon}
                      onChange={(e) => setShowConsortiumRibbon(e.target.checked)}
                      className="accent-amber-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-slate-200">Ultra-Sharp 4K Filter</span>
                    <input
                      type="checkbox"
                      checked={isUltraSharp}
                      onChange={(e) => setIsUltraSharp(e.target.checked)}
                      className="accent-amber-500"
                    />
                  </label>

                  <div className="pt-1 border-t border-white/10">
                    <span className="block text-[10px] uppercase text-slate-400 mb-1">
                      Daylight Grade
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {(
                        [
                          ['crystal_daylight', 'Crystal'],
                          ['solar_vivid', 'Vivid'],
                          ['golden_hdr', 'HDR'],
                        ] as [AtmosphereGrade, string][]
                      ).map(([gradeKey, label]) => (
                        <button
                          key={gradeKey}
                          type="button"
                          onClick={() => setAtmosphere(gradeKey)}
                          className={`py-1 rounded text-[10px] font-semibold ${
                            atmosphere === gradeKey
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          PAKISTAN NATIONAL CERTIFIED AGENCIES & LOCAL AGENTS DRAWER
          Genuine Local Pakistan Realtors (Islamabad, Taxila, Rawalpindi, Lahore)
          ==================================================================== */}
      <AnimatePresence>
        {showLocalAgentsModal && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3"
          >
            <div className="rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 p-4 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      Certified Agencies & Real Estate Agents — Pakistan National Network
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        100% Local Pakistan Verified Realtors
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      RDA, CDA & LDA licensed regional real estate consultants across Taxila, Faisal Hills, Islamabad, Rawalpindi & Lahore.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLocalAgentsModal(false);
                      scrollToSection('agents-section');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                  >
                    Open Full Agency Directory
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLocalAgentsModal(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CERTIFIED_PAKISTAN_AGENCIES_NETWORK.map((agency) => (
                  <div
                    key={agency.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-white/10 hover:border-emerald-400/50 transition"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={agency.avatar}
                        alt={agency.agentName}
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-400/60"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-emerald-400 truncate">
                        {agency.name}
                      </div>
                      <div className="text-sm font-bold text-white truncate">
                        {agency.agentName}
                      </div>
                      <div className="text-[11px] text-slate-300 truncate">
                        {agency.designation} • {agency.city}
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          {agency.license}
                        </span>
                        <a
                          href={`https://wa.me/${agency.whatsapp}?text=${encodeURIComponent(
                            `Assalam o Alaikum ${agency.agentName} (${agency.name}), I am contacting you via ri8click Pakistan Consortium Portal.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 flex items-center gap-1"
                        >
                          WhatsApp <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          MAIN HERO CONTENT GRID (LEFT NARRATIVE/MINIMAL CARD + RIGHT DIRECTOR DECK)
          ==================================================================== */}
      {!isCinemaTheaterMode && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* LEFT COLUMN */}
            <div
              className={`${
                showDirectorDeck
                  ? showLeftDescription
                    ? 'lg:col-span-7'
                    : 'lg:col-span-6'
                  : showLeftDescription
                  ? 'lg:col-span-9'
                  : 'lg:col-span-8'
              } space-y-4`}
            >
              {showLeftDescription ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWaypoint.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="p-5 sm:p-6 rounded-3xl bg-slate-950/65 backdrop-blur-md border border-white/15 shadow-2xl space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                          {activeWaypoint.divisionTag}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          {activeWaypoint.locationBadge}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowLeftDescription(false)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-slate-200 flex items-center gap-1"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        Hide Text
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                        {activeWaypoint.code} • {activeWaypoint.subLabel}
                      </div>
                      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                        {activeWaypoint.headline}
                      </h1>
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                        {activeWaypoint.description}
                      </p>
                    </div>

                    {/* Technical Specs Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {activeWaypoint.specs.map((spec) => (
                        <div
                          key={spec.id}
                          className="p-3 rounded-xl bg-white/5 border border-white/10"
                        >
                          <div className="text-[11px] text-slate-400 uppercase font-semibold">
                            {spec.label}
                          </div>
                          <div className="text-sm font-bold text-amber-300 mt-0.5">
                            {spec.value}
                          </div>
                          <div className="text-[11px] text-slate-300">{spec.subtext}</div>
                        </div>
                      ))}
                    </div>

                    {/* Sub-Gallery Thumbnails */}
                    {activeWaypoint.galleryImages && activeWaypoint.galleryImages.length > 1 && (
                      <div className="pt-1">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                          Active Waypoint Angles (Click to Switch):
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {activeWaypoint.galleryImages.map((imgUrl, idx) => (
                            <button
                              key={`${imgUrl}-${idx}`}
                              type="button"
                              onClick={() => setCustomActiveImageOverride(imgUrl)}
                              className={`relative w-16 h-11 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                                resolvedImageUrl === imgUrl
                                  ? 'border-amber-400 scale-105'
                                  : 'border-white/20 opacity-75 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Angle ${idx + 1}`}
                                onError={() => handleImageError(imgUrl, activeWaypoint)}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        id="hero-explore-listings-btn"
                        type="button"
                        onClick={onExploreClick}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg flex items-center gap-2 transition"
                      >
                        <span>Explore Portfolio</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {onOpen3DTour && (
                        <button
                          id="hero-launch-3d-tour-btn"
                          type="button"
                          onClick={() =>
                            onOpen3DTour({
                              id: activeWaypoint.id,
                              title: `${activeWaypoint.headline} - Ri8click Consortium Walkthrough`,
                              category: activeWaypoint.propertyCategory,
                              price: activeWaypoint.valuation,
                              location: {
                                city: 'Islamabad / Taxila',
                                society: activeWaypoint.locationBadge,
                                province: 'Islamabad Capital Territory',
                              },
                              images: activeWaypoint.galleryImages || [resolvedImageUrl],
                              virtualTourVideoUrl: activeWaypoint.videoUrl,
                            })
                          }
                          className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold text-sm flex items-center gap-2 transition"
                        >
                          <Compass className="w-4 h-4 text-amber-400" />
                          <span>Launch 360° Virtual Tour</span>
                        </button>
                      )}

                      <button
                        id="hero-contact-agent-btn"
                        type="button"
                        onClick={onContactAgentClick}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 transition"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Consult Local Agent</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                /* Minimal Compact Glass Card (Default Clean View) */
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWaypoint.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/55 backdrop-blur-md border border-white/20 shadow-xl max-w-lg"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold">
                        <Camera className="w-3 h-3" />
                        {activeWaypoint.code} • {activeWaypoint.divisionTag}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                        {activeWaypoint.valuation}
                      </span>
                    </div>

                    <h1 className="text-base sm:text-xl font-bold text-white leading-snug">
                      {activeWaypoint.headline}
                    </h1>
                    <p className="text-xs text-slate-300 truncate mt-0.5">
                      {activeWaypoint.subLabel}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/10">
                      <span className="text-[11px] text-slate-300 flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {activeWaypoint.locationBadge}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowLeftDescription(true)}
                          className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          Show Details
                        </button>

                        {onOpen3DTour && (
                          <button
                            type="button"
                            onClick={() =>
                              onOpen3DTour({
                                id: activeWaypoint.id,
                                title: `${activeWaypoint.headline} - Ri8click Consortium Walkthrough`,
                                category: activeWaypoint.propertyCategory,
                                price: activeWaypoint.valuation,
                                location: {
                                  city: 'Islamabad / Taxila',
                                  society: activeWaypoint.locationBadge,
                                  province: 'Islamabad Capital Territory',
                                },
                                images: activeWaypoint.galleryImages || [resolvedImageUrl],
                                virtualTourVideoUrl: activeWaypoint.videoUrl,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            360° Tour
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* RIGHT COLUMN: DRAGGABLE ARCHITECTURAL DIRECTOR DECK */}
            {showDirectorDeck && (
              <div
                className={`${
                  showLeftDescription ? 'lg:col-span-5' : 'lg:col-span-6'
                } flex justify-end`}
              >
                <motion.div
                  drag
                  dragControls={directorDragControls}
                  dragMomentum={false}
                  className="w-full max-w-md rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/20 p-4 shadow-2xl space-y-3"
                >
                  <div
                    onPointerDown={(e) => directorDragControls.start(e)}
                    className="flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-white/10 pb-2"
                  >
                    <div className="flex items-center gap-2">
                      <GripHorizontal className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Consortium Camera Deck ({waypointIdx + 1}/{filteredWaypoints.length})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setIsPaused((prev) => !prev)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200"
                        title={isPaused ? 'Resume Auto-Tour' : 'Pause Auto-Tour'}
                      >
                        {isPaused ? (
                          <Play className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Pause className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handlePrevWaypoint}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200"
                        title="Previous Waypoint"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextWaypoint}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200"
                        title="Next Waypoint"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Waypoint Switcher Cards */}
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {filteredWaypoints.map((wp, idx) => {
                      const isCurrent = wp.id === activeWaypoint.id;
                      const thumbUrl = resolveImageUrl(wp);
                      return (
                        <button
                          key={wp.id}
                          type="button"
                          onClick={() => {
                            setCustomActiveImageOverride(null);
                            setWaypointIdx(idx);
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-xl border text-left transition ${
                            isCurrent
                              ? 'bg-amber-500/20 border-amber-400/60 shadow-sm'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <img
                            src={thumbUrl}
                            alt={wp.label}
                            onError={() => handleImageError(thumbUrl, wp)}
                            className="w-14 h-10 rounded-lg object-cover shrink-0 border border-white/15"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                                {wp.code}
                              </span>
                              <span className="text-[10px] text-emerald-300 font-semibold truncate">
                                {wp.valuation}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-white truncate">
                              {wp.label}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {wp.divisionTag}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Verified Local Pakistan Agency Strip inside Deck */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={
                          CERTIFIED_PAKISTAN_AGENCIES_NETWORK[
                            waypointIdx % CERTIFIED_PAKISTAN_AGENCIES_NETWORK.length
                          ].avatar
                        }
                        alt="Pakistan Certified Agent"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white truncate flex items-center gap-1">
                          <span>
                            {
                              CERTIFIED_PAKISTAN_AGENCIES_NETWORK[
                                waypointIdx % CERTIFIED_PAKISTAN_AGENCIES_NETWORK.length
                              ].agentName
                            }
                          </span>
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </div>
                        <div className="text-[10px] text-slate-300 truncate">
                          {
                            CERTIFIED_PAKISTAN_AGENCIES_NETWORK[
                              waypointIdx % CERTIFIED_PAKISTAN_AGENCIES_NETWORK.length
                            ].name
                          }{' '}
                          ({CERTIFIED_PAKISTAN_AGENCIES_NETWORK[
                            waypointIdx % CERTIFIED_PAKISTAN_AGENCIES_NETWORK.length
                          ].city})
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollToSection('agents-section')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold shrink-0"
                    >
                      All Agents
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          BOTTOM 5-PILLAR CONSORTIUM BLOCK
          1. Real Estate | 2. Construction & Engineering Services
          3. Modular/Capsule Houses | 4. UPVC Solutions | 5. Tech Sols
          ==================================================================== */}
      {showConsortiumRibbon && !isCinemaTheaterMode && (
        <div className="relative z-10 border-t border-white/15 bg-slate-950/85 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                  ri8click Group of Companies
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-white">
                  Corporate Consortium Comprises of 5 Core Pillars
                </h2>
              </div>
              <button
                type="button"
                onClick={() => scrollToSection('consortium-section')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>View Full Consortium Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {CONSORTIUM_FIVE_PILLARS.map((pillar) => {
                const isSelected = selectedTourCategory === pillar.tourCategory;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() =>
                      handleSelectPillar(pillar.tourCategory, pillar.propertyCategory)
                    }
                    className={`group text-left p-3 rounded-xl border transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                          Pillar {pillar.pillarNumber}
                        </span>
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            isSelected ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                          }`}
                        />
                      </div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                        {pillar.shortName}
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">
                        {pillar.tagline}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-300 font-semibold">
                      <span>Explore Division</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
