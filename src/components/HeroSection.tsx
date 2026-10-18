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
  Home,
  Building2,
  Layers,
  Crosshair,
  Disc,
  Zap
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
  | 'capsule_containers'
  | 'constructed_villas'
  | 'interior_walkthrough'
  | 'commercial_plazas';

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
// 1. REFERENCE ASSET GALLERIES (CAP 1-10, HOUSE 1-4, INDOOR 1-5) + UHD BACKUPS
// ============================================================================

export const MODULAR_CAPSULE_GALLERY = {
  // cap1: Steelmark white capsule with wood louver porch in factory
  cap1_steelmarkPorchPod: 'https://www.genspark.ai/api/files/s/qkpwDNgf',
  // cap2: Red oxide structural steel capsule frame in factory
  cap2_structuralSteelFrame: 'https://www.genspark.ai/api/files/s/a88ABK4x',
  // cap3: Q3 white pitched-roof modular cabin in pine forest
  cap3_q3ForestCabinPod: 'https://www.genspark.ai/api/files/s/SIH7ziKy',
  // cap4: K5 futuristic white capsule house on coastal lawn
  cap4_k5WaterfrontCapsule: 'https://www.genspark.ai/api/files/s/NC8JX3DY',
  // cap5: 3D isometric cutaway of 2-story loft shipping container home
  cap5_isometricLoftContainer: 'https://www.genspark.ai/api/files/s/uWnx8SFT',
  // cap6: White shipping container home with rooftop deck & wood patio
  cap6_rooftopDeckContainerVilla: 'https://www.genspark.ai/api/files/s/LPtvKsRm',
  // cap7: Black futuristic container home with warm orange hexagonal LED lighting
  cap7_hexLedSmartContainer: 'https://www.genspark.ai/api/files/s/teAjvCmQ',
  // cap8: White curved-corner container office/studio in tropical garden
  cap8_tropicalGlassOfficePod: 'https://www.genspark.ai/api/files/s/sLJbA0cn',
  // cap9: V2124 double-decker stacked white curved glass capsule villa
  cap9_doubleDeckerV2124Pod: 'https://www.genspark.ai/api/files/s/IZcoBysh',
  // cap10: Lakeside white curved glass capsule house at sunset
  cap10_lakesidePanoramaPod: 'https://www.genspark.ai/api/files/s/US7vpWNE'
};

export const CONSTRUCTED_HOUSES_GALLERY = {
  // house1: Ultra-modern white cantilevered 3-story luxury villa with twin white sports cars
  house1_whiteSupercarVilla: 'https://www.genspark.ai/api/files/s/YZr3409c',
  // house2: Contemporary charcoal & white multi-level villa with 3-car underground garage
  house2_charcoalGarageVilla: 'https://www.genspark.ai/api/files/s/7QO0W212',
  // house3: Dark grey & stacked-stone luxury hillside villa with illuminated staircase
  house3_stoneGlassMansion: 'https://www.genspark.ai/api/files/s/G0HfpG8n',
  // house4: Matte black & charcoal geometric modern villa with terraced tropical landscaping
  house4_obsidianTerraceVilla: 'https://www.genspark.ai/api/files/s/MaqwqSX0',
  // house5: Classical-modern white pillared 3-story mansion with green grid driveway
  house5_whitePillaredEstate: 'https://www.genspark.ai/api/files/s/oARmbiwI'
};

export const INDOOR_WALKTHROUGH_GALLERY = {
  // indoor1: Modern wood-slat TV partition wall with LED cove lighting & dining view
  indoor1_woodSlatTvPartition: 'https://www.genspark.ai/api/files/s/jgeipCWH',
  // indoor2: Circular wooden cutout TV divider wall with floral centerpiece & glossy marble
  indoor2_circularZenTvWall: 'https://www.genspark.ai/api/files/s/mnJLBmSM',
  // indoor3: Traditional Chinese moon-gate circular wooden arch framing sunlit living room
  indoor3_moonGateLivingRoom: 'https://www.genspark.ai/api/files/s/JWI7WzUg',
  // indoor4: Indoor Japanese zen courtyard with koi fish pond, bonsai tree & glass skylight
  indoor4_koiPondCourtyard: 'https://www.genspark.ai/api/files/s/QhWCNmTo',
  // indoor5: Floating solid-wood staircase beside glass-enclosed indoor tropical atrium
  indoor5_floatingStaircaseAtrium: 'https://www.genspark.ai/api/files/s/glbQm2cO',
  // indoor6: Double-height timber & steel glass-roofed conservatory hallway
  indoor6_glassRoofConservatory: 'https://www.genspark.ai/api/files/s/ymhFeOsA'
};

// High-availability 4K UHD architectural backups (ensures zero blank frames if an external link is offline)
const UHD_ARCHITECTURAL_BACKUPS = {
  capsuleCoastal: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=2400&q=95',
  capsuleForest: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=2400&q=95',
  capsuleModern: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=95',
  villaWhite: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=95',
  villaModern: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=95',
  villaTwilight: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=95',
  villaEstate: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=95',
  interiorLiving: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=95',
  interiorZen: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2400&q=95',
  interiorAtrium: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2400&q=95',
  commercialTower: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=95',
  commercialAtrium: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2400&q=95'
};

const SHOWROOM_VIDEOS = {
  architecturalFlyover: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-buildings-on-a-sunny-day-41465-large.mp4',
  luxuryInteriorWalk: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  villaDroneOrbit: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
};

// ============================================================================
// 2. COMPLETE VIRTUAL TOUR WAYPOINTS ACROSS ALL CATEGORIES
// ============================================================================

