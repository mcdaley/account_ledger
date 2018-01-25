#------------------------------------------------------------------------------
# app/controllers/application_controller.rb
#------------------------------------------------------------------------------
class ApplicationController < ActionController::Base
  #------------------------------------------------------------------
  # HACK: 01/24/2018
  #
  # Since I'm hacking together an API I need to turn off the
  # CSRF check. I should ovverride this in the ApiController
  # instead of the ApplicationController
  #------------------------------------------------------------------
  ## protect_from_forgery with: :exception
  protect_from_forgery with: :null_session
end
