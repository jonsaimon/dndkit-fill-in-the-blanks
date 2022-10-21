import DroppableContainer from "./DroppableContainer";
import React, { Fragment, useMemo, useState } from "react";
import SortableItem from "./SortableItem";
import Submission from "./Submission";
import WordBank from "./WordBank";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { Global } from "@emotion/react";
import { Item } from "./Item";
import { RiDragDropLine } from "react-icons/ri";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import PropTypes from "prop-types";
import { SolutionGetter, WORD_BANK } from "../../utils";
import shuffle from "lodash/shuffle";
import uniq from "lodash/uniq";

// https://docs.dndkit.com/introduction/getting-started

// Modified the Multiple Containers Grid example on Storybook
// https://5fc05e08a4a65d0021ae0bf2-xkdjvdfnuz.chromatic.com/?path=/docs/presets-sortable-multiple-containers--grid
// code here: https://github.com/clauderic/dnd-kit/blob/b7355d19d9e15bb1972627bb622c2487ddec82ad/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx

// TODO: make custom "coordinates getter" to improve UX of keyboard navigation? -- https://docs.dndkit.com/api-documentation/sensors/keyboard

// need a JSX component that can accept props
export function Blank({ solution }) {
  return <span></span>;
}

const parseItemsFromChildren = (children, wrongAnswers, isTaskComplete) => {
  const solutionGetter = new SolutionGetter();
  const childrenWithBlanks = React.Children.toArray(children).map(
    (child, index) => {
      if (child.props?.solution) {
        const { solution } = child.props;
        const solutions = Array.isArray(solution) ? solution : [solution];
        return {
          id: `blank-${index}`,
          solutions,
          isCorrect: isTaskComplete || null,
          items: isTaskComplete ? solutionGetter.get(solutions) : []
        };
      }
      return child;
    }
  );

  const solutions = [];
  const blanks = childrenWithBlanks.reduce((acc, currChild) => {
    if (currChild.solutions) {
      solutions.push(...currChild.solutions);
      return {
        ...acc,
        [currChild.id]: currChild
      };
    }

    return acc;
  }, {});

  blanks[WORD_BANK] = {
    items: isTaskComplete
      ? wrongAnswers
      : shuffle(uniq(solutions).concat(wrongAnswers))
  };

  return [blanks, childrenWithBlanks];
};

