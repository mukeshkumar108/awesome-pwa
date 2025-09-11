import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  duration = 2500
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start showing content after a brief delay for smooth animation
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 200);

    // Complete splash screen after specified duration
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      // Allow time for fade-out animation before calling onComplete
      setTimeout(onComplete, 500);
    }, duration);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, duration]);

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      style={{
        backgroundColor: '#1f2937', // Dark background matching button theme
      }}
      aria-hidden={!isVisible}
    >
      {/* Animated content */}
      <div
        className={`
          flex flex-col items-center space-y-8
          transition-all duration-700 ease-out
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        {/* Logo/Brand placeholder */}
        <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center">
          {/* You can replace this with your actual logo */}
          <div className="text-4xl font-bold text-white">
            A
          </div>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Awesome PWA
          </h1>
          <p className="text-white/80 text-lg">
            Your journey starts here
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 text-sm">
            Loading experience...
          </p>
        </div>
      </div>

      {/* Bottom branding */}
      <div
        className={`
          absolute bottom-8 left-0 right-0 text-center
          transition-opacity duration-300 delay-500
          ${showContent ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <p className="text-white/50 text-sm">
          Powered by modern web technology
        </p>
      </div>
    </div>
  );
};
