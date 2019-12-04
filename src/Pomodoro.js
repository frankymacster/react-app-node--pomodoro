import React, { useReducer } from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";
import TodoApp from "./TodoApp";
import Timer from "./Timer";

function Pomodoro() {
  const timers = {
    states: {
      idle: "idle",
      work: "work",
      rest: "rest",
    },
    actions: {
      startWork: "startWork",
      startRest: "startRest",
      stop: "stop",
    }
  };
  timers.initialState = {
    type: "idle",
  };
  timers.transitions = useReducer(
    createMachine(
      /*
        digraph G {
          "idle" -> "work" [ label="startWork" ];
          "rest" -> "work" [ label="startRest" ];
          "work" -> "rest" [ label="startWork" ];
          "rest" -> "idle" [ label="stop" ];
        }
      */
      timers.initialState,
      {
        [timers.states.idle]: {
          [timers.actions.startWork]: state => ({
            ...state,
            type: timers.states.work
          }),
        },
        [timers.states.work]: {
          [timers.actions.startRest]: state => ({
            ...state,
            type: timers.states.rest
          }),
        },
        [timers.states.rest]: {
          [timers.actions.startWork]: state => ({
            ...state,
            type: timers.states.work
          }),
          [timers.actions.stop]: state => ({
            ...state,
            type: timers.states.idle
          }),
        }
      }
    ),
    timers.initialState
  );
  timers.currentState = timers.transitions[0];
  timers.dispatch = timers.transitions[1];


  const todos = {
    actions: {
      incrementTodosDoneCount: "incrementTodosDoneCount"
    }
  };
  todos.initialState = {
    todosDoneCount: 0,
  };
  todos.transitions = useReducer(
    createReducer(
      todos.initialState,
      {
        [todos.actions.incrementTodosDoneCount]: state => ({
          ...state,
          todosDoneCount: state.todosDoneCount + 1
        })
      }
    ),
    todos.initialState
  );
  todos.currentState = todos.transitions[0];
  todos.dispatch = todos.transitions[1];


  return (
    <>
      <Timer
        title="work"
        duration={8}
        start={timers.currentState.type === timers.states.work}
        stop={timers.currentState.type === timers.states.idle}
        onDone={s => {
          timers.dispatch({
            type: timers.actions.startRest
          });
        }}
      />
      <Timer
        title="rest"
        duration={5}
        start={timers.currentState.type === timers.states.rest}
        stop={timers.currentState.type === timers.states.idle}
        onDone={s => {
          todos.dispatch({
            type: todos.actions.incrementTodosDoneCount
          });
          timers.dispatch({
            type: timers.actions.startWork
          })
        }}
      />
      <button
        onClick={() => timers.dispatch({
          type: timers.actions.startWork
        })}
      >
        setTimerStarted
      </button>
      <TodoApp
        todosDoneCount={todos.currentState.todosDoneCount}
        onAllTodosDone={() => timers.dispatch({
          type: timers.actions.stop
        })}
      />
    </>
  );
}

export default Pomodoro;
