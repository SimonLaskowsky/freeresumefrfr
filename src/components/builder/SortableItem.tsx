'use client';

import { useSortable } from '@dnd-kit/sortable';
import type { ReactNode } from 'react';

interface Props {
  id: string;
  children: (handle: ReactNode) => ReactNode;
}

export function SortableItem({ id, children }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const handle = (
    <div
      {...listeners}
      className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 transition-colors p-1 touch-none"
      title="Drag to reorder"
    >
      <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
        <circle cx="4" cy="3" r="1.5" />
        <circle cx="8" cy="3" r="1.5" />
        <circle cx="4" cy="8" r="1.5" />
        <circle cx="8" cy="8" r="1.5" />
        <circle cx="4" cy="13" r="1.5" />
        <circle cx="8" cy="13" r="1.5" />
      </svg>
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
        zIndex: isDragging ? 10 : undefined,
      }}
    >
      {children(handle)}
    </div>
  );
}
