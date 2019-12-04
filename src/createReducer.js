// https://redux.js.org/recipes/reducing-boilerplate?source=post_page-----f560b2683b7b----------------------#generating-reducers

const createReducer = (initialState, handlers) =>
  (state = initialState, action) =>
    handlers.hasOwnProperty(action.type)
      ? handlers[action.type](state, action)
      : state;

export default createReducer;
