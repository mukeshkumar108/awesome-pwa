import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/TopBar';
import { BottomActionBar } from '../../components/BottomActionBar';
import { createGratitudeEntry } from '../../services/gratitude';
import { useAuth } from '../../context/AuthContext';

export const GratitudeTodayPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async () => {
    if (!content.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const result = await createGratitudeEntry({ content: content.trim() });

      if (result) {
        navigate('/dashboard', {
          state: {
            gratitudeLogged: true,
            gratitudeLength: content.length
          }
        });
      } else {
        console.error('Failed to save gratitude entry');
        // Could show an error message here
      }
    } catch (error) {
      console.error('Error saving gratitude entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const isContentValid = content.trim().length >= 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="What are you grateful for?"
        subtitle="Take a moment to reflect on something positive"
        onBack={handleBack}
      />

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Instructions */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              Take a moment to write down something or someone you're grateful for today.
              It could be big or small - what matters is that it's meaningful to you.
            </p>
          </div>

          {/* Textarea */}
          <div className="mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="I'm grateful for..."
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent text-base leading-relaxed"
              maxLength={1000}
            />
            <div className="flex justify-between mt-2">
              <span className={`text-xs ${
                content.length > 900 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {content.length}/1000 characters
              </span>
            </div>
          </div>

          {/* Examples */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Examples:
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• "The kindness of a stranger who held the door open"</li>
              <li>• "A good conversation with a friend"</li>
              <li>• "Having a place to live and food to eat"</li>
              <li>• "My partner's support and understanding"</li>
            </ul>
          </div>
        </div>
      </div>

      <BottomActionBar
        primaryText={isSaving ? "Saving..." : "Save Entry"}
        primaryAction={handleSave}
        primaryDisabled={!isContentValid || isSaving}
        primaryVariant={isSaving ? "secondary" : "primary"}
        secondaryText="Skip Today"
        secondaryAction={handleSkip}
      />
    </div>
  );
};
