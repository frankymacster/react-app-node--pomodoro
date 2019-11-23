import React, { useEffect, useState } from 'react';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import {
  MuiThemeProvider,
  AppBar
} from "material-ui";

import getData from "./getData";
import MediaCard from "./MediaCard";

import './App.css';

const DataToComponent = {
  RowChildren: ({ root, key }) => (
    <div
      className="row-children"
    >
      {root.children &&
        <Blocks
          key={key}
          root={root.children}
        />}
    </div>
  ),
  ColumnChildren: ({ root, key }) => (
    <div
      className="column-children"
    >
      {root.children &&
        <Blocks
          key={key}
          root={root.children}
        />}
    </div>
  ),
  Text: () => (
    <div>
      {"Hello"}
    </div>
  ),
  MediaCard: () => (
    <MediaCard />
  )
};

const Blocks = ({ root }) => (
  root.map((child, index) => 
    DataToComponent[child.type]({
      root: child,
      key: index
    })
  )
);

function App() {
  const [data, setData] = useState(null);

  useEffect(() =>
    (async () =>
      setData(await getData()))
    ()
  , []);

  const menu = location => (<Tabs className="container" value={location.pathname}>          
    <Tab label="Item One" component={Link} to="/" />
    <Tab label="Item Two" component={Link} to="/tab2" />
    <Tab
      label="Item Three"
      href="#basic-tabs"
      component={Link}
      to="/tab3"
    />
  </Tabs>);

  return (
    <BrowserRouter>
      <div className="App">
        <Route
          path="/"
          render={({ location }) => (
            <MuiThemeProvider>
              <AppBar
                title={menu(location)}
                style={{ background: '#1AB394' }}
                iconClassNameRight="muidocs-icon-navigation-expand-more"
              />
              {data &&
                <Blocks
                  root={data.pages}
                />}
              <Switch>
                <Route path="/tab2" render={() => <div>Tab 2</div>} />
                <Route path="/tab3" render={() => <div>Tab 3</div>} />
                <Route path="/" render={() => <div>Tab 1</div>} />
              </Switch>
            </MuiThemeProvider>
          )}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
