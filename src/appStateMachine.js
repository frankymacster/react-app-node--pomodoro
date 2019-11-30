const initialState = { text: 0 };

const actions = {
  setText: (state, action) => ({ text: action.text })
};

export {
  initialState,
  actions
}