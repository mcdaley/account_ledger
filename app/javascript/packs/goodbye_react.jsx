//-----------------------------------------------------------------------------
// app/javascript/packs/goodbye_react.js
//-----------------------------------------------------------------------------
import React        from 'react';
import ReactDOM     from 'react-dom';
import Gizmo        from 'components/gizmo/gizmo';
import Thingamajig  from 'components/thingamajig/thingamajig';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <p>Dude, Hello from es6 from the packs directory with goodbye_react.jsx</p>
        <Thingamajig materials='strings, cotton, toothpicks, and straws'>< /Thingamajig>
        <Gizmo name="gizmodo"></Gizmo>
      </div>
    )
  }
}


document.addEventListener('DOMContentLoaded', () => {
  console.log("DBG: Loading the App component")
  ReactDOM.render(<App />, document.getElementById('page'))
})
