import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";
import { ListItem } from "../../components/ListItem";
import classes from "../../components/ListItem/index.module.css";

export function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandle = (
    <div className={classes.dragHandle} {...attributes} {...listeners}>
      <IconGripVertical size={20} stroke={1.5} />
    </div>
  );

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      {...props}
      dragHandle={dragHandle}
    />
  );
}
