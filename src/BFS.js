import React, { useEffect, useState, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from "cytoscape";
import COSEBilkent from "cytoscape-cose-bilkent";

Cytoscape.use(COSEBilkent);

const BFS = () => {
  let cyRef;
  const ref = useRef(null);
 
  const [state, setState] = useState({});

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

    const bfs = cyRef.elements().bfs("#a", function() {}, true);

    let i = 0;
    const highlightNextEle = () => {
      if (i < bfs.path.length) {
        bfs.path[i].addClass('highlighted');

        i++;
        setTimeout(highlightNextEle, 1000);
      }
    };

    highlightNextEle();
  }, [cyRef]);

  const elements = [
    { data: { id: "a" } },
    { data: { id: "b" } },
    { data: { id: "c" } },
    { data: { id: "d" } },
    { data: { id: "e" } },

    { data: { id: 'a"e', weight: 1, source: "a", target: "e" } },
    { data: { id: "ab", weight: 3, source: "a", target: "b" } },
    { data: { id: "be", weight: 4, source: "b", target: "e" } },
    { data: { id: "bc", weight: 5, source: "b", target: "c" } },
    { data: { id: "ce", weight: 6, source: "c", target: "e" } },
    { data: { id: "cd", weight: 2, source: "c", target: "d" } },
    { data: { id: "de", weight: 7, source: "d", target: "e" } }
  ];

  const layout = {
    name: "breadthfirst",
    directed: true,
    roots: "#a"
  };

  return (
    <div
      style={{
        width: "100%",
        height: state.height
      }}
      ref={ref}
    >
      <CytoscapeComponent
        elements={elements}
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
            selector: '.edge',
            style: {
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'width': 4,
              'line-color': '#ddd',
              'target-arrow-color': '#ddd'
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
        layout={layout}
        cy={cy => {
          cyRef = cy;
        }}
      />
    </div>
  );
};

export default BFS;
