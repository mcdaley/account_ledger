//-----------------------------------------------------------------------------
// app/javascript/packs/goodbye_react.js
//-----------------------------------------------------------------------------
import React        from 'react';
import ReactDOM     from 'react-dom';
import moment       from 'moment';
import numeral      from 'numeral';

// Format date string into MM/DD/YYYYY format
function formatDate(date) {
  let     date_str = moment(date).format('MM/DD/YYYY')
  return  date_str
}

// Format number into currency
function formatCurrency(number) {
  let     currency = numeral(number).format('$0,0.00');
  return  currency;
}

class TransactionRow extends React.Component {
  
  render() {
    const transaction = this.props.transaction
    console.log("DBG: transaction description= " + transaction.description)
    
    return (
      <tr>
        <td className="text-left">  {formatDate(transaction.date)}        </td>
        <td className="text-left">  {transaction.description}             </td>
        <td className="text-right"> {formatCurrency(transaction.amount)}  </td>
      </tr>
    )
  }
}

class TransactionTable extends React.Component {
  render() {
    let rows = []
    let i    = 0
    this.props.records.forEach((transaction) => {
      rows.push(
        <TransactionRow transaction={transaction} key={i++}/>
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
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

class Ledger extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      transactions: this.props.transactions,
    };
  }
  
/******************************************************************** 
  //
  // Use componebtDidMount() to load the data from an AJAX request.
  // Code below is extracting from the data attribute of an <div>
  // 
  componentDidMount() {
    console.log("Entered componentDidMount")
      
    let ledger        = document.getElementById('ledger')
    let transactions  = JSON.parse(ledger.dataset.transactions)
    
    this.setState({
      transactions: transactions,
    })
  }
*********************************************************************/
  
  /////////////////////////////////////////////////////////////////////////////
  // TODO: 1/22/2018
  // - Need to figure out why I can't add more methods to the ES6 objects, I
  //   always get an error if I call logger
  //
  // - Need to preface the API calls with this.logger(txn)
  /////////////////////////////////////////////////////////////////////////////
  logger(tnx) {
    console.log("DBG: Entered transaction logger")
  }
  
  render() {    
    return (
      <div>
        <h1>Account Ledger</h1>
        <TransactionTable records={this.state.transactions} />
      </div>
    )
  }
}

//-----------------------------------------------------------------------------
// TODO: 01/20/2018
// - For design of react components used hard-coded data. Commented out 
//   after retrieving transactions from the database.
//-----------------------------------------------------------------------------

/********************************************************************
  const monday    = moment("2018-01-15").format("MM/DD/YYYY")
  const tuesday   = moment("2018-01-16").format("MM/DD/YYYY")
  const wednesday = moment("2018-01-17").format("MM/DD/YYYY")

  const TRANSACTIONS = [
    { description: "EWS",     date: monday,     amount:  500.00 },
    { description: "Target",  date: monday,     amount: -100.00 },
    { description: "Safeway", date: tuesday,    amount:  -55.00 },
    { description: "Hello",   date: wednesday,  amount:  -15.00 },
  ]
*********************************************************************/

document.addEventListener('DOMContentLoaded', () => {
  let ledger        = document.getElementById('ledger')
  let transactions  = JSON.parse(ledger.dataset.transactions)

  ReactDOM.render(<Ledger transactions={transactions} />, ledger)
})
