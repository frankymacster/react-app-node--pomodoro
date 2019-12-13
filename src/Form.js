import React, { useReducer } from 'react';
import TextField from '@material-ui/core/TextField';
import createReducer from "./createReducer";


const Form = ({
  placeholder,
  onValueSubmitted
}) => {
  const form = {
    actions: {
      setValue: "setValue",
      resetValue: "resetValue",
    }
  };
  form.initialState = {
    value: "",
  };
  form.transitions = createReducer(
    form.initialState,
    {
      [form.actions.setValue]: (state, { value }) => ({
        ...state,
        value
      }),
      [form.actions.resetValue]: state => ({
        ...state,
        value: ""
      }),
    }
  );

  [form.currentState, form.dispatch] = useReducer(form.transitions, form.initialState);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();

        onValueSubmitted(form.currentState.value);
        form.dispatch({ type: form.actions.resetValue });
      }}
    >
      <TextField
        variant="outlined"
        placeholder={placeholder}
        margin="normal"
        value={form.currentState.value}
        onChange={e => form.dispatch({
          type: form.actions.setValue,
          value: e.target.value
        })}
      />
    </form>
  );
};

export default Form;