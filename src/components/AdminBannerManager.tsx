import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Sparkles, 
  MapPin, 
  Save
} from 'lucide-react';
import { HeroSlide } from '../types';

interface AdminBannerManagerProps {
  slides: HeroSlide[];
  onUpdateSlides: (slides: HeroSlide[]) => void;
}

export const PRESET_IMAGES = [
  {
    name: 'Q3 Pitched-Roof Modular Forest Cabin Pod',
    url: 'https://www.genspark.ai/api/files/s/pSySUzgg',
    fallbackUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2000&q=85',
    category: 'modular'
  },
  {
    name: 'L-Shaped Dual-Container Loft & Interior Cutaway',
    url: 'https://www.genspark.ai/api/files/s/OypEiCb2',
    fallbackUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=85',
    category: 'modular'
  },
  {
    name: 'Rooftop Terrace Container Villa & Timber Deck',
    url: 'https://www.genspark.ai/api/files/s/3jIuxLrV',
    fallbackUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85',
    category: 'modular'
  },
  {
    name: 'Hex-Lit Matte-Black Designer Container Pod',
    url: 'https://www.genspark.ai/api/files/s/K4lfut6W',
    fallbackUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=85',
    category: 'modular'
  },
  {
    name: 'Curved-Corner Glass Executive Container Studio',
    url: 'https://www.genspark.ai/api/files/s/bl8vngPB',
    fallbackUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85',
    category: 'modular'
  },
  {
    name: 'V2124 Double-Decker Stacked Capsule Villa',
    url: 'https://www.genspark.ai/api/files/s/u84KzdvI',
    fallbackUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2000&q=85',
    category: 'modular'
  },
  {
    name: 'Lakeside Curved-Glass Observation Capsule Pod',
    url: 'https://www.genspark.ai/api/files/s/I6HwjuLB',
    fallbackUrl: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=2000&q=85',
    category: 'modular'
  },
  {
    name: 'Faisal Hills 1-Kanal Villa (Taxila / Margalla)',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
    fallbackUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
    category: 'residential'
  },
  {
    name: 'Islamabad Blue Area Highrise / The Centaurus',
    url: 'https://towers.pk/wp-content/uploads/2023/11/Centaurus_Mall-1.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85',
    category: 'commercial'
  },
  {
    name: 'Ri8click UPVC Sliding Patio Doors & Thermal Glazing',
    url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2000&q=85',
    fallbackUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2000&q=85',
    category: 'projects'
  },
  {
    name: 'Multi Gardens B-17 Sector G Margalla Residence',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=85',
    fallbackUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=85',
    category: 'residential'
  },
  {
    name: 'Lahore DHA Phase 6 Commercial Boulevard Highrise',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85',
    fallbackUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85',
    category: 'commercial'
  }
];

