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

//-----------------------------------------------------------------------------
// AddTransaction
//-----------------------------------------------------------------------------
class AddTransaction extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      date:         '',
      description:  '',
      amount:       '',
    }
    
    
    this.handleDate         = this.handleDate.bind(this)
    this.handleDescription  = this.handleDescription.bind(this)
    this.handleAmount       = this.handleAmount.bind(this)
    this.handleSubmit       = this.handleSubmit.bind(this)
    this.resetInitialState  = this.resetInitialState.bind(this)
  }
  
  resetInitialState() {
    console.log("INFO: Entered resetInitialState()")
    this.setState({
      date:         '',
      description:  '',
      amount:       '',
    })
  }
  
  handleDate(e) {
    this.setState({
      date: e.target.value
    })
  }
  
  handleDescription(e) {
    this.setState({
      description: e.target.value
    })
  }
  
  handleAmount(e) {
    this.setState({
      amount: e.target.value
    })
  }
  
  handleSubmit(e) {
    console.log("INFO: Entered handleSubmit")
    e.preventDefault()
    
    ///////////////////////////////////////////////////////////////////////////
    // TODO: 01/25/2018
    // - NEED TO CHECK IF THE LOGIC THAT I'VE ADDED FOR THE CSRF CHECK IS 
    //   REQUIRED IN THE HEADER AND BODY AS I TURNED OFF THE CHECK IN THE
    //   ApplicationController CLASS. 
    //
    // - NEED TO BETTER UNDERSTAND THE CORS HEADERS STUFF IN ORDER TO HANDLE
    //   THE CROSS-DOMAIN API CALLS, AS ALL APIS SHOULD NOT WORRY ABOUT THEM
    ///////////////////////////////////////////////////////////////////////////
    const url             = "/transactions"
    
    let   newTransaction  = {
      date:         this.state.date,
      description:  this.state.description,
      amount:       this.state.amount,
    }
    let   csrf_token      = document.querySelector('meta[name="csrf-token"]').content
    let   headers         = { 'Content-Type':  'application/json',
                              'X-CSRF-Token':  csrf_token }
    
    let   fetchData       = {
      method:       'POST',
      body:         JSON.stringify({ transaction: newTransaction }),
      headers:      headers,
      mode:         'cors'
    }
    
    //
    // The props are not visible in the fetch block, so I need to assign it to 
    // a variable in order to get it to work, not sure I understand the scoping
    // of fetch.
    //
    let   addTransactionPtr     = this.props.addTransaction
    let   resetInitialStatePtr  = this.resetInitialState
    
    fetch(url, fetchData)
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        console.log("INFO: Successfully added transaction")
        addTransactionPtr(data)
        resetInitialStatePtr()
      })
      .catch(err => console.error('ERROR:', err))
      
      // Reset the form
      //this.resetInitialState()
  }
  
  render() {
    console.log("DEBUG: Entered render for add transaction form")
    return (
      <div className="card bg-info" style={{marginBottom: 0.50 + "rem"}}>
        <form className="card-body" style={{paddingTop: 0.50 + "rem", paddingBottom: 0 + "rem"}}>
          <div className="form-row">
            <div className="col-3">
              <label  className   ="sr-only">Date</label>
              <input  type        = "date" 
                      onChange    = {this.handleDate} 
                      className   = "form-control" 
                      placeholder = "Date" 
                      value       = {this.state.date} ></input>
            </div>
            <div className="col-6">
              <label className    = "sr-only">Description</label>
              <input  type        = "text" 
                      onChange    = {this.handleDescription} 
                      className   = "form-control" 
                      id          = "txnDescription" 
                      placeholder = "Description" 
                      value       = {this.state.description} ></input>
            </div>
            <div className="col-2">
              <label className    = "sr-only">Amount</label>
              <input  type        = "text" 
                      onChange    = {this.handleAmount} 
                      className   = "form-control" 
                      id          = "txnAmount" 
                      placeholder = "Amount" 
                      value       = {this.state.amount} ></input>
            </div>
            <div className="col-1">
              <button type        = "submit" 
                      onClick     = {this.handleSubmit} 
                      className   = "btn btn-primary mb-2">Add</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

//-----------------------------------------------------------------------------
// TransactionRow
//-----------------------------------------------------------------------------
class TransactionRow extends React.Component {
  
  render() {
    const transaction = this.props.transaction
    //** console.log("DBG: transaction description= " + transaction.description)
    
    return (
      <tr>
        <td className="text-left">  {formatDate(transaction.date)}        </td>
        <td className="text-left">  {transaction.description}             </td>
        <td className="text-right"> {formatCurrency(transaction.amount)}  </td>
      </tr>
    )
  }
}

//-----------------------------------------------------------------------------
// TransactionTable
//-----------------------------------------------------------------------------
class TransactionTable extends React.Component {
  render() {
    let rows = []
    this.props.records.forEach((transaction) => {
      rows.push(
        <TransactionRow key={transaction.id} transaction={transaction} />
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

//-----------------------------------------------------------------------------
// Ledger
//-----------------------------------------------------------------------------
class Ledger extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      transactions: this.props.transactions,
    };
    
    this.addTransaction     = this.addTransaction.bind(this)
  }
  
  addTransaction(newTransaction) {
    console.log(`INFO: add new transaction, date: ${newTransaction.date}, description: ${newTransaction.description}, amount: ${newTransaction.amount}`)
    
    this.setState({
      transactions: this.state.transactions.concat([newTransaction])
    })
    return
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
  
  logger(tnx) {
    console.log("DBG: Entered transaction logger")
  }
  
  render() {    
    return (
      <div>
        <h2>Account Ledger</h2>
        <AddTransaction addTransaction={this.addTransaction} />
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

/*
 * Load the transactions from the data-transactions attribute
 */
document.addEventListener('DOMContentLoaded', () => {
  let ledger        = document.getElementById('ledger')
  let transactions  = JSON.parse(ledger.dataset.transactions)

  ReactDOM.render(<Ledger transactions={transactions} />, ledger)
})
