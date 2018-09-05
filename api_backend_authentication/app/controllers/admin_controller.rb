class AdminController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize

  def index
    @users = User.all
  end

  def update
  end

  private

  def authorize
    if !current_user.has_role? :admin
      render status: 401
    end
  end
end
