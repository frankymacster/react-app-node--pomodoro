import { useReducer } from "react";

// https://gist.github.com/thchia/dd1bc8200fd8cff89cfa6c928983e5c4
function useStore(rootReducer, state) {
  const initialState = state || rootReducer(undefined, { type: undefined });
  return useReducer(rootReducer, initialState);
}

export default useStore