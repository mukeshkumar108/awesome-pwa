import React, { useState } from 'react';
import type { StepProps } from '../types';

export const NameStep: React.FC<StepProps> = ({ onNext, onDataChange, data }) => {
  const [username, setUsername] = useState(data?.username || '');
  const [error, setError] = useState('');

  // Validate username
  const isValidUsername = username.trim().length >= 2 && /^[a-zA-Z0-9_\s]+$/.test(username.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidUsername) {
      setError('Please enter a valid name (at least 2 characters, letters and numbers only)');
      return;
    }

    // Clean the username
    const cleanUsername = username.trim();
    onNext({ username: cleanUsername });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    // Real-time update to parent
    onDataChange?.({ username: value });

    // Clear error when user starts typing
    if (error && value.trim().length >= 2) {
      setError('');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="username" className="onboarding-label">
            What's your name?
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={handleInputChange}
            className="onboarding-input w-full"
            autoFocus
            maxLength={50}
          />
          {error && (
            <p className="onboarding-error">{error}</p>
          )}
          <p className="onboarding-helper-text">
            This will be your display name in the app
          </p>
        </div>
      </form>
    </div>
  );
};
