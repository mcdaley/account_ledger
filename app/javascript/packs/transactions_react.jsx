//-----------------------------------------------------------------------------
// app/javascript/packs/goodbye_react.js
//-----------------------------------------------------------------------------
import React        from 'react';
import ReactDOM     from 'react-dom';
import moment       from 'moment';
import numeral      from 'numeral';
import _            from 'lodash';

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

function formatEditableCurrency(number) {
  let     editable_currency = numeral(number).format('0.00');
  return  editable_currency;
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
// UpdateTransaction
//-----------------------------------------------------------------------------
class UpdateTransaction extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      date:         this.props.date,
      description:  this.props.description,
      amount:       this.props.amount,
    }
  }
}

//-----------------------------------------------------------------------------
// TransactionRow
//-----------------------------------------------------------------------------
class TransactionRow extends React.Component {
  constructor(props) {
    super(props)
    ///////////////////////////////////////////////////////////////////////////
    // TODO: 01/26/2018
    // - DUPLICATING THE STATE IN THE AddTransaction COMPONENT BECAUSE I NEED
    //   TO EDIT THE FIELDS. 
    // - DO I NEED TO REFACTOR THE LOGIC INTO A SINGLE 
    //   COMPONENT AND THEN WRAP IT WITH THE PROPER STYLING.
    ///////////////////////////////////////////////////////////////////////////
    this.state = {
      edit:         false,
      transaction:  this.props.transaction,                       // Duplicated
    }
    
    this.handleDate         = this.handleDate.bind(this)          // Duplicated
    this.handleDescription  = this.handleDescription.bind(this)   // Duplicated
    this.handleAmount       = this.handleAmount.bind(this)        // Duplicated
    this.handleEdit         = this.handleEdit.bind(this)
    this.handleUpdate       = this.handleUpdate.bind(this)
    this.handleCancel       = this.handleCancel.bind(this)
    this.handleDelete       = this.handleDelete.bind(this)
  }
  
  toggleEdit() {  
    this.setState(prevState => ({
      edit: !prevState.edit
    }))
  }
  
  handleEdit(e) {
    console.log(`DEBUG: Edit the transaction, state[edit]= $(this.state.edit)`)
    e.preventDefault()
    this.toggleEdit()
  }
  
  handleDate(e) {
    let transaction   = Object.assign({}, this.state.transaction)
    transaction.date = e.target.value
    
    this.setState({
      transaction: transaction
    })
  }
  
  handleDescription(e) {
    let transaction         = Object.assign({}, this.state.transaction)
    transaction.description = e.target.value
    
    this.setState({
      transaction: transaction
    })
  }
  
  handleAmount(e) {
    let transaction    = Object.assign({}, this.state.transaction)
    transaction.amount = e.target.value
    
    this.setState({
      transaction: transaction
    })
  }
  
  /****
   * Call PUT /transactions/:id to update the transaction and then call 
   * Ledger.updateTransaction to update the transaction table
   */
  handleUpdate(e) {
    e.preventDefault()
    console.log("DEBUG: Prepare to update the transaction w/ new data") 
    const url = `/transactions/${this.state.transaction.id}`
    
    let   updateTransaction  = {
      date:         this.state.transaction.date,
      description:  this.state.transaction.description,
      amount:       this.state.transaction.amount,
    }
    
    let   csrf_token      = document.querySelector('meta[name="csrf-token"]').content
    let   headers         = { 'Content-Type':  'application/json',
                              'X-CSRF-Token':  csrf_token }
    
    let   fetchData       = {
      method:       'PUT',
      body:         JSON.stringify({ transaction: updateTransaction }),
      headers:      headers,
      mode:         'cors'
    }
    
    //
    // The props are not visible in the fetch block, so I need to assign it to 
    // a variable in order to get it to work, not sure I understand the scoping
    // of fetch.
    //
    let   updateTransactionPtr     = this.props.updateTransaction // Callback from Ledger
    //** Does the component unmount at this point, should figure out the state
    //** let   resetInitialStatePtr  = this.resetInitialState
    this.toggleEdit()
    
    fetch(url, fetchData)
      .then(function(response) {
        return response.json()
      })
      .then(function(transaction) {
        console.log("INFO: Successfully updated transaction")
        updateTransactionPtr(transaction)
        //** resetInitialStatePtr()
      })
      .catch(err => console.error('ERROR:', err.message))            
  }
  
