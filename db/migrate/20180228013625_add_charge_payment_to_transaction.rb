class AddChargePaymentToTransaction < ActiveRecord::Migration[5.1]
  def change
    add_column :transactions, :charge,  :float
    add_column :transactions, :payment, :float
  end
end
