//-----------------------------------------------------------------------------
// test/javascripts/ledger/ledger.test.js
//-----------------------------------------------------------------------------
import React                from 'react'
import ReactDOM             from 'react-dom'
import renderer             from 'react-test-renderer'
import {shallow, configure} from 'enzyme'
import Adapter              from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

import AddTransaction       from '../../../app/javascript/components/transactions/add_transaction'

///////////////////////////////////////////////////////////////////////////////
// TODO: 02/26/2018
// [] Test layout of AddTransaction Form
//    1.) Snapshot of component
//    2.) Test calling Submit/OnClick
// [] Test clicking 'Add' with empty form, should see errors
//    1.) Simulate AJAX response using a sinon.stub()
//    2.) Verify the empty fields have class '.has-error'
// [] Test clicking 'Add' with fields, should receive new transaction 
///////////////////////////////////////////////////////////////////////////////


it('renders correctly', () => {
  const handleSubmitMock = jest.fn()
  
  const tree = renderer
    .create(<AddTransaction addTransaction={handleSubmitMock} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
});

/**
it('handles submit', () => {
  const handleSubmitMock  = jest.fn()
  const wrapper           = shallow(<AddTransaction addTransaction={handleSubmitMock} />)
  wrapper.find('.btn-submit').simulate('click', { preventDefault: () => {} })
  expect(handleSubmitMock.mock.calls.length).toBe(1)
})
**/


