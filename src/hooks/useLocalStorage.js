import React from "react";

export const useLocalStorage = (
  key,
  defaultValue = "",
  { serialize = JSON.stringify, deserialize = JSON.parse } = {} // desctructured options, passing default values for `serialize` and `deserialize`
) => {
  // lazily initialize state via a callback as our `useState` argument
  // since we only care about what's in localStorage on the first render to get the initial value,
  // we don't need our function to go look in localStorage on every subsequent render, since that can potentially be computationally expensive
  const [state, setState] = React.useState(() => {
    const localStorageValue = window.localStorage.getItem(key);

    if (localStorageValue) {
      // the try/catch is here in case the localStorage value was set before

      // localStorage will coerce the value it's storing into a string, even if you pass it something like a number
      // we can combat this by parsing or deserializing the localStorage value
      try {
        return deserialize(localStorageValue);
      } catch (error) {
        window.localStorage.removeItem(key);
      }
    }

    // if the user passes a function as the defaultValue, we want to call that function
    // otherwise just return the defaultValue
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  // if the user decides to change the key

  // let's keep track of the old key via useRef so we can mutate it without triggering rerenders
  const previousKeyRef = React.useRef(key);

  React.useEffect(() => {
    const previousKey = previousKeyRef.current;

    // if the user changed the key
    if (previousKey !== key) {
      // remove the old one from localStorage
      window.localStorage.removeItem(previousKey);
    }

    // update our previousKeyRef to be the new key
    previousKeyRef.current = key;

    // update our localStorage
    // when we try to put the value into localStorage, we want to serialize this so that we can parse it back out when we're retrieving it later
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
};
