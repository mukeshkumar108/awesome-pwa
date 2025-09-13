import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Handle swipe/drag gestures on the entire page
  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir] }) => {
      const triggerThreshold = 50; // Minimum distance to trigger change

      if (!active) {
        // On drag end, check if we should change the mood
        if (Math.abs(mx) > triggerThreshold) {
          const currentIndex = Math.round(value) - 1;

          if (xDir < 0 && currentIndex < 4) {
            // Swipe left - next mood
            onChange(currentIndex + 2);
          } else if (xDir > 0 && currentIndex > 0) {
            // Swipe right - previous mood
            onChange(currentIndex);
          }
        }

        setDragOffset(0);
        setIsDragging(false);

        // Haptic feedback on mobile
        if (Math.abs(mx) > triggerThreshold && navigator.vibrate) {
          navigator.vibrate(20);
        }
      } else {
        // During drag, show visual feedback
        setIsDragging(true);
        setDragOffset(mx * 0.3); // Dampen the visual feedback
      }
    },
    {
      filterTaps: false,
      axis: 'x',
      swipe: { velocity: 0.1, distance: 10 }
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
              x: isDragging ? dragOffset : 0
            }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300
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

      {/* Swipe hint animation */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center"
          >
            <motion.div
              animate={{ x: dragOffset > 0 ? 100 : -100 }}
              className="text-white/50 text-4xl"
            >
              {dragOffset > 0 ? '👈' : '👉'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { MoodSlider };
