import React, { useReducer } from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";
import TodoApp from "./TodoApp";
import Timer from "./Timer";

function Pomodoro() {
  const todos = {
    // states: 0 | 1 | 2 | ...
    actions: {
      addDoneTodo: "addDoneTodo",
      setCurrentTodo: "setCurrentTodo"
    }
  };
  todos.initialState = {
    doneTodos: [],
    currentTodo: null
  };
  todos.transitions = useReducer(
    createReducer(
      todos.initialState,
      {
        [todos.actions.addDoneTodo]: (state, action) => ({
          ...state,
          doneTodos: [ ...state.doneTodos, action.doneTodo ]
        }),
        [todos.actions.setCurrentTodo]: (state, action) => ({
          ...state,
          currentTodo: action.currentTodo
        }),
      }
    ),
    todos.initialState
  );
  todos.currentState = todos.transitions[0];
  todos.dispatch = todos.transitions[1];


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
          [timers.actions.startWork]: state => {
            if (!todos.currentState.currentTodo) {
              return state;
            }

            return {
              ...state,
              type: timers.states.work
            };
          },
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
        onDone={() => 
          todos.dispatch({
            type: todos.actions.addDoneTodo,
            doneTodo: todos.currentState.currentTodo
          })          
        }
      />
      <button
        onClick={() => timers.dispatch({
          type: timers.actions.startWork
        })}
      >
        start
      </button>
      <TodoApp
        doneTodos={todos.currentState.doneTodos}
        getNextTodo={todo => {
          // don't set undefined todo as currentTodo
          if (todo) {
            todos.dispatch({
              type: todos.actions.setCurrentTodo,
              currentTodo: todo
            });
          }
        }}
        areAllTodosDone={yes => {
          // decide if go to "work" or "idle"
          if (yes) {
            timers.dispatch({
              type: timers.actions.stop
            });
          } else {
            timers.dispatch({
              type: timers.actions.startWork
            });
          }
        }}
      />
    </>
  );
}

export default Pomodoro;
