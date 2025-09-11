import React, { useState } from 'react';
import type { StepProps } from '../types';

interface ReferralStepProps extends StepProps {
  options?: string[];
}

const DEFAULT_REFERRAL_OPTIONS = [
  'Instagram',
  'Facebook',
  'TikTok',
  'Friend'
];

export const ReferralStep: React.FC<ReferralStepProps> = ({
  // onNext, // Not needed - handled by OnboardingWizard
  onDataChange,
  data,
  options = DEFAULT_REFERRAL_OPTIONS
}) => {
  const [selectedReferral, setSelectedReferral] = useState<string | null>(
    data?.referralSource || null
  );

  const handleSelect = (referral: string) => {
    setSelectedReferral(referral);
    // Real-time update to parent
    onDataChange?.({ referralSource: referral });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-center mb-6 onboarding-description">
          Help us understand how you found us
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`onboarding-step-option ${selectedReferral === option ? 'selected' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>

      {selectedReferral && (
        <div className="text-center">
          <p className="onboarding-helper-text">
            Selected: <span className="font-medium">{selectedReferral}</span>
          </p>
        </div>
      )}
    </div>
  );
};
