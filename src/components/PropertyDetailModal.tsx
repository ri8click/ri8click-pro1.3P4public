import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  Calendar, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Tag, 
  Building2, 
  Layers, 
  Compass, 
  Video,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Property } from '../types';
import { WatermarkBadge } from './WatermarkBadge';
import { LocationMapView } from './LocationMapView';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (propertyId: string) => void;
  onScheduleTour: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isSaved,
  onToggleSave,
  onScheduleTour
}) => {
  if (!property) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  const currentImage = images[activeImageIdx] || images[0];

  const handleWhatsApp = () => {
    const phone = property.agentWhatsApp || property.agentPhone || '923365666727';
    const text = encodeURIComponent(`Assalam o Alaikum, I am inquiring about "${property.title}" (PKR ${property.priceFormatted}) on ri8click.`);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${property.agentPhone || '+923365666727'}`, '_self');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out ${property.title} in ${property.location.society}, ${property.location.city} on ri8click`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Listing link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-300 truncate">
            <span className="font-bold text-white">ri8click Listing #{property.id.slice(0, 8)}</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{property.location.society}, {property.location.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Share Listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Save"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Main Photo Gallery Viewport */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
              <img
                src={currentImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Watermark Overlay */}
              <WatermarkBadge position="bottom-right" size="md" showVerifiedText={true} />

              {/* Price & Tagline */}
              <div className="absolute bottom-4 left-4 z-10 text-white space-y-0.5">
                <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                  {property.purpose === 'for_rent' ? 'For Rent' : 'Verified For Sale'}
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono drop-shadow-md">
                  {property.priceFormatted}
                </div>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIdx === idx ? 'border-blue-600 scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Address & Specifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Details, Amenities, Location Map */}
            <div className="lg:col-span-2 space-y-6">
              
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location.address || `${property.location.society}, ${property.location.city}`}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                  {property.title}
                </h2>
                {property.tagline && (
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {property.tagline}
                  </p>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 block text-[11px]">Area</span>
                  <span className="font-extrabold text-slate-900 text-sm">{property.area} {property.areaUnit}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 block text-[11px]">Category</span>
                  <span className="font-extrabold text-slate-900 capitalize">{property.category}</span>
                </div>
                {property.bedrooms && (
                  <div className="space-y-0.5">
                    <span className="text-slate-500 block text-[11px]">Bedrooms</span>
                    <span className="font-extrabold text-slate-900 text-sm">{property.bedrooms} Beds</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="space-y-0.5">
                    <span className="text-slate-500 block text-[11px]">Bathrooms</span>
                    <span className="font-extrabold text-slate-900 text-sm">{property.bathrooms} Baths</span>
                  </div>
                )}
              </div>

              {/* Comprehensive Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Property Overview & Features
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities & Highlights */}
              {property.features && property.features.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Amenities & Structural Highlights
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {property.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Map Section */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <LocationMapView
                  location={property.location}
                  propertyTitle={property.title}
                  propertyPrice={property.priceFormatted}
                  propertyType={property.type}
                />
              </div>

            </div>

            {/* Right 1 Col: Agent Card & Contact Box */}
            <div className="space-y-5">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Authorized Agent Partner</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={property.agentAvatar}
                    alt={property.agentName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {property.agentName}
                    </h4>
                    <p className="text-xs text-slate-500">{property.agentCompany}</p>
                    <div className="text-[11px] text-amber-600 font-bold mt-0.5">
                      ★ {property.agentRating} Verified Agent
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleCall}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>Call: {property.agentPhone}</span>
                  </button>

                  <button
                    onClick={() => onScheduleTour(property)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Free Site Tour</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 text-center bg-white p-3 rounded-xl border border-slate-200/60">
                  🛡️ ri8click Guarantee: All properties are physically verified and legally vetted.
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetailModal;
