//-----------------------------------------------------------------------------
// app/javascript/utils.js
//-----------------------------------------------------------------------------
import moment         from 'moment';
import numeral        from 'numeral';

// Format date string into MM/DD/YYYYY format
export function formatDate(date) {
  let     date_str = moment(date).format('MM/DD/YYYY')
  return  date_str
}

// Format number into currency
export function formatCurrency(number) {
  let     currency = numeral(number).format('$0,0.00');
  return  currency;
}

export function formatEditableCurrency(number) {
  let     editable_currency = numeral(number).format('0.00');
  return  editable_currency;
}