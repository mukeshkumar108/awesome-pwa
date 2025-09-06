import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { createProfile } from '../services/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If a user is already authenticated, redirect them to the dashboard.
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage('Successfully signed in!');
      // Redirection is handled by the useEffect hook.
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // Create a new user profile after successful sign-up.
      try {
        await createProfile(data.user);
        setSuccessMessage('Successfully signed up! Please check your email for a confirmation link.');
      } catch (dbError) {
        setError("Error creating user profile.");
        // Log the actual error for debugging
        console.error("Supabase Profile creation error:", dbError);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20">
        <form className="card-body p-8" onSubmit={isSigningUp ? handleSignUp : handleSignIn}>
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {isSigningUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSigningUp ? 'Join our awesome community' : 'Sign in to your account'}
            </p>
          </div>

          {error && <div className="alert alert-error mb-4 rounded-xl">{error}</div>}
          {successMessage && <div className="alert alert-success mb-4 rounded-xl">{successMessage}</div>}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isSigningUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSigningUp ? 'Create Account' : 'Sign In'
            )}
          </Button>

          <div className="text-center mt-6 space-y-2">
            <button
              type="button"
              onClick={() => setIsSigningUp(!isSigningUp)}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors block w-full"
            >
              {isSigningUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
            {!isSigningUp && (
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors block"
              >
                Forgot your password?
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
