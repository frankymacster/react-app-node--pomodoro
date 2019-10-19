import React, { useEffect, useState } from 'react';

import getData from "../src/getData";

import './App.css';

const DataToComponent = {
  RowChildren: ({ root }) => (
    <div
      className="row-children"
    >
      {root.children &&
        <Blocks
          root={root.children}
        />}
    </div>
  ),
  ColumnChildren: ({ root }) => (
    <div
      className="column-children"
    >
      {root.children &&
        <Blocks
          root={root.children}
        />}
    </div>
  ),
  Text: () => (
    <div>
      {"Hello"}
    </div>
  )
};

const Blocks = ({ root, params }) => (
  root.map(child => 
    DataToComponent[child.type]({ root: child })
  )
);

function App() {
  const [data, setData] = useState(null);

  useEffect(() =>
    (async () =>
      setData(await getData()))
    ()
  , []);

  return (
    <>
      {data &&
        <Blocks
          root={data.pages}
        />
      }
    </>
  );
}

export default App;
