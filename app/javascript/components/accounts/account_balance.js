//-----------------------------------------------------------------------------
// app/javascript/components/accounts/account_balance.js
//-----------------------------------------------------------------------------
import React            from 'react'
import ReactDOM         from 'react-dom'
import PropTypes        from 'prop-types'
import AmountBox        from 'components/accounts/amount_box';

//-----------------------------------------------------------------------------
// AccountBalance
//-----------------------------------------------------------------------------
export default class AccountBalance extends React.Component {
  render() {
    return(
      <div className="row account-balances-row">
        <div className="col-4">
          <AmountBox type={"credit"}  text={"Credit"}   total={this.props.credits} />
        </div>
        <div className="col-4">
          <AmountBox type={"debit"}   text={"Debit"}    total={this.props.debits} />
        </div>
        <div className="col-4">
          <AmountBox type={"balance"} text={"Balance"}  total={this.props.balance} />
        </div>
      </div>
    )
  }
}
