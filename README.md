# README

## Using Immutable JS Libary
When using the Immutable JS library it is important to think about how the JSON
returned from the API is formmatted. To use a Map the data will have to be 
formatted using a key/value pair. In the ledger.js file I converted the transactions
array returned from transactions#index to an object with transaction.id as the key

### TO DO
1.) When I'm running the test code, I see that sometimes numbers in the amount field
    are converted to strings and sometimes the numbers are saved as numbers. Need to
    figure out what causes the numbers to be converted to strings.
    
2.) 

### Using Maps
For the Ledger app, the transactions can be returned as a Map of Maps, where the
Maps unique key is the transaction.id. An advantage of the Map is that it is quicker 
to update and delete items from the Map as it has a unique key.

#### Create from JS Object
For the Ledger app we'll have and object something like:

txns  = { 1: { id: 1, desc: "one", amount: 50.00  }, 
          2: { id: 2, desc: "two", amount: "30"   }, 
          3: { id: 3, desc: "three", amount: "10" } }
        
To create the Map just us fromJS() method
> fromJS(txns)
Map { "1": Map { "id": 1, "desc": "one", "amount": 50 }, 
      "2": Map { "id": 2, "desc": "two", "amount": "30" }, 
      "3": Map { "id": 3, "desc": "three", "amount": "10" } 
    }
    
#### Create JavaScript Array from Map of Maps
In the txns Map defined above, I will need to create an array of JavaScript
objects that I can pass as property to the TransactionsTable component. In this
scenario, I need to get red of all the keys in the Map and create an Array from
the values. I can do this with the following line:

txns  = { 1: { id: 1, desc: "one", amount:    50.00 }, 
          2: { id: 2, desc: "two", amount:    "30" }, 
          3: { id: 3, desc: "three", amount:  "10" } 
        }

> let arr = txns.toList().toJS()
[ { id: 1, desc: 'one',   amount:  50  },
  { id: 2, desc: 'two',   amount: '30' },
  { id: 3, desc: 'three', amount: '10' } ]
  
#### CRUD Operations
The following sections provide an overview of adding, getting, and updating 
elements in the Map

##### Get Element from Map
To get the amount for the transaction with key = "3"
> txn_map.get("3").get("amount")
'30'

To get a single transaction with key = "2",
> txn_map.get("2")
Map { "id": 2, "desc": "two", "amount": "30" }

To convert the Map into a JavaScript object
> txn_map.get("2").toJS()
{ id: 2, desc: 'two', amount: '30' }

##### Set Element from Map
> let f = fromJS( {id: 4, desc: "four", amount: 40.00} )
> txn_map.set("4", f)
Map { "1": Map { "id": 1, "desc": "one",    "amount": 50    }, 
      "2": Map { "id": 2, "desc": "two",    "amount": "30"  }, 
      "3": Map { "id": 3, "desc": "three",  "amount": "10"  }, 
      "4": Map { "id": 4, "desc": "four",   "amount": 40    } }

##### Update Element from Map
To change the "desc" and "amount" for the element with key = "1"
> let txn_map_update = txn_map.get("1").set("desc", "ONE").amount(25)
Map { "id": 1, "desc": "ONE", "amount": 25 }

To update all the fields in the transaction ofr key = "1"
> let t = fromJS( {id: 1, desc: "ONE", amount: -5.00 } )
> txn_map.update( "1", el => {return t} )
Map { "1": Map { "id": 1, "desc": "ONE",    "amount": -5 }, 
      "2": Map { "id": 2, "desc": "two",    "amount": "30" }, 
      "3": Map { "id": 3, "desc": "three",  "amount": "10" } }

#### Sort Map Elements
To sort the follow Map of transactions by the amount in ascending order (smallest
to largest) use the sort() method
> txn_map
Map { "1": Map { "id": 1, "desc": "one", "amount": 50 }, 
      "2": Map { "id": 2, "desc": "two", "amount": "30" }, 
      "3": Map { "id": 3, "desc": "three", "amount": "10" } }
      
> txn_map.sort(a,b) => { if(a.get('amount') < b.get('amount')) { return -1 };
                         if(a.get('amount') > b.get('amount')) { return  1 };
                         return 0 } )
OrderedMap {  "3": Map { "id": 3, "desc": "three",  "amount": "10"  }, 
              "2": Map { "id": 2, "desc": "two",    "amount": "30"  }, 
              "4": Map { "id": 4, "desc": "four",   "amount": "40"  }, 
              "1": Map { "id": 1, "desc": "one",    "amount": "50"  } }                         

### Arrays
#### Create List from Array
In a normal scenario for the Ledger the array will contain objects, so creating the 
Immutable.List will create a List containing Maps. To access the Map elements we need
to use the Map.get() and Map.set() methods.

