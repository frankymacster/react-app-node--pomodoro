import React from "react";
import createMachine from "./createMachine";
import createReducer from "./createReducer";
import useStore from "./useStore";
import combineReducers from "./combineReducers";
import TodoApp from "./TodoApp";
import Timer from "./Timer";
import ToggleButton from "./ToggleButton";
import Form from "./Form";


const actions = {
  restTimerFinished: "restTimerFinished",
  workTimerFinished: "workTimerFinished",
  restFormSubmitted: "restFormSubmitted",
  workFormSubmitted: "workFormSubmitted",
  currentTodoFinished: "currentTodoFinished",
  allTodosFinished: "allTodosFinished",
  todoDeleted: "todoDeleted",
  toggleButtonTurnedOn: "toggleButtonTurnedOn",
  toggleButtonTurnedOff: "toggleButtonTurnedOff",
}

const todos = {};
todos.initialState = {
  finishedTodos: [],
  currentTodo: null
};
todos.transitions =
  createReducer(
    todos.initialState,
    {
      [actions.restTimerFinished]: (state, action) => ({
        ...state,
        finishedTodos: [ ...state.finishedTodos, action.finishedTodo ]
      }),
      [actions.currentTodoFinished]: (state, action) => {
        if (!action.currentTodo) {
          return state;
        }

        return {
          ...state,
          currentTodo: action.currentTodo
        }
      },
      [actions.allTodosFinished]: state => ({
        ...state,
        currentTodo: null
      }),
      [actions.todoDeleted]: (state, action) => {
        if (state.todos.currentTodo
          && state.todos.currentTodo.id === action.deletedTodo.id) {
          return state
        }

        return {
          ...state,
          currentTodo: null
        }
      },
    }
  );


const timers = {
  states: {
    off: "off",
    work_on: "work_on",
    work_off: "work_off",
    rest_on: "rest_on",
    rest_off: "rest_off",
  }
};
timers.initialState = {
  type: timers.states.off,
};
timers.transitions = createMachine(
  timers.initialState,
  {
    [timers.states.off]: {
      [actions.toggleButtonTurnedOn]: state => {
        return {
          ...state,
          type: timers.states.work_on
        };
      },
    },
    [timers.states.work_on]: {
      [actions.toggleButtonTurnedOff]: state => {
        return {
          ...state,
          type: timers.states.work_off
        };
      },
      [actions.workTimerFinished]: state => {
        return {
          ...state,
          type: timers.states.rest_on
        };
      },
      [actions.todoDeleted]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
    },
    [timers.states.work_off]: {
      [actions.toggleButtonTurnedOn]: state => {
        return {
          ...state,
          type: timers.states.work_on
        };
      },
      [actions.todoDeleted]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
    },
    [timers.states.rest_on]: {
      [actions.toggleButtonTurnedOff]: state => {
        return {
          ...state,
          type: timers.states.rest_off
        };
      },
      [actions.currentTodoFinished]: state => {
        return {
          ...state,
          type: timers.states.work_on
        };
      },
      [actions.allTodosFinished]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
      [actions.todoDeleted]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
    },
    [timers.states.rest_off]: {
      [actions.toggleButtonTurnedOn]: state => {
        return {
          ...state,
          type: timers.states.rest_on
        };
      },
      [actions.todoDeleted]: state => {
        return {
          ...state,
          type: timers.states.off
        };
      },
    },
  }
);

const forms = {};
forms.initialState = {
  workDuration: 8,
  restDuration: 5,
};
forms.transitions = createReducer(
  forms.initialState,
  {
    [actions.workFormSubmitted]: (state, { value }) => {
      return {
        ...state,
        workDuration: value,
      };
    },
    [actions.restFormSubmitted]: (state, { value }) => {
      return {
        ...state,
        restDuration: value,
      };
    },
  }
);


function Pomodoro() {
  const rootReducer = combineReducers({
    timers: timers.transitions,
    forms: forms.transitions,
    todos: todos.transitions,
  })

  const [currentState, dispatch] = useStore(rootReducer)

  return (
    <>
      <Form
        placeholder={"Input work timer duration"}
        onValueSubmitted={value => {
          dispatch({
            type: actions.workFormSubmitted,
            value
          });
        }}
      />
      <Timer
        title="work"
        duration={currentState.forms.workDuration}
        resetCondition={currentState.timers.type === timers.states.work_on}
        pause={currentState.timers.type !== timers.states.work_on}
        resume={currentState.timers.type === timers.states.work_on}
        onFinished={() =>
          dispatch({
            type: actions.workTimerFinished
          })
        }
      />
      <Timer
        title="total work"
        duration={currentState.forms.workDuration}
        pause={currentState.timers.type !== timers.states.work_on}
        resume={currentState.timers.type === timers.states.work_on}
      />
      <Form
        placeholder={"Input rest timer duration"}
        onValueSubmitted={value => {
          dispatch({
            type: actions.restFormSubmitted,
            value
          });
        }}
      />
      <Timer
        title="rest"
        duration={currentState.forms.restDuration}
        resetCondition={currentState.timers.type === timers.states.work_on}
        pause={currentState.timers.type !== timers.states.rest_on}
        resume={currentState.timers.type === timers.states.rest_on}
        onFinished={() => 
          dispatch({
            type: actions.restTimerFinished,
            finishedTodo: currentState.todos.currentTodo
          })
        }
      />
      <Timer
        title="total rest"
        duration={currentState.forms.restDuration}
        pause={currentState.timers.type !== timers.states.rest_on}
        resume={currentState.timers.type === timers.states.rest_on}
      />
      <ToggleButton
        turnOff={currentState.timers.type === timers.states.off}
        turnOnText={"start"}
        turnOffText={"pause"}
        toggleCondition={currentState.todos.currentTodo}
        onTurnedOn={() => {
          dispatch({
            type: actions.toggleButtonTurnedOn
          });
        }}
        onTurnedOff={() => {
          dispatch({
            type: actions.toggleButtonTurnedOff
          });
        }}
      />
      <TodoApp
        finishedTodos={currentState.todos.finishedTodos}
        onCurrentTodoFinished={ts => {
          dispatch({
            type: actions.currentTodoFinished,
            currentTodo: ts.filter(todo => !todo.done)[0] || null
          })
        }}
        onAllTodosFinished={() => {
          dispatch({
            type: actions.allTodosFinished
          })
        }}
        onDeleteTodo={deletedTodo => {
          dispatch({
            type: actions.todoDeleted,
            deletedTodo
          })
        }}
      />
    </>
  );
}

export default Pomodoro;
