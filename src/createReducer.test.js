import createReducer from "./createReducer"
import ramda from "ramda"

const currentState = "123"
const newState = "1234"
const ADD_CHAR = "ADD_CHAR"
const INEXISTANT = "INEXISTANT"
const FALSY = "FALSY"


const addChar = char => ({
  type: ADD_CHAR,
  char
})
const addCharHandler = (state, action) => {
  return state.concat(action.char)
}

const inexistant = char => ({
  type: INEXISTANT,
  char
})

const falsy = char => ({
  type: FALSY,
  char
})
const falsyHandler = (state, action) => {
  return undefined
}

describe("createReducer", () => {
  let reducer

  beforeEach(() => {
    jest.spyOn(ramda, "propOr")
    jest.spyOn(ramda, "identity")

    reducer = createReducer(currentState, {
      [ADD_CHAR]: addCharHandler,
      [FALSY]: falsyHandler
    })

    ramda.propOr.mockReturnValue()
    ramda.identity.mockReturnValue(value => value)
  })

  afterEach(() =>
    jest.restoreAllMocks()
  )

  describe("action type doesn't exist", () => {
    beforeEach(() => {
      ramda.propOr.mockReturnValue(state => state)
    })
  
    afterEach(() =>
      jest.restoreAllMocks()
    )

    it("returns the current state", () => {
      expect(
        reducer(currentState, inexistant("4"))
      ).toEqual(
        currentState
      )
    })
  })

  describe("new state is falsy", () => {
    beforeEach(() => {
      ramda.propOr.mockReturnValue(falsyHandler)
    })
  
    afterEach(() =>
      jest.restoreAllMocks()
    )

    it("returns the current state", () => {
      expect(
        reducer(currentState, falsy())
      ).toEqual(
        currentState
      )
    })
  })

  describe("action type and new state exist", () => {
    beforeEach(() => {
      ramda.propOr.mockReturnValue(addCharHandler)
    })
  
    afterEach(() =>
      jest.restoreAllMocks()
    )

    it("returns the new state", () => {
      expect(
        reducer(currentState, addChar("4"))
      ).toEqual(
        newState
      )
    })
  })
})