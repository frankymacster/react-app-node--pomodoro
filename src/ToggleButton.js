import React, { useReducer, useEffect } from "react";
import createMachine from "./createMachine";
import Button from '@material-ui/core/Button';


const toggleButton = {
  states: {
    on: "on",
    off: "off"
  },
  actions: {
    onToggleRequested: "onToggleRequested",
  }
};
toggleButton.initialState = {
  type: toggleButton.states.off
};
toggleButton.transitions = createMachine(
  // digraph G {
  //   "off" -> "on" [ label="onToggleRequested" ]; 
  //   "on" -> "off" [ label="onToggleRequested" ];
  // }
  toggleButton.initialState,
  {
    [toggleButton.states.on]: {
      [toggleButton.actions.onToggleRequested]: state => ({
        ...state,
        type: toggleButton.states.off
      }),
      [toggleButton.actions.reset]: state => ({
        ...state,
        type: toggleButton.initialState.type
      })
    },
    [toggleButton.states.off]: {
      [toggleButton.actions.onToggleRequested]: state => ({
        ...state,
        type: toggleButton.states.on
      })
    }
  }
);


function ToggleButton({
  turnOff,
  turnOnText,
  turnOffText,
  toggleCondition,
  onTurnedOn,
  onTurnedOff
}) {
  [toggleButton.currentState, toggleButton.dispatch] = useReducer(toggleButton.transitions, toggleButton.initialState);

  useEffect(() => {
    if (turnOff) {
      toggleButton.dispatch({
        type: toggleButton.actions.reset
      });
    }
  }, [turnOff]);
  
  useEffect(() => {
    if (toggleButton.currentState.type === toggleButton.states.on) {
      if (onTurnedOn) {
        onTurnedOn();
      }
    } else {
      if (onTurnedOff) {
        onTurnedOff();
      }
    }
  }, [toggleButton.currentState]);

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        if (toggleCondition) {
          toggleButton.dispatch({
            type: toggleButton.actions.onToggleRequested
          });
        }
      }}
    >
      {toggleButton.currentState.type === toggleButton.states.off
        ? turnOnText
        : turnOffText
      }
    </Button>
  );
}


export default ToggleButton;