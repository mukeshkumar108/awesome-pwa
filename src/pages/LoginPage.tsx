import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { createProfile } from '../services/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
      <form onSubmit={isSigningUp ? handleSignUp : handleSignIn}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{isSigningUp ? 'Create Account' : 'Login to your account'}</CardTitle>
            <CardDescription>
              {isSigningUp ? 'Join our awesome community' : 'Enter your email below to login to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
              )}
              {successMessage && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{successMessage}</div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {!isSigningUp && (
                    <Link
                      to="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  {isSigningUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSigningUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSigningUp(!isSigningUp)}
              className="w-full"
            >
              {isSigningUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default LoginPage;
