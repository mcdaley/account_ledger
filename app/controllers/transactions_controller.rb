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
  
  ##
  # Create a new transaction and return API response
  #
  def create
    @transaction = Transaction.new(transaction_params)
    
    if @transaction.save
      respond_to do |format|
        format.json {
          # Build the success API response
          transaction_response = {
            header: {
              code:   200,
              status: "OK",
              msg:    "Created transaction with id=[#{@transaction.id}]"
            },
            body: {
              transaction: @transaction
            }
          }
          render json: transaction_response
        }
      end
    else
      respond_to do |format|
        format.json {
          # Build the error API response
          transaction_error_response = {
            header: {
              code:   422,
              status: "ERROR",
              msg:    "Failed to create transaction",
              errors: @transaction.errors
            },
            body: {}  
          }
          render json: transaction_error_response, status: :unprocessable_entity
        }
      end
    end
  end
  
  ##
  # Update a transaction and return the updated transaction, otherwise
  # return the json error
  #
  def update
    logger.debug "DEBUG: Update params-[#{params.inspect}]"
    
    @transaction = Transaction.find(params[:id])
    
    if @transaction.update(transaction_params)
      logger.debug("DEBUG: Successfully updated transaction with id=[#{@transaction.id}]")
      respond_to do |format|
        format.json {
          # Build the success API response
          transaction_response = {
            header: {
              code:   200,
              status: "OK",
              msg:    "Updated transaction with id=[#{@transaction.id}]"
            },
            body: {
              transaction: @transaction
            }
          }
          logger.debug("MIKE: Transaction response= #{transaction_response.inspect}")
          render json: transaction_response
        }
      end      
    else
      logger.log_error_messages(@transaction, "TRANSACTIONS")
      respond_to do |format|
        format.json {
          # Build the error API response
          transaction_error_response = {
            header: {
              code:   422,
              status: "ERROR",
              msg:    "Failed to update the transaction with id=[#{@transaction.id}]",
              errors: @transaction.errors
            },
            body: {}  
          }
          logger.debug("MIKE: Transaction error response= #{transaction_error_response.inspect}")
          render json: transaction_error_response, status: :unprocessable_entity
        }
      end
    end
  end
  
  def destroy
    @transaction = Transaction.find(params[:id])
    @transaction.destroy
    
    render json: @transaction
  end
  
  #----------------------------------------------------------------------------
  # private
  #----------------------------------------------------------------------------
  private
    def transaction_params
      params.require(:transaction).permit(:date, :description, :amount)
    end

end # end of class TransactionsController
