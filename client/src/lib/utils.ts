export { cn } from 'cn';

/** Deterministic avatar color from a string, so a person always gets the same color. */
const AVATAR_COLORS = [
  'oklch(0.55 0.13 190)',
  'oklch(0.55 0.15 265)',
  'oklch(0.58 0.17 20)',
  'oklch(0.55 0.13 150)',
  'oklch(0.55 0.15 310)',
  'oklch(0.6 0.13 70)',
  'oklch(0.5 0.12 235)'
];

export const getAvatarColor = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const getInitials = (...parts: Array<string | undefined | null>) =>
  parts
    .filter(Boolean)
    .map(part => (part as string).charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
