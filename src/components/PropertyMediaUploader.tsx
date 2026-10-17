import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Link as LinkIcon, 
  Film, 
  Trash2, 
  Star, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Play, 
  Sparkles, 
  Eye, 
  Plus, 
  FileVideo,
  ShieldCheck,
  Video,
  FileImage,
  RefreshCw
} from 'lucide-react';
import { WatermarkBadge } from './WatermarkBadge';

interface PropertyMediaUploaderProps {
  images: string[];
  onChangeImages: (images: string[]) => void;
  videoUrl?: string;
  onChangeVideoUrl: (url: string) => void;
  videoTitle?: string;
  onChangeVideoTitle: (title: string) => void;
  isSuperAdmin: boolean;
  onOpenRoleSwitcher?: () => void;
}

const SAMPLE_IMAGES = [
  { name: 'Villa Exterior', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Modern Living Room', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Luxury Kitchen', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Master Bedroom', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Commercial Plaza Facade', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Capsule House Pod', url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80' }
];

const SAMPLE_VIDEOS = [
  {
    name: 'Executive Commercial Plaza (15s Drone Tour)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Executive Commercial Plaza 3D Tour & Facade Walkthrough (15s)'
  },
  {
    name: 'Faisal Hills Luxury Villa (15s Walkthrough)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    title: 'Faisal Hills Designer Villa Walkthrough & Margalla View (15s)'
  },
  {
    name: 'Modern Apartment Interior (18s HD)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-living-room-and-kitchen-40748-large.mp4',
    title: 'Designer Interior Walkthrough (18s)'
  }
];

