import React from 'react'
import Graph from 'react-graph-vis'

export default class GraphOlc extends React.Component {
  constructor (props) {
    super(props)
  }

  graph = {
    nodes: [
      
    ],
    edges: [
    ]
  }

  options = {
    layout: {
      hierarchical: true
    },
    edges: {
      color: '#000000'
    },
    height: '500px'
  }

  events = {
    select: function (event) {
      const { nodes, edges } = event
    }
  }

  render () {
    return (
      <Graph
        graph={{ nodes: this.props.nodes, edges: this.props.edges }}
        options={this.options}
        events={this.events}
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
    )
  }

}