import React, { useState } from 'react';
import type { StepProps } from '../types';

interface ObjectivesStepProps extends StepProps {
  options?: string[];
}

const DEFAULT_OBJECTIVE_OPTIONS = [
  'Be happier',
  'Think better thoughts',
  'Be less stressed'
];

export const ObjectivesStep: React.FC<ObjectivesStepProps> = ({
  // onNext, // Not needed - handled by OnboardingWizard
  onDataChange,
  data,
  options = DEFAULT_OBJECTIVE_OPTIONS
}) => {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>(
    data?.objectives || []
  );

  const toggleObjective = (objective: string) => {
    const newObjectives = selectedObjectives.includes(objective)
      ? selectedObjectives.filter(obj => obj !== objective)
      : [...selectedObjectives, objective];

    setSelectedObjectives(newObjectives);
    // Real-time update to parent
    onDataChange?.({ objectives: newObjectives });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-center mb-6 onboarding-description">
          What brings you here today? Choose all that apply.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedObjectives.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggleObjective(option)}
              className={`onboarding-step-option ${isSelected ? 'selected' : ''}`}
            >
              <span className="font-medium">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
