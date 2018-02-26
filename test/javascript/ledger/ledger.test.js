//-----------------------------------------------------------------------------
// test/javascripts/ledger/ledger.test.js
//-----------------------------------------------------------------------------
import React                from 'react'
import ReactDOM             from 'react-dom'
import {shallow, mount, configure} from 'enzyme'
import Adapter              from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

import Ledger               from '../../../app/javascript/components/ledger/ledger'
import AddTransaction       from '../../../app/javascript/components/transactions/add_transaction'
import TransactionTable     from '../../../app/javascript/components/transactions/transaction_table'
import TransactionRow       from '../../../app/javascript/components/transactions/transaction_row'

describe('<Ledger />', () => {
  var g_transactions   
  
  beforeEach(() => {
    g_transactions = [
      { id: 1, date: "2018-01-17", description: "Target",       amount: -10.0 },
      { id: 2, date: "2018-01-24", description: "Whole Foods",  amount: -20.0 },
      { id: 3, date: "2018-01-07", description: "Salary",       amount: 200.0 }
    ]
  })

  test('balance calculations', () => {
    let ledger = shallow( <Ledger transactions={g_transactions} /> )
    expect( ledger.instance().balance() ).toEqual(170)
    expect( ledger.instance().credits() ).toEqual(200)
    expect( ledger.instance().debits()  ).toEqual(-30)
  })
  
  describe('layout', () => {
    test('<AddTransaction />', () => {
      let wrapper = shallow( <Ledger transactions={g_transactions} /> )
      expect(wrapper.find(AddTransaction)).toBeDefined()
      expect(wrapper.find(AddTransaction)).toHaveLength(1)
    })
  
    test('<TransactionTable />', () => {
      let wrapper = shallow( <Ledger transactions={g_transactions} /> )
      expect(wrapper.find(TransactionTable)).toBeDefined()
      expect(wrapper.find(TransactionTable)).toHaveLength(1)
    })
  
    // Full DOM Rendering with mount()
    test('<TransactionRow />', () => {
      let wrapper = mount( <Ledger transactions={g_transactions} /> )
      expect(wrapper.find(TransactionRow)).toHaveLength(3)
    })
  })
})  // end of describe('Ledger')





