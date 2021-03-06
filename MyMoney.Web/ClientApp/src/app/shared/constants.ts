import { FeatureFlags, Frequency } from './api';
import { toFeatureFlagString, toFrequencyString } from './functions';

export const SESSION_LOCAL_STORAGE_KEY = 'my-money:session';

export const frequencyOptions: { key: Frequency; value: string }[] = [
   { key: Frequency.day, value: toFrequencyString(Frequency.day) },
   { key: Frequency.week, value: toFrequencyString(Frequency.week) },
   { key: Frequency.fortnight, value: toFrequencyString(Frequency.fortnight) },
   { key: Frequency.fourWeek, value: toFrequencyString(Frequency.fourWeek) },
   { key: Frequency.month, value: toFrequencyString(Frequency.month) },
   { key: Frequency.year, value: toFrequencyString(Frequency.year) },
];

export const featureOptions: { key: FeatureFlags; value: string }[] = [
   { key: FeatureFlags.budgets, value: toFeatureFlagString(FeatureFlags.budgets) },
   { key: FeatureFlags.incomesToTransactions, value: toFeatureFlagString(FeatureFlags.incomesToTransactions) },
];