  handleCancel(e) {
    e.preventDefault()
    this.toggleEdit()
  }
  
  handleDelete(e) {  
    console.log("DEBUG: Delete the transaction")
    e.preventDefault()
  }
  
  /****
   * Render the transaction
   */
  renderTransaction() {
    //** const transaction = this.props.transaction
    const transaction = this.state.transaction
    
    return (
      <tr>
        <td className="text-left">  {formatDate(transaction.date)}        </td>
        <td className="text-left">  {transaction.description}             </td>
        <td className="text-right"> {formatCurrency(transaction.amount)}  </td>
        <td>
          <span>
            <button type      = "button" 
                    className = "btn btn-primary" 
                    onClick   = {this.handleEdit}>   Edit    </button>
            <button type      = "button" 
                    className = "btn btn-danger" 
                    style     = {{marginLeft: 0.50 + "rem"}}  
                    onClick   = {this.handleDelete}> Delete  </button>
          </span>
        </td>
      </tr>
    )
  }
  
  /****
   * Display the inline edit transaction form
   */
  renderEditTransaction() {
    //** const transaction = this.props.transaction
    const transaction = this.state.transaction
    
    return (
      <tr>
        <td colSpan="4">
          <form className="card-body" style={{paddingTop: 0.50 + "rem", paddingBottom: 0 + "rem"}}>
            <div className="form-row">
              <div className="col-3">
                <label  className   ="sr-only">Date</label>
                <input  type        = "date" 
                        onChange    = {this.handleDate} 
                        className   = "form-control" 
                        placeholder = "Date" 
                        value       = {transaction.date} ></input>
              </div>
              <div className="col-4">
                <label className    = "sr-only">Description</label>
                <input  type        = "text" 
                        onChange    = {this.handleDescription} 
                        className   = "form-control" 
                        id          = "txnDescription" 
                        placeholder = "Description" 
                        value       = {transaction.description} ></input>
              </div>
              <div className="col-2">
                <label className    = "sr-only">Amount</label>
                <input  type        = "text" 
                        onChange    = {this.handleAmount} 
                        className   = "form-control" 
                        id          = "txnAmount" 
                        placeholder = "Amount" 
                        value       = {transaction.amount} ></input>
              </div>
              <div className="col-3">
                <span>
                  <button type        = "submit" 
                          onClick     = {this.handleUpdate} 
                          className   = "btn btn-primary mb-2">Save</button>
                  <button type        = "submit" 
                          onClick     = {this.handleCancel} 
                          className   = "btn btn-primary mb-2"
                          style       = { {marginLeft: 0.50 + "rem"} }>Cancel</button>
                </span>
              </div>
            </div>
          </form>
        </td>
      </tr>
    )
  }
  
  /****
   * Render the transaction in the ledger, if in edit mode then render the 
   * edit transaction form
   */
  render() {
    return this.state.edit ? this.renderEditTransaction() : this.renderTransaction()
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
        <TransactionRow key               = {transaction.id} 
                        transaction       = {transaction} 
                        updateTransaction = {this.props.updateTransaction} />
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
    this.updateTransaction  = this.updateTransaction.bind(this)
  }
  
  addTransaction(newTransaction) {
    console.log(`INFO: add new transaction, date: ${newTransaction.date}, description: ${newTransaction.description}, amount: ${newTransaction.amount}`)
    
    this.setState({
      transactions: this.state.transactions.concat([newTransaction])
    })
    return
  }
  
  /****
   * Transaction was updated in DB, so update the state in transactions [] and
   * render the transactions
   */ 
  updateTransaction(transaction) {
    console.log("INFO: Entered Ledger.updateTransaction)")

    let index   = this.state.transactions.findIndex( (element) => { return element.id == transaction.id } )
    let txns    = _.cloneDeep(this.state.transactions)
    txns[index] = transaction
    
    this.setState({
      transactions: txns,
    })
          
    console.log(`INFO: Found index= ${index}`)
    // Need to clone the array and replace the updated transaction, use lodash
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
        <AddTransaction   addTransaction    = {this.addTransaction} />
        <TransactionTable records           = {this.state.transactions} 
                          updateTransaction = {this.updateTransaction} />
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
