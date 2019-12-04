import React, { useReducer, useEffect } from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";

function Timer({
  title,
  duration = 5,
  start,
  stop,
  onDone
}) {
  const timer = {
    states: {
      idle: "idle",
      running: "running"
    },
    actions: {
      start: "start",
      stop: "stop"
    }
  };
  timer.initialState = {
    type: timer.states.idle
  };
  timer.transitions = useReducer(
    createMachine(
      timer.initialState,
      {
        [timer.states.idle]: {
          [timer.actions.start]: state => ({
            ...state,
            type: timer.states.running
          }),
        },
        [timer.states.running]: {
          [timer.actions.stop]: state => ({
            ...state,
            type: timer.states.idle
          }),
        }
      }
    ),
    timer.initialState
  );
  timer.currentState = timer.transitions[0];
  timer.dispatch = timer.transitions[1];


  const counter = {
    // states: 0 | 1 | 2 | ...
    actions: {
      incrementCount: "incrementCount",
    }
  };
  counter.initialState = {
    count: 0, 
  };
  counter.transitions = useReducer(
    createReducer(
      counter.initialState,
      {
        [counter.actions.incrementCount]: state => ({
          ...state,
          count: state.count + 1
        }),
      }
    ),
    counter.initialState
  );
  counter.currentState = counter.transitions[0];
  counter.dispatch = counter.transitions[1];


  // https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
  // use thunk for this
  useEffect(() => {
    if (timer.currentState.type !== timer.states.running) {
      return;
    }

    const interval = setInterval(() => {
      counter.dispatch({
        type: counter.actions.incrementCount
      })
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.currentState.type]);

  useEffect(() => {
    if (counter.currentState.count > 0
    &&  counter.currentState.count % duration === 0
    ) {
      timer.dispatch({
        type: timer.actions.stop,
      });
      onDone(counter.currentState);
    }
  }, [counter.currentState.count]);

  useEffect(() => {
    if (start) {
      timer.dispatch({
        type: timer.actions.start,
      });
    }
  }, [start]);

  useEffect(() => {
    if (stop) {
      timer.dispatch({
        type: timer.actions.stop,
      });
    }
  }, [stop]);

  return <h1>{title} {counter.currentState.count}</h1>;
}

export default Timer;
