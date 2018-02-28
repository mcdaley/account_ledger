#------------------------------------------------------------------------------
# app/models/transaction.rb
#------------------------------------------------------------------------------
class Transaction < ApplicationRecord
  #############################################################################
  # TODO: 02/01/2018
  # - ADD A DATE FORMAT VALIDATOR
  # - ADD CUSTOM VALIDATOR FOR CHARGE AND PAYMENT
  #############################################################################
  validates   :date,          presence: true
  validates   :description,   presence: true, length:       { maximum: 256 }
end
