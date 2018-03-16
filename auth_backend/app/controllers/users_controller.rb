class UsersController < ApplicationController
  before_action :authenticate_user, except: :create

  def show
    render json: current_user
  end

  def create
    user = User.create user_params
    token = Knock::AuthToken.new(payload: { sub: user.id }).token
    payload = {
      user: user,
      jwt: token
    }
    render json: payload, status: 201
  end

  private
  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation)
  end
end
