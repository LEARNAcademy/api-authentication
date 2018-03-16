require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe "GET /users" do
    let(:user){ User.create!(name: 'bob', email: 'bob@bobber.com', password: 'secret') }
    let(:auth_header) do
      token = Knock::AuthToken.new(payload: { sub: user.id }).token
      {
        'Authorization': "Bearer #{token}"
      }
    end

    it "requires token" do
      get user_path(user.id)
      expect(response).to have_http_status(401)
    end

    it "returns user" do
      get user_path(user.id), headers: auth_header
      expect(response).to have_http_status(200)
    end
  end
end
