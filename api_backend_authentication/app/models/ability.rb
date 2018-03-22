class Ability
  include CanCan::Ability

  def initialize(user)
    if user.nil?
      user = User.new
    end
    if user.has_role? :agent
      can :manage, :all
    elsif user.has_role? :client
      can :manage, Apartment, user_id: user.id 
    elsif user.has_role? :public
      can :read, Apartment
    end
  end
end
