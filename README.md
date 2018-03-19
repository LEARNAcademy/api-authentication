# Authentication

## Front to back communication
User authentication requires the frontend, directly controlled by the user and the backend, controlled by the developer to agree that the user is who he/she claims to be, and that there has been no interference, malicious or otherwise, between the two sides of the system.  This is the fundamentals of web application security, we need to make sure we know who is communicating, and that the communication is real.  There are many strategies developers use to ensure security in their applications, and just as many opinions on the benefits of each.  Some developers opt to construct their own authentication strategy, while others depend on tried and true standard methods supported and maintained by the community as a whole.  Best practice is to use standardized and open authentication tools for web apps.  Open source tools such as Knock and JWT, the two that we'll be using in class, have many, many smart people driving their development, protecting their apps against bugs and security vulnerabilities.  Just as important, these tools are well maintained, assuring that when new security risks are discovered, the tools are patched quickly.  It is our responsibility, as users of these tools, to make sure that we stay current with the latest versions, keeping our own apps as safe as possible.

## How authentication works

[auth workflow](https://s3.amazonaws.com/learn-site/curriculum/React/Authentication.jpg)

The backend app has the primary responsibility for maintaining security in an application.  It is the only place where us as developers can be certain that we have absolute control over our data.  The backend uses secrets and hashing algorithms for its secure data that it sends out to browsers and other clients.  The server then demands that the client sends a secure token that only the server could have generated with every request that requires authentication.

## Authenticating for APIs
Let's take a look at how authentication works on the server.  The backend generates a token when a user provides login credentials, and then requires that token on every request with elevated privileges.  When working with JSON Web Tokens, we encrypt the data needed to look the user up again and perform operations on that user's behalf.  This means that user data is encrypted, then sent to and stored on the client so we have to be certain that the entire transaction is secure.  How exactly do we go about this?  Let's setup a new Rails application, and take a look.

## Start with a Fresh Rails App
For this app, we'll use the now familiar ```-api``` and ```-T``` flags to setup it up, adding in Rspec for testing.  

```
$ rails new api_backend_authentication --api -T
$ cd api_backend_authentication
$ echo "gem 'rspec-rails', groups: [:development, :test]" >> Gemfile
$ bundle install
$ rails generate rspec:install
```

## Create a user that stores a password
<iframe src="https://player.vimeo.com/video/260582190" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/260582190">has_secure_password</a> from <a href="https://vimeo.com/user2583318">M,M,&amp;M</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

Next we will create a User model to store our login credentials and the other fields we'll want to store for users.  In this simple case, just their name.  Rails has some built in tools to help us with this.  Check out [has_secure_password](http://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html) to learn more about this feature of ActiveRecord.  

```
$ rails g resource User name:string email:string password_digest:string
$ rails db:create
$ rails db:migrate
```

Next, we uncomment ```gem 'bcrypt', '~> 3.1.7'``` in the Gemfile, and ```bundle install``` again

### Testing has_secure_password
Here are a few tests to get us started with has_secure_password:

#### spec/models/user-spec.rb
```ruby
RSpec.describe User, type: :model do
  it "should have secure password" do
    user = User.create(name: 'Bob', password: 'secret')
    expect(user.save).to be true
    expect(user.authenticate('not-secret')).to be false
  end

  it "should fail on bad password confirmation" do
    user = User.create(
      name: 'Jill',
      password: 'secret',
      password_confirmation: 'something else'
    )
    expect(user.save).to be false
  end

  it "should succeed on good password confirmation" do
    user = User.create(
      name: 'Jill',
      password: 'secret',
      password_confirmation: 'secret'
    )
    expect(user.save).to be true
  end
end
````

And to make those pass, all we need to do is add one line to the User model:

#### app/models/user.rb
```ruby
class User < ApplicationRecord
  has_secure_password # <-- This is the new line
end
```

## Adding Knock and JWT Authentication
We'll be using Knock and JWT for server side authentication.  You can read more about [Knock here](https://github.com/nsarno/knock).  JWT is an open standard used in many technologies: Ruby, Javascript, PHP, and Phyton for example.  Its [home page is here](https://jwt.io/).

<iframe src="https://player.vimeo.com/video/260589518" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/260589518">jwt-knock</a> from <a href="https://vimeo.com/user2583318">M,M,&amp;M</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

## Install Knock
Add this line to your application's Gemfile:

```ruby
gem 'knock'
```

Then execute:

    $ bundle install

Finally, run the install generator:

    $ rails generate knock:install

It will create the following initializer `config/initializers/knock.rb`.
This file contains all the informations about the existing configuration options.

Then, install a controller to provide tokens for users logging in.

    $ rails generate knock:token_controller user

This will generate the controller `user_token_controller.rb` and add the required route to your `config/routes.rb` file.

### Usage
Include the `Knock::Authenticable` module in your `ApplicationController`

```ruby
class ApplicationController < ActionController::API
  include Knock::Authenticable
end
```

You can now protect your resources by calling `authenticate_user` as a before_action
inside your controllers:

```ruby
class SecuredController < ApplicationController
  before_action :authenticate_user

  def index
    # etc...
  end

  # etc...
end
```

## Registering New Users

<iframe src="https://player.vimeo.com/video/260590816" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/260590816">jwt-rails-registration</a> from <a href="https://vimeo.com/user2583318">M,M,&amp;M</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

If your application allows registration, you'll want to provide an endpoint that accepts at least new user login credentials like email and password, which creates a new user and returns a token so the user can submit subsequent requests.

We'll use the Users Controller for the endpoint.  Here are the tests:

#### spec/requests/users_spec.rb
```ruby
require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe "GET /users/:id" do
    let(:user){ User.create name: 'Bob', email: 'bob@bobber.com', password: 'secret'}
    let(:auth_header) do
      token = Knock::AuthToken.new(payload: {sub: user.id}).token
      {
        'Authorization': "Bearer #{token}"
      }
    end

    #.... other user tests

    it "creates a user" do
      payload = {
        user: {
          name: 'Jill',
          email: 'jill@jiller.com',
          password: 'secret',
          password_confirmation: 'secret'
        }
      }

      post users_path, params: payload
      expect(response).to have_http_status(201)
      json = JSON.parse(response.body)
      expect(json["user"]["name"]).to eq "Jill"
      expect(json["jwt"]).to_not be_blank
    end

    it "should return errors when fails to create" do
      payload = {
        user: {
          name: 'Jill',
          email: 'jill@jiller.com',
          password: 'secret',
          password_confirmation: 'wrong password'
        }
      }

      post users_path, params: payload
      expect(response).to have_http_status(422)
      json = JSON.parse(response.body)
      expect(json["errors"]["password_confirmation"]).to_not be_blank
    end
  end
end
```

And here's the complete controller that to satisify these tests:

#### app/controllers/users_controller.rb
```ruby
class UsersController < ApplicationController
  before_action :authenticate_user, only: :show

  def show
    user = User.find params[:id]
    render json: user
  end

  def create
    user = User.new(user_params)
    if user.save
      token = Knock::AuthToken.new(payload: { sub: user.id }).token
      payload = {
        user: user,
        jwt: token
      }
      render json: payload, status: 201
    else
      render json: {errors: user.errors}, status: 422
    end
  end

  private
  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation)
  end
end
```

## Challenge
# Full Stack Apartment App 

## Workflow

1. Read the whole story; then break it down into smaller tasks.
1. Write the test first
 1. Use `rails generate rspec:integration CoolFeature` for user story testing
 1. Use model rspec testing when creating new models
1. Implement one task at a time - baby steps!
1. Commit to git every time you have something working.

## Definition of Done

A story is completed when:

* it has been tested - remember test *first*!
* it has been demonstrated to an instructor
* it has been merged onto the `master` branch in Github.

## Stories with Plain Generated Pages

**Story**: As an internet user, I can go to a web page and see a list of apartments.
Apartments have two street designations, and a city, postal code, state, country, in a addition to contact info: name, phone number, hours to contact
*Hint*: Use just one table.
*Hint*: Devide the story into smaller tasks; commit to git when each task is complete.

**Story**: As an apartment owner, I can create a new apartment listing


