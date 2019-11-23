import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import {
  MuiThemeProvider,
  AppBar
} from "material-ui";
import Button from '@material-ui/core/Button';
import getData from "./getData";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Toolbar from "@material-ui/core/Toolbar";
import classList from "./classList";
import Blocks from "./Blocks";

import './App.css';

const DataToComponent = {
  Pages: ({ root, key, params }) => (
    <>
      {DataToComponent.Header({ root, key, params })}
      <Switch>
        {root && root.children.map(page => (
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
  ),
  Header: ({ root, key, params: { location } }) => (
    <AppBar
      showMenuIconButton={false}
      title={(location => (
        <Tabs
          className="container"
          value={location.pathname}
        >          
          {root.children.map(page => (
            <Tab
              label={page.title}
              component={Link}
              to={page.route}
            />
          ))}
        </Tabs>))(location)}
      style={{ background: '#1AB394' }}
      iconClassNameRight="muidocs-icon-navigation-expand-more"
    />
  ),
  Footer: ({ root, key, params }) => {
    const useStyles = makeStyles((theme) =>
      createStyles({
        appBar: {
          top: "auto",
          bottom: 0,
          position: "absolute"
        }
      })
    );

    const classes = useStyles();

    return (
      <AppBar
        position="absolute"
        className={classes.appBar}
        showMenuIconButton={false}
      >
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
      {root.children &&
        <Blocks
          key={key}
          root={root.children}
          dataToComponent={DataToComponent}
          params={params}
        />}
    </div>
  ),
  ColumnChildren: ({ root, key, params }) => (
    <div
      className="column-children"
    >
      {root.children &&
        <Blocks
          key={key}
          root={root.children}
          dataToComponent={DataToComponent}
          params={params}
        />}
    </div>
  ),
  Text: ({ root }) => (
    <div>
      {root.text}
    </div>
  ),
  MediaCard: ({ root: { title, text } }) => (
    <Card>
      <CardActionArea>
        <CardMedia
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography component="p">
            {text}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
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
    <Link
      target="_blank"
      href={root.href}
    >
      {root.text}
    </Link>
  ),
};

function App() {
  const [data, setData] = useState(null);
  const [catData, setCatData] = useState(null);

  useEffect(() =>
    (async () => {
      setData(await getData("/api/data"));
      setCatData(await getData("https://api.thecatapi.com/v1/images/search"));
    })
    ()
  , []);

  return (
    <BrowserRouter>
      <div className="App">
        <Route
          path="/"
          render={({ location }) => (
            <MuiThemeProvider>
              {data &&
                <Blocks
                  dataToComponent={DataToComponent}
                  root={data}
                  params={{
                    location
                  }}
                />
              }
            </MuiThemeProvider>
          )}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
