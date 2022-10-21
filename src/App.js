import React from "react";
import { Flex, Heading } from "@chakra-ui/react";
import Instructions from "./components/Instructions";
import Dnd, { Blank } from "./components/Dnd";
import Separator from "./components/Separator";

// https://docs.dndkit.com/introduction/getting-started
// Modified the Multiple Containers Grid example on Storybook
// https://5fc05e08a4a65d0021ae0bf2-xkdjvdfnuz.chromatic.com/?path=/docs/presets-sortable-multiple-containers--grid
// code here: https://github.com/clauderic/dnd-kit/blob/b7355d19d9e15bb1972627bb622c2487ddec82ad/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx

// TODO: make custom "coordinates getter" to improve UX of keyboard navigation -- https://docs.dndkit.com/api-documentation/sensors/keyboard

export default function App() {
  return (
    <Flex direction="column" alignItems="center" px="6">
      <Heading as="h1" textAlign="center" mt="2">
        Drag 'n' drop
      </Heading>

      <Instructions />

      <Separator />

      <Dnd
        taskId="dnd-1"
        title="Fill in the blank"
        wrongAnswers={["😢", "bad"]}
      >
        I am a `drag 'n' drop` <Blank solution="activity" />. This blank has
        <Blank solution={["two", "multiple", "Answer 1"]} /> correct answers.{" "}
        <Blank solution={["Answer 1", "Answer 2"]} /> and{" "}
        <Blank solution={["Answer 1", "Answer 2"]} /> are both correct and the
        order doesn't matter.
      </Dnd>
    </Flex>
  );
}
