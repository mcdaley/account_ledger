#------------------------------------------------------------------------------
# config/routes.rb
#------------------------------------------------------------------------------
Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root      to: "transactions#index"
  
  resources :transactions
end
