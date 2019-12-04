const createMachine = (initialState, handlers) =>
  (state = initialState, action) =>
    handlers.hasOwnProperty(state.type)
      ? handlers[state.type].hasOwnProperty(action.type)
        ? handlers[state.type][action.type](state, action)
        : state
      : state;

export default createMachine;