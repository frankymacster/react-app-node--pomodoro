import React, { useReducer, useEffect } from "react";
import createReducer from "./createReducer";

function Pomodoro({ onDone }) {
  const initialState = {
    count: 0,
    timerStarted: false,
  };

  const reducer = createReducer(initialState, {
    incrementCount: (state, action) => ({
      ...state,
      count: state.count + 1
    }),
    setTimerStarted: state => ({
      ...state,
      timerStarted: !state.timerStarted
    })
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  // https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
  useEffect(() => {
    if (!state.timerStarted) {
      return;
    }

    const interval = setInterval(() => {
      dispatch({ type: "incrementCount" })
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timerStarted]);

  useEffect(() => {
    if (state.count > 0 && state.count % 5 === 0) {
      dispatch({ type: "setTimerStarted" });
      onDone(state);
    }
  }, [state.count]);

  return (
    <>
      <h1>{state.count}</h1>
      <button
        onClick={() => dispatch({ type: "setTimerStarted" })}
      >
        setTimerStarted
      </button>
    </>
  );
}

export default Pomodoro;
