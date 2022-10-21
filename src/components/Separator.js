import React from "react";
import { Box } from "@chakra-ui/react";

export default function Separator() {
  return (
    <Box
      as="hr"
      display="block"
      mx="auto"
      mt="12"
      mb="6"
      w="50%"
      h="2px"
      maxW="400px"
      border="none"
      css={({ theme }) => ({
        background: `linear-gradient(to right, white, ${theme.colors.blue[200]}, white)`
      })}
    />
  );
}
