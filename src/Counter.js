import React, { useReducer, useEffect } from "react";
import createReducer from "./createReducer";

const Counter = ({ initialCount, onChange }) => {
  useEffect(() => 
    dispatch({ type: "setCount", count: initialCount }),
    [initialCount]
  );

  const initialState = { count: initialCount };

  const reducer = createReducer(initialState, {
    setCount: (state, action) => {
      const newState = { count: action.count };
      onChange(newState)
      return newState
    },
    increment: state => {
      const newState = { count: state.count + 1 };
      onChange(newState)
      return newState
    },
    decrement: state => {
      const newState = { count: state.count - 1 };
      onChange(newState)
      return newState
    }
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
