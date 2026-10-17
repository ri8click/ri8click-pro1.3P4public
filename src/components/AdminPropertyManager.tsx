import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  MapPin, 
  ExternalLink, 
  Check, 
  X, 
  Sparkles, 
  AlertTriangle, 
  Eye, 
  DollarSign, 
  Compass, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Layers, 
  Home, 
  ChevronRight,
  RefreshCw,
  Video,
  Lock,
  BadgeCheck
} from 'lucide-react';
import { Property, AgencyAccount, ProvinceCityData, PropertyCategory, LocationData } from '../types';
import { UserAccount } from '../data/defaultAccounts';
import { LocationPickerMap } from './LocationPickerMap';
import { LocationMapView } from './LocationMapView';
import { WatermarkBadge } from './WatermarkBadge';
import { Ri8ClickLogo } from './Ri8ClickLogo';
import { PropertyMediaUploader } from './PropertyMediaUploader';

interface AdminPropertyManagerProps {
  properties: Property[];
  agencies: AgencyAccount[];
  provinceCityData: ProvinceCityData[];
  onUpdateProperties: (updated: Property[]) => void;
  onViewProperty?: (property: Property) => void;
  currentRole?: 'admin' | 'agency' | 'customer';
  isSuperAdmin?: boolean;
  currentUser?: UserAccount | null;
  onOpenRoleSwitcher?: () => void;
  onOpenVirtualTour?: (property: Property) => void;
}