const MASTER_VIRTUAL_TOUR_WAYPOINTS: CameraWaypoint[] = [
  // ---------------- CATEGORY A: CONSTRUCTED LUXURY HOUSES (HOUSE 1 - 5) ----------------
  {
    id: 'house-wp-1',
    tourCategory: 'constructed_villas',
    propertyCategory: 'residential',
    code: 'VILLA 01 // CANTILEVER SUPERCAR ESTATE',
    label: 'Cantilevered White Villa',
    subLabel: '3-Story Geometric Facade & Twin Supercar Gallery',
    headline: 'Ultra-Modern Cantilevered Signature Villa',
    description:
      'Inspired by automotive flagship showrooms, this 1-Kanal white architectural masterpiece features floating cantilevered sky-decks, double-height UPVC acoustic curtain walls, recessed linear LED soffits, and an integrated twin-supercar portico.',
    valuation: 'PKR 7.85 Crore',
    locationBadge: 'Faisal Hills Executive & DHA Islamabad',
    focalLength: '24MM f/1.4 MASTER PRIME',
    altitude: 'ELEVATION +4.2M',
    fov: '84° WIDE',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house1_whiteSupercarVilla,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.villaWhite,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'center center',
    panX: ['0%', '-1.8%'],
    panY: ['0%', '-1.2%'],
    scaleRange: [1.02, 1.11],
    hotspots: [
      { id: 'h1-1', x: 54, y: 28, title: 'Cantilevered Sky Terrace', spec: 'Reinforced post-tensioned slab with frameless laminated glass.' },
      { id: 'h1-2', x: 24, y: 42, title: 'Double-Height UPVC Curtain Wall', spec: 'Ri8Click German thermal break glazing with 96% UV rejection.' },
      { id: 'h1-3', x: 68, y: 68, title: 'Showroom Portico & EV Bay', spec: 'Polished architectural concrete apron with dual 22kW fast chargers.' }
    ]
  },
  {
    id: 'house-wp-2',
    tourCategory: 'constructed_villas',
    propertyCategory: 'residential',
    code: 'VILLA 02 // HILLSIDE STONE & GLASS MANOR',
    label: 'Hillside Stone Mansion',
    subLabel: 'Double-Height Corner Glass & Subterranean Lounge',
    headline: 'Hillside Stacked-Stone & Glass Residence',
    description:
      'Commanding panoramic Margalla foothill views, this multi-tiered residence blends natural slate stonework, warm timber soffits, a floating LED grand staircase, and a subterranean 3-car showroom.',
    valuation: 'PKR 8.40 Crore',
    locationBadge: 'Kohistan Enclave & Faisal Hills Block B',
    focalLength: '20MM ANAMORPHIC',
    altitude: 'TERRACE +6.0M',
    fov: '92° ULTRA',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house3_stoneGlassMansion,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.villaTwilight,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'left center',
    panX: ['-1.5%', '1.2%'],
    panY: ['0.6%', '-0.8%'],
    scaleRange: [1.09, 1.02],
    hotspots: [
      { id: 'h2-1', x: 32, y: 38, title: '24-Foot Corner Glass Atrium', spec: 'Seamless structural silicone glazing overlooking Margalla ridge.' },
      { id: 'h2-2', x: 24, y: 68, title: 'Illuminated Floating Steps', spec: 'Sensor-activated warm 3000K step lighting in granite treads.' },
      { id: 'h2-3', x: 58, y: 74, title: 'Subterranean Collector Garage', spec: 'Climate-controlled lower-ground parking with acoustic insulation.' }
    ]
  },
  {
    id: 'house-wp-3',
    tourCategory: 'constructed_villas',
    propertyCategory: 'residential',
    code: 'VILLA 03 // CHARCOAL MULTI-LEVEL RESIDENCE',
    label: 'Charcoal Podium Villa',
    subLabel: 'Biophilic Hanging Gardens & Triple Showroom Bay',
    headline: 'Contemporary Podium Villa with Sky Planters',
    description:
      'Engineered for luxury urban living, combining matte charcoal architectural render, cascading biophilic balcony planters, warm linear cove lighting, and a street-level triple garage.',
    valuation: 'PKR 6.95 Crore',
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
    scaleRange: [1.02, 1.1],
    hotspots: [
      { id: 'h3-1', x: 62, y: 55, title: 'Biophilic Cascading Terrace', spec: 'Automated drip-irrigated planter trough integrated into slab edge.' },
      { id: 'h3-2', x: 52, y: 72, title: 'Triple-Bay Showroom Garage', spec: 'Accoya timber cladding with recessed architectural spot optics.' }
    ]
  },
  {
    id: 'house-wp-4',
    tourCategory: 'constructed_villas',
    propertyCategory: 'residential',
    code: 'VILLA 04 // OBSIDIAN MONOLITH ESTATE',
    label: 'Obsidian Terrace Villa',
    subLabel: 'Matte Graphite Frames & Tropical Stepped Gardens',
    headline: 'Obsidian Monolith & Tropical Terrace Estate',
    description:
      'Bold monolithic geometry in matte graphite finished with tropical palm landscaping, frameless sky-balconies, and solar-integrated flat roof engineering.',
    valuation: 'PKR 7.20 Crore',
    locationBadge: 'Eighteen Islamabad & DHA Phase 2',
    focalLength: '24MM HDR PRIME',
    altitude: 'GARDEN +2.8M',
    fov: '84° WIDE',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house4_obsidianTerraceVilla,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.villaEstate,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'center bottom',
    panX: ['-1%', '1%'],
    panY: ['1%', '-1%'],
    scaleRange: [1.08, 1.02],
    hotspots: [
      { id: 'h4-1', x: 56, y: 32, title: 'Frameless Panoramic Upper Deck', spec: '15mm tempered low-iron sentry glass balustrade.' },
      { id: 'h4-2', x: 35, y: 65, title: 'Terraced Botanical Stairway', spec: 'Natural basalt stone steps flanked by tropical palms.' }
    ]
  },
  {
    id: 'house-wp-5',
    tourCategory: 'constructed_villas',
    propertyCategory: 'residential',
    code: 'VILLA 05 // IMPERIAL WHITE PILLARED MANOR',
    label: 'White Pillared Estate',
    subLabel: 'Classical Columns, Eco-Grid Lawn & Podium Portico',
    headline: 'Imperial White Pillared Family Sanctuary',
    description:
      'Timeless neoclassical columns meet modern full-height glass fenestration, complete with a permeable eco-turf forecourt, elevated garden terrace, and covered basement parking.',
    valuation: 'PKR 6.50 Crore',
    locationBadge: 'Faisal Hills Block A & Bahria Town',
    focalLength: '35MM NATURAL',
    altitude: 'LAWN +2.0M',
    fov: '70° NATURAL',
    imageUrl: CONSTRUCTED_HOUSES_GALLERY.house5_whitePillaredEstate,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.villaWhite,
    videoUrl: SHOWROOM_VIDEOS.villaDroneOrbit,
    motionOrigin: 'center center',
    panX: ['0%', '-1.5%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.03, 1.1],
    hotspots: [
      { id: 'h5-1', x: 60, y: 36, title: ' colonnade Veranda Suite', spec: 'Load-bearing cylindrical columns with warm soffit downlights.' },
      { id: 'h5-2', x: 45, y: 78, title: 'Permeable Eco-Grid Forecourt', spec: 'Reinforced turf-paver driveway reducing heat-island effect.' }
    ]
  },

  // ---------------- CATEGORY B: INDOOR & COURTYARD WALKTHROUGH (INDOOR 1 - 6) ----------------
  {
    id: 'indoor-wp-1',
    tourCategory: 'interior_walkthrough',
    propertyCategory: 'residential',
    code: 'INT 01 //KOI POND SKYLIT COURTYARD',
    label: 'Zen Koi Courtyard',
    subLabel: 'Indoor Bio-Pond, Sculpted Bonsai & Retractable Skylight',
    headline: 'Indoor Japanese Koi Sanctuary & Glass Atrium',
    description:
      'Step inside a serene biophilic heart of the home: a crystal-clear indoor koi pond bordered by natural river boulders, a century-old sculpted pine bonsai, and a motorized triple-glazed skylight.',
    valuation: 'Turnkey Interior Package',
    locationBadge: 'Bespoke Ri8Click Architectural Interiors',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'ATRIUM LEVEL',
    fov: '100° SPATIAL',
    imageUrl: INDOOR_WALKTHROUGH_GALLERY.indoor4_koiPondCourtyard,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.interiorAtrium,
    videoUrl: SHOWROOM_VIDEOS.luxuryInteriorWalk,
    motionOrigin: 'center center',
    panX: ['-1%', '1.5%'],
    panY: ['0.8%', '-0.8%'],
    scaleRange: [1.02, 1.11],
    hotspots: [
      { id: 'in1-1', x: 46, y: 20, title: 'Motorized Thermal Skylight', spec: 'Rain-sensor automated laminated skylight with solar-control Low-E coating.' },
      { id: 'in1-2', x: 48, y: 48, title: 'Japanese Black Pine Island', spec: ' Zen moss mound with full-spectrum daylight supplementation.' },
      { id: 'in1-3', x: 45, y: 78, title: 'Bio-Filtered Koi Reflection Pool', spec: 'UV-sterilized recirculation system with flush granite coping.' }
    ]
  },
  {
    id: 'indoor-wp-2',
    tourCategory: 'interior_walkthrough',
    propertyCategory: 'residential',
    code: 'INT 02 // CIRCULAR ZEN MEDIA LOUNGE',
    label: 'Circular Zen TV Wall',
    subLabel: 'Sculpted Timber Ring Divider & Bookmatched Marble',
    headline: 'Sculpted Circular Oak Media & Dining Partition',
    description:
      'Open-plan spatial artistry featuring a custom CNC-milled oak circular aperture with vertical louver slats, warm halo LED backlighting, and mirror-polished Italian porcelain slabs.',
    valuation: 'Designer Lounge Suite',
    locationBadge: 'Ri8Click Turnkey Interior Studio',
    focalLength: '24MM f/1.4 CINE',
    altitude: 'MAIN LOUNGE',
    fov: '84° WIDE',
    imageUrl: INDOOR_WALKTHROUGH_GALLERY.indoor2_circularZenTvWall,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.interiorLiving,
    videoUrl: SHOWROOM_VIDEOS.luxuryInteriorWalk,
    motionOrigin: 'left center',
    panX: ['-1.5%', '1%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.09, 1.02],
    hotspots: [
      { id: 'in2-1', x: 33, y: 55, title: 'Halo-Lit Circular Timber Portal', spec: 'White oak veneer with 2700K diffused architectural LED ring.' },
      { id: 'in2-2', x: 62, y: 54, title: 'Floating Acoustic Media Console', spec: 'Concealed cable routing & Dolby Atmos soundbar recess.' }
    ]
  },
  {
    id: 'indoor-wp-3',
    tourCategory: 'interior_walkthrough',
    propertyCategory: 'residential',
    code: 'INT 03 // FLOATING STAIR & GLASS TERRARIUM',
    label: 'Floating Stair Atrium',
    subLabel: 'Cantilevered Teak Treads & Indoor Tropical Garden',
    headline: 'Cantilevered Timber Staircase & Glass Terrarium',
    description:
      'Solid Burmese teak floating stair treads with frameless tempered glass balustrades ascending alongside a floor-to-ceiling glass-enclosed indoor rainforest courtyard.',
    valuation: 'Atrium Signature Series',
    locationBadge: 'Luxury Villa Interior Walkthrough',
    focalLength: '22MM ARCHITECTURAL',
    altitude: 'MEZZANINE LINK',
    fov: '88° WIDE',
    imageUrl: INDOOR_WALKTHROUGH_GALLERY.indoor5_floatingStaircaseAtrium,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.interiorZen,
    videoUrl: SHOWROOM_VIDEOS.luxuryInteriorWalk,
    motionOrigin: 'right center',
    panX: ['1%', '-1.5%'],
    panY: ['-0.8%', '0.8%'],
    scaleRange: [1.02, 1.1],
    hotspots: [
      { id: 'in3-1', x: 25, y: 62, title: 'Cantilevered Solid Teak Treads', spec: 'Concealed structural steel stringer embedded in shear wall.' },
      { id: 'in3-2', x: 64, y: 52, title: '2-Story Glass Biophilic Terrarium', spec: 'Acoustic glass enclosure bringing natural forest light indoors.' }
    ]
  },
  {
    id: 'indoor-wp-4',
    tourCategory: 'interior_walkthrough',
    propertyCategory: 'residential',
    code: 'INT 04 // GLASS-ROOF CONSERVATORY HALL',
    label: 'Skylit Timber Gallery',
    subLabel: 'Full-Span Glass Roof, Hardwood Floors & Forest Canopy',
    headline: 'Double-Height Skylit Conservatory & Great Hall',
    description:
      'Drenched in natural daylight under a continuous structural steel and thermal-glass roof canopy, pairing solid oak plank flooring with warm cedar ceiling soffits.',
    valuation: 'Conservatory Edition',
    locationBadge: 'Hillside & Forest Estate Collection',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'GREAT HALL',
    fov: '96° EXPANSIVE',
    imageUrl: INDOOR_WALKTHROUGH_GALLERY.indoor6_glassRoofConservatory,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.interiorAtrium,
    videoUrl: SHOWROOM_VIDEOS.luxuryInteriorWalk,
    motionOrigin: 'center center',
    panX: ['0%', '-1.5%'],
    panY: ['-1%', '1%'],
    scaleRange: [1.03, 1.11],
    hotspots: [
      { id: 'in4-1', x: 52, y: 24, title: 'Structural Steel & Low-E Glass Roof', spec: 'Argon-filled triple glazing engineered for zero solar heat gain.' },
      { id: 'in4-2', x: 48, y: 80, title: ' Quarter-Sawn White Oak Flooring', spec: 'Matte UV-cured polyurethane finish with radiant floor heating.' }
    ]
  },
  {
    id: 'indoor-wp-5',
    tourCategory: 'interior_walkthrough',
    propertyCategory: 'residential',
    code: 'INT 05 // ARCHITECTURAL LOUVER PARTITION',
    label: 'Louvered Media Suite',
    subLabel: 'Geometric LED Frame & Open-Plan Dining Portal',
    headline: 'Modern Wood-Slat Portal & LED Media Wall',
    description:
      'Seamless zoning between formal living and sunlit garden dining using vertical ash-wood louvers, recessed perimeter LED channels, and high-gloss ivory porcelain.',
    valuation: 'Contemporary Interior Spec',
    locationBadge: 'Faisal Hills & DHA Turnkey Homes',
    focalLength: '24MM PRIME',
    altitude: 'GROUND SUITE',
    fov: '84° WIDE',
    imageUrl: INDOOR_WALKTHROUGH_GALLERY.indoor1_woodSlatTvPartition,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.interiorLiving,
    videoUrl: SHOWROOM_VIDEOS.luxuryInteriorWalk,
    motionOrigin: 'center center',
    panX: ['-1%', '1%'],
    panY: ['0%', '-0.8%'],
    scaleRange: [1.02, 1.09],
    hotspots: [
      { id: 'in5-1', x: 68, y: 45, title: 'Recessed Perimeter LED Frame', spec: 'Dimmable smart DALI lighting integrated into stone-veneer panel.' },
      { id: 'in5-2', x: 35, y: 52, title: 'Walk-Through Ash Wood Portal', spec: 'Frames the garden dining room while maintaining acoustic privacy.' }
    ]
  },
  {
    id: 'indoor-wp-6',
    tourCategory: 'interior_walkthrough',
    propertyCategory: 'residential',
    code: 'INT 06 // MOON-GATE SUNLIT PAVILION',
    label: 'Moon-Gate Living Room',
    subLabel: 'Oriental Archway, Dappled Sunlight & Veranda Views',
    headline: 'Artisanal Moon-Gate Arch & Garden Living Hall',
    description:
      'A tranquil fusion of Oriental heritage and modern luxury, where a sweeping solid-walnut moon gate frames a sun-dappled lounge opening directly onto a lush tree canopy.',
    valuation: 'Bespoke Heritage Suite',
    locationBadge: 'Signature Architectural Interiors',
    focalLength: '28MM NATURAL',
    altitude: 'GARDEN PAVILION',
    fov: '80° CINE',
    imageUrl: INDOOR_WALKTHROUGH_GALLERY.indoor3_moonGateLivingRoom,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.interiorZen,
    videoUrl: SHOWROOM_VIDEOS.luxuryInteriorWalk,
    motionOrigin: 'center center',
    panX: ['1%', '-1%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.08, 1.02],
    hotspots: [
      { id: 'in6-1', x: 22, y: 50, title: 'Handcrafted Walnut Moon-Gate', spec: 'Steam-bent architectural timber arch creating a gallery-like transition.' },
      { id: 'in6-2', x: 64, y: 48, title: 'Full-Height Lattice Veranda Doors', spec: 'Slide-and-fold thermal timber doors opening to the forest deck.' }
    ]
  },

  // ---------------- CATEGORY C: CAPSULE & CONTAINER HOMES (CAP 1 - 10) ----------------
  {
    id: 'capsule-wp-1',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    code: 'POD 01 // K5 COASTAL CAPSULE',
    label: 'K5 Waterfront Pod',
    subLabel: 'Aerospace Aluminum Shell & Panoramic Bay Glazing',
    headline: 'K5 Waterfront Modular Smart Capsule',
    description:
      'Engineered with an aviation-grade fluorocarbon aluminum shell, 270-degree curved tempered glass, voice-controlled smart IoT automation, and zero-foundation crane installation.',
    valuation: 'PKR 65 Lakh - 1.25 Crore',
    locationBadge: 'Turnkey Nationwide Delivery & Installation',
    focalLength: '24MM HDR PRIME',
    altitude: 'COASTAL DECK',
    fov: '86° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap4_k5WaterfrontCapsule,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleCoastal,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0%', '-1.5%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.02, 1.09],
    hotspots: [
      { id: 'c1-1', x: 26, y: 48, title: '270° Curved Low-E Observation Glass', spec: 'Double-glazed impact-resistant marine-grade curved glass.' },
      { id: 'c1-2', x: 59, y: 52, title: 'Biometric Smart Entry Hatch', spec: 'Keyless fingerprint, NFC, and mobile app access control.' }
    ]
  },
  {
    id: 'capsule-wp-2',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    code: 'POD 02 // V2124 DOUBLE-DECKER',
    label: 'Dual-Level V2124 Villa',
    subLabel: 'Stacked Modular Capsule with Warm Cove Lighting',
    headline: 'V2124 Double-Decker Glass Capsule Villa',
    description:
      'Two-story stacked modular architecture offering an expansive ground-floor entertaining lounge and an upper-level panoramic master sky-suite with wrap-around glass.',
    valuation: 'PKR 1.45 Crore - 1.85 Crore',
    locationBadge: 'Resort, Farmhouse & Hillside Estates',
    focalLength: '20MM ARCHITECTURAL',
    altitude: '2-STORY DUPLEX',
    fov: '92° ULTRA',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap9_doubleDeckerV2124Pod,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleModern,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-1%', '1%'],
    panY: ['0.5%', '-0.5%'],
    scaleRange: [1.03, 1.1],
    hotspots: [
      { id: 'c2-1', x: 55, y: 28, title: 'Upper-Deck Sky Master Suite', spec: ' acoustic-isolated second-story module with motorized blackout shades.' },
      { id: 'c2-2', x: 48, y: 66, title: 'Open-Span Ground Living Lounge', spec: 'Full-width sliding glass wall connecting to composite timber deck.' }
    ]
  },
  {
    id: 'capsule-wp-3',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    code: 'POD 03 // LAKESIDE SANCTUARY',
    label: 'Lakeside Glass Capsule',
    subLabel: '270-Degree Curved Thermal Glass & Private Patio',
    headline: 'Lakeside Panoramic Glamping & Resort Pod',
    description:
      'Designed for luxury eco-resorts and lakeside retreats, featuring curved floor-to-ceiling observation windows, polyurethane sub-zero insulation, and a private outdoor deck.',
    valuation: 'PKR 58 Lakh - 95 Lakh',
    locationBadge: 'Khanpur Dam, Murree & Northern Resort Belt',
    focalLength: '18MM ULTRA-WIDE',
    altitude: 'WATERFRONT',
    fov: '98° EXPANSIVE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap10_lakesidePanoramaPod,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleCoastal,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'left center',
    panX: ['-1.5%', '1%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.08, 1.02],
    hotspots: [
      { id: 'c3-1', x: 38, y: 46, title: 'Curved Thermal Curtain Wall', spec: 'Zero-condensation argon double glazing for alpine & lake climates.' },
      { id: 'c3-2', x: 64, y: 74, title: 'Modular All-Weather Deck', spec: 'WPC anti-rot composite decking on adjustable screw piles.' }
    ]
  },
  {
    id: 'capsule-wp-4',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    code: 'POD 04 // ROOFTOP CONTAINER VILLA',
    label: '2-Story Container Deck',
    subLabel: 'Expandable Shipping Container Villa with Sky Terrace',
    headline: 'Luxury Container Home with Rooftop Lounge',
    description:
      'High-cube Corten steel container residence featuring an upper-deck sky terrace, expansive wrap-around timber patio, full chef kitchen, and energy-efficient UPVC sliders.',
    valuation: 'PKR 48 Lakh - 85 Lakh',
    locationBadge: 'Farmhouses & Rapid-Deploy Plots',
    focalLength: '28MM DAYLIGHT',
    altitude: 'ROOFTOP LOUNGE',
    fov: '80° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap6_rooftopDeckContainerVilla,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleModern,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'right center',
    panX: ['1%', '-1.5%'],
    panY: ['-0.5%', '0.5%'],
    scaleRange: [1.02, 1.09],
    hotspots: [
      { id: 'c4-1', x: 48, y: 24, title: 'Structural Rooftop Entertainment Deck', spec: 'Load-rated for 12+ guests with steel cable safety railing.' },
      { id: 'c4-2', x: 65, y: 68, title: 'Wrap-Around Hardwood Veranda', spec: 'Seamless indoor-outdoor living expansion.' }
    ]
  },
  {
    id: 'capsule-wp-5',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    code: 'POD 05 // HEX-LED SMART POD',
    label: 'Cyber-Hex Container',
    subLabel: 'Smart Ambient Perimeter Lighting & Acoustic Glass',
    headline: 'Cyber-Hex LED Smart Container Studio',
    description:
      'Futuristic chamfered-bezel container architecture with programmable RGBW amber perimeter lighting, hexagonal acoustic wall matrices, and smart glass.',
    valuation: 'PKR 55 Lakh - 90 Lakh',
    locationBadge: 'Executive Studios & Private Estates',
    focalLength: '24MM f/1.4 CINE',
    altitude: 'SMART GARDEN',
    fov: '84° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap7_hexLedSmartContainer,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleForest,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center bottom',
    panX: ['-1%', '1%'],
    panY: ['1%', '-0.5%'],
    scaleRange: [1.09, 1.02],
    hotspots: [
      { id: 'c5-1', x: 54, y: 50, title: 'Hexagonal Acoustic Backwall', spec: 'Sound-absorbing geometric timber & warm LED matrix.' },
      { id: 'c5-2', x: 82, y: 42, title: 'Chamfered Perimeter Halo Portal', spec: 'Weatherproof exterior architectural LED framing.' }
    ]
  },
  {
    id: 'capsule-wp-6',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    code: 'POD 06 // Q3 ALPINE CABIN',
    label: 'Q3 Pitched-Roof Pod',
    subLabel: 'Nordic A-Frame Modular Capsule for Pine Estates',
    headline: 'Q3 Nordic Pitched-Roof Forest Capsule',
    description:
      'Purpose-built for snowfall and pine forest terrains, the Q3 combines a pitched snow-shedding roof with rounded modular corners and triple-glazed picture windows.',
    valuation: 'PKR 52 Lakh - 78 Lakh',
    locationBadge: 'Nathia Gali, Malam Jabba & Murree Hills',
    focalLength: '35MM NATURAL',
    altitude: 'FOREST RIDGE',
    fov: '76° NATURAL',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap3_q3ForestCabinPod,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleForest,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0%', '-1.5%'],
    panY: ['0%', '-1%'],
    scaleRange: [1.02, 1.08],
    hotspots: [
      { id: 'c6-1', x: 35, y: 30, title: 'Alpine Snow-Shedding Pitched Roof', spec: 'High-density polyurethane insulated roof panels rated for heavy snow.' },
      { id: 'c6-2', x: 78, y: 58, title: 'Forest Picture Window', spec: 'Floor-to-ceiling thermal glass framing woodland views.' }
    ]
  },
  {
    id: 'capsule-wp-7',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    code: 'POD 07 // TROPICAL GLASS STUDIO',
    label: 'Garden Glass Container',
    subLabel: 'Turnkey Executive Resort Suite & Home Office',
    headline: 'Curved-Bezel Tropical Glass Container Suite',
    description:
      'Sleek white modular container featuring rounded black aluminum window bezels, warm recessed ceiling strips, and plug-and-play solar readiness.',
    valuation: 'PKR 42 Lakh - 68 Lakh',
    locationBadge: 'Executive Lawn Suites & Resort Pods',
    focalLength: '24MM PRIME',
    altitude: 'GARDEN LEVEL',
    fov: '84° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap8_tropicalGlassOfficePod,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleModern,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'left center',
    panX: ['-1%', '1.5%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.03, 1.09],
    hotspots: [
      { id: 'c7-1', x: 66, y: 48, title: 'Rounded-Corner Architectural Glazing', spec: 'Gasket-sealed curved aluminum frames inspired by high-speed rail.' }
    ]
  },
  {
    id: 'capsule-wp-8',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    code: 'POD 08 // 3D LOFT CUTAWAY',
    label: 'Isometric Loft Layout',
    subLabel: 'Mezzanine Bedroom, Full Kitchen & Luxury Bath',
    headline: '3D Isometric Multi-Container Loft Plan',
    description:
      'Explore the intelligent spatial engineering inside ourL-shaped modular container homes: elevated mezzanine bed deck, ergonomic study underneath, full culinary kitchen, and spa bath.',
    valuation: 'PKR 45 Lakh - 75 Lakh',
    locationBadge: 'Custom BIM Spatial Configurations',
    focalLength: 'ISOMETRIC BIM',
    altitude: 'INTERIOR PLAN',
    fov: '60° ORTHO',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap5_isometricLoftContainer,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleModern,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0%', '0%'],
    panY: ['-1%', '1%'],
    scaleRange: [1.02, 1.07],
    hotspots: [
      { id: 'c8-1', x: 64, y: 24, title: 'Elevated Mezzanine Bedroom', spec: 'Queen loft bed with dedicated work-from-home study nook below.' },
      { id: 'c8-2', x: 58, y: 58, title: 'Full Modular Culinary Kitchen', spec: 'Built-in induction hob, sink, refrigerator, and dining island.' }
    ]
  },
  {
    id: 'capsule-wp-9',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    code: 'POD 09 // STEELMARK VERANDA POD',
    label: 'Steelmark Veranda Pod',
    subLabel: 'Integrated Timber Pergola Deck & CE/ISO Certified Shell',
    headline: 'Steelmark Turnkey Capsule with Integrated Veranda',
    description:
      'Factory-finished modular pod featuring a built-in hardwood pergola deck, triple-track sliding patio doors, and international CE, UL, TUV, and ISO-9001 quality certifications.',
    valuation: 'PKR 48 Lakh - 72 Lakh',
    locationBadge: 'Ri8Click Prefab Manufacturing Division',
    focalLength: '28MM WORKSHOP',
    altitude: 'FACTORY QA',
    fov: '80° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap1_steelmarkPorchPod,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleCoastal,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['-1%', '1%'],
    panY: ['0%', '0%'],
    scaleRange: [1.04, 1.01],
    hotspots: [
      { id: 'c9-1', x: 40, y: 65, title: 'Integrated Hardwood Veranda', spec: 'Pre-assembled weather-resistant outdoor deck within the main chassis.' },
      { id: 'c9-2', x: 55, y: 38, title: 'Forklift & Crane Lifting Channels', spec: 'Relocatable heavy-duty steel base skids for instant site placement.' }
    ]
  },
  {
    id: 'capsule-wp-10',
    tourCategory: 'capsule_containers',
    propertyCategory: 'modular',
    code: 'POD 10 // GALVANIZED STEEL CORE',
    label: 'Structural Steel Chassis',
    subLabel: 'Seismic-Grade Red Oxide Tubular Steel Skeleton',
    headline: 'Seismic-Grade Structural Steel Capsule Frame',
    description:
      'Look beneath the skin: heavy-gauge welded tubular steel ribs, anti-corrosion red-oxide primer, and closely spaced floor joists engineered for a 50+ year structural lifespan.',
    valuation: '50-Year Structural Warranty',
    locationBadge: 'Ri8Click Heavy Steel Fabrication Plant',
    focalLength: '24MM INDUSTRIAL',
    altitude: 'CHASSIS BAY',
    fov: '84° WIDE',
    imageUrl: MODULAR_CAPSULE_GALLERY.cap2_structuralSteelFrame,
    fallbackUrl: UHD_ARCHITECTURAL_BACKUPS.capsuleForest,
    videoUrl: SHOWROOM_VIDEOS.architecturalFlyover,
    motionOrigin: 'center center',
    panX: ['0%', '-1%'],
    panY: ['0%', '-0.5%'],
    scaleRange: [1.02, 1.08],
    hotspots: [
      { id: 'c10-1', x: 35, y: 35, title: 'Curved Monocoque Steel Ring Beams', spec: 'Seismic Zone-4 rated cold-rolled Q235B structural steel frame.' },
      { id: 'c10-2', x: 55, y: 72, title: 'Reinforced Sub-Floor Grid', spec: 'High-load cross-members supporting stone flooring and wet zones.' }
    ]
  }
];

type AtmosphereGrade = 'crystal_daylight' | 'solar_vivid' | 'showroom_hdr';

const WAYPOINT_DURATION_MS = 5200;

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

  // Tour Deck Category Filter ('all_showroom' tours Villas + Interiors + Capsules + Commercial)
  const [tourCategory, setTourCategory] = useState<TourDeckCategory>('all_showroom');
  const [waypointIdx, setWaypointIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoTourActive, setIsVideoTourActive] = useState(false);
  const [isCinemaTheaterMode, setIsCinemaTheaterMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Ferrari / Jaguar style 3D Spatial Perspective & Hotspot overlays
  const [is3DShowroomRig, setIs3DShowroomRig] = useState(true);
  const [showSpatialHotspots, setShowSpatialHotspots] = useState(true);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  // Brighter, sharper default optical preset
  const [atmosphere, setAtmosphere] = useState<AtmosphereGrade>('crystal_daylight');
  const [isUltraSharp, setIsUltraSharp] = useState(true);

  // View Options Slider Toggles (Supports complete banner categories)
  const [showDirectorDeck, setShowDirectorDeck] = useState(true);
  const [showCameraSwitcher, setShowCameraSwitcher] = useState(true);
  const [showTelemetryStrip, setShowTelemetryStrip] = useState(false);
  const [isHudMenuOpen, setIsHudMenuOpen] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [videoFailed, setVideoFailed] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Convert CMS commercial/project slides into full 3D tour waypoints so ALL categories work in the Tour Deck
  const cmsCommercialWaypoints: CameraWaypoint[] = useMemo(() => {
    return activeSlides.map((s, idx) => ({
      id: `cms-wp-${s.id}`,
      tourCategory: 'commercial_plazas' as TourDeckCategory,
      propertyCategory: (s.samplePropertyData?.category || 'commercial') as PropertyCategory,
      code: `CMS 0${idx + 1} // ${(s.categoryTag || 'SIGNATURE PROJECT').toUpperCase()}`,
      label: s.title.split(' ').slice(0, 3).join(' '),
      subLabel: s.subtitle || 'Landmark Commercial & Mixed-Use Development',
      headline: s.title,
      description: s.description || s.subtitle,
      valuation: s.price || 'PKR 3.5 Crore+',
      locationBadge: s.society || s.location || 'Faisal Hills & Lahore Ring Road',
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
      scaleRange: [1.02, 1.1] as [number, number],
      hotspots: [
        {
          id: `cms-hs-${idx}-1`,
          x: 48,
          y: 38,
          title: s.features?.[0] || 'Double-Glazed Thermal Curtain Wall',
          spec: 'High-visibility commercial frontage with capsule elevators & dedicated underground parking.'
        },
        {
          id: `cms-hs-${idx}-2`,
          x: 68,
          y: 62,
          title: s.features?.[1] || 'High-Yield Investment Asset',
          spec: `Located in ${s.society || 'prime corridor'} with verified NOC & turnkey management.`
        }
      ]
    }));
  }, [activeSlides]);

  // Filter waypoints based on selected Tour Deck category
  const cameraWaypoints: CameraWaypoint[] = useMemo(() => {
    const combined = [...MASTER_VIRTUAL_TOUR_WAYPOINTS, ...cmsCommercialWaypoints];
    if (tourCategory === 'all_showroom') {
      // Curated interleaved order: Constructed Villas -> Indoor Walkthrough -> Capsule Pods -> Commercial
      return combined;
    }
    const filtered = combined.filter(wp => wp.tourCategory === tourCategory);
    return filtered.length > 0 ? filtered : MASTER_VIRTUAL_TOUR_WAYPOINTS;
  }, [tourCategory, cmsCommercialWaypoints]);

  const activeWaypoint = cameraWaypoints[waypointIdx] || cameraWaypoints[0];

  // Preload current, next, and previous waypoint images so animations never flash blank
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

  // Auto-cycle camera waypoints like an automotive 3D configurator reel
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

  // Complete Tour Deck Categories (Not just container houses!)
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
      label: 'All 3D Showroom Tour',
      shortLabel: 'All Showroom',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.length + cmsCommercialWaypoints.length,
      filterCategory: 'all',
      icon: <Orbit className="w-3.5 h-3.5" />
    },
    {
      id: 'constructed_villas',
      label: 'Constructed Luxury Houses',
      shortLabel: 'Luxury Houses',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'constructed_villas').length,
      filterCategory: 'residential',
      icon: <Home className="w-3.5 h-3.5" />
    },
    {
      id: 'interior_walkthrough',
      label: 'Indoor & Courtyard Tour',
      shortLabel: 'Indoor Tour',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'interior_walkthrough').length,
      filterCategory: 'residential',
      icon: <Layers className="w-3.5 h-3.5" />
    },
    {
      id: 'capsule_containers',
      label: 'Capsule & Container Pods',
      shortLabel: 'Capsule Pods',
      count: MASTER_VIRTUAL_TOUR_WAYPOINTS.filter(w => w.tourCategory === 'capsule_containers').length,
      filterCategory: 'modular',
      icon: <Box className="w-3.5 h-3.5" />
    },
    {
      id: 'commercial_plazas',
      label: 'Commercial & Mega Towers',
      shortLabel: 'Commercial',
      count: cmsCommercialWaypoints.length,
      filterCategory: 'commercial',
      icon: <Building2 className="w-3.5 h-3.5" />
    }
  ];

  // Ultra-bright, high-clarity optical grades (pure CSS filters for 60fps GPU compositing)
  const atmosphereStyle: React.CSSProperties = useMemo(() => {
    const baseFilter =
      atmosphere === 'crystal_daylight'
        ? 'brightness(1.16) contrast(1.14) saturate(1.22)'
        : atmosphere === 'solar_vivid'
        ? 'brightness(1.22) contrast(1.12) saturate(1.32)'
        : 'brightness(1.12) contrast(1.20) saturate(1.35)';

    return {
      filter: isUltraSharp ? `${baseFilter} drop-shadow(0 0 1px rgba(255,255,255,0.15))` : baseFilter
    };
  }, [atmosphere, isUltraSharp]);

  // Reusable Slider Switch for View Options Popover
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
      className="relative w-full overflow-hidden bg-slate-950 text-white select-none shadow-[0_25px_80px_rgba(15,23,42,0.55)] border-b border-white/15"
      style={{ perspective: '1400px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      {/* =====================================================================
          1. FERRARI / JAGUAR STYLE 3D SPATIAL STAGE & ANIMATED IMAGE CANVAS
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

        {/* INTERACTIVE 3D SPATIAL HOTSPOT PINS ON THE STAGE (Like Ferrari/Jaguar 3D Configurators) */}
        {showSpatialHotspots && !isVideoTourActive && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {activeWaypoint.hotspots.map((spot) => {
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
                    <span className="relative w-7 h-7 rounded-full bg-slate-950/85 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.65)] group-hover:scale-125 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
                      <Crosshair className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.92 }}
                        className="absolute bottom-9 left-1/2 -translate-x-1/2 w-64 p-3 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-amber-400/60 shadow-2xl text-left z-30"
                      >
                        <div className="flex items-center justify-between gap-2 pb-1.5 mb-1 border-b border-white/10">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                            3D Architectural Spec
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveHotspotId(null)}
                            className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                        <div className="text-xs font-extrabold text-white">{spot.title}</div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
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

        {/* Luminous High-Clarity Daylight Scrims (Keeps images ultra-bright while anchoring text) */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isCinemaTheaterMode
              ? 'bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/15'
              : 'bg-gradient-to-r from-slate-950/65 via-slate-950/20 to-transparent'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/20 pointer-events-none" />

        {/* Subtle Solar Specular Highlight */}
        <div className="absolute -top-28 right-1/4 w-[38rem] h-[38rem] rounded-full bg-amber-300/15 blur-[140px] pointer-events-none mix-blend-screen" />
      </div>

      {/* =====================================================================
          2. TOP SHOWROOM NAVIGATION & COMPLETE CATEGORY TOUR SWITCHER
         ===================================================================== */}
      <div className="relative z-30 border-b border-white/15 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Complete Category Virtual Tour Switcher (Houses, Interiors, Capsules, Commercial) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {tourCategories.map((cat) => {
              const isSelected = tourCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setTourCategory(cat.id);
                    onSelectCategoryFilter(cat.filterCategory);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.45)]'
                      : 'bg-white/10 text-white/90 border-white/15 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {cat.icon}
                  <span className="hidden md:inline">{cat.label}</span>
                  <span className="md:hidden">{cat.shortLabel}</span>
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                      isSelected ? 'bg-slate-950 text-amber-300' : 'bg-white/15 text-white'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Direct Slider Toggle for Director's Tour Deck, Optical Grade & View Options Menu */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Direct Quick-Slider Pill for "Director's Tour Deck" (Works for ALL categories) */}
            <label
              onClick={() => setShowDirectorDeck(prev => !prev)}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/20 hover:border-amber-300/60 cursor-pointer transition-all"
              title="Toggle Director's Tour Deck for the active category"
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
            <div className="hidden xl:flex items-center bg-slate-900/80 p-0.5 rounded-full border border-white/15">
              {(
                [
                  { id: 'crystal_daylight', label: 'Crystal Daylight' },
                  { id: 'solar_vivid', label: 'Solar Vivid' },
                  { id: 'showroom_hdr', label: 'Showroom HDR' }
                ] as { id: AtmosphereGrade; label: string }[]
              ).map((grade) => (
                <button
                  key={grade.id}
                  type="button"
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

            {/* View Options Slider Menu (Complete Banner Category & HUD Customizer) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsHudMenuOpen(prev => !prev)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isHudMenuOpen
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-900/80 border-white/20 text-white hover:bg-slate-900'
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
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/20 p-4 shadow-2xl z-50 space-y-2"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                        3D Showroom &amp; Deck Controls
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsHudMenuOpen(false)}
                        className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                      >
                        Done
                      </button>
                    </div>

                    {/* Category Selector inside View Options */}
                    <div className="py-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Active Tour Deck Category
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {tourCategories.map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setTourCategory(cat.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-left flex items-center justify-between border transition-all cursor-pointer ${
                              tourCategory === cat.id
                                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                                : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className="truncate">{cat.shortLabel}</span>
                            <span className="text-[9px] opacity-80">{cat.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-1.5 space-y-1">
                      <ToggleSwitch
                        label="Director's Tour Deck"
                        description="Interactive multi-category camera monitor"
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
                        label="3D Spatial Hotspots"
                        description="Interactive spec pins on architecture"
                        checked={showSpatialHotspots}
                        onChange={() => setShowSpatialHotspots(prev => !prev)}
                      />

                      <ToggleSwitch
                        label="3D Gyro / Mouse Parallax Rig"
                        description="Ferrari/Jaguar 6-DOF camera tilt"
                        checked={is3DShowroomRig}
                        onChange={() => setIs3DShowroomRig(prev => !prev)}
                      />

                      <ToggleSwitch
                        label="Telemetry & Valuation Strip"
                        description="Detailed 4-card specification boxes"
                        checked={showTelemetryStrip}
                        onChange={() => setShowTelemetryStrip(prev => !prev)}
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
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                isCinemaTheaterMode
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-lg'
                  : 'bg-slate-900/80 border-white/20 text-white hover:bg-slate-900'
              }`}
              title="Hide text overlays for an unobstructed 3D showroom view"
            >
              {isCinemaTheaterMode ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">
                {isCinemaTheaterMode ? 'Exit Clean View' : 'Clean View'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. MAIN FOREGROUND SHOWROOM STAGE
         ===================================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 min-h-[560px] sm:min-h-[640px] flex flex-col justify-between">
        {/* Top Multi-Angle Camera Switcher Bar */}
        <AnimatePresence>
          {showCameraSwitcher && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/20 shadow-xl overflow-x-auto max-w-full no-scrollbar">
                <button
                  type="button"
                  onClick={() => setIsVideoTourActive(prev => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isVideoTourActive
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-amber-300'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{isVideoTourActive ? 'Cinema Video: ON' : 'Video Reel'}</span>
                </button>

                {isVideoTourActive && (
                  <button
                    type="button"
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
                      type="button"
                      onClick={() => {
                        setIsVideoTourActive(false);
                        setActiveHotspotId(null);
                        setWaypointIdx(idx);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Camera
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-slate-950' : 'text-amber-300'
                        }`}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}. {wp.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Optical Telemetry Readout & Pause Pill */}
              <div className="hidden lg:flex items-center gap-2.5 bg-slate-950/70 backdrop-blur-xl px-3.5 py-1.5 rounded-2xl border border-white/20">
                <Disc className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300">
                  {activeWaypoint.focalLength} • {activeWaypoint.fov}
                </span>
                <span className="text-white/30">|</span>
                <span className="text-[11px] font-medium text-white truncate max-w-[220px]">
                  {activeWaypoint.subLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPaused(prev => !prev)}
                  className="ml-1 p-1 rounded-lg bg-white/15 hover:bg-amber-400 hover:text-slate-950 text-white transition-all cursor-pointer"
                  title={isPaused ? 'Resume Auto-Pilot Tour' : 'Hold Camera Frame'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Main Content & Universal Director's Tour Deck */}
        <AnimatePresence mode="wait">
          {!isCinemaTheaterMode ? (
            <motion.div
              key="foreground-content"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-5"
            >
              {/* Left Column: Architectural Narrative & Interactive Actions */}
              <div className={showDirectorDeck ? 'lg:col-span-7' : 'lg:col-span-10'}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWaypoint.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                  >
                    {/* Category & Verified Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-400 text-slate-950 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>{activeWaypoint.code}</span>
                      </span>

                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-950/75 backdrop-blur-md text-white border border-white/25">
                        <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span>{activeWaypoint.locationBadge}</span>
                      </div>

                      <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 backdrop-blur-md">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                        <span>3D Verified Spec</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-[1.06] font-serif drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
                      {activeWaypoint.headline}
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] font-medium">
                      {activeWaypoint.description}
                    </p>

                    {/* Valuation Pill & Optional 4-Card Telemetry Strip */}
                    {!showTelemetryStrip ? (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-amber-400/50 shadow-lg">
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
                          className="px-3.5 py-2 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Gauge className="w-3.5 h-3.5 text-amber-300" />
                          <span>Telemetry Specs</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-3xl">
                        <div className="p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-amber-400/50">
                          <span className="block text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                            Valuation
                          </span>
                          <span className="text-sm sm:text-base font-black text-white font-mono">
                            {activeWaypoint.valuation}
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/20">
                          <span className="block text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                            Camera Rig
                          </span>
                          <span className="text-xs font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                            <Orbit className="w-3.5 h-3.5 text-cyan-300" />
                            <span>{activeWaypoint.focalLength}</span>
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/20">
                          <span className="block text-[10px] uppercase tracking-widest text-slate-300 font-bold">
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
                          className="p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl border border-white/20 text-left cursor-pointer"
                        >
                          <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">
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
                        className="px-5 py-3 rounded-2xl bg-slate-950/80 hover:bg-white hover:text-slate-950 text-white border border-white/30 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 backdrop-blur-xl transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-amber-300" />
                        <span>Explore Listings</span>
                      </button>

                      <button
                        type="button"
                        onClick={onContactAgentClick}
                        className="px-4 py-3 rounded-2xl bg-emerald-500/25 hover:bg-emerald-500 hover:text-slate-950 text-emerald-100 border border-emerald-400/40 font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-xl transition-all cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Book Private Tour</span>
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column: UNIVERSAL DIRECTOR'S TOUR DECK (Supports Houses, Interiors, Capsules & Commercial) */}
              {showDirectorDeck && (
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  className="lg:col-span-5 bg-slate-950/80 backdrop-blur-2xl rounded-3xl border border-white/20 p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.65)] space-y-3.5"
                >
                  {/* Deck Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-white">
                          Director&apos;s 3D Tour Deck
                        </div>
                        <div className="text-[10px] text-amber-300 font-semibold">
                          Complete Architectural &amp; Interior Showroom
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsVideoTourActive(prev => !prev)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                          isVideoTourActive
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {isVideoTourActive ? '2D/3D Stills' : '4K Video'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDirectorDeck(false)}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-slate-300 hover:text-white cursor-pointer"
                        title="Minimize Director's Tour Deck"
                      >
                        Hide
                      </button>
                    </div>
                  </div>

                  {/* Category Tabs inside Director's Tour Deck */}
                  <div className="grid grid-cols-4 gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10">
                    {(
                      [
                        { id: 'all_showroom', label: 'All' },
                        { id: 'constructed_villas', label: 'Houses' },
                        { id: 'interior_walkthrough', label: 'Interiors' },
                        { id: 'capsule_containers', label: 'Capsules' }
                      ] as { id: TourDeckCategory; label: string }[]
                    ).map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTourCategory(tab.id)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                          tourCategory === tab.id
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Interactive Thumbnail Matrix for Active Category */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[230px] overflow-y-auto pr-1 scrollbar-thin">
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
                              ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02]'
                              : 'border-white/15 opacity-80 hover:opacity-100 hover:border-white/40'
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
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                          <div className="absolute top-1 left-1.5 px-1.5 py-0.2 rounded bg-slate-950/80 text-[8px] font-mono font-bold text-amber-300">
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
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-300">
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
            /* Clean View Minimal Floating Pill */
            <motion.div
              key="clean-view-hud"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="my-auto flex items-end justify-between"
            >
              <div className="p-4 rounded-2xl bg-slate-950/65 backdrop-blur-xl border border-white/20 max-w-md">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block">
                  {activeWaypoint.code}
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">{activeWaypoint.headline}</h2>
                <p className="text-xs text-slate-200 mt-1">{activeWaypoint.subLabel}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =====================================================================
            4. BOTTOM AUTOMOTIVE-STYLE SHOWROOM TIMELINE & CAMERA SCRUBBER
           ===================================================================== */}
        <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                        isCurrent ? 'text-amber-300' : 'text-white/50 group-hover:text-white/80'
                      }`}
                    >
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold truncate max-w-[90px] transition-colors ${
                        isCurrent ? 'text-white' : 'text-white/50 group-hover:text-white/80'
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
                        animate={{ width: isPaused ? '100%' : '100%' }}
                        transition={{
                          duration: isPaused ? 0.2 : WAYPOINT_DURATION_MS / 1000,
                          ease: 'linear'
                        }}
                        className="h-full bg-amber-400"
                      />
                    ) : (
                      <div className="h-full w-0 group-hover:w-full bg-white/50 transition-all duration-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Previous / Pause / Next Camera Rig Controls */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-slate-950/75 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 transition-all cursor-pointer"
              title="Previous Camera Waypoint"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused(prev => !prev)}
              className="px-3.5 py-2 rounded-full bg-slate-950/75 hover:bg-white/20 text-white border border-white/20 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
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
              className="p-2.5 rounded-full bg-slate-950/75 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 transition-all cursor-pointer"
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
