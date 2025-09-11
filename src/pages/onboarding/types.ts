export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<StepProps>;
  validate?: (data: any) => boolean;
}

export interface StepProps {
  onNext: (data?: any) => void;
  onBack?: () => void;
  onSkip?: () => void;
  onDataChange?: (data: any) => void;
  data?: any;
}

export interface OnboardingData {
  username?: string;
  referralSource?: string;
  objectives?: string[];
}

export interface StepConfig {
  referralOptions: string[];
  objectiveOptions: string[];
}
