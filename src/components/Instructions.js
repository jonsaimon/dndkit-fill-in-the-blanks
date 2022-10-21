import React from "react";
import { Box, Kbd, UnorderedList, ListItem, Text } from "@chakra-ui/react";

export default function Instructions() {
  return (
    <Box
      w="80%"
      maxW="600px"
      mx="auto"
      mt="4"
      p="4"
      borderRadius="8px"
      bgColor="blue.100"
    >
      <Text fontWeight="700">I am keyboard friendly! </Text>
      <UnorderedList mt="4" listStylePosition="inside">
        <ListItem>
          Use{" "}
          <span>
            <Kbd>Tab</Kbd>
          </span>{" "}
          when not "holding" an item to change the focus to the next item (
          <span>
            <Kbd>Shift</Kbd>
          </span>{" "}
          +{" "}
          <span>
            <Kbd>Tab</Kbd>
          </span>{" "}
          to go back to the previous item)
        </ListItem>
        <ListItem>
          Use{" "}
          <span>
            <Kbd>spacebar</Kbd>
          </span>{" "}
          or <Kbd>Enter</Kbd> to "pick up" or "put down" an item.
        </ListItem>{" "}
        <ListItem>
          Use{" "}
          <span>
            <Kbd>↑</Kbd>
          </span>{" "}
          <span>
            <Kbd>↓</Kbd>
          </span>{" "}
          <span>
            <Kbd>→</Kbd>
          </span>{" "}
          <span>
            <Kbd>←</Kbd>
          </span>{" "}
          to move a "picked up" item.
        </ListItem>{" "}
      </UnorderedList>
    </Box>
  );
}
