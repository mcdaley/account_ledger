//-----------------------------------------------------------------------------
// app/javascript/components/transaction_row/transaction_row.js
//-----------------------------------------------------------------------------
import React                          from 'react'
import ReactDOM                       from 'react-dom'
import PropTypes                      from 'prop-types'
import TransactionView                from './transaction_view'
import EditTransaction                from './edit_transaction'

///////////////////////////////////////////////////////////////////////////////
// TODO: 02/18/2018
// -  LOOK AT MOVING THE AJAX FETCH CALL LOGIC FOR THE TRANSACTION CRUD
//    API CALLS TO A SEPARATE REACT COMPONENTS, TransactionsAPI SO THAT I 
//    CAN SEPARATE API CALLS FROM THE COMPONENT DISPLAY.
///////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
// TransactionRow
//-----------------------------------------------------------------------------
export default class TransactionRow extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      edit: false,
    }
    
    this.toggleEdit = this.toggleEdit.bind(this)
  }
  
  toggleEdit() {  
    this.setState(prevState => ({
      edit: !prevState.edit
    }))
  }
  
  /****
   * Render the transaction view
   */
  renderTransactionView() {
    return (
      <TransactionView
        transaction       = {this.props.transaction}
        deleteTransaction = {this.props.deleteTransaction}
        toggleEdit        = {this.toggleEdit}
      />
    )
  }

  /****
   * Display the inline edit transaction form
   */
  renderEditTransaction() {
    console.log(`[INFO]: Render the edit transaction form`)
    return (
      <EditTransaction
        toggleEdit        = {this.toggleEdit}
        transaction       = {this.props.transaction}
        updateTransaction = {this.props.updateTransaction}
      />
    )
  }
  
 
  /****
   * Render the transaction in the ledger, if in edit mode then render the 
   * edit transaction form
   */
  render() {
    return this.state.edit  ? this.renderEditTransaction() 
                            : this.renderTransactionView()
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