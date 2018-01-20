//-----------------------------------------------------------------------------
// app/javascript/components/gizmo/gizmo.js
//-----------------------------------------------------------------------------
import React        from 'react';
import ReactDOM     from 'react-dom';
import Contraption  from 'components/contraption/contraption'

export default class Gizmo extends React.Component {
  render() {
    return (
      <div>
        <h2>GIZMO by gizman for {this.props.name}</h2>
        <Contraption company='acme'></Contraption>
      </div>
    )
  }
}
