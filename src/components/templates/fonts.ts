import { Font } from '@react-pdf/renderer';

// This module only ever loads client-side (templates are dynamic-imported
// with ssr:false), so window.location.origin is always available.
// Absolute URLs are required so react-pdf's internal fetch resolves
// correctly regardless of the current page path.
const origin = typeof window !== 'undefined' ? window.location.origin : '';

// Inter — sans-serif with full Latin Extended coverage (Polish, Turkish, etc.)
Font.register({
  family: 'Inter',
  fonts: [
    { src: `${origin}/fonts/Inter-Regular.ttf`, fontWeight: 400, fontStyle: 'normal' },
    { src: `${origin}/fonts/Inter-Bold.ttf`, fontWeight: 700, fontStyle: 'normal' },
    { src: `${origin}/fonts/Inter-Italic.ttf`, fontWeight: 400, fontStyle: 'italic' },
    { src: `${origin}/fonts/Inter-BoldItalic.ttf`, fontWeight: 700, fontStyle: 'italic' },
  ],
});

// Lora — serif with Latin Extended coverage (for Elegant template)
Font.register({
  family: 'Lora',
  fonts: [
    { src: `${origin}/fonts/Lora-Regular.ttf`, fontWeight: 400, fontStyle: 'normal' },
    { src: `${origin}/fonts/Lora-Bold.ttf`, fontWeight: 700, fontStyle: 'normal' },
    { src: `${origin}/fonts/Lora-Italic.ttf`, fontWeight: 400, fontStyle: 'italic' },
    { src: `${origin}/fonts/Lora-BoldItalic.ttf`, fontWeight: 700, fontStyle: 'italic' },
  ],
});

// Prevent react-pdf from splitting words at unexpected positions
Font.registerHyphenationCallback((word) => [word]);

export const SANS = 'Inter';
export const SERIF = 'Lora';
