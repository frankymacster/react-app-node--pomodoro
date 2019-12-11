import React, { useReducer, useEffect } from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";

function Timer({
  title,
  duration = 5,
  resetCondition,
  pause,
  resume,
  onDone
}) {
  const timer = {
    states: {
      running: "running",
      paused: "paused",
    },
    actions: {
      onTimerPauseRequested: "onTimerPauseRequested",
      onTimerResumeRequested: "onTimerResumeRequested",
      onCounterDone: "onCounterDone",
    }
  };
  timer.initialState = {
    type: timer.states.paused
  };
  timer.transitions = useReducer(
    createMachine(
      // digraph G {
      //   "running" -> "paused" [ label="onTimerPauseRequested" ];
      //   "paused" -> "running" [ label="onTimerResumeRequested" ];
      // }
      timer.initialState,
      {
        [timer.states.running]: {
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
      onResetCondition: "onResetCondition",
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
        [counter.actions.onResetCondition]: state => ({
          ...state,
          count: 0
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

  useEffect(() => {
    if (resetCondition) {
      counter.dispatch({
        type: counter.actions.onResetCondition,
      });
    }
  }, [resetCondition])

  return <h1>{title} {counter.currentState.count}</h1>;
}

export default Timer;
