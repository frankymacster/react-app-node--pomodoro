import React, { useReducer } from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";
import TodoApp from "./TodoApp";
import Timer from "./Timer";

function Pomodoro() {
  const todos = {
    // states: 0 | 1 | 2 | ...
    actions: {
      onRestTimerDone: "onRestTimerDone",
      onGotNextTodo: "onGotNextTodo"
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
        [todos.actions.onRestTimerDone]: (state, action) => ({
          ...state,
          doneTodos: [ ...state.doneTodos, action.doneTodo ]
        }),
        [todos.actions.onGotNextTodo]: (state, action) => {
          if (!action.currentTodo) {
            return state;
          }

          return {
            ...state,
            currentTodo: action.currentTodo
          }
        },
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
      onTaskStartRequested: "onTaskStartRequested",
      onWorkDone: "onWorkDone",
      onAllTodosDone: "onAllTodosDone",
    }
  };
  timers.initialState = {
    type: "idle",
  };
  timers.transitions = useReducer(
    createMachine(
      /*
        digraph G {
          "idle" -> "work" [ label="onTaskStartRequested" ];
          "rest" -> "work" [ label="onNotAllTodosDone" ];
          "work" -> "rest" [ label="onWorkDone" ];
          "rest" -> "idle" [ label="onAllTodosDone" ];
        }
      */
      timers.initialState,
      {
        [timers.states.idle]: {
          [timers.actions.onTaskStartRequested]: state => {
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
          [timers.actions.onWorkDone]: state => ({
            ...state,
            type: timers.states.rest
          }),
        },
        [timers.states.rest]: {
          [timers.actions.onNotAllTodosDone]: state => {
            if (!todos.currentState.currentTodo) {
              return state;
            }

            return {
              ...state,
              type: timers.states.work
            };
          },  
          [timers.actions.onAllTodosDone]: state => ({
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
        onDone={() =>
          timers.dispatch({
            type: timers.actions.onWorkDone
          })
        }
      />
      <Timer
        title="rest"
        duration={5}
        start={timers.currentState.type === timers.states.rest}
        stop={timers.currentState.type === timers.states.idle}
        onDone={() => 
          todos.dispatch({
            type: todos.actions.onRestTimerDone,
            doneTodo: todos.currentState.currentTodo
          })          
        }
      />
      <button
        onClick={() =>
          timers.dispatch({
            type: timers.actions.onTaskStartRequested
          })
        }
      >
        start
      </button>
      <TodoApp
        doneTodos={todos.currentState.doneTodos}
        getNextTodo={todo =>
          todos.dispatch({
            type: todos.actions.onGotNextTodo,
            currentTodo: todo
          })
        }
        areAllTodosDone={yes => {
          // decide if go to "work" or "idle"
          if (yes) {
            timers.dispatch({
              type: timers.actions.onAllTodosDone
            });
          } else {
            timers.dispatch({
              type: timers.actions.onNotAllTodosDone
            });
          }
        }}
      />
    </>
  );
}

export default Pomodoro;
