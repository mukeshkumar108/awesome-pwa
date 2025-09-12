import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { TopBar } from '../../components/TopBar';
import { BottomActionBar } from '../../components/BottomActionBar';
import { getTagsForRating } from '../../services/mood';
import { useAuth } from '../../context/AuthContext';

export const MoodTagsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { selectedRating } = location.state || {};

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Get available tags for the selected rating
  const availableTags = getTagsForRating(selectedRating);

  if (!selectedRating) {
    navigate('/mood/rating');
    return null;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmedTag = customTag.trim();
    if (trimmedTag && !availableTags.includes(trimmedTag) && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setCustomTag('');
      setShowCustomInput(false);
    }
  };

  const handleRemoveCustomTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleNext = () => {
    navigate('/mood/confirm', {
      state: { selectedRating, selectedTags }
    });
  };

  const handleSkip = () => {
    navigate('/mood/confirm', {
      state: { selectedRating, selectedTags: [] }
    });
  };

  const handleBack = () => {
    navigate('/mood/rating');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Add tags (optional)"
        subtitle="Choose words that describe how you're feeling"
        onBack={handleBack}
      />

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Rating indicator */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-3">
              <span className="text-2xl">🙂</span>
              <span className="text-sm text-gray-500">Rating: {selectedRating}/5</span>
            </div>
          </div>

          {/* Available Tags */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">
              Suggested tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tag Input */}
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 transition-colors mb-6"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add your own tag</span>
            </button>
          ) : (
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your own tag..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleAddCustomTag}
                  disabled={!customTag.trim()}
                  className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomTag('');
                  }}
                  className="p-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-medium text-gray-900 mb-3">
                Selected ({selectedTags.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleRemoveCustomTag(tag)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                  >
                    {tag.replace(/_/g, ' ')}
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomActionBar
        primaryText="Continue"
        primaryAction={handleNext}
        secondaryText="Skip tags"
        secondaryAction={handleSkip}
      />
    </div>
  );
};