export const AdminBannerManager: React.FC<AdminBannerManagerProps> = ({
  slides,
  onUpdateSlides,
}) => {
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form State for create/edit
  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    categoryTag: 'Contemporary Modular Capsule',
    badgeColor: 'bg-indigo-600 text-white',
    title: '',
    subtitle: '',
    description: '',
    price: 'PKR 68 Lakh',
    location: 'Taxila / Islamabad',
    society: 'Faisal Hills & Resort Estates',
    imageUrl: PRESET_IMAGES[0].url,
    tourRoomsCount: 4,
    isActive: true,
    features: ['Aerospace Capsule Shell', 'Ri8Click UPVC Glazing', 'Smart IoT Controls', 'Turnkey Delivery']
  });

  const [featureInput, setFeatureInput] = useState<string>('');

  const handleStartCreate = () => {
    setFormData({
      id: `slide-${Date.now()}`,
      categoryTag: 'Contemporary Modular Capsule',
      badgeColor: 'bg-indigo-600 text-white',
      title: '',
      subtitle: '',
      description: '',
      price: 'PKR 68 Lakh',
      location: 'Islamabad / Taxila',
      society: 'Faisal Hills (Executive Block)',
      imageUrl: PRESET_IMAGES[0].url,
      tourRoomsCount: 4,
      isActive: true,
      order: slides.length + 1,
      features: ['Aerospace Capsule Shell', 'Ri8Click UPVC Windows', 'Solar Backup', 'Margalla View'],
      samplePropertyData: {
        title: 'New Featured Capsule / Property',
        category: 'modular',
        location: { city: 'Taxila', society: 'Faisal Hills', province: 'Punjab' }
      }
    });
    setIsCreatingNew(true);
    setEditingSlide(null);
  };

  const handleStartEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({ ...slide });
    setIsCreatingNew(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      alert('Please provide at least a Title and Image URL');
      return;
    }

    if (isCreatingNew) {
      const newSlide: HeroSlide = {
        id: `slide-${Date.now()}`,
        categoryTag: formData.categoryTag || 'Featured Property',
        badgeColor: formData.badgeColor || 'bg-blue-600 text-white',
        title: formData.title || '',
        subtitle: formData.subtitle || '',
        description: formData.description || '',
        price: formData.price || 'PKR 5 Crore',
        location: formData.location || 'Taxila',
        society: formData.society || 'Faisal Hills',
        imageUrl: formData.imageUrl || PRESET_IMAGES[0].url,
        tourRoomsCount: formData.tourRoomsCount || 3,
        isActive: formData.isActive !== false,
        order: slides.length + 1,
        features: formData.features && formData.features.length > 0 
          ? formData.features 
          : ['Prime Location', 'Ri8Click UPVC Glazing', 'Watermarked Listing'],
        samplePropertyData: formData.samplePropertyData || {
          title: formData.title,
          category: 'modular',
          location: { city: 'Taxila', society: 'Faisal Hills', province: 'Punjab' }
        }
      };
      onUpdateSlides([...slides, newSlide]);
      setIsCreatingNew(false);
    } else if (editingSlide) {
      const updated = slides.map(s => {
        if (s.id === editingSlide.id) {
          return {
            ...s,
            ...formData,
            features: formData.features || s.features
          } as HeroSlide;
        }
        return s;
      });
      onUpdateSlides(updated);
      setEditingSlide(null);
    }
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert('You must have at least 1 hero banner slide.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this banner slide?')) {
      onUpdateSlides(slides.filter(s => s.id !== id));
      if (editingSlide?.id === id) setEditingSlide(null);
    }
  };

  const handleToggleActive = (id: string) => {
    onUpdateSlides(slides.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;
    
    // Update order numbering
    const reordered = newSlides.map((s, idx) => ({ ...s, order: idx + 1 }));
    onUpdateSlides(reordered);
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    const current = formData.features || [];
    setFormData({ ...formData, features: [...current, featureInput.trim()] });
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    const current = formData.features || [];
    setFormData({ ...formData, features: current.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Hero Banner &amp; Capsule Showcase Slide Manager</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, update, reorder and delete full-screen hero slides featuring Contemporary Capsule &amp; Container Houses, Islamabad Highrises, UPVC Systems, and Luxury Villas.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner Slide</span>
        </button>
      </div>

      {/* Slide Edit / Create Form Modal Card */}
      {(isCreatingNew || editingSlide) && (
        <div className="bg-white rounded-xl border-2 border-blue-500/40 p-5 sm:p-6 space-y-5 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">
                {isCreatingNew ? 'Create New Banner Slide' : `Edit Slide: ${editingSlide?.title}`}
              </h4>
            </div>
            <button
              onClick={() => {
                setIsCreatingNew(false);
                setEditingSlide(null);
              }}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Banner Main Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Model V2124 Double-Decker Stacked Space Capsule Villa"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Futuristic Two-Story Capsule Home with 270° Curved UPVC Glazing"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Tag */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category Tag</label>
                <input
                  type="text"
                  value={formData.categoryTag || ''}
                  onChange={e => setFormData({ ...formData, categoryTag: e.target.value })}
                  placeholder="e.g. Contemporary Capsule House"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Badge Color */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Badge Color Style</label>
                <select
                  value={formData.badgeColor || 'bg-blue-600 text-white'}
                  onChange={e => setFormData({ ...formData, badgeColor: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="bg-indigo-600 text-white">Indigo / Purple (Modular / Capsules)</option>
                  <option value="bg-blue-600 text-white">Blue Accent (Residential / Luxury)</option>
                  <option value="bg-emerald-600 text-white">Emerald Green (Highrise / High ROI)</option>
                  <option value="bg-amber-600 text-white">Amber Gold (UPVC / Margalla Hillside)</option>
                  <option value="bg-rose-600 text-white">Rose Red (Exclusive Deal)</option>
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Formatted Price</label>
                <input
                  type="text"
                  value={formData.price || ''}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. PKR 68 Lakh or PKR 1.35 Crore"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location & Society */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Location &amp; Society</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Taxila / Islamabad"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={formData.society || ''}
                    onChange={e => setFormData({ ...formData, society: e.target.value })}
                    placeholder="e.g. Faisal Hills Block B"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Description (1-2 sentences)</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed architectural specifications and highlights..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image URL & Presets */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  High-Resolution Architectural / Capsule Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl || ''}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />

                {/* Preset Quick Selectors */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-medium text-slate-500">
                    Quick-Select Contemporary Capsule Houses, UPVC &amp; Pakistani Landmark Photography:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                        className={`p-2 rounded-lg border text-left transition-all flex flex-col gap-1 ${
                          formData.imageUrl === preset.url
                            ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          onError={e => {
                            const target = e.currentTarget;
                            if (preset.fallbackUrl && target.src !== preset.fallbackUrl) {
                              target.src = preset.fallbackUrl;
                            }
                          }}
                          className="w-full h-14 object-cover rounded brightness-105 contrast-[1.05]" 
                        />
                        <span className="text-[10px] font-medium text-slate-700 truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bullet Features Manager */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Feature Bullet Badges</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    placeholder="e.g. 270° Curved UPVC Glass or Turnkey 7-Day Setup"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Add Feature
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.features?.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingSlide(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2 shadow-2xs"
              >
                <Save className="w-4 h-4" />
                <span>{isCreatingNew ? 'Save & Publish Slide' : 'Update Slide Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Slide Items List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Active Slides in Sequence ({slides.length})
        </h4>

        <div className="space-y-3">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`bg-white rounded-xl border transition-all p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                slide.isActive 
                  ? 'border-slate-200 shadow-2xs hover:border-slate-300' 
                  : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              {/* Left Thumbnail & Info */}
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                <div className="relative w-24 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-900">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    onError={e => {
                      e.currentTarget.src = PRESET_IMAGES[0].fallbackUrl;
                    }}
                    className="w-full h-full object-cover brightness-105 contrast-[1.04]"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white">
                    #{index + 1}
                  </div>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${slide.badgeColor}`}>
                      {slide.categoryTag}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {slide.price}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {slide.society}, {slide.location}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {slide.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {slide.features?.slice(0, 3).map((feat, fidx) => (
                      <span key={fidx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        • {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Operations Controls */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                {/* Order Controls */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 mr-1">
                  <button
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move slide up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move slide down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Toggle Active */}
                <button
                  onClick={() => handleToggleActive(slide.id)}
                  className={`p-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 ${
                    slide.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                  title={slide.isActive ? 'Disable slide' : 'Enable slide'}
                >
                  {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="text-[11px]">{slide.isActive ? 'Active' : 'Hidden'}</span>
                </button>

                {/* Edit */}
                <button
                  onClick={() => handleStartEdit(slide)}
                  className="p-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors"
                  title="Edit slide"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="p-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-colors"
                  title="Delete slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBannerManager;