export const AdminPropertyManager: React.FC<AdminPropertyManagerProps> = ({
  properties,
  agencies,
  provinceCityData,
  onUpdateProperties,
  onViewProperty,
  currentRole = 'admin',
  isSuperAdmin,
  currentUser,
  onOpenRoleSwitcher,
  onOpenVirtualTour,
}) => {
  const userIsSuperAdmin = isSuperAdmin ?? (currentUser?.role === 'admin' || currentRole === 'admin');
  const canManageAllPosts = userIsSuperAdmin || (currentUser?.permissions && currentUser.permissions.includes('manage_all_posts'));
  const currentUserAgencyId = currentUser?.agencyId;

  const canManageThisProperty = (prop: Property) => {
    if (canManageAllPosts) return true;
    if (currentUserAgencyId && prop.agencyId === currentUserAgencyId) return true;
    if (currentUser && prop.agentName && prop.agentName.toLowerCase() === currentUser.name.toLowerCase()) return true;
    return false;
  };
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PropertyCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'sold'>('all');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');

  // Modal / Editing states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [mapPreviewProperty, setMapPreviewProperty] = useState<Property | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State (for both Create & Edit)
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formCategory, setFormCategory] = useState<PropertyCategory>('residential');
  const [formType, setFormType] = useState('Villa');
  const [formPurpose, setFormPurpose] = useState<'for_sale' | 'for_rent'>('for_sale');
  const [formPrice, setFormPrice] = useState<number>(35000000);
  const [formPriceFormatted, setFormPriceFormatted] = useState('PKR 3.50 Crore');
  const [formArea, setFormArea] = useState<string>('10');
  const [formAreaUnit, setFormAreaUnit] = useState<string>('Marla');
  const [formBedrooms, setFormBedrooms] = useState<number>(4);
  const [formBathrooms, setFormBathrooms] = useState<number>(5);
  const [formFloors, setFormFloors] = useState<number>(2);
  const [formStatus, setFormStatus] = useState<'active' | 'pending' | 'sold'>('active');
  const [formIsFeatured, setFormIsFeatured] = useState<boolean>(true);
  const [formDescription, setFormDescription] = useState('');
  const [formFeatures, setFormFeatures] = useState<string>('Ri8Click Watermark Verified, UPVC Thermal Glass Windows, 24/7 Security, 100% Legal Clear Title, Near Commercial Broadway');
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [formVirtualTourVideoUrl, setFormVirtualTourVideoUrl] = useState<string>('');
  const [formVirtualTourVideoTitle, setFormVirtualTourVideoTitle] = useState<string>('');
  const [formAgencyId, setFormAgencyId] = useState(agencies[0]?.id || 'agency-1');
  
  // Location sub-form state with Latitude & Longitude
  const [formLocation, setFormLocation] = useState<LocationData>({
    province: 'Punjab',
    city: 'Taxila',
    society: 'Faisal Hills',
    block: 'Block B',
    address: 'Plot #12, Street 18, Block B, Faisal Hills, Taxila / Rawalpindi',
    latitude: 33.7297,
    longitude: 72.8258,
    mapZoom: 15,
    nearbyLandmarks: ['Faisal Hills Main Boulevard', 'Commercial Broadway Gate', 'Margalla View Point']
  });

  // Filtered properties list
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = 
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.agentCompany.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || prop.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || prop.status === statusFilter || (statusFilter === 'active' && !prop.status);
    const matchesAgency = agencyFilter === 'all' || prop.agencyId === agencyFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesAgency;
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormId(`prop-${Date.now()}`);
    setFormTitle('Luxury Designer Villa in Faisal Hills');
    setFormTagline('Brand New 10-Marla Modern House with Margalla View');
    setFormCategory('residential');
    setFormType('Villa');
    setFormPurpose('for_sale');
    setFormPrice(45000000);
    setFormPriceFormatted('PKR 4.50 Crore');
    setFormArea('10');
    setFormAreaUnit('Marla');
    setFormBedrooms(4);
    setFormBathrooms(5);
    setFormFloors(2);
    setFormStatus('active');
    setFormIsFeatured(true);
    setFormDescription('Newly constructed designer property in Faisal Hills Taxila featuring imported German UPVC double glazed windows, luxury open-concept kitchen, landscaped lawn, high rental yield potential, and verified clear title.');
    setFormFeatures('ri8click Watermark Verified, Turnkey Construction Standard, UPVC Double Glazed Windows, 24/7 Security, Underground Electricity, High Rental Yield');
    setFormImages([
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ]);
    setFormVirtualTourVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4');
    setFormVirtualTourVideoTitle('Designer Villa Walkthrough & Margalla View (15s)');
    setFormAgencyId(agencies[0]?.id || 'agency-1');
    setFormLocation({
      province: 'Punjab',
      city: 'Taxila',
      society: 'Faisal Hills',
      block: 'Block B',
      address: 'Street 22, Block B, Faisal Hills, Taxila / Rawalpindi',
      latitude: 33.7297,
      longitude: 72.8258,
      mapZoom: 15,
      nearbyLandmarks: ['Faisal Hills Main Boulevard', 'Commercial Broadway Gate', 'Margalla View Point']
    });

    setEditingProperty(null);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (prop: Property) => {
    setEditingProperty(prop);
    setFormId(prop.id);
    setFormTitle(prop.title);
    setFormTagline(prop.tagline || '');
    setFormCategory(prop.category);
    setFormType(prop.type);
    setFormPurpose(prop.purpose);
    setFormPrice(prop.price);
    setFormPriceFormatted(prop.priceFormatted);
    setFormArea(String(prop.area));
    setFormAreaUnit(prop.areaUnit);
    setFormBedrooms(prop.bedrooms || 4);
    setFormBathrooms(prop.bathrooms || 4);
    setFormFloors(prop.floors || 2);
    setFormStatus(prop.status || 'active');
    setFormIsFeatured(prop.isFeatured || false);
    setFormDescription(prop.description);
    setFormFeatures(prop.features ? prop.features.join(', ') : '');
    setFormImages(prop.images && prop.images.length > 0 ? prop.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']);
    setFormVirtualTourVideoUrl(prop.virtualTourVideoUrl || '');
    setFormVirtualTourVideoTitle(prop.virtualTourVideoTitle || '');
    setFormAgencyId(prop.agencyId);
    setFormLocation({
      province: prop.location.province,
      city: prop.location.city,
      society: prop.location.society,
      block: prop.location.block || '',
      address: prop.location.address,
      latitude: prop.location.latitude ?? 33.7297,
      longitude: prop.location.longitude ?? 72.8258,
      mapZoom: prop.location.mapZoom ?? 15,
      nearbyLandmarks: prop.location.nearbyLandmarks || ['Main Boulevard', 'Central Mosque', 'Commercial Zone']
    });

    setIsCreateModalOpen(true);
  };

  // Save (Create or Update)
  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const assignedAgency = agencies.find(a => a.id === formAgencyId) || agencies[0];
    const featuresList = formFeatures
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const savedProp: Property = {
      id: formId || `prop-${Date.now()}`,
      title: formTitle.trim(),
      tagline: formTagline.trim() || undefined,
      description: formDescription.trim(),
      category: (formCategory === 'all' ? 'residential' : formCategory),
      type: formType,
      purpose: formPurpose,
      price: Number(formPrice) || 0,
      priceFormatted: formPriceFormatted.trim(),
      currency: 'PKR',
      location: {
        province: formLocation.province,
        city: formLocation.city,
        society: formLocation.society,
        block: formLocation.block,
        address: formLocation.address,
        latitude: formLocation.latitude,
        longitude: formLocation.longitude,
        mapZoom: formLocation.mapZoom,
        nearbyLandmarks: formLocation.nearbyLandmarks
      },
      area: formArea.trim(),
      areaUnit: formAreaUnit,
      bedrooms: formCategory === 'commercial' ? undefined : formBedrooms,
      bathrooms: formCategory === 'commercial' ? undefined : formBathrooms,
      floors: formFloors,
      features: featuresList.length > 0 ? featuresList : ['ri8click Watermark Verified', 'Prime Location', 'Clear Title'],
      images: formImages.length > 0 ? formImages : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      virtualTourVideoUrl: userIsSuperAdmin ? (formVirtualTourVideoUrl.trim() || undefined) : editingProperty?.virtualTourVideoUrl,
      virtualTourVideoTitle: userIsSuperAdmin ? (formVirtualTourVideoTitle.trim() || undefined) : editingProperty?.virtualTourVideoTitle,
      hasVirtualTour: userIsSuperAdmin ? Boolean(formVirtualTourVideoUrl.trim()) : Boolean(editingProperty?.virtualTourVideoUrl),
      watermark: true,
      agencyId: assignedAgency.id,
      agentName: assignedAgency.name,
      agentCompany: assignedAgency.companyName,
      agentPhone: assignedAgency.phone,
      agentWhatsApp: assignedAgency.whatsapp,
      agentAvatar: assignedAgency.avatar,
      agentRating: assignedAgency.rating,
      isFeatured: formIsFeatured,
      isHotCommercial: formCategory === 'commercial',
      viewsCount: editingProperty ? (editingProperty.viewsCount || 0) : 0,
      savesCount: editingProperty ? (editingProperty.savesCount || 0) : 0,
      createdAt: editingProperty ? editingProperty.createdAt : new Date().toISOString(),
      status: formStatus
    };

    if (editingProperty) {
      // Update existing
      const updated = properties.map(p => p.id === editingProperty.id ? savedProp : p);
      onUpdateProperties(updated);
      showToast(`Property "${savedProp.title}" and location map updated successfully.`);
    } else {
      // Create new
      const updated = [savedProp, ...properties];
      onUpdateProperties(updated);
      showToast(`New property advertisement "${savedProp.title}" created with verified location map.`);
    }

    setIsCreateModalOpen(false);
    setEditingProperty(null);
  };

  // Delete property
  const handleConfirmDelete = () => {
    if (!deletingProperty) return;
    const updated = properties.filter(p => p.id !== deletingProperty.id);
    onUpdateProperties(updated);
    showToast(`Property "${deletingProperty.title}" deleted.`);
    setDeletingProperty(null);
  };

  // Quick Status Toggle
  const handleToggleStatus = (propId: string, currentStatus?: 'active' | 'pending' | 'sold') => {
    const nextStatusMap: Record<string, 'active' | 'pending' | 'sold'> = {
      'active': 'sold',
      'sold': 'pending',
      'pending': 'active'
    };
    const next = nextStatusMap[currentStatus || 'active'];
    const updated = properties.map(p => p.id === propId ? { ...p, status: next } : p);
    onUpdateProperties(updated);
    showToast(`Status updated to "${next.toUpperCase()}".`);
  };

  return (
    <div className="space-y-6" id="admin-property-crud-manager">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Posted Advertisements & Location Map CRUD Manager</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  {properties.length} Total Posts
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Manage, publish, edit location maps & GPS pins, update pricing, and delete posted real estate advertisements.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Advertisement</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Search Input (5 cols) */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by title, society, city, agency or ID..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Filter (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as PropertyCategory)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial Plazas & Shops</option>
              <option value="modular">Modular Capsule Smart Houses</option>
              <option value="projects">Off-Plan Projects</option>
            </select>
          </div>

          {/* Status Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Listing</option>
              <option value="pending">Pending Review</option>
              <option value="sold">Sold Out</option>
            </select>
          </div>

          {/* Agency Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={agencyFilter}
              onChange={e => setAgencyFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Agencies</option>
              {agencies.map(a => (
                <option key={a.id} value={a.id}>{a.companyName}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Filter stats count */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Showing <strong>{filteredProperties.length}</strong> of {properties.length} advertisements</span>
          {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || agencyFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setAgencyFilter('all');
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Property Data Table (CRUD Read & Action Panel) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-900 text-slate-200 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Advertisement / Property</th>
                <th className="py-3.5 px-3">Category & Type</th>
                <th className="py-3.5 px-3">Price & Area</th>
                <th className="py-3.5 px-3">Location & Map Pin</th>
                <th className="py-3.5 px-3">Agent / Agency</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No advertisements found matching your criteria</p>
                    <p className="text-[11px]">Try adjusting your search query or clear the filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Property Main Details */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 px-1 bg-black/70 text-[9px] font-bold text-white">
                            ✓ Ref
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                               onClick={() => onViewProperty?.(prop)}>
                            {prop.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            ID: <span className="font-mono">{prop.id}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap mt-1">
                            {prop.isFeatured && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold border border-amber-200">
                                <Sparkles className="w-2.5 h-2.5" /> Featured
                              </span>
                            )}
                            {prop.virtualTourVideoUrl && (
                              <span 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenVirtualTour?.(prop);
                                }}
                                className="inline-flex items-center gap-1 text-[10px] text-purple-700 bg-purple-50 hover:bg-purple-100 px-1.5 py-0.2 rounded font-semibold border border-purple-200 cursor-pointer transition-colors"
                                title="Click to view Super Admin Virtual Tour Movie"
                              >
                                <Video className="w-2.5 h-2.5" /> Movie Tour
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 font-medium">
                              {prop.images?.length || 1} {prop.images?.length === 1 ? 'photo' : 'photos'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Type */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800">{prop.type}</div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {prop.category} • {prop.purpose === 'for_sale' ? 'Sale' : 'Rent'}
                      </div>
                    </td>

                    {/* Price & Area */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{prop.priceFormatted}</div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {prop.area} {prop.areaUnit}
                      </div>
                    </td>

                    {/* Location & Map Coordinates */}
                    <td className="py-3.5 px-3 max-w-[200px]">
                      <div className="flex items-start gap-1 text-slate-800 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span className="truncate">{prop.location.society}, {prop.location.city}</span>
                      </div>
                      
                      {/* Interactive Map Pin Indicator */}
                      <button
                        onClick={() => setMapPreviewProperty(prop)}
                        className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-[10.5px] font-mono border border-blue-200"
                        title="View Location Map Pin"
                      >
                        <Compass className="w-3 h-3 text-blue-600" />
                        <span>
                          {prop.location.latitude ? `${prop.location.latitude.toFixed(3)}°N, ${prop.location.longitude?.toFixed(3)}°E` : 'Set Pin'}
                        </span>
                      </button>
                    </td>

                    {/* Agency / Agent */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800 truncate">{prop.agentName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{prop.agentCompany}</div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(prop.id, prop.status)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                          prop.status === 'sold'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : prop.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title="Click to toggle status (Active -> Sold -> Pending)"
                      >
                        {prop.status || 'active'}
                      </button>
                    </td>

                    {/* Action Buttons (CRUD) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Preview on Map */}
                        <button
                          onClick={() => setMapPreviewProperty(prop)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View Location Map"
                        >
                          <Compass className="w-4 h-4" />
                        </button>

                        {/* Virtual Tour Preview */}
                        {onOpenVirtualTour && (
                          <button
                            onClick={() => onOpenVirtualTour(prop)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              prop.virtualTourVideoUrl 
                                ? 'text-purple-600 hover:bg-purple-50' 
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                            title={prop.virtualTourVideoUrl ? "Launch 3D & Video Tour" : "Preview 360 Tour"}
                          >
                            <Video className="w-4 h-4" />
                          </button>
                        )}

                        {/* View Details */}
                        {onViewProperty && (
                          <button
                            onClick={() => onViewProperty(prop)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="View Full Advertisement"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit Property */}
                        {canManageThisProperty(prop) ? (
                          <button
                            onClick={() => handleOpenEdit(prop)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Advertisement & Map"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span
                            className="p-1.5 rounded-lg text-slate-300 cursor-not-allowed"
                            title={`Restricted Access: Managed by ${prop.agentCompany || prop.agentName}. Only Super Admin can modify other agents' listings.`}
                          >
                            <Lock className="w-4 h-4" />
                          </span>
                        )}

                        {/* Delete Property */}
                        {canManageThisProperty(prop) ? (
                          <button
                            onClick={() => setDeletingProperty(prop)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Advertisement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : null}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: CREATE / EDIT PROPERTY ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div 
            className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ri8ClickLogo size="sm" showSubtitle={false} />
                <div className="border-l border-slate-700 pl-3">
                  <h3 className="text-sm font-bold text-white">
                    {editingProperty ? 'Edit Property Advertisement & Map Pin' : 'Create New Property Advertisement'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Manage title, pricing, specifications, watermarked gallery, and GPS location map coordinates.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProperty} className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1 bg-slate-50">
              
              {/* Basic Information */}
              <div className="bg-white p-4.5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>General Property Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      placeholder="e.g. Modern Designer Villa in Faisal Hills Block B"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tagline / Subtitle (Optional)
                    </label>
                    <input
                      type="text"
                      value={formTagline}
                      onChange={e => setFormTagline(e.target.value)}
                      placeholder="e.g. 5-Bedroom Luxury Residence with Margalla Foothill Views"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value as PropertyCategory)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial Plazas & Shops</option>
                      <option value="modular">Modular Capsule Smart Houses</option>
                      <option value="projects">Off-Plan Projects</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
                    <select
                      value={formType}
                      onChange={e => setFormType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Villa">Villa</option>
                      <option value="Luxury Apartment">Luxury Apartment</option>
                      <option value="Commercial Plaza">Commercial Plaza</option>
                      <option value="Corporate Office">Corporate Office</option>
                      <option value="Retail Shop">Retail Shop</option>
                      <option value="Capsule Smart House">Capsule Smart House</option>
                      <option value="Residential Plot">Residential Plot</option>
                      <option value="Commercial Plot">Commercial Plot</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose</label>
                    <select
                      value={formPurpose}
                      onChange={e => setFormPurpose(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="for_sale">For Sale</option>
                      <option value="for_rent">For Rent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="active">Active Listing</option>
                      <option value="pending">Pending / Verification</option>
                      <option value="sold">Sold Out</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Asking Price (PKR Number)</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setFormPrice(val);
                        if (val >= 10000000) {
                          setFormPriceFormatted(`PKR ${(val / 10000000).toFixed(2)} Crore`);
                        } else if (val >= 100000) {
                          setFormPriceFormatted(`PKR ${(val / 100000).toFixed(2)} Lakh`);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Formatted Price Display</label>
                    <input
                      type="text"
                      required
                      value={formPriceFormatted}
                      onChange={e => setFormPriceFormatted(e.target.value)}
                      placeholder="e.g. PKR 4.50 Crore"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Area Dimension</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formArea}
                        onChange={e => setFormArea(e.target.value)}
                        placeholder="e.g. 10"
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      <select
                        value={formAreaUnit}
                        onChange={e => setFormAreaUnit(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="Marla">Marla</option>
                        <option value="Kanal">Kanal</option>
                        <option value="Sq Ft">Sq Ft</option>
                        <option value="Sq Yd">Sq Yd</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Agency Account</label>
                    <select
                      value={formAgencyId}
                      onChange={e => setFormAgencyId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {agencies.map(a => (
                        <option key={a.id} value={a.id}>{a.companyName} ({a.name})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rooms & Floor Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                  {formCategory !== 'commercial' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Bedrooms</label>
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={formBedrooms}
                          onChange={e => setFormBedrooms(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Bathrooms</label>
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={formBathrooms}
                          onChange={e => setFormBathrooms(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    </>
                  )}
                  <div className={formCategory === 'commercial' ? 'sm:col-span-1' : ''}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Building Storeys / Floors</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formFloors}
                      onChange={e => setFormFloors(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      placeholder="e.g. 17 (Twin Towers)"
                    />
                  </div>
                </div>
              </div>

              {/* LOCATION MAP & COORDINATES SECTION */}
              <div className="bg-white p-4.5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-rose-600" />
                    <span>Location Map & Society Pin Coordinates</span>
                  </h4>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Google Maps Ready</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Province</label>
                    <input
                      type="text"
                      value={formLocation.province}
                      onChange={e => setFormLocation({ ...formLocation, province: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formLocation.city}
                      onChange={e => setFormLocation({ ...formLocation, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Society / Zone</label>
                    <input
                      type="text"
                      value={formLocation.society}
                      onChange={e => setFormLocation({ ...formLocation, society: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Detailed Street Address</label>
                    <input
                      type="text"
                      value={formLocation.address}
                      onChange={e => setFormLocation({ ...formLocation, address: e.target.value })}
                      placeholder="e.g. Street 18, Block B, Faisal Hills, Taxila / Rawalpindi"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Embedded Interactive Map Calibration Picker */}
                <LocationPickerMap
                  location={formLocation}
                  onChangeLocation={updatedLoc => setFormLocation(updatedLoc)}
                  provinceCityData={provinceCityData}
                />
              </div>

              {/* Description & Features */}
              <div className="bg-white p-4.5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span>Description & Amenities</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={formDescription}
                    onChange={e => setFormDescription(e.target.value)}
                    placeholder="Enter comprehensive property highlights..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Key Amenities (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formFeatures}
                    onChange={e => setFormFeatures(e.target.value)}
                    placeholder="e.g. UPVC Double Glazed, 24/7 Security, 10kW Solar System, Clear NOC"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>

              {/* Media Uploader: Multiple Local Files / URLs + Super Admin Movie Clip */}
              <PropertyMediaUploader
                images={formImages}
                onChangeImages={setFormImages}
                videoUrl={formVirtualTourVideoUrl}
                onChangeVideoUrl={setFormVirtualTourVideoUrl}
                videoTitle={formVirtualTourVideoTitle}
                onChangeVideoTitle={setFormVirtualTourVideoTitle}
                isSuperAdmin={userIsSuperAdmin}
                onOpenRoleSwitcher={onOpenRoleSwitcher}
              />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProperty ? 'Save Changes & Update Map' : 'Publish Advertisement & Map'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MAP PREVIEW ================= */}
      {mapPreviewProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div 
            className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-sm sm:max-w-lg">
                    Location Map: {mapPreviewProperty.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    GPS Coordinates: {mapPreviewProperty.location.latitude ?? 33.7297}° N, {mapPreviewProperty.location.longitude ?? 72.8258}° E
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMapPreviewProperty(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <LocationMapView
                location={mapPreviewProperty.location}
                propertyTitle={mapPreviewProperty.title}
                propertyPrice={mapPreviewProperty.priceFormatted}
                propertyType={mapPreviewProperty.type}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deletingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">Delete Property Advertisement?</h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong className="text-slate-800">"{deletingProperty.title}"</strong> (ID: {deletingProperty.id})? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeletingProperty(null)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPropertyManager;
