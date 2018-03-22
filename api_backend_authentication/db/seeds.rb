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


apartment_attributes = [
  {
    street: '123 Main St.',
    city: 'New York',
    state: 'NY',
    listing_price: '$600K',
    user_id: 1
  },
  {
    street: '456 Main St.',
    city: 'New York',
    state: 'NY',
    listing_price: '$1 million',
    user_id: 2
  },
  {
    street: '789 Main St.',
    city: 'New York',
    state: 'NY',
    listing_price: '$850K',
    user_id: 5
  }
]

apartment_attributes.each do |attributes|
  Apartment.create(attributes)
end
