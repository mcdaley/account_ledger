#------------------------------------------------------------------------------
# app/models/transaction.rb
#------------------------------------------------------------------------------
class Transaction < ApplicationRecord
  #############################################################################
  # TODO: 02/01/2018
  # - ADD A DATE FORMAT VALIDATOR
  #############################################################################
  validates   :date,          presence: true
  validates   :description,   presence: true, length:       { maximum: 256 }
  validates   :amount,        presence: true, numericality: true
end
