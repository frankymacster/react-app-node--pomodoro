import React, { useReducer, useEffect } from "react";
import createReducer from "./createReducer";
import TodoApp from "./TodoApp";
import Timer from "./Timer";

function Pomodoro() {
  const initialState = {
    text: 0,
    setTopTodoAsDone: -1,
    workTimerShouldStart: false,
    restTimerShouldStart: false,
  };

  const reducer = createReducer(initialState, {
    setTopTodoAsDone: (state, action) => ({
      ...state,
      setTopTodoAsDone: state.setTopTodoAsDone + 1
    }),
    startRestTimer: (state, action) => ({
      ...state,
      restTimerShouldStart: true,
      workTimerShouldStart: false
    }),
    startWorkTimer: (state, action) => ({
      ...state,
      restTimerShouldStart: false,
      workTimerShouldStart: true
    }),
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <Timer
        title="work"
        duration={8}
        triggerTimer={state.workTimerShouldStart}
        onDone={s => {
          dispatch({
            type: "setTopTodoAsDone"
          });
          dispatch({
            type: "startRestTimer"
          });
        }}
      />
      <Timer
        title="rest"
        duration={5}
        triggerTimer={state.restTimerShouldStart}
        onDone={s => {
          dispatch({
            type: "startWorkTimer"
          })
        }}
      />

      <button
        onClick={() => dispatch({
          type: "startWorkTimer"
        })}
      >
        setTimerStarted
      </button>
      <TodoApp
        setTopTodoAsDone={state.setTopTodoAsDone}
        // TODO onAllTasksDone: stop timers
      />
    </>
  );
}

export default Pomodoro;
