// https://redux.js.org/recipes/reducing-boilerplate?source=post_page-----f560b2683b7b----------------------#generating-reducers

import { propOr, identity } from "ramda"

/**
 * A utility function that allows defining a reducer as a mapping from action
 * type to *case reducer* functions that handle these action types. The
 * reducer's initial state is passed as the first argument.
 *
 * @param initialState The initial state to be returned by the reducer.
 * @param handlers A mapping from action types to action-type-specific
 *   case reducers.
 *
 */

const createReducer = (initialState, handlers) =>
  (state = initialState, action) => {
    const newState = propOr(identity, action.type, handlers)(state, action)

    return  propOr(identity, newState, handlers)
      ? newState
      : state
  }

export default createReducer
