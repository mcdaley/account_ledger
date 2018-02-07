//-----------------------------------------------------------------------------
// app/javascript/packs/transactions_react.js
//-----------------------------------------------------------------------------
import React            from 'react'
import ReactDOM         from 'react-dom'
import Ledger           from 'components/ledger/ledger'

/*
 * Load the transactions from the data-transactions attribute
 */
document.addEventListener('DOMContentLoaded', () => {
  let ledger        = document.getElementById('ledger')
  let transactions  = JSON.parse(ledger.dataset.transactions)

  ReactDOM.render(<Ledger transactions={transactions} />, ledger)
})
