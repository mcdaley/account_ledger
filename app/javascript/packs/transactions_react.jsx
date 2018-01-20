//-----------------------------------------------------------------------------
// app/javascript/packs/goodbye_react.js
//-----------------------------------------------------------------------------
import React        from 'react';
import ReactDOM     from 'react-dom';
import moment       from 'moment';

class TransactionRow extends React.Component {
  render() {
    const transaction = this.props.transaction
    console.log("DBG: transaction description= " + transaction.description)
    
    return (
      <tr>
        <td> {moment(transaction.date).format("MM/DD/YYYY")} </td>
        <td> {transaction.description}  </td>
        <td> {transaction.amount}       </td>
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
      <table>
        <thead>
          <tr>
            <td> Created      </td>
            <td> Description  </td>
            <td> Amount       </td>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

class Ledger extends React.Component {
  
  logger(tnx) {
    console.log("DBG: Entered transaction logger")
  }
  
  render() {
    return (
      <div>
        <h1>Account Ledger</h1>
        <TransactionTable records={this.props.transactions} />
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
const monday    = moment(new Date(2018, 0, 15)).format("MM/DD/YYYY")
const tuesday   = moment(new Date(2018, 0, 16)).format("MM/DD/YYYY")
const wednesday = moment(new Date(2018, 0, 17)).format("MM/DD/YYYY")

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
