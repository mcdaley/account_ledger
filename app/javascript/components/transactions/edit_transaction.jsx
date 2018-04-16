//-----------------------------------------------------------------------------
// app/javascript/components/transactions/edit_transaction.jsx
//-----------------------------------------------------------------------------
import React      from 'react'
import PropTypes  from 'prop-types'

export default class EditTransaction extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      transaction:  this.props.transaction,
      errors:       {},
    }

    this.resetInitialState  = this.resetInitialState.bind(this)
    this.updateErrors       = this.updateErrors.bind(this)
    this.handleDate         = this.handleDate.bind(this)
    this.handleDescription  = this.handleDescription.bind(this)
    this.handleCharge       = this.handleCharge.bind(this)
    this.handlePayment      = this.handlePayment.bind(this)
    this.handleUpdate       = this.handleUpdate.bind(this)
    this.handleCancel       = this.handleCancel.bind(this)
  }

  resetInitialState() {
    this.setState(prevState => ({
      transaction:  this.props.transaction,
      errors:       {}
    }))
  }
  
  updateErrors(data) {
    this.setState({
      errors: data.header.errors
    })
  }

  handleDate(e) {
    let transaction   = Object.assign({}, this.state.transaction)
    transaction.date  = e.target.value
    
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

  handleCharge(e) {
    let transaction     = Object.assign({}, this.state.transaction)
    transaction.charge  = e.target.value
    transaction.amount  = -1 * transaction.charge
    transaction.payment = ''
    
    this.setState({
      transaction: transaction
    })
  }
  
  handlePayment(e) {
    let transaction     = Object.assign({}, this.state.transaction)
    transaction.payment = e.target.value
    transaction.amount  = transaction.payment
    transaction.charge  = ''
    
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
      charge:       this.state.transaction.charge,
      payment:      this.state.transaction.payment,
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
    let   updateTransactionPtr    = this.props.updateTransaction // Callback from Ledger
    let   toggleEditPtr           = this.props.toggleEdit
    let   updateErrorsPtr         = this.updateErrors
    
    fetch(url, fetchData)
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        console.log("INFO: Successfully updated transaction")
        if(data.header.code == 200) {
          updateTransactionPtr(data.body.transaction)
          toggleEditPtr()
        }
        else {          
          // Response returned error
          updateErrorsPtr(data)
        }        
      })
      .catch(function(err) {
        console.error('ERROR: ', err.message)
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
  
  handleCancel(e) {
    e.preventDefault()
    this.resetInitialState()
    this.props.toggleEdit()
  }

  render() {
    const transaction = this.state.transaction
    
    return (
      <tr>
        <td colSpan="5">
          <form className="card-body" style={{paddingTop: 0.50 + "rem", paddingBottom: 0 + "rem"}}>
            <div className="form-row">
              <div className="col-3">
                <label  className   ="sr-only">Date</label>
                <input  type        = "date"
                        onChange    = {this.handleDate} 
                        className   = { this.hasError('date') ? "form-control has-error" : "form-control" } 
                        value       = {transaction.date}
                        autoFocus >
                </input>
                { this.showErrorMessage('date') }
              </div>
              <div className="col-3">
                <label  className   = "sr-only">Description</label>
                <input  type        = "text" 
                        onChange    = {this.handleDescription} 
                        className   = { this.hasError('description') ? "form-control has-error" : "form-control" }
                        id          = "txnDescription" 
                        placeholder = "Description" 
                        value       = {transaction.description} >
                </input>
                { this.showErrorMessage('description') }        
              </div>
              <div className="col-2">
                <label className    = "sr-only">Charge</label>
                <input  type        = "text" 
                        onChange    = {this.handleCharge} 
                        className   = { this.hasError('amount') ? "form-control has-error" : "form-control" }
                        id          = "txnCharge" 
                        placeholder = "Charge" 
                        value       = {transaction.charge} >
                </input>
                { this.showErrorMessage('amount') } 
              </div>
              <div className="col-2">
                <label className    = "sr-only">Payment</label>
                <input  type        = "text" 
                        onChange    = {this.handlePayment} 
                        className   = { this.hasError('amount') ? "form-control has-error" : "form-control" }
                        id          = "txnPayment" 
                        placeholder = "Payment" 
                        value       = {transaction.payment} >
                </input>
                { this.showErrorMessage('amount') } 
              </div>
              <div className="col-2">
                <span>
                  <button type        = "submit" 
                          onClick     = {this.handleUpdate} 
                          className   = "btn btn-sm btn-primary mb-2">Save</button>
                  <button type        = "submit" 
                          onClick     = {this.handleCancel} 
                          className   = "btn btn-sm btn-primary mb-2"
                          style       = { {marginLeft: 0.50 + "rem"} }>Cancel</button>
                </span>
              </div>
            </div>
          </form>
        </td>
      </tr>
    )
  }
}