#------------------------------------------------------------------------------
# app/controllers/transactions/transactions_controller.rb
#------------------------------------------------------------------------------
class TransactionsController < ApplicationController

  ##
  # Not using a pure API for the transactions#index controller because I'm
  # adding the component to a HAML template in an empty div. In this case, I
  # need to add the transactions json string as a data attribute and then
  # load the data attribute in the transactions_react.jsx.
  #
  # If I want to build a pure API then I need to build the page using 
  # reactjs components instead of embedding in HAML templates.
  #
  def index
    @transactions       = Transaction.order(date: :desc)
    @transactions_json  = @transactions.to_json
  end
  
  def create
    logger.debug "DEBUG: Create transaction params=[#{params.inspect}]"
    logger.debug "DEBUG: params[transaction]= #{params["transaction"].inspect}"
    @transaction = Transaction.new(transaction_params)
    
    if @transaction.save
      @transaction_json = @transaction.to_json
      logger.debug "DEBUG: Added transaction: #{@transaction_json}"
      render json: @transaction_json
    else
      render json: @transaction.errors, status: :unprocessable_entity
    end
  end
  
  #----------------------------------------------------------------------------
  # private
  #----------------------------------------------------------------------------
  private
    def transaction_params
      params.require(:transaction).permit(:date, :description, :amount)
    end

end # end of class TransactionsController
