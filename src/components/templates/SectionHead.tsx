import { View } from '@react-pdf/renderer';

/**
 * Wraps a section heading so it is never orphaned at the bottom of a page:
 * if less than ~2 lines of the section's content would fit below it, the
 * heading moves to the next page. react-pdf ignores minPresenceAhead on a
 * container's first child (a break "would not improve presence"), so an empty
 * sibling view goes in front to keep the protection active.
 */
export function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <>
      <View />
      <View minPresenceAhead={120}>{children}</View>
    </>
  );
}
