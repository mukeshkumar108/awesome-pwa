import React from 'react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description?: string;
  onBack?: () => void;
  onNext?: (data?: any) => void;
  onSkip?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showBack?: boolean;
  showSkip?: boolean;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  title,
  description,
  onBack,
  onNext,
  onSkip,
  nextDisabled = false,
  nextLabel = 'Continue',
  showBack = true,
  showSkip = true,
}) => {
  const progressPercentage = ((currentStep) / totalSteps) * 100;

  return (
    <div className="onboarding-container onboarding-theme">
      {/* Progress Bar */}
      <div className="onboarding-header">
        <div className="onboarding-progress">
          <div className="onboarding-progress-label">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="onboarding-progress-bar">
            <div
              className="onboarding-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="onboarding-content">
        <div className="onboarding-content-inner">
          {/* Header */}
          <div className="mb-8">
            <h1 className="onboarding-title">{title}</h1>
            {description && (
              <p className="onboarding-description">{description}</p>
            )}
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {children}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="onboarding-actions">
        <div className="onboarding-actions-container">
          {/* Back Button */}
          {showBack && currentStep > 1 && onBack && (
            <button
              onClick={onBack}
              className="onboarding-button-outline"
            >
              Back
            </button>
          )}

          {/* Next/Continue Button */}
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="onboarding-button-primary"
          >
            {nextLabel}
          </button>
        </div>

        {/* Skip Link */}
        {showSkip && onSkip && (
          <div className="onboarding-skip-link">
            <button
              onClick={onSkip}
              className="onboarding-skip-button"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
