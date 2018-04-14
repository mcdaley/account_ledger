//-----------------------------------------------------------------------------
// app/javascript/containers/add_transaction.jsx
//-----------------------------------------------------------------------------
import React          from 'react'
import AddTransaction from '../components/add_transaction'

export default class AddTransactionCmd extend React.Component {
  constructor(props) {
    super(props)

    this.addTransaction = this.addTransaction.bind(this)
  }

  addTransaction(transaction) {
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
    
    //
    // The props are not visible in the fetch block, so I need to assign it to 
    // a variable in order to get it to work, not sure I understand the scoping
    // of fetch.
    //
    let   addTransactionPtr     = this.props.addTransaction
    let   resetInitialStatePtr  = this.resetInitialState
    let   updateErrorsPtr       = this.updateErrors
    
    fetch(url, fetchData)
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        if(data.header.code == 200) {
          console.log("INFO: Successfully added transaction")
          addTransactionPtr(data.body.transaction)
          resetInitialStatePtr()
        }
        else {
          // Response returned error
          console.log("ERROR: Failed to create the transaction")
          updateErrorsPtr(data)
        }   
      })
      .catch(err => console.error('ERROR:', err)) 
  }

  callFetch() {
    // Call the Fetch and return the data, should also be able to catch the error
    // Update the state and render component.
  }

  /////////////////////////////////////////////////////////////////////////////
  // TODO: 04/14/2018
  // -  NEED TO FIGURE OUT HOW TO GET THE DATA OUT OF THE FETCH CALL
  // -  CAN I JUST RETURN THE DATA IF RESPONSE IS OK?
  /////////////////////////////////////////////////////////////////////////////
  render() {
    <AddTransaction 
      addTransaction = {this.addTransaction}
    />
  }
}