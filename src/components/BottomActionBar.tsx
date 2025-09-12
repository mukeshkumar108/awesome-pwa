import React from 'react';

interface BottomActionBarProps {
  primaryText: string;
  primaryAction: () => void;
  primaryDisabled?: boolean;
  primaryVariant?: 'primary' | 'secondary';
  secondaryText?: string;
  secondaryAction?: () => void;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  primaryText,
  primaryAction,
  primaryDisabled = false,
  primaryVariant = 'primary',
  secondaryText,
  secondaryAction
}) => {
  return (
    <div className="sticky bottom-0 z-40 bg-white shadow-lg border-t border-gray-200">
      <div className="px-4 py-4">
        <div className="flex gap-3">
          {/* Secondary Action (if provided) */}
          {secondaryText && secondaryAction && (
            <button
              onClick={secondaryAction}
              className="flex-1 h-12 px-6 rounded-md font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {secondaryText}
            </button>
          )}

          {/* Primary Action */}
          <button
            onClick={primaryAction}
            disabled={primaryDisabled}
            className={`flex-1 h-12 px-6 rounded-md font-medium transition-colors ${
              primaryVariant === 'primary'
                ? 'bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {primaryText}
          </button>
        </div>
      </div>
    </div>
  );
};
