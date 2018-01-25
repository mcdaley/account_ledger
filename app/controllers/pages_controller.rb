class PagesController < ApplicationController
  def home
    logger.debug("Entered pages->home method")
    
    @dummy = {
      one:      1,
      two:      2,
      three:    3
    }
    
    render json: @dummy.to_json
  end
end
