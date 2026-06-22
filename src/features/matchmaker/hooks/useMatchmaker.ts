'use client';

import { useState, useCallback } from 'react';
import type { MatchPreferences } from '@/shared/types';

/**
 * State machine hook for the Matchmaker wizard.
 * Separates navigation/state logic from presentation.
 */
export function useMatchmaker() {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<MatchPreferences>({
    serviceType: '',
    style: '',
    placement: '',
    color: '',
  });

  const handleSelect = useCallback(
    (key: keyof MatchPreferences, value: string) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));

      // Step navigation logic
      if (key === 'serviceType' && value === 'Piercing') {
        // Piercing skips to style selection (step 2)
        setStep(2);
      } else if (key === 'style' && preferences.serviceType === 'Piercing') {
        // After piercing type selection, skip placement + color → go to results
        setStep(5);
      } else {
        // Normal tattoo flow: 0 → 1 → 2 → 3 → 4 → 5
        setStep((prev) => prev + 1);
      }
    },
    [preferences.serviceType]
  );

  const goBack = useCallback(() => {
    if (step === 2 && preferences.serviceType === 'Piercing') {
      setStep(1); // Piercing: go back to service type
    } else if (step === 5 && preferences.serviceType === 'Piercing') {
      setStep(2); // Piercing results: go back to type selection
    } else {
      setStep((prev) => Math.max(0, prev - 1));
    }
  }, [step, preferences.serviceType]);

  const reset = useCallback(() => {
    setStep(0);
    setPreferences({ serviceType: '', style: '', placement: '', color: '' });
  }, []);

  const start = useCallback(() => setStep(1), []);

  return {
    step,
    preferences,
    handleSelect,
    goBack,
    reset,
    start,
  };
}
