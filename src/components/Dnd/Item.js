import PropTypes from "prop-types";
import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { CSS } from "@dnd-kit/utilities";
import { FiCheck, FiX } from "react-icons/fi";
import { keyframes } from "@emotion/react";

const boxShadowBorder =
  "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05)";
const boxShadowCommon =
  "0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)";
const boxShadow = `${boxShadowBorder}, ${boxShadowCommon}`;

const pop = keyframes({
  from: {
    transform: "scale(1)",
    boxShadow: "var(--box-shadow)"
  },
  to: {
    transform: "scale(var(--scale))",
    boxShadow: "var(--box-shadow-picked-up)"
  }
});

const wrapperDragOverlay = (dragOverlay) =>
  dragOverlay
    ? {
        "--scale": 1.05,
        "--box-shadow": boxShadow,
        "--box-shadow-picked-up": {
          "--box-shadow-picked-up": [
            boxShadowBorder,
            "-1px 0 15px 0 rgba(34, 33, 81, 0.01)",
            "0px 15px 15px 0 rgba(34, 33, 81, 0.25)"
          ].toString()
        },
        zIndex: 999
      }
    : {};

function getItemStyles({ dragging, dragOverlay }) {
  if (dragOverlay) {
    return {
      cursor: "inherit",
      animation: `${pop} 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)`,
      transform: "scale(var(--scale))",
      boxShadow: "var(--box-shadow-picked-up)",
      opacity: 1
    };
  }

  if (dragging) {
    return {
      opacity: "var(--dragging-opacity, 0.25)",
      zIndex: 0,

      "&:focus": {
        boxShadow
      }
    };
  }
}

export const Item = React.memo(
  React.forwardRef(
    (
      {
        taskId,
        dragOverlay,
        dragging,
        listeners,
        style,
        transition,
        transform,
        value,
        isCorrect,
        ...props
      },
      ref
    ) => {
      const isDisplayingAlertIcon = typeof isCorrect === "boolean";

      return (
        <Flex
          justifySelf="center"
          w="full"
          transformOrigin="top left"
          style={{
            transform: CSS.Transform.toString(transform),
            transition
          }}
          sx={{
            touchAction: "manipulation",
            ...wrapperDragOverlay(dragOverlay),
            height: 8
          }}
          ref={ref}
        >
          <Flex
            pos="relative"
            grow="1"
            align="center"
            justify="space-between"
            color="black"
            px="3"
            boxShadow={isDisplayingAlertIcon ? "none" : boxShadow}
            outline="none"
            whiteSpace="nowrap"
            rounded="sm"
            cursor="grab"
            sx={{
              WebkitTapHighlightColor: "transparent", // for mobile

              // only show focus outline when using keyboard
              "&:focus-visible": {
                boxShadow: "outline",
                touchAction: "none",
                userSelect: "none",
                WebkitUserSelect: "none"
              },

              ...getItemStyles({ dragging, dragOverlay }),
              ...style
            }}
            css={({ theme }) => ({
              backgroundColor:
                !isDisplayingAlertIcon && theme.colors.blackAlpha[100]
            })}
            {...listeners}
            {...props}
            tabIndex={0}
          >
            {value}
            {typeof isCorrect === "boolean" && (
              <Box
                as={isCorrect ? FiCheck : FiX}
                ml="1"
                color={`${isCorrect ? "green" : "red"}.600`}
              />
            )}
          </Flex>
        </Flex>
      );
    }
  )
);

Item.displayName = "Item";

Item.propTypes = {
  taskId: PropTypes.string,
  dragging: PropTypes.bool,
  dragOverlay: PropTypes.bool,
  listeners: PropTypes.object,
  style: PropTypes.object,
  transition: PropTypes.string,
  transform: PropTypes.object,
  value: PropTypes.node,
  isCorrect: PropTypes.bool
};
