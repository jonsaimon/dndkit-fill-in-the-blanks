# Drag 'n' drop

To create a drag 'n' drop fill-in-the-blank activity, use the `Dnd` component. The user must fill in all of the blanks with the correct answers in order to mark the `Dnd` task as complete. `Dnd` accepts the following props:

| Name           | Description                                            | type   | Default value                                                        | Required |
| -------------- | ------------------------------------------------------ | ------ | -------------------------------------------------------------------- | -------- |
| taskId         | a unique identifier for the question within the course | string | --                                                                   | yes      |
| wrongAnswers   | an array of extra, incorrect choices                   | array  | []                                                                   | yes      |
| title          | the title of the multiple choice question              | string | "Drag 'n' Drop"                                                      | no       |
| successMessage | a message that appears when the answer is correct      | string | "Nicely done!"                                                       | no       |
| failureMessage | a message that appears when the answer is incorrect    | string | "Review the video or read the course to find the right information." | no       |
| children       | content to be displayed                                | node   | --                                                                   | no       |

To create the different choices, use the `Blank` component as `children` inside of `Dnd`. `Blank` accepts the following props:

| Name     | Description                                     | type            | Default value | Required |
| -------- | ----------------------------------------------- | --------------- | ------------- | -------- |
| solution | correct answer or a list of the correct answers | string \| array | --            | yes      |

> This component randomizes the order in which the choices are displayed to the user in the word bank, so they won't necessarily be rendered in the same order in which they're written.

Example usage:

```jsx
<Dnd taskId="dnd-1" title="Fill in the blank" wrongAnswers={["😢", "bad"]}>
  I am a `drag 'n' drop` <Blank solution="activity" />. This blank has
  <Blank solution={["two", "multiple", "Answer 1"]} /> correct answers. <Blank
    solution={["Answer 1", "Answer 2"]}
  /> and <Blank solution={["Answer 1", "Answer 2"]} /> are both correct and the order
  doesn't matter.
</Dnd>
```

## Notes

This component was built using [`dnd-kit`](https://docs.dndkit.com/introduction/getting-started). This particular implementation is a heavy modification of the "Multiple Containers Grid" example on [Storybook](https://5fc05e08a4a65d0021ae0bf2-xkdjvdfnuz.chromatic.com/?path=/docs/presets-sortable-multiple-containers--grid). You can find the code for that Storybook example on [GitHub](https://github.com/clauderic/dnd-kit/blob/b7355d19d9e15bb1972627bb622c2487ddec82ad/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx).

Some other packages were used for ease of styling, such as [Chakra UI](https://chakra-ui.com/) and [`polished`](https://polished.js.org/). [`canvas-confetti`](https://github.com/catdad/canvas-confetti#readme) was used for the celebration confetti upon successful completion of a drag 'n' drop activity. Some utilities from [`lodash`](https://lodash.com/) were also used for more rapid development with this example repo.

If you'd like to use this in your own project, you might need to swap out the usage of the `useLocalStorage` hook and replace it with your own API call that updates your database. For simplicity's sake for this demo, `localStorage` was sufficient.
