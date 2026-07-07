export const featureNames = [
  "rsvp",
  "admin",
  "giftList",
  "music",
  "gallery",
  "countdown",
  "dressCode",
] as const;

export type FeatureName = (typeof featureNames)[number];

export type FeatureFlags = Record<FeatureName, boolean>;

export function isFeatureEnabled(features: FeatureFlags, feature: FeatureName) {
  return features[feature] === true;
}
