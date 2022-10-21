import PropTypes from "prop-types";
import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";

export default function DroppableContainer({
  children,
  id,
  items,
  isCorrect,
  allBlanksEmpty,
  style
}) {
  const { over, isOver, setNodeRef } = useDroppable({
    id
  });
  const isOverContainer = isOver || (over ? items.includes(over.id) : false);

  return (
    <Box
      ref={setNodeRef}
      display="inline-block"
      minW="150px"
      minH="40px"
      p="2px"
      my="1"
      borderWidth="2px"
      rounded="md"
      transition="background-color .35s ease"
      sx={style}
      css={({ theme }) => {
        console.log(theme);
        if (isOverContainer) {
          return {
            backgroundColor: theme.colors.gray[100]
          };
        }

        if (!allBlanksEmpty && typeof isCorrect === "boolean") {
          return {
            backgroundColor: theme.colors[isCorrect ? "green" : "red"][100]
          };
        }
      }}
    >
      {children.length ? (
        children
      ) : (
        <Flex align="center" h="full">
          &nbsp;
        </Flex>
      )}
    </Box>
  );
}

DroppableContainer.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  isCorrect: PropTypes.bool,
  allBlanksEmpty: PropTypes.bool,
  style: PropTypes.object
};
