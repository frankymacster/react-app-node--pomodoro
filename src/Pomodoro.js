import React, { useReducer } from "react";
import createReducer from "./createReducer";
import TodoApp from "./TodoApp";
import Timer from "./Timer";

function Pomodoro() {
  const timersInitialState = {
    runningTimer: "none", // "none" | "work" | "rest"
  };

  const [timersState, timersDispatch] = useReducer(
    createReducer(timersInitialState, {
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
    }),
    timersInitialState
  );


  const todosInitialState = {
    todosDoneCount: 0,
  };

  const [todosState, todosDispatch] = useReducer(
    createReducer(timersInitialState, {
      incrementTodosDoneCount: state => ({
        ...state,
        todosDoneCount: state.todosDoneCount + 1
      })
    }),
    todosInitialState
  );

  return (
    <>
      <Timer
        title="work"
        duration={8}
        start={timersState.runningTimer === "work"}
        stop={timersState.runningTimer === "none"}
        onDone={s => {
          todosDispatch({
            type: "incrementTodosDoneCount"
          });
          timersDispatch({
            type: "startRestTimer"
          });
        }}
      />
      <Timer
        title="rest"
        duration={5}
        start={timersState.runningTimer === "rest"}
        stop={timersState.runningTimer === "none"}
        onDone={s => {
          timersDispatch({
            type: "startWorkTimer"
          })
        }}
      />
      <button
        onClick={() => timersDispatch({
          type: "startWorkTimer"
        })}
      >
        setTimerStarted
      </button>
      <TodoApp
        todosDoneCount={todosState.todosDoneCount}
        onAllTodosDone={() => timersDispatch({
          type: "stopTimers"
        })}
      />
    </>
  );
}

export default Pomodoro;
