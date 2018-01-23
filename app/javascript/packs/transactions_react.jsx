//-----------------------------------------------------------------------------
// app/javascript/packs/goodbye_react.js
//-----------------------------------------------------------------------------
import React        from 'react';
import ReactDOM     from 'react-dom';
import moment       from 'moment';
import numeral      from 'numeral';

function formatCurrency(number) {
  let currency = numeral(number).format('$0,0.00');
  return currency;
}

class TransactionRow extends React.Component {
  
  render() {
    const transaction = this.props.transaction
    console.log("DBG: transaction description= " + transaction.description)
    
    return (
      <tr>
        <td className="text-left">  {transaction.date} </td>
        <td className="text-left">  {transaction.description}  </td>
        <td className="text-right"> {formatCurrency(transaction.amount)}       </td>
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
  
  /////////////////////////////////////////////////////////////////////////////
  // TODO: 1/22/2018
  // - Need to figure out why I can't add more methods to the ES6 objects, I
  //   always get an error if I call logger
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
// - IN THE RAILS API THE DATES IN THE JSON OBJECT WILL BE STRINGS, SO NEED
//   TO THINK ABOUT HOW I SHOULD HANDLE THEM. WOULD I CONVERT TO DATE OBJECTS
//   AND THEN FORMAT AS STRINGS?
//-----------------------------------------------------------------------------
const monday    = moment("2018-01-15").format("MM/DD/YYYY")
const tuesday   = moment("2018-01-16").format("MM/DD/YYYY")
const wednesday = moment("2018-01-17").format("MM/DD/YYYY")

const TRANSACTIONS = [
  { description: "EWS",     date: monday,     amount:  500.00 },
  { description: "Target",  date: monday,     amount: -100.00 },
  { description: "Safeway", date: tuesday,    amount:  -55.00 },
  { description: "Hello",   date: wednesday,  amount:  -15.00 },
]


document.addEventListener('DOMContentLoaded', () => {
  console.log("DBG: Loading the Ledger component")
  ReactDOM.render(<Ledger transactions={TRANSACTIONS} />, document.getElementById('ledger'))
})
