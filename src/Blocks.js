import { connect } from "react-redux";

const Blocks = ({ root, dataToComponent, params, state, dispatch }) => (
  root.map((child, index) => 
    dataToComponent[child.type]({
      root: child,
      key: index,
      params: {
        ...params,
        state,
        dispatch
      }
    })
  )
);

export default connect(
  state => ({ state })
)(Blocks);