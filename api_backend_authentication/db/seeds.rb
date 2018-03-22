user_attributes = [
  {
    name: 'Chandler Bing',
    email: 'chandler@friends.com',
    password: 'funnyguy',
    password_confirmation: 'funnyguy',
  },
  {
    name: 'Ross Gellar',
    email: 'ross@friends.com',
    password: 'doctorguy',
    password_confirmation: 'doctorguy',
  },
  {
    name: 'Joey Tribiani',
    email: 'joey@friends.com',
    password: 'suaveguy',
    password_confirmation: 'suaveguy',
  },
  {
    name: 'Rachel Green',
    email: 'rachel@friends.com',
    password: 'valleygirl',
    password_confirmation: 'valleygirl',
  },
  {
    name: 'Monica Gellar',
    email: 'monica@friends.com',
    password: 'cleangirl',
    password_confirmation: 'cleangirl',
  },
  {
    name: 'Phoebe Buffet',
    email: 'phoebe@friends.com',
    password: 'weirdgirl',
    password_confirmation: 'weirdgirl',
  },
]

user_attributes.each do |attributes|
  User.create(attributes)
end
