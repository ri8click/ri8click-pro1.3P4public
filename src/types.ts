export type PropertyCategory = 'all' | 'residential' | 'commercial' | 'modular' | 'projects';
export type PropertyPurpose = 'for_sale' | 'for_rent';
export type PropertyType = 
  | 'Villa' 
  | 'Luxury Apartment' 
  | 'Commercial Plaza' 
  | 'Corporate Office' 
  | 'Retail Shop' 
  | 'Capsule Smart House' 
  | 'Commercial Plot' 
  | 'Residential Plot'
  | 'Penthouse'
  | 'Warehouse'
  | string;

export interface LocationData {
  province: string;
  city: string;
  society: string;
  block?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  mapZoom?: number;
  nearbyLandmarks?: string[];
}

export interface Property {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  category: 'residential' | 'commercial' | 'modular' | 'projects';
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  priceFormatted: string;
  currency?: 'PKR' | 'USD';
  location: LocationData;
  area: number | string;
  areaUnit: 'Marla' | 'Kanal' | 'Sq Ft' | 'Sq Yd' | string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  floors?: number;
  features: string[];
  images: string[];
  watermark: boolean;
  agencyId: string;
  agentName: string;
  agentPhone: string;
  agentWhatsApp: string;
  agentAvatar: string;
  agentCompany: string;
  agentRating: number;
  isFeatured?: boolean;
  isHotCommercial?: boolean;
  viewsCount?: number;
  savesCount?: number;
  createdAt: string;
  status?: 'active' | 'pending' | 'sold';
  virtualTourVideoUrl?: string; // Short movie clip for virtual tour (Super Admin privilege)
  virtualTourVideoTitle?: string;
  hasVirtualTour?: boolean;
}

export interface ProvinceCityData {
  province: string;
  cities: {
    name: string;
    societies: string[];
  }[];
}

export interface AgencyAccount {
  id: string;
  name: string;
  companyName: string;
  role: 'agency' | 'agent' | 'customer';
  email: string;
  phone: string;
  whatsapp: string;
  avatar: string;
  verified: boolean;
  rating: number;
  totalPosts: number;
  postLimit: number;
  activeListings: number;
  city: string;
  primarySociety: string;
  memberSince: string;
  status: 'active' | 'suspended';
  canManageAdvibe?: boolean;
  address?: string;
  bio?: string;
}

export interface AdStatusRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  agencyId: string;
  agencyName: string;
  agentName: string;
  requestedAction: 'enable' | 'disable';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  adminNote?: string;
}

export interface ConsortiumDivision {
  id: string;
  title: string;
  shortName: string;
  tagline: string;
  description: string;
  badge: string;
  iconName: string;
  image: string;
  capabilities: string[];
  stats: { label: string; value: string }[];
  contactPerson: string;
  contactPhone: string;
  contactWhatsApp: string;
}

export interface SearchFilterState {
  searchQuery: string;
  purpose: 'all' | 'for_sale' | 'for_rent';
  category: PropertyCategory;
  province: string;
  city: string;
  society: string;
  propertyType: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number | null;
  areaUnit?: string;
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
  agencyId?: string;
}

export interface TourBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  agentName: string;
  agentPhone: string;
  agentWhatsApp: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  categoryTag: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  location: string;
  society: string;
  imageUrl: string;
  tourRoomsCount: number;
  isActive: boolean;
  order: number;
  features: string[];
  samplePropertyData?: {
    title: string;
    category: 'residential' | 'commercial' | 'modular' | 'projects';
    location: {
      city: string;
      society: string;
      province: string;
    };
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Market Trends' | 'Project Updates' | 'Investment Guides' | 'Construction & UPVC' | 'Modular Housing' | 'Legal & NOC';
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  viewsCount: number;
  isFeatured?: boolean;
  status: 'published' | 'draft';
}

export interface SiteSectionPortion {
  id: string;
  key: 
    | 'top_announcement_bar'
    | 'hero_slider' 
    | 'search_bar' 
    | 'properties_grid' 
    | 'commercial_showcase' 
    | 'modular_showcase' 
    | 'agencies_network' 
    | 'consortium_showcase' 
    | 'news_blogs_section'
    | 'cta_banner';
  name: string;
  title: string;
  subtitle: string;
  isEnabled: boolean;
  order: number;
  badge?: string;
  description?: string;
}

// ==========================================
// ADVIBE MODULE DATA TYPES & CONTRACTS
// ==========================================

export type AdVibeProjectType = 
  | 'Housing Society' 
  | 'High-Rise Tower' 
  | 'Luxury Apartments' 
  | 'Commercial Development' 
  | 'Smart Villa Community' 
  | 'Waterfront Enclave' 
  | 'Mixed-Use Megaproject';

export type AdVibeProjectStatus = 
  | 'Upcoming' 
  | 'Booking Open' 
  | 'Under Construction' 
  | 'Ready to Move' 
  | 'Limited Units' 
  | 'Sold Out';

export type AdVibeSectionType = 
  | 'hero' 
  | 'intro' 
  | 'highlights' 
  | 'stats' 
  | 'salient' 
  | 'master_plan' 
  | 'location' 
  | 'amenities' 
  | 'gallery' 
  | 'videos' 
  | 'virtual_tour' 
  | 'units' 
  | 'pricing' 
  | 'developer' 
  | 'enquiry' 
  | 'cta' 
  | 'disclaimer'
  | 'custom_text'
  | 'custom_image';

