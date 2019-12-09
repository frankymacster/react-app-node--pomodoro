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
    off: "off",
    work_on: "work_on",
    work_off: "work_off",
    rest_on: "rest_on",
    rest_off: "rest_off",
  },
  actions: {
    onToggleButtonOnTurnedOn: "onToggleButtonOnTurnedOn",
    onToggleButtonOnTurnedOff: "onToggleButtonOnTurnedOff",
    onWorkDone: "onWorkDone",
    onAllTodosDone: "onAllTodosDone",
    onNotAllTodosDone: "onNotAllTodosDone",
  }
};
timers.initialState = {
  type: timers.states.off,
};
timers.transitions = createMachine(
  timers.initialState,
  {
    [timers.states.off]: {
      [timers.actions.onToggleButtonOnTurnedOn]: state => {
        return {
          ...state,
          type: timers.states.work_on
        };
      },
    },
    [timers.states.work_on]: {
      [timers.actions.onToggleButtonOnTurnedOff]: state => {
        return {
          ...state,
          type: timers.states.work_off
        };
      },
      [timers.actions.onWorkDone]: state => {
        return {
          ...state,
          type: timers.states.rest_on
        };
      },
    },
    [timers.states.work_off]: {
      [timers.actions.onToggleButtonOnTurnedOn]: state => {
        return {
          ...state,
          type: timers.states.work_on
        };
      },
    },
    [timers.states.rest_on]: {
      [timers.actions.onToggleButtonOnTurnedOff]: state => {
        return {
          ...state,
          type: timers.states.rest_off
        };
      },
      [timers.actions.onNotAllTodosDone]: state => {
        return {
          ...state,
          type: timers.states.work_on
        };
      },
      [timers.actions.onAllTodosDone]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
    },
    [timers.states.rest_off]: {
      [timers.actions.onToggleButtonOnTurnedOn]: state => {
        return {
          ...state,
          type: timers.states.rest_on
        };
      },
    },
  }
);


function Pomodoro() {
  [timers.currentState, timers.dispatch] = useReducer(timers.transitions, timers.initialState);
  [todos.currentState, todos.dispatch] = useReducer(todos.transitions, todos.initialState);

  return (
    <>
      <Timer
        title="work"
        duration={8}
        pause={timers.currentState.type !== timers.states.work_on}
        resume={timers.currentState.type === timers.states.work_on}
        onDone={() =>
          timers.dispatch({
            type: timers.actions.onWorkDone
          })
        }
      />
      <Timer
        title="rest"
        duration={5}
        pause={timers.currentState.type !== timers.states.rest_on}
        resume={timers.currentState.type === timers.states.rest_on}
        onDone={() => 
          todos.dispatch({
            type: todos.actions.onRestTimerDone,
            doneTodo: todos.currentState.currentTodo
          })
        }
      />
      <ToggleButton
        turnOff={timers.currentState.type === timers.states.off}
        turnOnText={"start"}
        turnOffText={"pause"}
        toggleCondition={todos.currentState.currentTodo}
        onTurnedOn={() => {
          timers.dispatch({
            type: timers.actions.onToggleButtonOnTurnedOn
          });
        }}
        onTurnedOff={() => {
          timers.dispatch({
            type: timers.actions.onToggleButtonOnTurnedOff
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
