import React, { useReducer } from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";
import TodoApp from "./TodoApp";
import Timer from "./Timer";

function Pomodoro() {
  const timersInitialState = {
    type: "idle", // "idle" | "work" | "rest"
  };

  // digraph G {
  //   "idle" -> "work" [ label="startTaskWork" ];
  //   "rest" -> "work" [ label="startTaskWork" ];
  //   "work" -> "rest" [ label="startTaskRest" ];
  //   "rest" -> "idle" [ label="stopTasks" ];
  // }
  const [timersState, timersDispatch] = useReducer(
    createMachine(
      timersInitialState,
      {
        idle: {
          startTaskWork: state => ({
            ...state,
            type: "work"
          }),
        },
        work: {
          startTaskRest: state => ({
            ...state,
            type: "rest"
          }),
        },
        rest: {
          startTaskWork: state => ({
            ...state,
            type: "work"
          }),
          stopTasks: state => ({
            ...state,
            type: "none"
          }),
        }
      }
    ),
    timersInitialState
  );


  const todosInitialState = {
    todosDoneCount: 0,
  };

  const [todosState, todosDispatch] = useReducer(
    createReducer(
      timersInitialState,
      {
        incrementTodosDoneCount: state => ({
          ...state,
          todosDoneCount: state.todosDoneCount + 1
        })
      }
    ),
    todosInitialState
  );

  return (
    <>
      <Timer
        title="work"
        duration={8}
        start={timersState.type === "work"}
        stop={timersState.type === "none"}
        onDone={s => {
          todosDispatch({
            type: "incrementTodosDoneCount"
          });
          timersDispatch({
            type: "startTaskRest"
          });
        }}
      />
      <Timer
        title="rest"
        duration={5}
        start={timersState.type === "rest"}
        stop={timersState.type === "none"}
        onDone={s => {
          timersDispatch({
            type: "startTaskWork"
          })
        }}
      />
      <button
        onClick={() => timersDispatch({
          type: "startTaskWork"
        })}
      >
        setTimerStarted
      </button>
      <TodoApp
        todosDoneCount={todosState.todosDoneCount}
        onAllTodosDone={() => timersDispatch({
          type: "stopTasks"
        })}
      />
    </>
  );
}

export default Pomodoro;
