require 'rails_helper'

RSpec.describe "UserTokens", type: :request do
  describe "GET /user_tokens" do
    it "fetches token" do
      user = User.create!(name: 'Bob', email: 'bob@bobber.com', password: 'secret')
      payload = {auth: {email: user.email, password: "secret"}}
      post user_token_path, params: payload
      expect(response).to have_http_status(201)
      json = JSON.parse(response.body)
      expect(json.keys).to include("jwt")
    end
  end
end
