const initialState = {
  text: 0,
  setTopTodoAsDone: -1
};

const actions = {
  setText: (state, action) => ({
    ...state,
    text: action.text
  }),
  setTopTodoAsDone: (state, action) => ({
    ...state,
    setTopTodoAsDone: state.setTopTodoAsDone + 1
  })
};

export {
  initialState,
  actions
}