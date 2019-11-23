import * as R from "ramda";

// https://programmingwithmosh.com/react/multiple-css-classes-react/
const classList = classes => R.transduce(
  R.compose(
    R.filter(entry => entry[1]),
    R.map(entry => entry[0])
  ),
  R.flip(R.append),
  [],
  Object.entries(classes)
).join(" ");

export default classList;