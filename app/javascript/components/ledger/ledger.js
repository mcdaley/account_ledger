//-----------------------------------------------------------------------------
// app/javascript/components/ledger/ledger.js
//-----------------------------------------------------------------------------
import React              from 'react'
import ReactDOM           from 'react-dom'
import moment             from 'moment'       // Move logic to utils.js and import
import { fromJS, Map }    from 'immutable'
import AddTransaction     from 'components/transactions/add_transaction'
import TransactionTable   from 'components/transactions/transaction_table'

//-----------------------------------------------------------------------------
// Ledger
//-----------------------------------------------------------------------------
export default class Ledger extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      transactions:      fromJS(this.props.transactions),
    };
    
    this.addTransaction       = this.addTransaction.bind(this)
    this.updateTransaction    = this.updateTransaction.bind(this)
    this.deleteTransaction    = this.deleteTransaction.bind(this)
    //** this.convertTransactions  = this.convertTransactions.bind(this)
  }
  
  /****
   * Convert the transactions to an Immutable Map that can be used in with 
   * the immutable.js APIs
   * 
   * To find a transaction, you can do:
   * - let t = txn_list.get('75')
   * - let d = txn_list.get('75').get('description')
   * - let d = txn_list.get(['75', 'description'])
   *
   * To update a transaction
   * - txn_list = txn_list.setIn(['75', 'description'], 'New Description')
   *
   * Need to figure out
   * 1. Can I get multiple fields back in the get
   * 2. Can I set multiple fields using setIn
   */
/************************************************
  /////////////////////////////////////////////////////////////////////////////
  // NOTE: 02/10/2018
  // -  TURNED OFF THE CONVERSION OF THE TRANSACTIONS AND I'M USING A List 
  //    INSTEAD OF A Map FOR THE CRUD OPERTATIONS.
  /////////////////////////////////////////////////////////////////////////////
  convertTransactions() {
    let z = {}

    this.props.transactions.forEach( (txn) => { z[txn.id] = txn } )
    
    const   txn_map = fromJS(z)
    return  txn_map
  }
*************************************************/
  
  /****
   * Add the transaction to the front of the List
   */
  addTransaction(newTransaction) {
    console.log(`INFO: add new transaction, date: ${newTransaction.date}, description: ${newTransaction.description}, amount: ${newTransaction.amount}`)
        
    this.setState({
      transactions: this.state.transactions.unshift( fromJS(newTransaction) )
    })
    return
  }
  
  /****
   * Transaction was updated in DB, so update the state in transactions [] and
   * render the transactions
   */ 
  updateTransaction(updatedTransaction) {
    let transaction   = fromJS(updatedTransaction)
    let index         = this.state.transactions.findIndex( 
                          el => { return el.get('id') === updatedTransaction.id 
                        })
    let transactions  = this.state.transactions.update( index, el => { return transaction } )
    
    this.setState({
      transactions: transactions,
    })   
    return
  }
  
  /*****
   * Remove the deleted transaction from the transactions state array and
   * render the updated view.
   */
  deleteTransaction(deletedTransaction) {
    console.log(`INFO: Remove transaction with id= ${deletedTransaction} from Ledger view`)
    
    let index         = this.state.transactions.findIndex( 
                          el => { return el.get('id') === deletedTransaction.id 
                        } )
    let transactions  = this.state.transactions.delete(index)
    
    this.setState({
      transactions: transactions,
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
  
  /****
   * Render the account ledger and show the transactions from newest to oldest
   * 
   * NOTE:  Sorting the transactions before rendering them everytime, not
   *        sure if this is the most optimal, but it keeps the logic simple
   */
  render() {
    // Sort the transactions from newest to oldest
    let sorted_transactions = this.state.transactions.sort( (a,b) => {
      let a_date = moment(a.get("date"))
      let b_date = moment(b.get("date"))
      
      if( a_date.isBefore( b_date ) ) { return  1 }
      if( a_date.isAfter(  b_date ) ) { return -1 }
      return 0
    })
    
    return (
      <div>
        <h2>Account Ledger</h2>
        <AddTransaction   addTransaction    = { this.addTransaction         } />
        <TransactionTable records           = { sorted_transactions.toJS()  } 
                          updateTransaction = { this.updateTransaction      }
                          deleteTransaction = { this.deleteTransaction      } />
      </div>
    )
  }
}

