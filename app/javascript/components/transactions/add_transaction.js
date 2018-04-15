//-----------------------------------------------------------------------------
// app/javascript/components/add_transaction/add_transaction.js
//-----------------------------------------------------------------------------
import React        from 'react'
import ReactDOM     from 'react-dom'
import PropTypes    from 'prop-types'

//-----------------------------------------------------------------------------
// AddTransaction
//-----------------------------------------------------------------------------
export default class AddTransaction extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      date:         '',
      description:  '',
      charge:       '',
      payment:      '',
      amount:       '',
      errors:       {},
    }
    
    this.handleDate             = this.handleDate.bind(this)
    this.handleDescription      = this.handleDescription.bind(this)
    this.handleAmount           = this.handleAmount.bind(this)
    this.handleCharge           = this.handleCharge.bind(this)
    this.handlePayment          = this.handlePayment.bind(this)
    this.handleSubmit           = this.handleSubmit.bind(this)
    this.handleClear            = this.handleClear.bind(this)
    this.resetInitialState      = this.resetInitialState.bind(this)
    this.hasError               = this.hasError.bind(this)
    this.showErrorMessage       = this.showErrorMessage.bind(this)
    this.updateErrors           = this.updateErrors.bind(this)
    this.buildTransaction       = this.buildTransaction.bind(this)
    this.addTransactionRequest  = this.addTransactionRequest.bind(this)
  }
  
  resetInitialState() {
    console.log("INFO: Entered resetInitialState()")
    this.setState({
      date:         '',
      description:  '',
      charge:       '',
      payment:      '',
      amount:       '',
      errors:       {},
    })
  }
  
  hasError(name) {
    if(this.state.errors.hasOwnProperty(name) ) {
      return true;
    }
    return false;
  }
  
  showErrorMessage(name) {
    if(this.hasError(name)) {
      return (
        <span className="error-text">
          {this.state.errors[name][0]}
        </span>
      )
    }
  }
  
  updateErrors(data) {
    this.setState({
      errors: data.header.errors
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
  
  handleCharge(e) {
    this.setState({
      charge:   e.target.value,
      amount:   -1 * e.target.value,
      payment:  '',
    })
  }
  
  handlePayment(e) {
    this.setState({
      payment:  e.target.value,
      amount:   e.target.value,
      charge:   '',
    })
  }
  
  handleClear(e) {
    this.resetInitialState()
  }
  
  handleSubmit(e) {
    console.log("INFO: Entered handleSubmit")
    e.preventDefault()
    
    try {
      let transaction = this.buildTransaction()
      let fetchData   = this.buildFetchData(transaction)
      
      this.addTransactionRequest(fetchData)
    }
    catch(err) {
      /////////////////////////////////////////////////////////////////////////
      // TODO: 04/14/2018
      // -  LOG THE ERROR AND SHOW SOME STANDARD ERROR PAGE OR MESSAGE ON
      //    THE PAGE SHOWING ERRO
      /////////////////////////////////////////////////////////////////////////
      console.error('ERROR:', err)
    }
  }

  /**** 
   * Build the transaction that is being added to the ledger from the
   * add transaction form inputs 
   */
  buildTransaction() {
    const transaction = {
      date:         this.state.date,
      description:  this.state.description,
      charge:       this.state.charge,
      payment:      this.state.payment,
      amount:       this.state.amount,
    }
    return transaction
  }

  ///////////////////////////////////////////////////////////////////////////
  // TODO: 01/25/2018
  // - NEED TO CHECK IF THE LOGIC THAT I'VE ADDED FOR THE CSRF CHECK IS 
  //   REQUIRED IN THE HEADER AND BODY AS I TURNED OFF THE CHECK IN THE
  //   ApplicationController CLASS. 
  //
  // - NEED TO BETTER UNDERSTAND THE CORS HEADERS STUFF IN ORDER TO HANDLE
  //   THE CROSS-DOMAIN API CALLS, AS ALL APIS SHOULD NOT WORRY ABOUT THEM
  ///////////////////////////////////////////////////////////////////////////
  buildFetchData(transaction) {
    let csrf_token = document.querySelector('meta[name="csrf-token"]').content
    let headers    = { 
      'Content-Type':  'application/json',
      'X-CSRF-Token':  csrf_token 
    }
    
    let fetchData = {
      method:   'POST',
      body:     JSON.stringify({ transaction: transaction }),
      headers:  headers,
      mode:     'cors'
    }

    return fetchData
  }

  /**** 
   * Refactored out the logic for calling the fetch() api using async
   * and await which makes the logic a lot cleaner.
   * 
   * I could not call a method to build the fetchData before making
   * the fetch calls in the async function, still not 100% sure how
   * async/await works
   */
  async addTransactionRequest(fetchData) {
    // Ajax Post URL
    const url     = "/transactions"
    
    // Ajax call to add record to DB
    let response  = await fetch(url, fetchData)
    let data      = await response.json()

    if(data.header.code == 200) {
      console.log(`[INFO]: Successfully added the transaction to DB`)
      this.props.addTransaction(data.body.transaction)
      this.resetInitialState()
    }
    else {
      console.log(`[ERROR]: Failed to create the transaction`)
      this.updateErrors(data)
    }
  }
  
  render() {
    return (
      <div className="card bg-info" style={{marginBottom: 0.50 + "rem"}}>
        <form className="card-body" style={{paddingTop: 0.50 + "rem", paddingBottom: 0 + "rem"}}>
          <div className="form-row">
            <div className="col-3">
              <label  className   ="sr-only">Date</label>
              <input  type        = "date" 
                      onChange    = {this.handleDate} 
                      className   = { this.hasError('date') ? "form-control has-error" : "form-control" }
                      value       = {this.state.date} >
              </input>
              { this.showErrorMessage('date') }
            </div>
            <div className="col-3">
              <label className    = "sr-only">Description</label>
              <input  type        = "text" 
                      onChange    = {this.handleDescription} 
                      className   = { this.hasError('description') ? "form-control has-error" : "form-control" }
                      id          = "txnDescription" 
                      placeholder = "Description" 
                      value       = {this.state.description} >
              </input>
              { this.showErrorMessage('description') }
            </div>
            <div className="col-2">
              <label className    = "sr-only">Charge</label>
              <input  type        = "text" 
                      onChange    = {this.handleCharge} 
                      className   = { this.hasError('amount') ? "form-control has-error" : "form-control" }
                      id          = "txnAmount" 
                      placeholder = "Charge" 
                      value       = {this.state.charge} >
              </input>
              { this.showErrorMessage('charge') }
            </div>
            <div className="col-2">
              <label className    = "sr-only">Payment</label>
              <input  type        = "text" 
                      onChange    = {this.handlePayment} 
                      className   = { this.hasError('amount') ? "form-control has-error" : "form-control" }
                      id          = "txnPayment" 
                      placeholder = "Payment" 
                      value       = {this.state.payment} >
              </input>
              { this.showErrorMessage('payment') }
            </div>
            <div className="col-2">
              <button type        = "submit" 
                      onClick     = {this.handleSubmit} 
                      className   = "btn btn-primary mb-2 btn-submit"> Add
              </button>
              <button type        = "submit" 
                      onClick     = {this.handleClear} 
                      className   = "btn mb-2"
                      style       = {{marginLeft: 0.25 + "rem"}}> Clear
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

//-----------------------------------------------------------------------------
// PropTypes for AddTransaction component
//-----------------------------------------------------------------------------
AddTransaction.propTypes = {
  addTransaction:   PropTypes.func.isRequired,
}

