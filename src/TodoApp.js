import React, { useReducer, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import createReducer from "./createReducer";

const TodoForm = ({
  saveTodo
}) => {
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

        saveTodo({
          text: state.value,
          editing: false,
          done: false,
        });
        dispatch({ type: "reset" });
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Add todo"
        margin="normal"
        onChange={e => dispatch({
          type: "setValue",
          value: e.target.value
        })}
        value={state.value}
      />
    </form>
  );
};

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
  todosDoneCount,
  onAllTodosDone
}) => {
  useEffect(() =>
    dispatch({
      type: "setTodosDoneCount",
      todosDoneCount
    }),
    [todosDoneCount]
  );

  const initialState = { todos: [] };

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
        // TODO if todo was done, decrement todosDoneCount
        // actually todosDoneCount should be replaced by actually checking which todos are done
        // and syncing the Timer with a todo
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
      setTodosDoneCount: (state, action) => {
        const newTodos = state.todos.reduce((accumulator, currentValue, currentIndex) => {
          if (currentIndex + 1 > action.todosDoneCount) {
            return accumulator.concat([currentValue]);
          }

          return accumulator.concat([{
            ...currentValue,
            done: true
          }]);
        }, []);

        return {
          ...state,
          todos: newTodos
        }
      }
    }
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(
    () => {
      if (state.todos.every(todo => todo.done === true)) {
        onAllTodosDone();
      }
    },
    [state.todos]
  );

  return (
    <>
      <TodoForm
        saveTodo={todo =>
          dispatch({
            type: "addTodo",
            todo
          })
        }
      />

      <TodoList
        todos={state.todos}
        deleteTodo={todoIndex =>
          dispatch({
            type: "deleteTodo",
            todoIndex
          })
        }
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