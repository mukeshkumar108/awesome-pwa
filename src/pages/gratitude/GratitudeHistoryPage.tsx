import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/TopBar';
import { BottomActionBar } from '../../components/BottomActionBar';
import { getGratitudeEntries, formatGratitudeTimestamp } from '../../services/gratitude';
import { useAuth } from '../../context/AuthContext';
import type { GratitudeEntry } from '../../services/gratitude';

export const GratitudeHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGratitudeEntries();
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const loadGratitudeEntries = async () => {
    setLoading(true);
    try {
      const entries = await getGratitudeEntries();
      setGratitudeEntries(entries);
    } catch (error) {
      console.error('Error loading gratitude entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogNewGratitude = () => {
    navigate('/gratitude/today');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar
          title="Gratitude History"
          subtitle="Your past gratitude entries"
          onBack={handleBack}
        />
        <div className="px-4 py-6">
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-3 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Gratitude History"
        subtitle="Your past gratitude entries"
        onBack={handleBack}
      />

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {gratitudeEntries.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🙏</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No gratitude entries yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start practicing gratitude to cultivate more positivity in your life.
              </p>
              <button
                onClick={handleLogNewGratitude}
                className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Write Your First Entry
              </button>
            </div>
          ) : (
            // Gratitude entries list
            <div className="space-y-4 mb-6">
              {gratitudeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Gratitude Icon */}
                    <div className="text-2xl flex-shrink-0">
                      🙏
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-medium text-gray-900 text-sm">
                          I'm grateful for...
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {formatGratitudeTimestamp(entry.created_at)}
                        </span>
                      </div>

                      {/* Gratitude Text */}
                      <div className="text-gray-700 leading-relaxed">
                        {entry.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomActionBar
        primaryText="Write New Entry"
        primaryAction={handleLogNewGratitude}
      />
    </div>
  );
};
