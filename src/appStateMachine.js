const initialState = { text: "asd" };

const actions = {
  setText: (state, action) => ({ text: action.text })
};

export {
  initialState,
  actions
}