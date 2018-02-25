//-----------------------------------------------------------------------------
// test/javascripts/accounts/amount_box.test.js
//-----------------------------------------------------------------------------
import React      from 'react'
import AmountBox  from '../../../app/javascript/components/accounts/amount_box'
import renderer   from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<AmountBox type="credit" text="Credits" total="55.00" />)
    .toJSON()
  expect(tree).toMatchSnapshot()
});