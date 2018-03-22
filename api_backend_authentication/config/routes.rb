Rails.application.routes.draw do
  get 'admin' => 'admin#index'
  put 'admin/:id' => 'admin#update'
  patch 'admin/:id' => 'admin#update'

  resources :apartments, defaults: {format: :json}
  post 'user_token' => 'user_token#create'
  resources :users, defaults: {format: :json}
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