> let arr  = [ {id: 1, name: "one"}, {id: 2, name: "two"}, {id: 3, name: "three"} ]
> let list = fromJS(arr)
> list
List [ Map { "id": 1, "name": "one" }, Map { "id": 2, "name": "two" }, Map { "id": 3, "name": "three" } ]

#### Find Element in Array
Find an element in an arrya with id = 3
> let index = list.findIndex( el => { el.get('id') === 3 } )
2

Find an element in array with name = "two"
> let index = list.findIndex( el => { el.get('name') === "two" } )

#### Update Element in Array
Update the element with id = 3 to have name = "THREE"
> list = list.update(l.findIndex( el => { return el.get('id') === 3 } ), 
                                  el => { return el.set("name", "THREE") } )
List [ Map { "id": 1, "name": "one" }, Map { "id": 2, "name": "two" }, Map { "id": 3, "name": "THREE" } ]

#### Insert Element in Array at specific position
Insert a new record with id = 4 after element with id = 2

> r = fromJS( {id: 4, name: "four" } )
Map { "id": 4, "name": "four" }

> list = list.insert( l.findIndex(el => { return el.get('id') === 2 }), r )
List [  Map { "id": 1, "name": "one"  }, 
        Map { "id": 4, "name": "four" }, 
        Map { "id": 2, "name": "two"  }, 
        Map { "id": 3, "name": "THREE" } ]
        
#### Insert Element at beginning / end of List
I should test set(), push(), unshift()

#### Sort a List of Transactions
Sort the list by the "name" field

> list.sort( (a,b) => { if( a.get("name") > b.get("name")) { return 1 };
                        if( a.get("name") < b.get("name")) { return -1 };
                        return 0 } )
List [  Map { "id": 1, "name": "one"    }, 
        Map { "id": 3, "name": "three"  }, 
        Map { "id": 2, "name": "two"    } ]
        
#### Calculate the Sum of List of Transactions
Use the reduce() method to calculate the sum of the transactions. Need to
pass in the variable (total) the will be returned, the element, and the 
initial value for the total, which is 0 in the example below

> const { fromJS, List } = require('immutable')
> let arr = [ { id: 1, desc: "one",   amount:  5.00 }, 
              { id: 2, desc: "two",   amount: -3.00 },
              { id: 3, desc: "three", amount: 12.00 } ]
> let txns = fromJS(arr)
List [  Map { "id": 1, "desc": "one",   "amount":  5 }, 
        Map { "id": 2, "desc": "two",   "amount": -3 }, 
        Map { "id": 3, "desc": "three", "amount": 12 } ]
> let sum = txns.reduce( (total, v) => total + v.get('amount'), 0 )
14

#### Calcuate the Debits/Credits for List of Transactions
Use the filter() and reduce() methods to calculate the total debits and
credits. The filter() method creates a list of elements the meet the filter
criteria. For example to get all credits we want to filter all transactions
with an amount >= 0.

> let credits = txns.filter( (el) => el.get('amount') >= 0 )
                    .reduce( (total, v) => total + v.get('amount'), 0 )
                    
NOTE: IF I TRY TO ADD THE '{' AND '}' TO THE METHOD CALL THEN THE CREDITS
CALCULATION DOES NOT WORK, NOT SURE HOW TO FIX SO I'M LEAVING THE BRACKETS
OFF FOR NOW.

## To Do
[x] 1. Build the rails API to return the JSON responses
[x] 2. Add a transaction
[x] 3. Edit a transaction
[x] 4. Delete a transaction
5. Add account balance to top of the form
6. Running balance
7. Proptypes for handling type checks
8. JavaScript testing

## Questions
1. How do I load transactions on the initial page load for transactions#index?
   a.) Want to make the AJAX call to the index controller when the page loads to get the transactions.
   b.) Right now I'm loading from an embedded JSON array.
   c.) Should be able to see example from reactjs video tutorial

### Bootstrap
1. Link to CDN
  a.) Attempt to link to the CDN to see if I can use bootstrap styles in reactjs components
  
2. Install as a ruby gem
  a.) Install as a ruby gem and use the css class in erb layouts and react components
  b.) Verify that I can setup the sass global variables to customize the styles
  
3. Install as an npm package
  a.) Install as a node package and verify that I can add the styles to react components.
  b.) Guessing that I will not be able to leverage in the rails layout files

## Wiki
1. Create project templates in github:
  a.) Using Bootstrap CDN, rails, and reactjs
  b.) Using Bootstrap Gem, rails, and reactjs
  c.) Using Bootstrap npm package
  d.) Using PostCSS and reactjs component structure
  
## Original
This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
