import PropTypes from "prop-types";
import React from "react";
import { Item } from "./Item";
import { useSortable } from "@dnd-kit/sortable";

const SORTABLE_TRANSITION_DURATION = 250;

export default function SortableItem({ id, taskId, isCorrect }) {
  const {
    setNodeRef,
    listeners,
    isDragging,
    transform,
    transition
  } = useSortable({
    id,
    transition: {
      duration: SORTABLE_TRANSITION_DURATION,
      easing: "ease"
    }
  });

  return (
    <Item
      ref={setNodeRef}
      taskId={taskId}
      value={id}
      dragging={isDragging}
      transition={transition}
      transform={transform}
      listeners={listeners}
      isCorrect={isCorrect}
    />
  );
}

SortableItem.propTypes = {
  taskId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isCorrect: PropTypes.bool
};
