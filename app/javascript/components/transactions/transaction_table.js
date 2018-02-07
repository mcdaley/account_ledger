//-----------------------------------------------------------------------------
// app/javascript/components/transaction_table/transaction_table.js
//-----------------------------------------------------------------------------
import React            from 'react'
import ReactDOM         from 'react-dom'
import TransactionRow   from 'components/transactions/transaction_row';

//-----------------------------------------------------------------------------
// TransactionTable
//-----------------------------------------------------------------------------
export default class TransactionTable extends React.Component {
  render() {
    let rows = []
    this.props.records.forEach((transaction) => {
      rows.push(
        <TransactionRow key               = {transaction.id} 
                        transaction       = {transaction} 
                        updateTransaction = {this.props.updateTransaction}
                        deleteTransaction = {this.props.deleteTransaction} />
      )
    });
    console.log("DBG: Render the transaction table")
    
    return (
      <table className="table table-striped table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th className="text-left">  Created      </th>
            <th className="text-left">  Description  </th>
            <th className="text-right"> Amount       </th>
            <th className="text-left">  Actions      </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

