import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CreditItem } from './CreditItem';

export function SortableCreditItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <CreditItem
      ref={setNodeRef}
      style={style}
      {...props}
      dragAttributes={attributes}
      dragListeners={listeners}
    />
  );
}