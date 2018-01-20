//-----------------------------------------------------------------------------
// app/javascript/components/thingamajig/thingamajig.js
//-----------------------------------------------------------------------------
import React    from 'react';
import ReactDOM from 'react-dom';

export default class Thingamajig extends React.Component {
  render() {
    return (
      <p>Thingamajig built with {this.props.materials}</p>
    )
  }
}