export const PropertyMediaUploader: React.FC<PropertyMediaUploaderProps> = ({
  images,
  onChangeImages,
  videoUrl = '',
  onChangeVideoUrl,
  videoTitle = '',
  onChangeVideoTitle,
  isSuperAdmin,
  onOpenRoleSwitcher
}) => {
  // Local states for images
  const [imageTab, setImageTab] = useState<'local' | 'url'>('local');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessingLocal, setIsProcessingLocal] = useState(false);
  const [imageUploadMessage, setImageUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local states for Super Admin video
  const [videoTab, setVideoTab] = useState<'local' | 'url'>('local');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoFileSizeInfo, setVideoFileSizeInfo] = useState<string | null>(null);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // ================= Handle Local Image Files Upload =================
  const handleLocalImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessingLocal(true);
    setImageUploadMessage(null);

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      setImageUploadMessage('Please select valid image files (JPG, PNG, WebP).');
      setIsProcessingLocal(false);
      return;
    }

    // Read all files via FileReader
    const promises = validFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('File reading error'));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((dataUrls) => {
        const updated = [...images, ...dataUrls];
        onChangeImages(updated);
        setImageUploadMessage(`Successfully added ${dataUrls.length} photo(s) from local system.`);
        setTimeout(() => setImageUploadMessage(null), 4000);
      })
      .catch((err) => {
        console.error('Error reading image files:', err);
        setImageUploadMessage('Error uploading some images. Please try again.');
      })
      .finally(() => {
        setIsProcessingLocal(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
  };

  // Drag & Drop for images
  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleLocalImageFiles(e.dataTransfer.files);
    }
  };

  // ================= Handle Image URLs =================
  const handleAddImageUrl = (urlToAdd?: string) => {
    const raw = urlToAdd || urlInput;
    if (!raw.trim()) return;

    // Support comma or newline separated multiple URLs
    const splitUrls = raw
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 5);

    if (splitUrls.length > 0) {
      onChangeImages([...images, ...splitUrls]);
      if (!urlToAdd) setUrlInput('');
      setImageUploadMessage(`Added ${splitUrls.length} image URL(s).`);
      setTimeout(() => setImageUploadMessage(null), 3000);
    }
  };

  // Move image to cover (index 0)
  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const filtered = images.filter((_, i) => i !== index);
    onChangeImages([item, ...filtered]);
  };

  // Remove single image
  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChangeImages(updated);
  };

  // Clear all images
  const handleClearAllImages = () => {
    if (window.confirm('Are you sure you want to remove all attached images?')) {
      onChangeImages([]);
    }
  };

  // ================= Handle Super Admin Video File Upload =================
  const handleLocalVideoFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate video type
    if (!file.type.startsWith('video/')) {
      setVideoError('Please upload a valid movie clip file (MP4, WebM, MOV).');
      return;
    }

    // Size calculation (MB)
    const sizeInMB = file.size / (1024 * 1024);
    const sizeText = `${sizeInMB.toFixed(1)} MB`;

    if (sizeInMB > 100) {
      setVideoError(`File size (${sizeText}) is too large. For short size virtual tour movie clips, please select a clip under 50MB.`);
      return;
    }

    setVideoError(null);
    setIsProcessingVideo(true);
    setVideoFileSizeInfo(`${sizeText} • ${file.type || 'video/mp4'}`);

    // Read as Data URL or Object URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChangeVideoUrl(e.target.result as string);
        if (!videoTitle) {
          const defaultName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          onChangeVideoTitle(`Virtual Tour: ${defaultName}`);
        }
      }
      setIsProcessingVideo(false);
    };
    reader.onerror = () => {
      setVideoError('Failed to read video file. Try another clip or link by URL.');
      setIsProcessingVideo(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle Video URL
  const handleApplyVideoUrl = (urlToApply?: string, sampleTitle?: string) => {
    const targetUrl = (urlToApply || videoUrlInput).trim();
    if (!targetUrl) return;

    onChangeVideoUrl(targetUrl);
    setVideoFileSizeInfo('Cloud Video Stream');
    setVideoError(null);
    if (sampleTitle) {
      onChangeVideoTitle(sampleTitle);
    } else if (!videoTitle) {
      onChangeVideoTitle('3D Virtual Tour Walkthrough');
    }
    if (!urlToApply) setVideoUrlInput('');
  };

  const handleRemoveVideo = () => {
    onChangeVideoUrl('');
    onChangeVideoTitle('');
    setVideoFileSizeInfo(null);
    setVideoError(null);
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6" id="property-media-uploader">
      
      {/* ========================================================
          1. MULTIPLE PROPERTY PHOTOS UPLOADER (LOCAL SYSTEM OR URL)
          ======================================================== */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 space-y-4 shadow-2xs">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <FileImage className="w-4 h-4 text-blue-600" />
              <span>Property Gallery Photos (Upload Multiple Files or URLs)</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Upload multiple images from your local system or paste image links. All photos are automatically protected with the Ri8Click watermark.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{images.length} {images.length === 1 ? 'Photo' : 'Photos'} Attached</span>
            </span>

            {images.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllImages}
                className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Remove all photos"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Source Mode Switcher: Local System Files vs Web URL */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setImageTab('local')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              imageTab === 'local'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload from Local System</span>
          </button>

          <button
            type="button"
            onClick={() => setImageTab('url')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              imageTab === 'url'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Add via Image URL(s)</span>
          </button>
        </div>

        {/* TAB 1: LOCAL SYSTEM UPLOAD (DRAG & DROP / MULTI-SELECT) */}
        {imageTab === 'local' && (
          <div className="space-y-3">
            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleImageDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/70 rounded-xl p-5 text-center cursor-pointer transition-all space-y-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleLocalImageFiles(e.target.files)}
              />

              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800">
                  {isProcessingLocal ? 'Processing Local Files...' : 'Click to Browse or Drag & Drop Multiple Images'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Select multiple JPG, PNG, WEBP files from your computer or phone • Auto-watermarked
                </div>
              </div>

              <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Instant Multi-Photo Client Encoder</span>
              </div>
            </div>

            {imageUploadMessage && (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{imageUploadMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: URL INPUT (SINGLE OR BULK) */}
        {imageTab === 'url' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste image link: https://images.unsplash.com/... (or comma separated)"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImageUrl();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleAddImageUrl()}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image</span>
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-slate-500">
                Quick Sample Presets (Click to add high-resolution real estate photography):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddImageUrl(sample.url)}
                    className="px-2.5 py-1 rounded-md text-[10.5px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80 flex items-center gap-1"
                  >
                    <span>+</span>
                    <span>{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {imageUploadMessage && (
              <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{imageUploadMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* ATTACHED IMAGES GALLERY GRID */}
        {images.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
              <span>Attached Media Gallery ({images.length}) • Click "Set as Cover" to change main display</span>
              <span className="text-slate-400">First image will be the listing cover</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((img, idx) => {
                const isCover = idx === 0;
                return (
                  <div
                    key={idx}
                    className={`relative group aspect-[4/3] rounded-lg overflow-hidden border-2 bg-slate-900 transition-all ${
                      isCover ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Property Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Ri8Click Watermark Overlay Preview */}
                    <div className="absolute bottom-1 right-1 pointer-events-none scale-75 origin-bottom-right opacity-90">
                      <WatermarkBadge position="bottom-right" size="sm" showVerifiedText={false} />
                    </div>

                    {/* Cover Pill Badge */}
                    {isCover && (
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-xs flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        <span>Cover</span>
                      </div>
                    )}

                    {!isCover && (
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                        #{idx + 1}
                      </div>
                    )}

                    {/* Hover Controls */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(idx);
                          }}
                          className="p-1 rounded bg-red-600/90 hover:bg-red-600 text-white transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {!isCover && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetCoverImage(idx);
                          }}
                          className="w-full py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold tracking-wide transition-colors flex items-center justify-center gap-1"
                        >
                          <Star className="w-3 h-3" />
                          <span>Make Cover</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            No property images attached yet. Select local files or enter URLs above to display in the listing.
          </div>
        )}

      </div>

      {/* ========================================================
          2. VIRTUAL TOUR SHORT MOVIE CLIP (SUPER ADMIN PRIVILEGE ONLY)
          ======================================================== */}
      <div className={`rounded-xl border p-4.5 space-y-4 transition-all ${
        isSuperAdmin 
          ? 'bg-gradient-to-br from-amber-500/5 via-slate-900/[0.02] to-blue-500/5 border-amber-300/80 shadow-2xs' 
          : 'bg-slate-50/80 border-slate-200'
      }`}>
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-amber-600" />
                <span>Virtual Tour Short Movie Clip</span>
              </h4>

              {isSuperAdmin ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Super Admin Privilege</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Super Admin Only</span>
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-600">
              Attach a short size movie clip (drone flyover, video walkthrough, or 3D render) for property virtual tours.
            </p>
          </div>

          {videoUrl && isSuperAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-semibold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Movie Clip Active</span>
              </span>
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Remove Clip
              </button>
            </div>
          )}
        </div>

        {/* ================= IF NOT SUPER ADMIN: LOCKED STATE ================= */}
        {!isSuperAdmin ? (
          <div className="p-5 rounded-xl bg-white border border-slate-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-slate-600" />
            </div>
            
            <div className="max-w-md mx-auto space-y-1">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Restricted Super Admin Feature
              </h5>
              <p className="text-xs text-slate-500">
                Only the <strong className="text-slate-700">Super Admin / Platform Manager</strong> has privilege to attach short movie clips to property virtual tours. Agency and customer accounts can manage photos.
              </p>
            </div>

            {onOpenRoleSwitcher && (
              <button
                type="button"
                onClick={onOpenRoleSwitcher}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Switch to Super Admin Account</span>
              </button>
            )}
          </div>
        ) : (
          /* ================= IF SUPER ADMIN: FULL PRIVILEGE CONTROLS ================= */
          <div className="space-y-4">
            
            {/* Explanatory Super Admin Banner */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold">Super Admin Privilege Authorized</div>
                <div className="text-[11px] text-amber-800/90 leading-relaxed">
                  You have exclusive privilege to upload a short size movie clip (walkthrough / drone fly-through / 3D virtual tour) from your local computer or online CDN. Recommended duration: <strong>15–60 seconds</strong> (max 50MB for smooth mobile loading).
                </div>
              </div>
            </div>

            {/* Video Input Mode Switcher: Local File vs URL */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVideoTab('local')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  videoTab === 'local'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Local Movie Clip</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoTab('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  videoTab === 'url'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Video Clip URL</span>
              </button>
            </div>

            {/* TAB 1: LOCAL VIDEO UPLOAD */}
            {videoTab === 'local' && (
              <div className="space-y-2">
                <div
                  onClick={() => videoFileInputRef.current?.click()}
                  className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/30 hover:bg-amber-50/60 rounded-xl p-4 text-center cursor-pointer transition-all space-y-2 group"
                >
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    className="hidden"
                    onChange={(e) => handleLocalVideoFile(e.target.files)}
                  />

                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Film className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {isProcessingVideo ? 'Loading Short Video Clip...' : 'Click to Browse Short Movie Clip (MP4 / WebM)'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Recommended: 15–60 sec walkthrough, max 50MB
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    <span>🎬 Local Video Walkthrough Ready</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VIDEO URL INPUT */}
            {videoTab === 'url' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="https://.../walkthrough.mp4 (direct MP4/WebM URL)"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyVideoUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyVideoUrl()}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Apply Video</span>
                  </button>
                </div>

                {/* Quick Presets for Video Tour Testing */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-semibold text-slate-500">
                    Quick Sample Walkthrough Clips (Super Admin Testing):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_VIDEOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyVideoUrl(sample.url, sample.title)}
                        className="px-2.5 py-1 rounded-md text-[10.5px] font-medium bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 transition-colors border border-slate-200 flex items-center gap-1.5 shadow-2xs"
                      >
                        <Play className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
                        <span>{sample.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {videoError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{videoError}</span>
              </div>
            )}

            {/* Video Title Input */}
            {videoUrl && (
              <div className="space-y-1 pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700">
                  Virtual Tour Movie Clip Title / Caption
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => onChangeVideoTitle(e.target.value)}
                  placeholder="e.g. 5-Marla Luxury House Walkthrough & Rooftop Margalla View"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* LIVE PREVIEW PLAYER FOR SUPER ADMIN MOVIE CLIP */}
            {videoUrl ? (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-amber-600" />
                    <span>Live Movie Clip Preview (Ri8Click Watermarked)</span>
                  </span>
                  {videoFileSizeInfo && (
                    <span className="text-slate-400 font-mono text-[10.5px]">
                      {videoFileSizeInfo}
                    </span>
                  )}
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 shadow-md aspect-video max-h-72">
                  <video
                    src={videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />

                  {/* Ri8Click Watermark Overlay */}
                  <div className="absolute bottom-2 right-2 pointer-events-none opacity-90">
                    <WatermarkBadge position="bottom-right" size="sm" showVerifiedText={true} />
                  </div>

                  {/* Super Admin Verified Tour Pill */}
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/40 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Super Admin Virtual Tour Clip</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-white/60 border border-slate-200 text-center text-xs text-slate-500">
                No virtual tour movie clip attached yet. Upload a local clip or choose a preset above.
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default PropertyMediaUploader;
