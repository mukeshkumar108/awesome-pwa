import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TopBar } from '../../components/TopBar';
import { BottomActionBar } from '../../components/BottomActionBar';
import { createMoodLog, getEmojiForRating } from '../../services/mood';
import { useAuth } from '../../context/AuthContext';

export const MoodConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { selectedRating, selectedTags } = location.state || {};

  const [isSaving, setIsSaving] = useState(false);

  if (!selectedRating) {
    navigate('/mood/rating');
    return null;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleEdit = () => {
    navigate('/mood/tags', {
      state: { selectedRating, selectedTags }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await createMoodLog({
        rating: selectedRating,
        tags: selectedTags || []
      });

      if (result) {
        navigate('/dashboard', {
          state: {
            moodLogged: true,
            moodRating: selectedRating,
            moodTags: selectedTags?.length || 0
          }
        });
      } else {
        console.error('Failed to save mood log');
        // Could show an error message here
      }
    } catch (error) {
      console.error('Error saving mood log:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/mood/tags');
  };

  const emoji = getEmojiForRating(selectedRating);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Confirm your mood"
        subtitle="Review your entry before saving"
        onBack={handleBack}
      />

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Summary Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {emoji}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Mood Rating: {selectedRating}/5
              </h2>
              <p className="text-sm text-gray-500">
                {getMoodLabel(selectedRating)}
              </p>
            </div>

            {/* Tags Section */}
            {(selectedTags && selectedTags.length > 0) && (
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">
                  Tags ({selectedTags.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* No tags message */}
            {(!selectedTags || selectedTags.length === 0) && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  No tags added (optional)
                </p>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            disabled={isSaving}
          >
            Edit tags
          </button>
        </div>
      </div>

      <BottomActionBar
        primaryText={isSaving ? "Saving..." : "Save Entry"}
        primaryAction={handleSave}
        primaryDisabled={isSaving}
        primaryVariant={isSaving ? "secondary" : "primary"}
      />
    </div>
  );
};

function getMoodLabel(rating: number): string {
  switch (rating) {
    case 1: return "Very low - Feeling really tough";
    case 2: return "Low - Having a challenging time";
    case 3: return "Neutral - Just going through the motions";
    case 4: return "Good - Feeling pretty good";
    case 5: return "Very good - Feeling really positive and happy";
    default: return "";
  }
}
