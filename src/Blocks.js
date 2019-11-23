const Blocks = ({ root, dataToComponent, params }) => (
  root.map((child, index) => 
    dataToComponent[child.type]({
      root: child,
      key: index,
      params
    })
  )
);

export default Blocks;