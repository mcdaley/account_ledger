//-----------------------------------------------------------------------------
// test/javascripts/ledger/ledger.test.js
//-----------------------------------------------------------------------------
import React                from 'react'
import ReactDOM             from 'react-dom'
import {shallow, configure} from 'enzyme'
import Adapter              from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

import Ledger               from '../../../app/javascript/components/ledger/ledger'

test('balance', () => {
  let transactions = [
    { id: 1, date: "2018-01-17", description: "Target",       amount: -10.0 },
    { id: 2, date: "2018-01-24", description: "Whole Foods",  amount: -20.0 },
    { id: 3, date: "2018-01-07", description: "Salary",       amount: 200.0 }
  ]
  
  let ledger = shallow( <Ledger transactions={transactions} /> )
  expect( ledger.instance().balance() ).toEqual(170)
})
