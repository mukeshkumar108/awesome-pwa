import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoodSlider } from '../../components/ui/mood-slider';
import { useAuth } from '../../context/AuthContext';

export const MoodRatingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRating, setSelectedRating] = useState(3); // Start at neutral (3)

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleRatingChange = (rating: number) => {
    setSelectedRating(Math.round(rating));
  };

  const handleContinue = () => {
    navigate('/mood/tags', {
      state: { selectedRating: Math.round(selectedRating) }
    });
  };

  return (
    <MoodSlider
      value={selectedRating}
      onChange={handleRatingChange}
      onContinue={handleContinue}
    />
  );
};
