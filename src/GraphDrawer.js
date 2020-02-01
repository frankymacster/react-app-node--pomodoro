import React, { useEffect, useState, useRef, useReducer } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import Button from "@material-ui/core/Button";
import createReducer from "./createReducer";

Cytoscape.use(edgehandles);

const GraphDrawer = () => {
  let cyRef;
  const ref = useRef(null);

  const graph = {
    actions: {
      addNode: "addNode",
      addEdge: "addEdge",
      runBFSClicked: "runBFSClicked",
    },
  };
  graph.initialState = {
    elements: [],
    elementsCount: 0,
    isBfsRunning: false,
  };
  graph.transitions = createReducer(
    graph.initialState,
    {
      [graph.actions.addNode]: (state, { position }) => {
        return {
          ...state,
          elements: state.elements.concat([{
            data: {
              id: state.elementsCount
            },
            position,
          }]),
          elementsCount: state.elementsCount + 1
        }
      },
      [graph.actions.runBFSClicked]: (state) => {
        return {
          ...state,
          isBfsRunning: true
        }
      },
    }
  );
 
  const [state, setState] = useState({});
  [graph.currentState, graph.dispatch] = useReducer(graph.transitions, graph.initialState);

  useEffect(() => {
    const width = ref.current
      ? ref.current.offsetWidth
      : 0;

    setState({
      width,
      height: width * 0.75
    });
  }, [ref.current]);

  useEffect(() => {
    if (!cyRef) {
      return;
    }

    cyRef.edgehandles();

    cyRef.on("click", e => {
      graph.dispatch({
        type: graph.actions.addNode,
        position: e.position,
      });
    });
  }, [cyRef]);

  useEffect(() => {
    if (graph.currentState.isBfsRunning) {
      const bfs = cyRef.elements().bfs(`#0`, function() {}, true);

      let i = 0;
      const highlightNextEle = () => {
        if (i < bfs.path.length) {
          bfs.path[i].addClass('highlighted');

          i++;
          setTimeout(highlightNextEle, 1000);
        }
      };

      highlightNextEle();
    }
  }, [graph.currentState.isBfsRunning, cyRef])

  return (
    <>
      <div
        style={{
          width: "100%",
          height: state.height
        }}
        ref={ref}
      >
        <CytoscapeComponent
          elements={graph.currentState.elements}
          style={{
            width: state.width,
            height: state.height,
            "text-align": "left",
            "background-color": "black",
          }}
          stylesheet={[
            {
              selector: '.node',
              style: {
                'content': 'data(id)'
              }
            },
            {
              selector: 'edge',
              style: {
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'width': 4,
                'line-color': '#ddd',
                'target-arrow-color': '#ddd'
              }
            },
            {
              selector: '.eh-handle',
              style: {
                'background-color': 'red',
                'width': 12,
                'height': 12,
                'shape': 'ellipse',
                'overlay-opacity': 0,
                'border-width': 12, // makes the handle easier to hit
                'border-opacity': 0
              }
            },
            {
              selector: '.highlighted',
              style: {
                'background-color': '#61bffc',
                'line-color': '#61bffc',
                'target-arrow-color': '#61bffc',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
              }
            }
          ]}
          cy={cy => {
            cyRef = cy;
          }}
        />
      </div>
      {/* TODO allow user to choose starting point */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          graph.dispatch({
            type: graph.actions.runBFSClicked,
          })
        }}
      >
        run BFS from 0
      </Button>
    </>
  );
};

export default GraphDrawer;
