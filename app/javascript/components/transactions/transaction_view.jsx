//-----------------------------------------------------------------------------
// app/javascript/components/transactions/transaction_view.jsx
//-----------------------------------------------------------------------------
import React                          from 'react'
import PropTypes                      from 'prop-types'
import {formatDate, formatCurrency }  from '../../utils.js'

export default class TransactionView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      transaction: this.props.transaction,
    }

    this.handleEdit   = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleEdit(e) {
    e.preventDefault()
    this.props.toggleEdit()
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
        
    let csrf_token  = document.querySelector('meta[name="csrf-token"]').content
    let headers     = { 
      'Content-Type':  'application/json',
      'X-CSRF-Token':  csrf_token 
    }
    
    let fetchData   = {
      method:   'DELETE',
      body:     '',
      headers:  headers,
      mode:     'cors'
    }

    let deleteTransactionPtr  = this.props.deleteTransaction // Callback from Ledger
    let transaction_id        = this.state.transaction.id
  
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

  render() {
    //** const transaction = this.props.transaction
    const transaction = this.state.transaction
    
    return (
      <tr>
        <td className="text-left">  {formatDate(transaction.date)}          </td>
        <td className="text-left">  {transaction.description}               </td>
        <td className="text-right"> {formatCurrency(transaction.charge)}    </td>
        <td className="text-right"> {formatCurrency(transaction.payment)}   </td>
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
} // end of class TransactionView
