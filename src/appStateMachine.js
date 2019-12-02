const initialState = {
  text: 0,
};

const actions = {
  setText: (state, action) => ({
    ...state,
    text: action.text
  }),
};

export {
  initialState,
  actions
}