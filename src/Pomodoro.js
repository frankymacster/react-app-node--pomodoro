import React, { useReducer } from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";
import TodoApp from "./TodoApp";
import Timer from "./Timer";
import ToggleButton from "./ToggleButton";


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
todos.transitions =
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
      [todos.actions.onAllTodosDone]: state => ({
        ...state,
        currentTodo: null
      }),
    }
  );


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
timers.transitions = createMachine(
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
          type: timers.states.idle,
      }),
    }
  }
);


const messages = {
  actions: {
    onTaskPauseRequested: "onTaskPauseRequested",
    onTaskResumeRequested: "onTaskResumeRequested",
  },
  states: {
    pause: "pause",
    resume: "resume",
  }
};
messages.initialState = {};
messages.transitions = createReducer(
  messages.initialState,
  {
    [messages.actions.onTaskPauseRequested]: state => ({
      ...state,
      type: messages.states.pause
    }),
    [messages.actions.onTaskResumeRequested]: state => ({
      ...state,
      type: messages.states.resume
    }),
  });


function Pomodoro() {
  [timers.currentState, timers.dispatch] = useReducer(timers.transitions, timers.initialState);
  [todos.currentState, todos.dispatch] = useReducer(todos.transitions, todos.initialState);
  [messages.currentState, messages.dispatch] = useReducer(messages.transitions, messages.initialState);

  return (
    <>
      <Timer
        title="work"
        duration={8}
        start={timers.currentState.type === timers.states.work}
        pause={messages.currentState.type === messages.states.pause}
        resume={messages.currentState.type === messages.states.resume}
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
        pause={messages.currentState.type === messages.states.pause}
        resume={messages.currentState.type === messages.states.resume}
        onDone={() => 
          todos.dispatch({
            type: todos.actions.onRestTimerDone,
            doneTodo: todos.currentState.currentTodo
          })
          // TODO should change toggleButton back to start
        }
      />
      <ToggleButton
        turnOnText={"start"}
        turnOffText={"pause"}
        toggleCondition={todos.currentState.currentTodo}
        onTurnedOn={() => {
          timers.dispatch({
            type: timers.actions.onTaskStartRequested
          });
          messages.dispatch({
            type: messages.actions.onTaskResumeRequested
          });
        }}
        onTurnedOff={() => {
          messages.dispatch({
            type: messages.actions.onTaskPauseRequested
          });
        }}
      />
      <TodoApp
        doneTodos={todos.currentState.doneTodos}
        onChange={ts => {
          todos.dispatch({
            type: todos.actions.onGotNextTodo,
            currentTodo: ts.filter(todo => !todo.done)[0] || null
          });

          if (ts.every(todo => todo.done === true)) {
            timers.dispatch({
              type: timers.actions.onAllTodosDone
            });
            todos.dispatch({
              type: todos.actions.onAllTodosDone
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
