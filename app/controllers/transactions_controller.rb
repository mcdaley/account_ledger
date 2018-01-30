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
    @transaction = Transaction.new(transaction_params)
    
    if @transaction.save
      @transaction_json = @transaction.to_json
      render json: @transaction_json
    else
      render json: @transaction.errors, status: :unprocessable_entity
    end
  end
  
  ##
  # Update a transaction and return the updated transaction, otherwise
  # return the json error
  #
  def update
    logger.debug "DEBUG: Update params-[#{params.inspect}]"
    ## logger.debug "DEBUG: Update params[:id]   = #{params[:id]}"
    ##logger.debug "DEBUG: Update params[:data] = #{params[:transaction]}"
    
    @transaction = Transaction.find(params[:id])
    logger.debug "DEBUG: Update the transaction: #{@transaction.inspect}"
#=begin
    if @transaction.update(transaction_params)
      @transaction_json = @transaction.to_json
      render json: @transaction_json
    else
      render json: @record.errors, status: :unprocessable_entity
    end
#=end
  end
  
  #----------------------------------------------------------------------------
  # private
  #----------------------------------------------------------------------------
  private
    def transaction_params
      params.require(:transaction).permit(:date, :description, :amount)
    end

end # end of class TransactionsController
