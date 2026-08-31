import { Text, View } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/stylesheet';

/**
 * RODO/GDPR consent clause: small print pinned to the bottom of the last page.
 * The flexGrow spacer absorbs whatever free space the last page has, so the
 * clause sits at the very bottom when the resume is short and right after the
 * content when the page is full. wrap={false} keeps it in one piece.
 */
export function Clause({ text, style }: { text?: string; style?: Style }) {
  if (!text?.trim()) return null;
  return (
    <View style={{ flexGrow: 1, justifyContent: 'flex-end', ...style }} wrap={false}>
      <Text style={{ fontSize: 6.5, color: '#9ca3af', lineHeight: 1.4, marginTop: 16 }}>
        {text.trim()}
      </Text>
    </View>
  );
}
