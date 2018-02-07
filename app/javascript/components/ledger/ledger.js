//-----------------------------------------------------------------------------
// app/javascript/components/ledger/ledger.js
//-----------------------------------------------------------------------------
import React              from 'react'
import ReactDOM           from 'react-dom'
import AddTransaction     from 'components/transactions/add_transaction'
import TransactionTable   from 'components/transactions/transaction_table'

//-----------------------------------------------------------------------------
// Ledger
//-----------------------------------------------------------------------------
export default class Ledger extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      transactions: this.props.transactions,
    };
    
    this.addTransaction     = this.addTransaction.bind(this)
    this.updateTransaction  = this.updateTransaction.bind(this)
    this.deleteTransaction  = this.deleteTransaction.bind(this)
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
    return
  }
  
  /*****
   * Remove the deleted transaction from the transactions state array and
   * render the updated view.
   */
  deleteTransaction(transaction) {
    console.log(`INFO: Remove transaction with id= ${transaction} from Ledger view`)
    
    /**************
      let deleted_txn   = _.remove(this.state.transactions, (element) => { return element.id == transaction.id } )
      let txns          = _.cloneDeep(this.state.transactions)
    ***************/
    let txns = this.state.transactions.filter( (element) => element.id != transaction.id)
    
    this.setState({
      transactions: txns,
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
        <AddTransaction   addTransaction    = {this.addTransaction} />
        <TransactionTable records           = {this.state.transactions} 
                          updateTransaction = {this.updateTransaction}
                          deleteTransaction = {this.deleteTransaction} />
      </div>
    )
  }
}

