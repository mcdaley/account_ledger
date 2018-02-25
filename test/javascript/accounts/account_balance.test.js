//-----------------------------------------------------------------------------
// test/javascripts/accounts/account_balance.test.js
//-----------------------------------------------------------------------------
import React          from 'react'
import AccountBalance from '../../../app/javascript/components/accounts/account_balance'
import renderer       from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<AccountBalance credits="200.00" debits="50.00" balance="150.00" />)
    .toJSON()
  expect(tree).toMatchSnapshot()
});