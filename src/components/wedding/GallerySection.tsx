import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

interface GallerySectionProps {
  title?: string;
  subtitle?: string;
  images: GalleryImage[];
}

const GallerySection = ({ 
  title = "Gallery", 
  subtitle = "Moments we cherish",
  images 
}: GallerySectionProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <section id="gallery" className="wedding-section bg-gradient-soft">
      <div className="wedding-container">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="wedding-heading mb-4">{title}</h2>
          <div className="wedding-divider mb-6" />
          <p className="wedding-text max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer overflow-hidden rounded-sm ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              }`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                  index === 0 ? 'h-full min-h-[300px] md:min-h-[400px]' : 'h-40 md:h-48'
                }`}
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/20 transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation */}
          <button
            className="absolute left-4 z-10 w-10 h-10 rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/20 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            className="absolute right-4 z-10 w-10 h-10 rounded-full bg-background/10 backdrop-blur-sm flex items-center justify-center text-background hover:bg-background/20 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image */}
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-body text-sm text-background/70">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
