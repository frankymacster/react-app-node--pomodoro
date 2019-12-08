import React, { useReducer, useEffect } from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";

function Timer({
  title,
  duration = 5,
  start,
  pause,
  resume,
  onDone
}) {
  const timer = {
    states: {
      idle: "idle",
      running: "running",
      paused: "paused",
    },
    actions: {
      onTimerStartRequested: "onTimerStartRequested",
      onTimerPauseRequested: "onTimerPauseRequested",
      onTimerResumeRequested: "onTimerResumeRequested",
      onCounterDone: "onCounterDone",
    }
  };
  timer.initialState = {
    type: timer.states.idle
  };
  timer.transitions = useReducer(
    createMachine(
      // digraph G {
      //   "idle" -> "running" [ label="onTimerStartRequested" ]; 
      //   "running" -> "idle" [ label="stop" ];
      //   "running" -> "paused" [ label="onTimerPauseRequested" ];
      //   "paused" -> "running" [ label="onTimerResumeRequested" ];
      // }
      timer.initialState,
      {
        [timer.states.idle]: {
          [timer.actions.onTimerStartRequested]: state => ({
            ...state,
            type: timer.states.running
          }),
        },
        [timer.states.running]: {
          [timer.actions.onCounterDone]: state => ({
            ...state,
            type: timer.states.idle
          }),
          [timer.actions.onTimerPauseRequested]: state => ({
            ...state,
            type: timer.states.paused
          }),
        },
        [timer.states.paused]: {
          [timer.actions.onTimerResumeRequested]: state => ({
            ...state,
            type: timer.states.running
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
        type: timer.actions.onCounterDone,
      });
      onDone(counter.currentState);
    }
  }, [counter.currentState.count]);

  useEffect(() => {
    if (start) {
      timer.dispatch({
        type: timer.actions.onTimerStartRequested,
      });
    }
  }, [start]);

  useEffect(() => {
    if (pause) {
      timer.dispatch({
        type: timer.actions.onTimerPauseRequested,
      });
    }
  }, [pause]);

  useEffect(() => {
    if (resume) {
      timer.dispatch({
        type: timer.actions.onTimerResumeRequested,
      });
    }
  }, [resume]);

  return <h1>{title} {counter.currentState.count}</h1>;
}

export default Timer;
