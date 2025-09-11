import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/db';
import { OnboardingWizard } from './onboarding';
import type { OnboardingData } from './onboarding/types';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, session, loading } = useAuth();
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!loading && !user) {
      navigate('/login', { replace: true });
      return;
    }

    // If authenticated, check if onboarding is needed
    if (!loading && user && session && !hasCheckedOnboarding) {
      checkOnboardingStatus();
    }
  }, [user, loading, session, hasCheckedOnboarding, navigate]);

  const checkOnboardingStatus = async () => {
    try {
      const profile = await getProfile(session);
      setHasCheckedOnboarding(true);

      // If profile doesn't exist or onboarding is not completed, show onboarding
      if (!profile || !profile.onboarding_completed) {
        // Onboarding will be shown
        return;
      }

      // If onboarding is completed, redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // On error, show onboarding by default
      setHasCheckedOnboarding(true);
    }
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      // Update profile with onboarding data
      const updates = {
        username: data.username,
        referral_source: data.referralSource,
        objectives: data.objectives,
        onboarding_completed: true,
        language_pref: 'en' // Default language
      };

      await updateProfile(session!, updates);

      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Still proceed to dashboard even if update fails
      navigate('/dashboard', { replace: true });
    }
  };

  const handleOnboardingSkip = () => {
    // Skip just takes user to dashboard without saving data
    navigate('/dashboard', { replace: true });
  };

  // Show loading while checking authentication and onboarding status
  if (loading || !user || !hasCheckedOnboarding) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-white"></span>
          <p className="text-white text-base">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingWizard
      onComplete={handleOnboardingComplete}
      onSkip={handleOnboardingSkip}
    />
  );
};
