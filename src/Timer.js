import React, { useReducer, useEffect } from "react";
import createReducer from "./createReducer";

function Timer({ title, duration = 5, triggerTimer, onDone }) {
  const initialState = {
    count: 0,
    timerStarted: false,
  };

  const reducer = createReducer(initialState, {
    incrementCount: (state, action) => ({
      ...state,
      count: state.count + 1
    }),
    setTimerStarted: (state, action) => ({
      ...state,
      timerStarted: action.timerStarted
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
    if (state.count > 0 && state.count % duration === 0) {
      dispatch({
        type: "setTimerStarted",
        timerStarted: false,
      });
      onDone(state);
    }
  }, [state.count]);

  useEffect(() => {
    if (triggerTimer) {
      dispatch({
        type: "setTimerStarted",
        timerStarted: true,
      });
    }
  }, [triggerTimer]);

  return <h1>{title} {state.count}</h1>;
}

export default Timer;
