import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../../components/TopBar';
import { BottomActionBar } from '../../components/BottomActionBar';
import { getMoodLogs, getEmojiForRating, formatMoodTimestamp } from '../../services/mood';
import { useAuth } from '../../context/AuthContext';
import type { MoodLog } from '../../services/mood';

export const MoodHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoodLogs();
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const loadMoodLogs = async () => {
    setLoading(true);
    try {
      const logs = await getMoodLogs();
      setMoodLogs(logs);
    } catch (error) {
      console.error('Error loading mood logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogNewMood = () => {
    navigate('/mood/rating');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar
          title="Mood History"
          subtitle="Your past mood entries"
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
        title="Mood History"
        subtitle="Your past mood entries"
        onBack={handleBack}
      />

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {moodLogs.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No mood entries yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start tracking your mood to see your patterns over time.
              </p>
              <button
                onClick={handleLogNewMood}
                className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Log Your First Mood
              </button>
            </div>
          ) : (
            // Mood entries list
            <div className="space-y-4 mb-6">
              {moodLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Mood Emoji */}
                    <div className="text-3xl flex-shrink-0">
                      {getEmojiForRating(log.rating)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          Rating: {log.rating}/5
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {formatMoodTimestamp(log.created_at)}
                        </span>
                      </div>

                      {/* Tags */}
                      {log.tags && log.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {log.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {tag.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomActionBar
        primaryText="Log New Mood"
        primaryAction={handleLogNewMood}
      />
    </div>
  );
};
