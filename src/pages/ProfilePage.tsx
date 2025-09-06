import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/db';

const ProfilePage = () => {
  const { user,session } = useAuth();
  const [username, setUsername] = useState('');
  const [languagePref, setLanguagePref] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (!session) throw new Error('User not authenticated.');
      const profile = await getProfile(session);
      if (profile) {
        setUsername(profile.username || '');
        setLanguagePref(profile.language_pref || 'en');
      }
    } catch (err: any) {
      setError('Error fetching profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('--- Submitting Update ---');
    console.log('Username from form state:', username);
    console.log('Current session object:', session);

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      if (!session) throw new Error('User not authenticated.');

      await updateProfile(session, { username, language_pref: languagePref });
      setSuccess('Profile updated successfully!');
      console.log('Update was successful!');
    } catch (err: any) {
      setError('Error updating profile: ' + err.message);
      console.error('Update failed. Error:', err);
    } finally {
      setLoading(false);
      console.log('--- Update Attempt Finished ---');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="hero min-h-[30vh] bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl mb-8 shadow-xl">
          <div className="hero-content text-center text-white">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-4">Your Profile</h1>
              <p className="text-xl opacity-90">Manage your account settings</p>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-lg rounded-2xl border border-gray-100">
          <form className="card-body p-8" onSubmit={handleUpdate}>
            {error && <div className="alert alert-error mb-6 rounded-xl">{error}</div>}
            {success && <div className="alert alert-success mb-6 rounded-xl">{success}</div>}

            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="avatar placeholder mb-4">
                    <div className="bg-neutral text-neutral-content rounded-full w-24 h-24">
                      <span className="text-3xl font-bold">{username?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{username || 'User'}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>

                <div className="form-control mb-6">
                  <label className="label mb-2">
                    <span className="label-text font-semibold text-gray-700">Email</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered rounded-xl bg-gray-50 cursor-not-allowed w-full"
                    value={user?.email || ''}
                    disabled
                  />
                  <span className="label-text-alt text-gray-500 mt-1 block">Email cannot be changed</span>
                </div>

                <div className="form-control mb-6">
                  <label className="label mb-2">
                    <span className="label-text font-semibold text-gray-700">Username</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="input input-bordered rounded-xl focus:ring-2 focus:ring-purple-500 transition-all w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-control mb-8">
                  <label className="label mb-2">
                    <span className="label-text font-semibold text-gray-700">Language Preference</span>
                  </label>
                  <select
                    value={languagePref}
                    onChange={(e) => setLanguagePref(e.target.value)}
                    className="select select-bordered rounded-xl focus:ring-2 focus:ring-purple-500 transition-all w-full"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                  <span className="label-text-alt text-gray-500 mt-1 block">
                    Choose your preferred language for the application
                  </span>
                </div>

                <div className="form-control">
                  <button
                    type="submit"
                    className={`btn btn-primary rounded-xl py-3 font-semibold text-lg hover:scale-105 transition-transform w-full ${loading ? 'btn-disabled' : ''}`}
                  >
                    {loading && <span className="loading loading-spinner mr-2"></span>}
                    Update Profile
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
