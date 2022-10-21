import DroppableContainer from "./DroppableContainer";
import PropTypes from "prop-types";
import React from "react";
import SortableItem from "./SortableItem";
import { Box, Text } from "@chakra-ui/react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { WORD_BANK } from "../../utils";

export default function WordBank({ taskId, items }) {
  return (
    <Box p="2" mt="3" borderWidth="2px" borderRadius="lg">
      <Text
        fontSize="md" // make slightly smaller than other text
        color="gray.600"
      >
        Drag items from the box to the blanks above
      </Text>
      <SortableContext
        items={items[WORD_BANK].items}
        strategy={rectSortingStrategy}
      >
        <DroppableContainer
          taskId={taskId}
          id={WORD_BANK}
          items={items[WORD_BANK].items}
          style={{
            display: "grid",
            gridAutoRows: "max-content",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridGap: "10px",
            border: "none",
            margin: "0"
          }}
        >
          {items[WORD_BANK].items.map((value) => {
            return <SortableItem key={value} id={value} taskId={taskId} />;
          })}
        </DroppableContainer>
      </SortableContext>
    </Box>
  );
}

WordBank.propTypes = {
  taskId: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired
};
