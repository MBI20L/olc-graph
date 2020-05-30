import React from 'react'
import Graph from 'react-graph-vis'
import './GraphOlc.css';


export default function GraphOlc(props) {
  
  const nodes = props.items.map( (input, id) => {return {id: id+1, title: input.text, label: input.text}});
  const edges = props.edges
  console.log(edges)
  
  let options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: '#000000'
    },
    height: '500px'
  }

  let events = {
    select: function (event) {
      const { nodes, edges } = event
    }
  }
  //return null;
  
  return (
      <div className='graph'>
      <Graph
        graph={{ nodes: nodes, edges: edges }}
        options={options}
        events={events}
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
        
      </div>
    )//*/


}