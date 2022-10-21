export const defaultContainerStyle = ({ isOverContainer, isCorrect }) => ({
  backgroundColor: isOverContainer
    ? "rgb(235,235,235,1)"
    : typeof isCorrect === "boolean"
    ? isCorrect
      ? "rgba(154, 230, 180, 0.36)" // 0.16 opacity for odyssey dark mode
      : "rgba(254, 178, 178, 0.36)" // 0.16 opacity for odyssey dark mode
    : "rgb(220, 220, 220)"
});

// https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/hooks/defaults.ts#L22-L25

// default sortable transition duration -- use in the cypress integration tests
export const SORTABLE_TRANSITION_DURATION = 200;

export const WORD_BANK = "WORD_BANK";

export class SolutionGetter {
  constructor(defaultUsed = []) {
    // all the answers that have already been used in existing blanks and that have been marked as correct
    this.used = defaultUsed;
  }

  get(solutions) {
    // if answer is NOT correct, or it has no answer, check the solutions for the blank
    // if the blank only has 1 solution, then that's already the correct answer we want
    if (solutions.length === 1) {
      return solutions;
    }

    // if the blank has multiple solutions, we need to pick the one that has NOT been selected as a correct answer already
    const solution = solutions.find(
      (solution) => !this.used.includes(solution)
    );
    this.used.push(solution);
    return [solution];
  }
}

/**
 * Returns a object with blank IDs as keys, and an object as values
 *  Each object has:
 *  - id (the blank's ID)
 *  - isCorrect (boolean indicating if the blank has the correct answer)
 *  - items (an array of strings indicating what is currently in the blank)
 *  - solutions (an array of strings indicating what the correct answers could be for this blank. can have multiple.)
 */
export const getCorrectAnswers = (items) => {
  const entries = Object.entries(items);

  // get all the answers that have already been used in existing blanks and that have been marked as correct
  const alreadyUsedSolutions = entries.reduce(
    (acc, [key, value]) =>
      key !== WORD_BANK && value.isCorrect && value.solutions.length > 1
        ? [...acc, ...value.items]
        : acc,
    []
  );

  const solutionGetter = new SolutionGetter(alreadyUsedSolutions);

  return entries.reduce(
    (acc, [key, value]) =>
      key === WORD_BANK
        ? acc
        : {
            ...acc,
            [key]: {
              ...value,
              isCorrect: true,
              // if answer is already correct, then we don't need to do anything, just keep it as-is
              items: value.isCorrect
                ? value.items
                : solutionGetter.get(value.solutions)
            }
          },
    items
  );
};