export default function Dnd({
  taskId,
  children,
  wrongAnswers = [],
  title = "Drag 'n' Drop",
  successMessage = "Nicely done!",
  failureMessage = "Review the video or read the course to find the right information."
}) {
  const [isTaskComplete] = useLocalStorage(taskId);
  const [isCorrect, setIsCorrect] = useState(
    isTaskComplete && isTaskComplete.length ? true : false
  );
  const [activeId, setActiveId] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(
    isTaskComplete && isTaskComplete.length ? true : false
  );

  const [initialItems] = useMemo(
    () => parseItemsFromChildren(children, wrongAnswers),
    [children, wrongAnswers]
  );

  const [defaultItems, childrenWithBlanks] = useMemo(
    () => parseItemsFromChildren(children, wrongAnswers, isTaskComplete),
    [children, isTaskComplete, wrongAnswers]
  );

  // keys in `items` are the ids of the blanks/droppableContainers
  const [items, setItems] = useState(defaultItems);
  const allBlanksEmpty = useMemo(
    () =>
      !Object.entries(items).some(
        ([key, value]) => key !== WORD_BANK && value.items.length
      ),
    [items]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // find the blank/droppableContainer that an item is in
  const findContainer = (id) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].items.includes(id));
  };

  const onDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const onDragEnd = ({ active, over }) => {
    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;
    const overContainer = findContainer(overId);

    if (activeContainer && overContainer) {
      const activeIndex = items[activeContainer].items.indexOf(active.id);
      const overIndex = items[overContainer].items.indexOf(overId);

      // if it's different than overContainer, swap the items
      if (activeContainer !== overContainer) {
        setItems((prevItems) => {
          let activeItems = [...prevItems[activeContainer].items];
          let overItems = [...prevItems[overContainer].items];

          // activeContainer gets what was in overContainer and vice versa
          // first check if overContainer is word bank or a blank
          // if it's a blank (NOT the word bank), swap contents with activeContainer
          // if it IS word bank, just move activeContainer contents to word bank
          if (overContainer === WORD_BANK) {
            activeItems = [];
            overItems.push(active.id);
          } else {
            activeItems.splice(activeIndex, 1);

            // if there's already something in the blank, push its contents to activeItems
            if (overItems.length) {
              activeItems.push(...overItems);
            }
            overItems = [active.id];
          }

          const updatedItems = {
            ...prevItems,
            [activeContainer]: {
              ...prevItems[activeContainer],
              isCorrect: null,
              items: activeItems
            },
            [overContainer]: {
              ...prevItems[overContainer],
              isCorrect: null,
              items: overItems
            }
          };

          // reset isCorrect values if all of the blanks (minus word bank) are empty
          if (allBlanksEmpty) {
            Object.values(updatedItems).forEach((blank) => {
              blank.isCorrect = null;
            });
          }

          return updatedItems;
        });
      } else if (activeIndex !== overIndex) {
        setItems((prevItems) => ({
          ...prevItems,
          [overContainer]: {
            ...prevItems[overContainer],
            isCorrect: null,
            items: arrayMove(items[overContainer].items, activeIndex, overIndex)
          }
        }));
      }
    }

    setActiveId(null);
  };

  const onDragCancel = () => {
    setActiveId(null);
  };

  const colorScheme = !hasSubmitted ? "blue" : isCorrect ? "green" : "red";
  const showWordBank = !hasSubmitted || !isCorrect;

  return (
    <Box pl="4" py="1" maxW="960px" mx="auto">
      <Flex
        align="center"
        color={`${colorScheme}.600`}
        fontWeight="semibold"
        mb="2"
      >
        <Box mr="2" as={RiDragDropLine} fontSize="xl" />
        <Text>{title}</Text>
      </Flex>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <Flex direction="column" alignItems="flex-start">
          <div>
            {childrenWithBlanks.map((child, index) => {
              const { solutions, id } = child;
              // need a blank for children that have a 'solution'
              if (solutions) {
                const { items: blankItems, isCorrect: isBlankCorrect } = items[
                  id
                ];
                return (
                  <>
                    {" "}
                    <DroppableContainer
                      key={id}
                      id={id}
                      items={blankItems}
                      isCorrect={isBlankCorrect}
                      allBlanksEmpty={allBlanksEmpty}
                      style={{
                        height: "40px"
                      }}
                    >
                      {blankItems.map((value) => {
                        return (
                          <SortableItem
                            key={`sortable-item--${value}`}
                            id={value}
                            taskId={taskId}
                            isCorrect={isBlankCorrect}
                          />
                        );
                      })}
                    </DroppableContainer>{" "}
                  </>
                );
              }
              return <Fragment key={index}>{child}</Fragment>;
            })}
          </div>
          {showWordBank && <WordBank taskId={taskId} items={items} />}
        </Flex>
        <DragOverlay>
          {activeId && (
            <>
              <Global styles={{ body: { cursor: "grabbing" } }} />
              <Item value={activeId} dragOverlay />
            </>
          )}
        </DragOverlay>
        <Submission
          taskId={taskId}
          isCorrect={isCorrect}
          items={items}
          hasSubmitted={hasSubmitted}
          failureMessage={failureMessage}
          successMessage={successMessage}
          setIsCorrect={setIsCorrect}
          setItems={setItems}
          reset={onDragCancel}
          initialItems={initialItems}
          setHasSubmitted={setHasSubmitted}
        />
      </DndContext>
    </Box>
  );
}

Dnd.propTypes = {
  taskId: PropTypes.string.isRequired,
  children: PropTypes.node,
  wrongAnswers: PropTypes.array,
  successMessage: PropTypes.string,
  title: PropTypes.string,
  failureMessage: PropTypes.string,
  items: PropTypes.object
};
