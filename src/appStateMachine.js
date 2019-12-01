const initialState = {
  text: 0,
  setTopTodoAsDone: -1,
  workTimerShouldStart: false,
  restTimerShouldStart: false,
};

const actions = {
  setText: (state, action) => ({
    ...state,
    text: action.text
  }),
  // Pomodoro related
  setTopTodoAsDone: (state, action) => ({
    ...state,
    setTopTodoAsDone: state.setTopTodoAsDone + 1
  }),
  startRestTimer: (state, action) => ({
    ...state,
    restTimerShouldStart: true,
    workTimerShouldStart: false
  }),
  startWorkTimer: (state, action) => ({
    ...state,
    restTimerShouldStart: false,
    workTimerShouldStart: true
  }),
};

export {
  initialState,
  actions
}