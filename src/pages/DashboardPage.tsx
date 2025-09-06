import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/db';

const DashboardPage = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session) {
        const userProfile = await getProfile(session);
        setProfile(userProfile);
      }
    };
    fetchUserProfile();
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="hero min-h-[50vh] bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-8 shadow-xl">
          <div className="hero-content text-center text-white">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-4">Welcome back, {profile?.username || user?.email?.split('@')[0]}!</h1>
              <p className="text-xl opacity-90">Ready to build something amazing?</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl border border-gray-100">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="card-title text-lg">Analytics</h3>
              </div>
              <p className="text-gray-600">View your app's performance metrics</p>
            </div>
          </div>

          <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl border border-gray-100">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="card-title text-lg">Settings</h3>
              </div>
              <p className="text-gray-600">Customize your experience</p>
            </div>
          </div>

          <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow rounded-2xl border border-gray-100">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="card-title text-lg">Support</h3>
              </div>
              <p className="text-gray-600">Get help and contact us</p>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-lg rounded-2xl border border-gray-100">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary rounded-xl px-6 py-3 font-semibold hover:scale-105 transition-transform">
                Create New Project
              </button>
              <button className="btn btn-outline rounded-xl px-6 py-3 font-semibold hover:scale-105 transition-transform">
                View Reports
              </button>
              <button className="btn btn-secondary rounded-xl px-6 py-3 font-semibold hover:scale-105 transition-transform" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
