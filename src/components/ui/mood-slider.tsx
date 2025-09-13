import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

export interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
  onContinue?: () => void;
  className?: string;
}

const MOOD_EMOJIS = ['😣', '😕', '😐', '🙂', '😄'];
const BACKGROUND_COLORS = ['#34495E', '#5DADE2', '#F1C40F', '#F39C12', '#E67E22'];

const MoodSlider: React.FC<MoodSliderProps> = ({ value, onChange, onContinue, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState<number | null>(null);

  // Motion values for smooth animations
  const dragX = useMotionValue(0);
  const springX = useSpring(dragX, {
    damping: 25,
    stiffness: 300,
    mass: 0.8
  });

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Native mobile spring configuration
  const nativeSpring = {
    type: "spring" as const,
    damping: prefersReducedMotion ? 30 : 25,
    stiffness: prefersReducedMotion ? 400 : 300,
    mass: 0.8,
    bounce: prefersReducedMotion ? 0 : 0.15
  };

  // Prevent page scroll during interaction
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    const preventWheel = (e: WheelEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    if (isDragging) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventWheel, { passive: false });
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventWheel);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventWheel);
    };
  }, [isDragging]);

  // Handle swipe/drag gestures with native mobile feel
  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], velocity: [vx], tap }) => {
      const triggerThreshold = prefersReducedMotion ? 30 : 40;

      if (tap) return; // Ignore taps

      if (active) {
        setIsDragging(true);
        if (dragStartTime === null) {
          setDragStartTime(Date.now());
        }

        // Natural drag feel with slight resistance
        const resistance = Math.max(0.7, Math.min(1, 1 - Math.abs(mx) / 300));
        dragX.set(mx * resistance);

        // Subtle haptic feedback during drag (very gentle)
        if (Math.abs(mx) > 20 && !prefersReducedMotion) {
          navigator.vibrate?.([1]); // Micro vibration
        }
      } else {
        // Calculate velocity and time for momentum
        const velocity = Math.abs(vx);

        // Determine if this is a significant swipe
        const isSignificantSwipe = Math.abs(mx) > triggerThreshold;
        const isFastSwipe = velocity > (prefersReducedMotion ? 0.8 : 0.5);

        if (isSignificantSwipe || (isFastSwipe && Math.abs(mx) > 15)) {
          const currentIndex = Math.round(value) - 1;

          // Calculate direction with momentum consideration
          let shouldGoNext = xDir < 0; // Left swipe = next

          // Strong fast swipes should always trigger
          if (isFastSwipe && Math.abs(mx) > 20) {
            shouldGoNext = mx < 0 ? true : false;
          }

          // Apply the change with native feedback
          if (shouldGoNext && currentIndex < 4) {
            onChange(currentIndex + 2);
            // Success haptic pattern
            if (!prefersReducedMotion) {
              navigator.vibrate?.([10, 5, 10]);
            }
          } else if (!shouldGoNext && currentIndex > 0) {
            onChange(currentIndex);
            // Success haptic pattern
            if (!prefersReducedMotion) {
              navigator.vibrate?.([10, 5, 10]);
            }
          } else if (Math.abs(mx) > triggerThreshold) {
            // Edge bounce - gentle haptic
            if (!prefersReducedMotion) {
              navigator.vibrate?.([5]);
            }
          }
        }

        // Smooth spring back to center
        dragX.set(0);
        setIsDragging(false);
        setDragStartTime(null);
      }
    },
    {
      filterTaps: true,
      axis: 'x',
      swipe: {
        velocity: prefersReducedMotion ? 0.6 : 0.3,
        distance: prefersReducedMotion ? 15 : 10
      }
    }
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = Math.round(value) - 1;

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        onChange(currentIndex);
      } else if (e.key === 'ArrowRight' && currentIndex < 4) {
        e.preventDefault();
        onChange(currentIndex + 2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, onChange]);

  // Handle dot clicks
  const handleDotClick = useCallback((newValue: number) => {
    onChange(newValue);
  }, [onChange]);

  // Get current background color
  const currentBgColor = BACKGROUND_COLORS[Math.round(value) - 1] || BACKGROUND_COLORS[0];
  const currentEmoji = MOOD_EMOJIS[Math.round(value) - 1] || MOOD_EMOJIS[0];

  return (
    <div
      className={`min-h-screen flex flex-col ${className}`}
      style={{ backgroundColor: currentBgColor }}
      {...bind()}
    >
      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Large animated emoji */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEmoji}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
              x: (prefersReducedMotion || !isDragging) ? 0 : springX.get()
            }}
            exit={{ scale: isDragging ? 0.8 : 0, rotate: 180 }}
            transition={nativeSpring}
            style={{
              x: springX,
              pointerEvents: isDragging ? 'none' : 'auto'
            }}
            className="text-8xl mb-8 select-none"
          >
            {currentEmoji}
          </motion.div>
        </AnimatePresence>

        {/* Mood description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <h2 className="text-2xl font-semibold mb-2">Current Mood</h2>
          <p className="text-lg opacity-90">Rating: {Math.round(value)}/5</p>
        </motion.div>

        {/* Instruction text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/80 mt-8"
        >
          <p className="text-sm">Swipe left/right or use arrow keys</p>
          <p className="text-xs mt-1">Click dots below to jump to any mood</p>
        </motion.div>
      </div>

      {/* Continue Button */}
      {onContinue && (
        <div className="flex justify-center items-center p-4">
          <motion.button
            onClick={onContinue}
            className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Continue with selected mood"
          >
            Continue
          </motion.button>
        </div>
      )}

      {/* Bottom navigation dots */}
      <div className="flex justify-center items-center p-8 pb-12">
        <div className="flex space-x-3">
          {MOOD_EMOJIS.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index + 1)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.round(value) === index + 1
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Select mood ${index + 1}: ${MOOD_EMOJIS[index]}`}
            />
          ))}
        </div>
      </div>

      {/* Subtle drag indicator */}
      <AnimatePresence>
        {isDragging && !prefersReducedMotion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-white/30 text-6xl"
            >
              ⚡
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { MoodSlider };
