import React, { useReducer } from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";
import TodoApp from "./TodoApp";
import Timer from "./Timer";
import ToggleButton from "./ToggleButton";
import Form from "./Form";


const todos = {
  // states: 0 | 1 | 2 | ...
  actions: {
    onRestTimerDone: "onRestTimerDone",
    onGotNextTodo: "onGotNextTodo",
    onTodoAppDeleteTodo: "onTodoAppDeleteTodo",
    onNotAllTodosDone: "onNotAllTodosDone"
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
      [todos.actions.onTodoAppDeleteTodo]: state => ({
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
    onTodoAppDeleteTodo: "onTodoAppDeleteTodo",
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
      [timers.actions.onTodoAppDeleteTodo]: state => {
        return {
          ...state,
          type: timers.states.off
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
      [timers.actions.onTodoAppDeleteTodo]: state => {
        return {
          ...state,
          type: timers.states.off
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
      [timers.actions.onTodoAppDeleteTodo]: state => {
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
      [timers.actions.onTodoAppDeleteTodo]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
    },
  }
);

const timersDuration = {
  actions: {
    onWorkFormValueSubmitted: "onWorkFormValueSubmitted",
    onRestFormValueSubmitted: "onRestFormValueSubmitted",
  },
};
timersDuration.initialState = {
  workDuration: 8,
  restDuration: 5,
};
timersDuration.transitions = createReducer(
  timersDuration.initialState,
  {
    [timersDuration.actions.onWorkFormValueSubmitted]: (state, { value }) => {
      return {
        ...state,
        workDuration: value,
      };
    },
    [timersDuration.actions.onRestFormValueSubmitted]: (state, { value }) => {
      return {
        ...state,
        restDuration: value,
      };
    },
  }
);


function Pomodoro() {
  [timers.currentState, timers.dispatch] = useReducer(timers.transitions, timers.initialState);
  [timersDuration.currentState, timersDuration.dispatch] = useReducer(timersDuration.transitions, timersDuration.initialState);
  [todos.currentState, todos.dispatch] = useReducer(todos.transitions, todos.initialState);

  return (
    <>
      <Form
        placeholder={"Input work timer duration"}
        onValueSubmitted={value => {
          timersDuration.dispatch({
            type: timersDuration.actions.onWorkFormValueSubmitted,
            value
          });
        }}
      />
      <Timer
        title="work"
        duration={timersDuration.currentState.workDuration}
        resetCondition={timers.currentState.type === timers.states.work_on}
        pause={timers.currentState.type !== timers.states.work_on}
        resume={timers.currentState.type === timers.states.work_on}
        onDone={() =>
          timers.dispatch({
            type: timers.actions.onWorkDone
          })
        }
      />
      <Timer
        title="total work"
        duration={timersDuration.currentState.workDuration}
        pause={timers.currentState.type !== timers.states.work_on}
        resume={timers.currentState.type === timers.states.work_on}
        onDone={() =>
          timers.dispatch({
            type: timers.actions.onWorkDone
          })
        }
      />
      <Form
        placeholder={"Input rest timer duration"}
        onValueSubmitted={value => {
          timersDuration.dispatch({
            type: timersDuration.actions.onRestFormValueSubmitted,
            value
          });
        }}
      />
      <Timer
        title="rest"
        duration={timersDuration.currentState.restDuration}
        resetCondition={timers.currentState.type === timers.states.work_on}
        pause={timers.currentState.type !== timers.states.rest_on}
        resume={timers.currentState.type === timers.states.rest_on}
        onDone={() => 
          todos.dispatch({
            type: todos.actions.onRestTimerDone,
            doneTodo: todos.currentState.currentTodo
          })
        }
      />
      <Timer
        title="total rest"
        duration={timersDuration.currentState.restDuration}
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
            todos.dispatch({
              type: timers.actions.onNotAllTodosDone
            });
          }
        }}
        onDeleteTodo={deletedTodo => {
          if (todos.currentState.currentTodo
            && todos.currentState.currentTodo.id === deletedTodo.id) {
            timers.dispatch({
              type: timers.actions.onTodoAppDeleteTodo
            });
            todos.dispatch({
              type: timers.actions.onTodoAppDeleteTodo
            });
          }
        }}
      />
    </>
  );
}

export default Pomodoro;
