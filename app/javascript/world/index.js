//-----------------------------------------------------------------------------
// app/javascript/world/index.js
//-----------------------------------------------------------------------------
import React    from 'react';
import ReactDOM from 'react-dom';

export default class World extends React.Component {
  render() {
    return (
      <p>World Widget from the world directory for {this.props.name}</p>
    )
  }
}
