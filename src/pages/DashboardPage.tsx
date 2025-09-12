import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfile } from '../services/db';
import { getMoodLogs, getEmojiForRating, formatMoodTimestamp } from '../services/mood';
import { getGratitudeEntries, truncateGratitudeContent, formatGratitudeTimestamp } from '../services/gratitude';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MoodLog } from '../services/mood';
import type { GratitudeEntry } from '../services/gratitude';

const DashboardPage = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [recentMoods, setRecentMoods] = useState<MoodLog[]>([]);
  const [recentGratitude, setRecentGratitude] = useState<GratitudeEntry[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session) {
        const userProfile = await getProfile(session);
        setProfile(userProfile);
      }
    };
    fetchUserProfile();
  }, [session]);

  useEffect(() => {
    loadRecentEntries();
  }, []);

  useEffect(() => {
    // Check if user just completed logging (from navigation state)
    const state = location.state as any;
    if (state?.moodLogged || state?.gratitudeLogged) {
      setShowSuccessMessage(true);
      loadRecentEntries();
      // Clear state after showing message
      navigate('.', { replace: true });
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  }, [location.state]);

  const loadRecentEntries = async () => {
    try {
      const [moods, gratitude] = await Promise.all([
        getMoodLogs(10), // Last 10 mood entries
        getGratitudeEntries(5) // Last 5 gratitude entries
      ]);
      setRecentMoods(moods);
      setRecentGratitude(gratitude);
    } catch (error) {
      console.error('Error loading recent entries:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleLogMood = () => navigate('/mood/rating');
  const handleViewMoodHistory = () => navigate('/mood/history');
  const handleLogGratitude = () => navigate('/gratitude/today');
  const handleViewGratitudeHistory = () => navigate('/gratitude/history');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good to see you{profile?.username ? `, ${profile.username}` : ''}! 🌟
          </h1>
          <p className="text-gray-600">How are you feeling today?</p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="text-green-500">✅</div>
            <p className="text-green-800 font-medium">
              Entry saved! Your response will appear below.
            </p>
          </div>
        )}

        {/* Quick Action Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Track Your Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={handleLogMood}
                className="h-auto p-4 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <span className="text-2xl">😊</span>
                <span className="font-medium">Log Mood</span>
              </Button>

              <Button
                onClick={handleLogGratitude}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <span className="text-2xl">🙏</span>
                <span className="font-medium">Log Gratitude</span>
              </Button>

              <Button
                onClick={handleViewMoodHistory}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <span className="text-2xl">📈</span>
                <span className="font-medium">Mood History</span>
              </Button>

              <Button
                onClick={handleViewGratitudeHistory}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <span className="text-2xl">📖</span>
                <span className="font-medium">Gratitude Journal</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Mood */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>🎭</span>
                Recent Mood (Last 10)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentMoods.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No mood entries yet. Start tracking your feelings!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMoods.map((mood) => (
                    <div key={mood.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getEmojiForRating(mood.rating)}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">
                            Rating: {mood.rating}/5
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatMoodTimestamp(mood.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {mood.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white text-xs text-gray-700 rounded-full border"
                          >
                            {tag.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {mood.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-200 text-xs text-gray-600 rounded-full">
                            +{mood.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {recentMoods.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewMoodHistory}
                    className="w-full"
                  >
                    View All Entries
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Gratitude */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>🙏</span>
                Recent Gratitude (Last 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentGratitude.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No gratitude entries yet. Start practicing gratitude!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentGratitude.map((entry) => (
                    <div key={entry.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <p className="text-gray-800 mb-2 leading-relaxed">
                        "{truncateGratitudeContent(entry.content, 80)}"
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatGratitudeTimestamp(entry.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {recentGratitude.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewGratitudeHistory}
                    className="w-full"
                  >
                    View All Entries
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                Edit Profile
              </Button>
              <Button variant="secondary" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
