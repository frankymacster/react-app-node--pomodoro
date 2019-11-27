// https://redux.js.org/recipes/reducing-boilerplate?source=post_page-----f560b2683b7b----------------------#generating-reducers

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}

export default createReducer;
