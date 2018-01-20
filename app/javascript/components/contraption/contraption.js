//-----------------------------------------------------------------------------
// app/javascript/components/contraption/contraption.js
//-----------------------------------------------------------------------------
import React    from 'react';
import ReactDOM from 'react-dom';

export default class Contraption extends React.Component {
  render() {
    return (
      <p>Contraption built by {this.props.company}</p>
    )
  }
}