import React, { useReducer } from "react";
import createReducer from "./createReducer";

const Counter = ({ initialCount }) => {
  const initialState = { count: initialCount };

  const reducer = createReducer(initialState, {
    reset: () => initialState,
    increment: state => ({ count: state.count + 1 }),
    decrement: state => ({ count: state.count - 1 })
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
};

export default Counter;
