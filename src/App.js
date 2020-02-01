import React, { useEffect, useState } from "react";
import Plot from 'react-plotly.js';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import { MuiThemeProvider, AppBar } from "material-ui";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import classList from "./classList";
import Blocks from "./Blocks";
import Counter from "./Counter";
import Pomodoro from "./Pomodoro";
import BFS from "./BFS";
import GraphDrawer from "./GraphDrawer";
import layout from "./layout.json";

import "./App.css";

const DataToComponent = {
  Pages: ({ root, key, params, params: { location, setCurrentPage } }) => {
    setCurrentPage(root.children.find(page => location.pathname === page.route))

    return (
      <>
        {DataToComponent.Header({ root, key, params })}
        <Switch>
          {root &&
            root.children.map(page => (
              <Route
                path={page.route}
                render={() => (
                  <Blocks
                    root={[page]}
                    dataToComponent={DataToComponent}
                    params={params}
                  />
                )}
              />
            ))}
        </Switch>
      </>
    )
  },
  Header: ({ root, params: { location, data, setData, lastAddedPageId, setLastAddedPageId } }) => (
    <AppBar
      showMenuIconButton={false}
      title={(location => (
        <>
          <Tabs className="container" value={location.pathname}>
            {root.children.map(page => (
              <Tab
                className="tab"
                label={page.title}
                component={Link}
                to={page.route}
              />
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                root && root.children.push({
                  type: "RowChildren",
                  children: [{
                    "type": "WidgetAdder",
                    "widgets": ["GraphDrawer", "Pomodoro", "Plot"]
                  }],
                  title: "Page" + lastAddedPageId,
                  route: "/page" + lastAddedPageId,
                })
                setData([
                  ...data
                ])
                setLastAddedPageId(lastAddedPageId + 1)
              }}
            >
              {` + page`} 
            </Button>
          </Tabs>
        </>
      ))(location)}
      style={{ background: "#333" }}
      iconClassNameRight="muidocs-icon-navigation-expand-more"
    />
  ),
  Footer: ({ root, key, params }) => {
    return (
      <AppBar
        position="absolute"
        className="footer"
        showMenuIconButton={false}>
        <Toolbar>
          <Blocks
            key={key}
            root={root.children}
            dataToComponent={DataToComponent}
            params={params}
          />
        </Toolbar>
      </AppBar>
    );
  },
  RowChildren: ({ root, key, params }) => (
    <div
      className={classList({
        "row-children": true,
        "horizontal-center": root.align === "center"
      })}
    >
      {root.children && (
        <Blocks
          key={key}
          root={root.children}
          dataToComponent={DataToComponent}
          params={params}
        />
      )}
    </div>
  ),
  ColumnChildren: ({ root, key, params }) => (
    <div className="column-children">
      {root.children && (
        <Blocks
          key={key}
          root={root.children}
          dataToComponent={DataToComponent}
          params={params}
        />
      )}
    </div>
  ),
  Text: ({ root }) => <div>{root.text}</div>,
  MediaCard: ({ root, root: { title, text } }) => (
    <Card className="media-card">
      <CardActionArea>
        <CardMedia
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography component="p">{text}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {root.codelink && (
          <Button
            size="small"
            color="primary"
            target="_blank"
            href={root.codelink}
          >
            Code
          </Button>
        )}
        {root.demolink && (
          <Button
            size="small"
            color="primary"
            target="_blank"
            href={root.demolink}
          >
            Demo
          </Button>
        )}
      </CardActions>
    </Card>
  ),
  Button: ({ root }) => (
    <Button
      variant="outlined"
      color="secondary"
      target="_blank"
      href={root.link}
    >
      {root.text}
    </Button>
  ),
  Link: ({ root }) => (
    <Link className="link" target="_blank" href={root.link}>
      {root.text}
    </Link>
  ),
  Input: ({ root, params: { state, dispatch } }) => (
    <input
      value={state.text}
      type="text"
      onChange={e =>
        dispatch({
          type: "setText",
          text: parseInt(e.target.value)
        })
      }
    />
  ),
  Counter: ({ root: { initialCount }, params: { state, dispatch } }) => (
    <Counter
      initialCount={state.text}
      onChange={s =>
        dispatch({
          type: "setText",
          text: s.count
        })
      }
    />
  ),
  // TODO make multiple Pomodoro widgets work
  Pomodoro: () => (
    <Card className="media-card">
      <Pomodoro />
    </Card>
  ),
  BFS: () => (
    <Card className="media-card">
      <BFS />
    </Card>
  ),
  GraphDrawer: () => (
    <Card className="media-card">
      <GraphDrawer />
    </Card>
  ),
  Plot: () => (
    <Card className="media-card">
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }
      />
    </Card>
  ),
  WidgetAdder: ({ root: { widgets }, params: { data, setData, currentPage } }) => {
    return (
      <Card className="media-card">
        {widgets.map(widget => (
          <div>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                currentPage && currentPage.children.push({
                  type: widget
                })
                setData([
                  ...data
                ])
              }}
            >
              {`${widget} +`} 
            </Button>
          </div>
          )
        )}
        
      </Card>
    )
  },  
};

function App() {
  const [data, setData] = useState(layout)
  const [currentPage, setCurrentPage] = useState(null)
  const [lastAddedPageId, setLastAddedPageId] = useState(2)

  return (
    <BrowserRouter>
      <div className="App">
        <Route
          path="/"
          render={({ location }) => (
            <MuiThemeProvider>
              {data && (
                <Blocks
                  dataToComponent={DataToComponent}
                  root={data}
                  params={{
                    location,
                    data,
                    setData,
                    currentPage,
                    setCurrentPage,
                    lastAddedPageId,
                    setLastAddedPageId
                  }}
                />
              )}
            </MuiThemeProvider>
          )}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
