import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Resource } from '../../types';

type BookingPayload = {
  resourceName: string;
  date: string;
  time: string;
};

interface ResourceDetailProps {
  resource: Resource;
  isDarkMode: boolean;
  onBack: () => void;
  onBookingComplete: (booking: BookingPayload) => void;
  onReport: (resource: Resource) => void;
}

const ResourceDetail: React.FC<ResourceDetailProps> = ({
  resource,
  isDarkMode,
  onBack,
  onBookingComplete,
  onReport,
}) => {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const bookingTimerRef = useRef<number | null>(null);

  const galleryImages = useMemo(
    () => [
      resource.imageUrl ||
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800',
    ],
    [resource.imageUrl]
  );

  const handleExecuteBooking = () => {
    if (isBooking) return;

    setIsBooking(true);

    bookingTimerRef.current = window.setTimeout(() => {
      setIsBooking(false);
      onBookingComplete({
        resourceName: resource.name,
        date: new Date().toISOString().split('T')[0],
        time: '09:00 - 11:00 AM',
      });
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (bookingTimerRef.current) {
        clearTimeout(bookingTimerRef.current);
        bookingTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar animate-in slide-in-from-right-4 duration-500">
      <div className="max-w-[1600px] mx-auto">
        {/* Breadcrumb */}
        <button onClick={onBack} className="flex items-center gap-2 mb-8 group">
          <span className="text-blue-500 font-black text-xs tracking-widest">
            &lt; BROWSE
          </span>
          <span className="text-white/20 text-xs font-black tracking-widest uppercase">
            / {resource.name}
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-24">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-8">
            <div
              className={`relative aspect-video rounded-[40px] border overflow-hidden ${
                isDarkMode
                  ? 'bg-[#0a0a0f] border-white/5'
                  : 'bg-slate-100 border-slate-200 shadow-2xl'
              }`}
            />

            {/* Gallery */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6">
                PERSPECTIVE GALLERY
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map(img => (
                  <button
                    key={img}
                    onClick={() =>
                      setActiveGalleryIndex(galleryImages.indexOf(img))
                    }
                    className={`relative aspect-video rounded-2xl overflow-hidden border-2 transition-all ${
                      activeGalleryIndex === galleryImages.indexOf(img)
                        ? 'border-blue-500 scale-[0.98]'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={resource.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4 space-y-6">
            <div
              className={`p-10 rounded-[40px] border shadow-2xl ${
                isDarkMode
                  ? 'bg-[#0a0a0f] border-white/10'
                  : 'bg-white border-slate-200'
              }`}
            >
              <h2 className="text-4xl font-black uppercase mb-12">Reserve</h2>

              <button
                onClick={handleExecuteBooking}
                disabled={isBooking}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all active:scale-[0.98] relative overflow-hidden"
              >
                {!isBooking ? (
                  <span className="uppercase text-xs tracking-[0.3em]">
                    EXECUTE BOOKING
                  </span>
                ) : (
                  <div className="flex justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </button>

              <button
                onClick={() => onReport(resource)}
                className="mt-6 w-full bg-white/[0.03] border border-white/10 hover:border-amber-500/40 text-white/40 hover:text-amber-500 font-black py-4 rounded-2xl transition-all"
              >
                REPORT ANOMALY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;