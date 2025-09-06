import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="hero min-h-[30vh] bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl mb-8 shadow-xl">
          <div className="hero-content text-center text-white">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold mb-4">Your Profile</h1>
              <p className="text-xl opacity-90">Manage your account settings</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-6">
              {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}
              {success && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">{success}</div>}

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="avatar placeholder mb-4">
                      <div className="bg-muted text-muted-foreground rounded-full w-24 h-24 flex items-center justify-center">
                        <span className="text-3xl font-bold">{username?.charAt(0)?.toUpperCase() || 'U'}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold">{username || 'User'}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language Preference</Label>
                    <Select value={languagePref} onValueChange={setLanguagePref}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred language for the application
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