export interface AdVibeTheme {
  primaryColor: string;
  accentColor: string;
  bgStyle: 'dark' | 'light' | 'midnight' | 'slate' | 'luxury_black';
  fontHeading: 'Playfair Display' | 'Plus Jakarta Sans' | 'Cormorant Garamond' | 'Outfit';
  fontBody: 'Plus Jakarta Sans' | 'Inter' | 'Manrope';
  buttonStyle: 'rounded-xl' | 'rounded-full' | 'rounded-md' | 'pill-glow';
  overlayOpacity: number;
  animationIntensity: 'subtle' | 'standard' | 'dynamic' | 'reduced';
}

export interface AdVibeSEO {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonicalUrl?: string;
  keywords: string[];
}

export interface AdVibeDeveloper {
  name: string;
  logo: string;
  description: string;
  foundedYear?: number;
  completedProjects?: number;
  ongoingProjects?: number;
  rating?: number;
  website?: string;
  phone?: string;
  email?: string;
}

export interface AdVibeHighlight {
  id: string;
  title: string;
  value: string;
  description: string;
  iconName: string;
  image?: string;
}

export interface AdVibeAmenity {
  id: string;
  name: string;
  category: 'Wellness & Sports' | 'Security & Infrastructure' | 'Lifestyle & Leisure' | 'Smart Technology';
  description: string;
  iconName: string;
  image?: string;
}

export interface AdVibeLocationPoint {
  id: string;
  name: string;
  category: 'Highway & Access' | 'Education' | 'Healthcare' | 'Commercial & Retail' | 'Airport' | 'Natural Landmark';
  distance: string;
  driveTime: string;
  iconName?: string;
}

export interface AdVibeHotspot {
  id: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  title: string;
  category: 'Residential Block' | 'Commercial Broadway' | 'Civic Center' | 'Park / Green Spine' | 'Mosque' | 'Clubhouse' | 'Education City';
  description: string;
  status: 'Available' | 'Booking Fast' | 'Sold Out' | 'Under Development';
  totalPlots?: number;
  availablePlots?: number;
  linkedPropertyId?: string; // connects directly to existing Property record
}

export interface AdVibeMasterPlan {
  imageUrl: string;
  satelliteImageUrl?: string;
  legend: { category: string; color: string }[];
  hotspots: AdVibeHotspot[];
}

export interface AdVibeMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  category: 'Exterior' | 'Interior' | 'Aerial Drone' | 'Master Plan' | 'Construction Update' | 'Amenities';
  caption: string;
  tags?: string[];
}

export interface AdVibeVideoItem {
  id: string;
  title: string;
  category: 'Project Tour' | 'Location Tour' | 'Amenities' | 'Construction' | 'Apartment Tour' | 'Developer Message';
  type: 'hosted' | 'youtube' | 'vimeo';
  url: string;
  thumbnail: string;
  duration?: string;
  description?: string;
}

export interface AdVibePricingPlan {
  id: string;
  unitType: string;
  size: string;
  totalPrice: string;
  downPayment: string;
  monthlyInstallment: string;
  quarterlyBalloon?: string;
  possession: string;
  features: string[];
}

export interface AdVibeLead {
  id: string;
  projectId: string;
  projectTitle: string;
  name: string;
  phone: string;
  email: string;
  preferredUnit: string;
  message: string;
  contactPreference: 'whatsapp' | 'phone' | 'email';
  source?: 'website_advibe' | 'site_visit_request' | 'brochure_download' | 'price_sheet';
  status: 'new' | 'contacted' | 'site_visit_booked' | 'closed';
  notes?: string;
  createdAt: string;
}

export interface AdVibeSection {
  id: string;
  type: AdVibeSectionType;
  title: string;
  subtitle: string;
  tagline?: string;
  badge?: string;
  isEnabled: boolean;
  order: number;
  content?: any;
  customSettings?: {
    layout?: 'default' | 'split' | 'grid' | 'cards' | 'fullscreen';
    backgroundOverride?: string;
    pinnedScroll?: boolean;
    bgVideoUrl?: string;
    bgImageUrl?: string;
  };
}

export interface AdVibeProject {
  id: string;
  title: string;
  slug: string;
  type: AdVibeProjectType;
  developer: AdVibeDeveloper;
  logo: string;
  tagline: string;
  description: string;
  city: string;
  area: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
    zoom?: number;
  };
  starting_price: number;
  starting_price_formatted: string;
  price_range?: string;
  status: AdVibeProjectStatus;
  featured: boolean;
  published: boolean;
  archived?: boolean;
  schedule: {
    startDate?: string;
    completionDate?: string;
    launchDate?: string;
  };
  theme: AdVibeTheme;
  seo: AdVibeSEO;
  sections: AdVibeSection[];
  highlights: AdVibeHighlight[];
  amenities: AdVibeAmenity[];
  locationPoints: AdVibeLocationPoint[];
  masterPlan: AdVibeMasterPlan;
  gallery: AdVibeMediaItem[];
  videos: AdVibeVideoItem[];
  virtualTour: {
    provider: 'matterport' | 'kuula' | 'custom360' | 'video';
    url: string;
    title?: string;
    instructions?: string;
    autoRun?: boolean; // Auto-run 3D tour by default
    rotationSpeed?: number; // 0.5 to 3
    dayNightMode?: boolean; // Support day & night lighting toggle
    scenes?: {
      id: string;
      name: string;
      imageUrl: string;
      nightImageUrl?: string;
      category?: string;
      description?: string;
      hotspots?: {
        id: string;
        x: number; // 0-100%
        y: number; // 0-100%
        title: string;
        description?: string;
        actionUrl?: string;
      }[];
    }[];
  };
  linkedPropertyIds: string[]; // references existing Property records
  pricingTiers: AdVibePricingPlan[];
  downloadableBrochureUrl?: string;
  dealerId?: string; // agencyId or 'admin'
  dealerName?: string;
  dealerPhone?: string;
  dealerWhatsApp?: string;
  createdAt: string;
  updatedAt: string;
  viewsCount?: number;
}

