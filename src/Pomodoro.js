import React, { useReducer } from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";
import TodoApp from "./TodoApp";
import Timer from "./Timer";
import ToggleButton from "./ToggleButton";
import Form from "./Form";


const todos = {
  actions: {
    restTimerFinished: "restTimerFinished",
    nextTodoReceived: "nextTodoReceived",
    todoDeleted: "todoDeleted",
    currentTodoFinished: "currentTodoFinished"
  }
};
todos.initialState = {
  finishedTodos: [],
  currentTodo: null
};
todos.transitions =
  createReducer(
    todos.initialState,
    {
      [todos.actions.restTimerFinished]: (state, action) => ({
        ...state,
        finishedTodos: [ ...state.finishedTodos, action.finishedTodo ]
      }),
      [todos.actions.nextTodoReceived]: (state, action) => {
        if (!action.currentTodo) {
          return state;
        }

        return {
          ...state,
          currentTodo: action.currentTodo
        }
      },
      [todos.actions.allTodosFinished]: state => ({
        ...state,
        currentTodo: null
      }),
      [todos.actions.todoDeleted]: state => ({
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
    toggleButtonTurnedOn: "toggleButtonTurnedOn",
    toggleButtonTurnedOff: "toggleButtonTurnedOff",
    workTimerFinished: "workTimerFinished",
    allTodosFinished: "allTodosFinished",
    currentTodoFinished: "currentTodoFinished",
    todoDeleted: "todoDeleted",
  }
};
timers.initialState = {
  type: timers.states.off,
};
timers.transitions = createMachine(
  timers.initialState,
  {
    [timers.states.off]: {
      [timers.actions.toggleButtonTurnedOn]: state => {
        return {
          ...state,
          type: timers.states.work_on
        };
      },
    },
    [timers.states.work_on]: {
      [timers.actions.toggleButtonTurnedOff]: state => {
        return {
          ...state,
          type: timers.states.work_off
        };
      },
      [timers.actions.workTimerFinished]: state => {
        return {
          ...state,
          type: timers.states.rest_on
        };
      },
      [timers.actions.todoDeleted]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
    },
    [timers.states.work_off]: {
      [timers.actions.toggleButtonTurnedOn]: state => {
        return {
          ...state,
          type: timers.states.work_on
        };
      },
      [timers.actions.todoDeleted]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
    },
    [timers.states.rest_on]: {
      [timers.actions.toggleButtonTurnedOff]: state => {
        return {
          ...state,
          type: timers.states.rest_off
        };
      },
      [timers.actions.currentTodoFinished]: state => {
        return {
          ...state,
          type: timers.states.work_on
        };
      },
      [timers.actions.allTodosFinished]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
      [timers.actions.todoDeleted]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
    },
    [timers.states.rest_off]: {
      [timers.actions.toggleButtonTurnedOn]: state => {
        return {
          ...state,
          type: timers.states.rest_on
        };
      },
      [timers.actions.todoDeleted]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
    },
  }
);

const forms = {
  actions: {
    workFormSubmitted: "workFormSubmitted",
    restFormSubmitted: "restFormSubmitted",
  },
};
forms.initialState = {
  workDuration: 8,
  restDuration: 5,
};
forms.transitions = createReducer(
  forms.initialState,
  {
    [forms.actions.workFormSubmitted]: (state, { value }) => {
      return {
        ...state,
        workDuration: value,
      };
    },
    [forms.actions.restFormSubmitted]: (state, { value }) => {
      return {
        ...state,
        restDuration: value,
      };
    },
  }
);


function Pomodoro() {
  [timers.currentState, timers.dispatch] = useReducer(timers.transitions, timers.initialState);
  [forms.currentState, forms.dispatch] = useReducer(forms.transitions, forms.initialState);
  [todos.currentState, todos.dispatch] = useReducer(todos.transitions, todos.initialState);

  return (
    <>
      <Form
        placeholder={"Input work timer duration"}
        onValueSubmitted={value => {
          forms.dispatch({
            type: forms.actions.workFormSubmitted,
            value
          });
        }}
      />
      <Timer
        title="work"
        duration={forms.currentState.workDuration}
        resetCondition={timers.currentState.type === timers.states.work_on}
        pause={timers.currentState.type !== timers.states.work_on}
        resume={timers.currentState.type === timers.states.work_on}
        onFinished={() =>
          timers.dispatch({
            type: timers.actions.workTimerFinished
          })
        }
      />
      <Timer
        title="total work"
        duration={forms.currentState.workDuration}
        pause={timers.currentState.type !== timers.states.work_on}
        resume={timers.currentState.type === timers.states.work_on}
      />
      <Form
        placeholder={"Input rest timer duration"}
        onValueSubmitted={value => {
          forms.dispatch({
            type: forms.actions.restFormSubmitted,
            value
          });
        }}
      />
      <Timer
        title="rest"
        duration={forms.currentState.restDuration}
        resetCondition={timers.currentState.type === timers.states.work_on}
        pause={timers.currentState.type !== timers.states.rest_on}
        resume={timers.currentState.type === timers.states.rest_on}
        onFinished={() => 
          todos.dispatch({
            type: todos.actions.restTimerFinished,
            finishedTodo: todos.currentState.currentTodo
          })
        }
      />
      <Timer
        title="total rest"
        duration={forms.currentState.restDuration}
        pause={timers.currentState.type !== timers.states.rest_on}
        resume={timers.currentState.type === timers.states.rest_on}
      />
      <ToggleButton
        turnOff={timers.currentState.type === timers.states.off}
        turnOnText={"start"}
        turnOffText={"pause"}
        toggleCondition={todos.currentState.currentTodo}
        onTurnedOn={() => {
          timers.dispatch({
            type: timers.actions.toggleButtonTurnedOn
          });
        }}
        onTurnedOff={() => {
          timers.dispatch({
            type: timers.actions.toggleButtonTurnedOff
          });
        }}
      />
      <TodoApp
        finishedTodos={todos.currentState.finishedTodos}
        onChange={ts => {
          todos.dispatch({
            type: todos.actions.nextTodoReceived,
            currentTodo: ts.filter(todo => !todo.done)[0] || null
          });

          if (ts.every(todo => todo.done === true)) {
            timers.dispatch({
              type: timers.actions.allTodosFinished
            });
            todos.dispatch({
              type: todos.actions.allTodosFinished
            });
          } else {
            timers.dispatch({
              type: timers.actions.currentTodoFinished
            });
            todos.dispatch({
              type: timers.actions.currentTodoFinished
            });
          }
        }}
        onDeleteTodo={deletedTodo => {
          if (todos.currentState.currentTodo
            && todos.currentState.currentTodo.id === deletedTodo.id) {
            timers.dispatch({
              type: timers.actions.todoDeleted
            });
            todos.dispatch({
              type: timers.actions.todoDeleted
            });
          }
        }}
      />
    </>
  );
}

export default Pomodoro;
