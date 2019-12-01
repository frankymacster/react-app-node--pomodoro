import React, { useReducer } from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import createReducer from "./createReducer";

const TodoForm = ({ saveTodo }) => {
  const initialState = { value: "" };

  const reducer = createReducer(
    initialState,
    {
      setValue: (state, { value }) => ({
        ...state,
        value
      }),
      reset: state => ({
        ...state,
        value: ""
      })
    }
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();

        saveTodo(state.value);
        dispatch({ type: "reset" });
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Add todo"
        margin="normal"
        onChange={e => dispatch({ type: "setValue", value: e.target.value })}
        value={state.value}
      />
    </form>
  );
};

const TodoList = ({ todos, deleteTodo }) => (
  <List>
    {todos.map((todo, index) => (
      <ListItem key={index.toString()} dense button>
        <Checkbox tabIndex={-1} disableRipple />
        <ListItemText primary={todo} />
        <ListItemSecondaryAction>
          <IconButton
            aria-label="Delete"
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

const TodoApp = () => {
  const initialState = { todos: [] };

  const reducer = createReducer(
    initialState,
    {
      addTodo: (state, { text }) => ({
        ...state,
        todos: [...state.todos, text]
      }),
      deleteTodo: (state, { todoIndex }) => ({
        ...state,
        todos: state.todos.filter((_, index) => index !== todoIndex)
      })
    }
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <TodoForm
        saveTodo={text => {
          const trimmedText = text.trim();

          if (trimmedText.length > 0) {
            dispatch({
              type: "addTodo",
              text: trimmedText
            })
          }
        }}
      />

      <TodoList
        todos={state.todos}
        deleteTodo={todoIndex =>
          dispatch({
            type: "deleteTodo",
            todoIndex
          })
        }
      />
    </>
  );
};

export default TodoApp;