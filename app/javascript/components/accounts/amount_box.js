//-----------------------------------------------------------------------------
// app/javascript/components/accounts/amount_box.js
//-----------------------------------------------------------------------------
import React              from 'react'
import ReactDOM           from 'react-dom'
import PropTypes          from 'prop-types'
import { formatCurrency } from '../../utils.js'

//-----------------------------------------------------------------------------
// AmountBox
//-----------------------------------------------------------------------------
export default class AmountBox extends React.Component {
  render() {
    return(
      <div className="card">
        <div className="card-header">
          {this.props.text}
        </div>
        <div className="card-body account-card-body">
          <h5 className="card-title account-card-title">{formatCurrency(this.props.total)}</h5>
        </div>
      </div>
    )
  }
}
