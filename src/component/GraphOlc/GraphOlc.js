import React from 'react'
import Graph from 'react-graph-vis'


export default function GraphOlc(props) {

  const newNode = props.items.map( (input, id) => {return {id: id+1, title: input.text, label: input.text}});

  console.log(newNode)


  const list = newNode.map( (i) =>
  <tr>
    <th>{i.title}</th>
  </tr>
  )
 
  let options = {
    layout: {
      hierarchical: true
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


    return (
      <div>
      <Graph
        graph={{ nodes: newNode, edges: [] }}
        options={options}
        events={events}
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
        
      </div>
    )


}