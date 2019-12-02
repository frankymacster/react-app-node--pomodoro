import React, { useReducer } from "react";
import createReducer from "./createReducer";
import TodoApp from "./TodoApp";
import Timer from "./Timer";

function Pomodoro() {
  const initialState = {
    todosDoneCount: 0,
    runningTimer: "none", // "none" | "work" | "rest"
  };

  const reducer = createReducer(initialState, {
    incrementTodosDoneCount: state => ({
      ...state,
      todosDoneCount: state.todosDoneCount + 1
    }),
    startRestTimer: state => ({
      ...state,
      runningTimer: "rest"
    }),
    startWorkTimer: state => ({
      ...state,
      runningTimer: "work"
    }),
    stopTimers: state => ({
      ...state,
      runningTimer: "none"
    }),
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <Timer
        title="work"
        duration={8}
        start={state.runningTimer === "work"}
        stop={state.runningTimer === "none"}
        onDone={s => {
          dispatch({
            type: "incrementTodosDoneCount"
          });
          dispatch({
            type: "startRestTimer"
          });
        }}
      />
      <Timer
        title="rest"
        duration={5}
        start={state.runningTimer === "rest"}
        stop={state.runningTimer === "none"}
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
        todosDoneCount={state.todosDoneCount}
        onAllTodosDone={() => dispatch({
          type: "stopTimers"
        })}
      />
    </>
  );
}

export default Pomodoro;
