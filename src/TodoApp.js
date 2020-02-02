import React, { useReducer, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import createReducer from "./createReducer";
import Form from "./Form";

const TodoList = ({
  todos,
  deleteTodo,
  editTodo,
  setNewText
}) => (
  <List>
    {todos.map((todo, index) => (
      <ListItem key={index.toString()} dense button>
        <Checkbox
          tabIndex={-1}
          disableRipple
          checked={todo.done}
        />
        {
          todo.editing
            ? <input
                value={todo.text}
                onChange={e => setNewText(index, e.target.value)}
              />
            : <ListItemText primary={todo.text} />
        }

        <ListItemSecondaryAction>
          <IconButton
            aria-label="Delete"
            onClick={() => {
              editTodo(index);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="Edit"
            onClick={() => {
              deleteTodo(index);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
);

const TodoApp = ({
  finishedTodos,
  onCurrentTodoFinished,
  onDeleteTodo,
  onAllTodosFinished
}) => {
  useEffect(() =>
    dispatch({
      type: "setfinishedTodos",
      finishedTodos
    }),
    [finishedTodos]
  );

  const initialState = {
    todos: [],
    count: 0
  };

  const reducer = createReducer(
    initialState,
    {
      addTodo: (state, { todo }) => ({
        ...state,
        todos: [...state.todos, todo]
      }),
      editTodo: (state, { todoIndex }) => {
        const newTodos = Object.assign(
          [],
          state.todos,
          {
            [todoIndex]: {
              ...state.todos[todoIndex],
              editing: !state.todos[todoIndex].editing
            }
          }
        );

        return {
          ...state,
          todos: newTodos
        }
      },
      deleteTodo: (state, { todoIndex }) => ({
        ...state,
        todos: state.todos.filter((_, index) => index !== todoIndex)
      }),
      setNewText: (state, { todoIndex, text }) => {
        const newTodos = Object.assign(
          [],
          state.todos,
          {
            [todoIndex]: {
              ...state.todos[todoIndex],
              text
            }
          }
        );

        return {
          ...state,
          todos: newTodos
        }
      },
      setfinishedTodos: (state, action) => {
        const newTodos = state.todos.reduce((accumulator, currentValue) => {
          if (action.finishedTodos.some(todo => todo.id === currentValue.id)) {
            return accumulator.concat([{
              ...currentValue,
              done: true
            }]);
          }

          return accumulator.concat([currentValue]);
        }, []);

        return {
          ...state,
          todos: newTodos
        }
      },
      incrementTodoCount: (state) => {
        return {
          ...state,
          count: state.count + 1
        }
      }
    }
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    () => {
      if (state.todos.every(todo => todo.done === true)) {
        onAllTodosFinished && onAllTodosFinished(state.todos);
      } else {
        onCurrentTodoFinished && onCurrentTodoFinished(state.todos);
      }
    },
    [state.todos]
  );

  return (
    <>
      <Form
        placeholder={"Add todo"}
        onValueSubmitted={value => {
          dispatch({
            type: "addTodo",
            todo: {
              id: state.count,
              text: value,
              editing: false,
              done: false,
            }
          });
          dispatch({
            type: "incrementTodoCount"
          });
        }}
      />
      <TodoList
        todos={state.todos}
        deleteTodo={todoIndex => {
          dispatch({
            type: "deleteTodo",
            todoIndex
          });
          onDeleteTodo(state.todos[todoIndex]);
        }}
        editTodo={todoIndex =>
          dispatch({
            type: "editTodo",
            todoIndex
          })
        }
        setNewText={(todoIndex, text) =>
          dispatch({
            type: "setNewText",
            todoIndex,
            text
          })
        }
      />
    </>
  );
};

export default TodoApp;