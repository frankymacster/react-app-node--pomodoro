import React from "react";
import { connect } from "react-redux";

const Input = ({ state, dispatch }) => (
  <input value={state.text} onChange={e => dispatch({ type: "setText", text: e.target.value })}/>
);

export default connect(
  state => ({ state })
)(Input);
