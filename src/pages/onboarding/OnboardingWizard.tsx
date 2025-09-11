import React, { useState } from 'react';
import { OnboardingLayout } from './OnboardingLayout';
import { NameStep } from './steps/NameStep';
import { ReferralStep } from './steps/ReferralStep';
import { ObjectivesStep } from './steps/ObjectivesStep';
import type { OnboardingData } from './types';

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
  initialData?: Partial<OnboardingData>;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onSkip,
  initialData = {}
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialData);
  const [currentStepData, setCurrentStepData] = useState<any>({});

  const steps = [
    {
      id: 'name',
      title: 'Welcome!',
      description: 'Let\'s get to know you better',
      component: NameStep,
      data: { username: onboardingData.username }
    },
    {
      id: 'referral',
      title: 'How did you find us?',
      description: 'Help us understand our community better',
      component: ReferralStep,
      data: { referralSource: onboardingData.referralSource }
    },
    {
      id: 'objectives',
      title: 'What are your goals?',
      description: 'Tell us what brings you here today',
      component: ObjectivesStep,
      data: { objectives: onboardingData.objectives }
    }
  ];

  const currentStepConfig = steps[currentStep - 1];
  const isLastStep = currentStep === steps.length;

  const handleNext = (stepData: any) => {
    // Update onboarding data with step data
    const updatedData = { ...onboardingData, ...stepData, ...currentStepData };
    setOnboardingData(updatedData);

    if (isLastStep) {
      // Complete onboarding
      onComplete(updatedData);
    } else {
      // Move to next step
      setCurrentStep(currentStep + 1);
      // Clear current step data for the next step
      setCurrentStepData({});
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Clear current step data when going back
      setCurrentStepData({});
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  // Handle real-time data changes from step components
  const handleDataChange = (stepData: any) => {
    setCurrentStepData(stepData);
  };

  // Determine if continue button should be disabled
  const getContinueDisabled = () => {
    // Check both currentStepData (real-time) and onboardingData (persisted)
    const effectiveData = { ...onboardingData, ...currentStepData };

    switch (currentStep) {
      case 1:
        return !effectiveData.username?.trim();
      case 2:
        return !effectiveData.referralSource;
      case 3:
        return !effectiveData.objectives || effectiveData.objectives.length === 0;
      default:
        return false;
    }
  };

  const getContinueLabel = () => {
    return isLastStep ? 'Get Started' : 'Continue';
  };

  const StepComponent = currentStepConfig.component;

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={steps.length}
      title={currentStepConfig.title}
      description={currentStepConfig.description}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={handleSkip}
      nextDisabled={getContinueDisabled()}
      nextLabel={getContinueLabel()}
      showBack={currentStep > 1}
      showSkip={true}
    >
      <StepComponent
        onNext={handleNext}
        onDataChange={handleDataChange}
        data={currentStepConfig.data}
      />
    </OnboardingLayout>
  );
};
