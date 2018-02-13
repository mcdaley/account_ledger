//-----------------------------------------------------------------------------
// app/javascript/components/transaction_row/transaction_row.js
//-----------------------------------------------------------------------------
import React                          from 'react'
import ReactDOM                       from 'react-dom'
import PropTypes                      from 'prop-types'
import _                              from 'lodash'
import {formatDate, formatCurrency }  from '../../utils.js'

//-----------------------------------------------------------------------------
// TransactionRow
//-----------------------------------------------------------------------------
export default class TransactionRow extends React.Component {
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
      errors:       {},
      transaction:  this.props.transaction,                       // Duplicated
    }
    
    this.handleDate         = this.handleDate.bind(this)          // Duplicated
    this.handleDescription  = this.handleDescription.bind(this)   // Duplicated
    this.handleAmount       = this.handleAmount.bind(this)        // Duplicated
    this.handleEdit         = this.handleEdit.bind(this)
    this.toggleEdit         = this.toggleEdit.bind(this)
    this.handleUpdate       = this.handleUpdate.bind(this)
    this.handleCancel       = this.handleCancel.bind(this)
    this.handleDelete       = this.handleDelete.bind(this)
    this.updateErrors       = this.updateErrors.bind(this)
    this.hasError           = this.hasError.bind(this)
    this.resetInitialState  = this.resetInitialState.bind(this)
    this.showErrorMessage   = this.showErrorMessage.bind(this)
  }
  
  toggleEdit() {  
    this.setState(prevState => ({
      edit: !prevState.edit
    }))
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
    let   updateTransactionPtr    = this.props.updateTransaction // Callback from Ledger
    let   toggleEditPtr           = this.toggleEdit
    let   updateErrorsPtr         = this.updateErrors
    
    fetch(url, fetchData)
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        console.log("INFO: Successfully updated transaction")
        if(data.header.code == 200) {
          toggleEditPtr()
          updateTransactionPtr(data.body.transaction)
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
    this.toggleEdit()
    this.resetInitialState()
  }
  
  /****
   * Call DELTE /transactions/:id to delete the transaction from the ledger 
   * then call the Ledger.deleteTransaction callback property
   */
  handleDelete(e) {  
    console.log("DEBUG: Delete the transaction")
    e.preventDefault()
    
    console.log("DEBUG: Prepare to delete the transaction") 
    const url = `/transactions/${this.state.transaction.id}`
        
    let   csrf_token      = document.querySelector('meta[name="csrf-token"]').content
    let   headers         = { 'Content-Type':  'application/json',
                              'X-CSRF-Token':  csrf_token }
    
    let   fetchData       = {
      method:       'DELETE',
      body:         '',
      headers:      headers,
      mode:         'cors'
    }

    let   deleteTransactionPtr  = this.props.deleteTransaction // Callback from Ledger
    let   transaction_id        = this.state.transaction.id
  
    fetch(url, fetchData)
      .then(function(response) {
        return response.json()
      })
      .then(function(transaction) {
        console.log(`INFO: Successfully deleted transaction with id= ${transaction_id}`)
        deleteTransactionPtr(transaction)
      })
      .catch(err => console.error('ERROR:', err.message))
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
                        className   = { this.hasError('date') ? "form-control has-error" : "form-control" } 
                        value       = {transaction.date}
                        autoFocus >
                </input>
                { this.showErrorMessage('date') }
              </div>
              <div className="col-4">
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
                <label className    = "sr-only">Amount</label>
                <input  type        = "text" 
                        onChange    = {this.handleAmount} 
                        className   = { this.hasError('amount') ? "form-control has-error" : "form-control" }
                        id          = "txnAmount" 
                        placeholder = "Amount" 
                        value       = {transaction.amount} >
                </input>
                { this.showErrorMessage('amount') } 
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
// TransactionRow.propTypes
//-----------------------------------------------------------------------------
TransactionRow.propTypes = {
  transaction:  PropTypes.object.isRequired,
  transaction:  PropTypes.shape({
    date:         PropTypes.string.isRequired,
    description:  PropTypes.string.isRequired,
    amount:       PropTypes.number.isRequired,
  })
}