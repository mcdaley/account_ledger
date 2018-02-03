#------------------------------------------------------------------------------
# config/initializers/log_formatter.rb
#------------------------------------------------------------------------------

##
# Monkey patch utility methods to the Logger
#
class ActiveSupport::Logger
  ##
  # Log the parameters passed into a controller to help with debugging. 
  # Just pass in the params hash as well as an optional grep string that
  # you can use to debug in the log file.
  #
  # ==== Attributes
  # * +params+      - Params passed into the controller
  # * +grep_string+ - Unique string to prefix the log message, so it can be
  #                   grepped from the log file
  #
  # ==== Example
  # logger.debug(params, "TASK")
  #
  def debug_params(params, grep_string = '')
    prefix = grep_string.empty? ? "" : "[#{grep_string}] "
    self.debug { "#{prefix} Controller=[#{params[:controller]}], Action=[#{params[:action]}], Params=[#{params.inspect}]" }
  end
  
  ##
  # Log an object via a call to inspect. Just pass in the object and an
  # optional grep string that can be used to search in the log file
  #
  # ==== Attributes
  # * +object+      - Object that you want to inspect
  # * +grep_string+ - Unique string to prefix the log message, so it can be 
  #                   grepped from the log file
  #
  def log_inspect(object, grep_string = '')
    prefix = grep_string.empty? ? "" : "[#{grep_string}] "
    self.debug { "#{prefix} Class=[#{object.class}], Inspect=[#{object.inspect}]" }
  end
  
  ##
  # Log the error messages for a model, to use from the controller just call:
  # logger.log_error_messages(model, grep_string), where model is the object with 
  # the errors and the grep_string is an optional string to prefix the log
  # message, so that you can use grep to filter out the messages when 
  # debugging. 
  #
  # ==== Attributes
  # * +model+       - Model that could not be saved
  # * +grep_string+ - Unique string to prefix the log message, so it can be
  #                   grepped from the log file
  #
  # ==== Examples
  # if !@model.save
  #   logger.log_error_messages(@model, "MODEL")
  #   ...
  #
  def log_error_messages(model, grep_string = '')
    prefix = grep_string.empty? ? "" : "[#{grep_string}] "
    self.error "#{prefix} Unable to save the #{model.class}"
    model.errors.each do |name, msg|
      self.error "#{prefix} #{model.class}[#{name}] = [#{msg}]"
    end
  end
end # end of class ActiveSupport::Logger
