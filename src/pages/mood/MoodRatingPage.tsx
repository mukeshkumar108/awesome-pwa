import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/TopBar';
import { BottomActionBar } from '../../components/BottomActionBar';
import { useAuth } from '../../context/AuthContext';
// Removed unused import

const MOOD_RATINGS = [
  {
    rating: 1 as const,
    emoji: '😣',
    label: 'Very low',
    description: 'Feeling really tough right now'
  },
  {
    rating: 2 as const,
    emoji: '😕',
    label: 'Low',
    description: 'Having a challenging time'
  },
  {
    rating: 3 as const,
    emoji: '😐',
    label: 'Neutral',
    description: 'Just going through the motions'
  },
  {
    rating: 4 as const,
    emoji: '🙂',
    label: 'Good',
    description: 'Feeling pretty good today'
  },
  {
    rating: 5 as const,
    emoji: '😄',
    label: 'Very good',
    description: 'Feeling really positive and happy'
  }
];

export const MoodRatingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRating, setSelectedRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleRatingSelect = (rating: 1 | 2 | 3 | 4 | 5) => {
    setSelectedRating(rating);
  };

  const handleNext = () => {
    if (selectedRating) {
      navigate('/mood/tags', {
        state: { selectedRating }
      });
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="How are you feeling?"
        subtitle="Choose the emoji that best represents your current mood"
        onBack={() => navigate('/dashboard')}
      />

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Mood Rating Options */}
          <div className="space-y-4">
            {MOOD_RATINGS.map(({ rating, emoji, label, description }) => (
              <button
                key={rating}
                onClick={() => handleRatingSelect(rating)}
                className={`w-full p-6 rounded-lg border-2 transition-all duration-200 ${
                  selectedRating === rating
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {emoji}
                  </div>
                  <div className="text-left flex-1">
                    <div className={`font-semibold text-lg ${
                      selectedRating === rating ? 'text-white' : 'text-gray-900'
                    }`}>
                      {label}
                    </div>
                    <div className={`text-sm mt-1 ${
                      selectedRating === rating ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      {description}
                    </div>
                  </div>
                  {selectedRating === rating && (
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomActionBar
        primaryText="Continue"
        primaryAction={handleNext}
        primaryDisabled={!selectedRating}
        secondaryText="Skip"
        secondaryAction={handleSkip}
      />
    </div>
  );
};
