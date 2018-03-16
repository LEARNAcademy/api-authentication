require 'rails_helper'

RSpec.describe User, type: :model do
  it "should have secure password" do
    # Demonstrating how to use 'has_secure_password'
    user = User.new(name: 'donny', password: '', password_confirmation: 'nomatch')
    expect(user.save).to be false
    user.password = 'mUc3m00RsqyRe'
    expect(user.save).to be false  # confirmation doesn't match
    user.password_confirmation = 'mUc3m00RsqyRe'
    expect(user.save).to be true
    expect(user.authenticate('notright')).to be false
    expect(user.authenticate('mUc3m00RsqyRe')).to eq user
  end
end
