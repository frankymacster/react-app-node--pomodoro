import React, { useReducer, useEffect } from "react";
import createReducer from "./createReducer";

function Timer({
  title,
  duration = 5,
  start,
  stop,
  onDone
}) {
  const initialState = {
    count: 0,
    running: false,
  };

  const reducer = createReducer(initialState, {
    incrementCount: state => ({
      ...state,
      count: state.count + 1
    }),
    start: state => ({
      ...state,
      running: true
    }),
    stop: state => ({
      ...state,
      running: false
    }),
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  // https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
  useEffect(() => {
    if (!state.running) {
      return;
    }

    const interval = setInterval(() => {
      dispatch({
        type: "incrementCount"
      })
    }, 1000);

    return () => clearInterval(interval);
  }, [state.running]);

  useEffect(() => {
    if (state.count > 0 && state.count % duration === 0) {
      dispatch({
        type: "stop",
      });
      onDone(state);
    }
  }, [state.count]);

  useEffect(() => {
    if (start) {
      dispatch({
        type: "start",
      });
    }
  }, [start]);

  useEffect(() => {
    if (stop) {
      dispatch({
        type: "stop",
      });
    }
  }, [stop]);

  return <h1>{title} {state.count}</h1>;
}

export default Timer;
