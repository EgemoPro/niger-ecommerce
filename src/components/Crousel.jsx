import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Carousel = ({ 
  images = [], 
  autoPlay = false, 
  autoPlayInterval = 4000,
  showThumbnails = false,
  showIndicators = true,
  className = "",
  aspectRatio = "16/9"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [images.length, isTransitioning]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentIndex, isTransitioning]);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && images.length > 1) {
      intervalRef.current = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(intervalRef.current);
    }
  }, [isPlaying, goToNext, autoPlayInterval, images.length]);

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Aucune image à afficher</p>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Main carousel container */}
      <div 
        className="relative overflow-hidden rounded-xl"
        style={{ aspectRatio }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Images */}
        <div 
          className="flex transition-transform duration-300 ease-out h-full"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            filter: isTransitioning ? 'brightness(0.9)' : 'brightness(1)'
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading={Math.abs(index - currentIndex) <= 1 ? "eager" : "lazy"}
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
              onClick={goToPrevious}
              disabled={isTransitioning}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
              onClick={goToNext}
              disabled={isTransitioning}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Play/Pause button */}
        {images.length > 1 && autoPlay && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        )}

        {/* Progress bar */}
        {isPlaying && images.length > 1 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: `${((currentIndex + 1) / images.length) * 100}%`
              }}
            />
          </div>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative flex-shrink-0 w-16 h-10 rounded-md overflow-hidden transition-all duration-200 ${
                index === currentIndex 
                  ? 'ring-2 ring-blue-600 ring-offset-2' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
            >
              <img
                src={image.url}
                alt={`Miniature ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-blue-600/20" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

// Exemple d'utilisation
const CarouselDemo = () => {
  const sampleImages = [
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop",
      alt: "Paysage de montagne au coucher du soleil"
    },
    {
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=450&fit=crop",
      alt: "Forêt verdoyante avec sentier"
    },
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop&sat=-100",
      alt: "Océan turquoise avec plage"
    },
    {
      url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=450&fit=crop",
      alt: "Désert avec dunes de sable"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Carousel Moderne</h1>
        <p className="text-gray-600">
          Composant carousel optimisé avec navigation tactile, clavier et auto-play
        </p>
      </div>

      <div className="space-y-8">
        {/* Carousel principal */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Carousel Complet</h2>
          <Carousel 
            images={sampleImages}
            autoPlay={true}
            autoPlayInterval={3000}
            showThumbnails={true}
            showIndicators={true}
            aspectRatio="16/9"
            className="w-full"
          />
        </div>

        {/* Carousel minimaliste */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Carousel Minimaliste</h2>
          <Carousel 
            images={sampleImages}
            autoPlay={false}
            showThumbnails={false}
            showIndicators={true}
            aspectRatio="21/9"
            className="w-full"
          />
        </div>

        {/* Instructions d'utilisation */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Navigation</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Utilisez les flèches gauche/droite du clavier</li>
            <li>• Faites glisser sur mobile/tactile</li>
            <li>• Cliquez sur les miniatures ou indicateurs</li>
            <li>• Appuyez sur Espace pour pause/lecture</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Carousel;