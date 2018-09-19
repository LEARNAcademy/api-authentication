# Authentication

## Front to back communication
User authentication requires the frontend, directly controlled by the user and the backend, controlled by the developer to agree that the user is who he/she claims to be, and that there has been no interference, malicious or otherwise, between the two sides of the system.  This is the fundamentals of web application security, we need to make sure we know who is communicating, and that the communication is real.  There are many strategies developers use to ensure security in their applications, and just as many opinions on the benefits of each.  Some developers opt to construct their own authentication strategy, while others depend on tried and true standard methods supported and maintained by the community as a whole.  Best practice is to use standardized and open authentication tools for web apps.  Open source tools such as Devise and JWT, the two that we'll be using in class, have many, many smart people driving their development, protecting their apps against bugs and security vulnerabilities.  Just as important, these tools are well maintained, assuring that when new security risks are discovered, the tools are patched quickly.  It is our responsibility, as users of these tools, to make sure that we stay current with the latest versions, keeping our own apps as safe as possible.

## How authentication works

[auth workflow](https://s3.amazonaws.com/learn-site/curriculum/React/Authentication.jpg)

The backend app has the primary responsibility for maintaining security in an application.  It is the only place where us as developers can be certain that we have absolute control over our data.  The backend uses secrets and hashing algorithms for its secure data that it sends out to browsers and other clients.  The server then demands that the client sends a secure token that only the server could have generated with every request that requires authentication.

## Authenticating for APIs
Let's take a look at how authentication works on the server.  The backend generates a token when a user provides login credentials, and then requires that token on every request with elevated privileges.  When working with JSON Web Tokens, we encrypt the data needed to look the user up again and perform operations on that user's behalf.  This means that user data is encrypted, then sent to and stored on the client so we have to be certain that the entire transaction is secure.  How exactly do we go about this?  Let's setup a new Rails application, and take a look.

## Start with a Fresh Rails App
For this app, we'll use the now familiar ```-api``` and ```-T``` flags to setup it up, adding in Rspec for testing.  

```
$ rails new api_backend_authentication --api -T --database=postgres
$ cd api_backend_authentication
$ echo "gem 'rspec-rails', groups: [:development, :test]" >> Gemfile
$ bundle install
$ rails generate rspec:install
```

### Git Commit

We have finished the basic setup of our app. This would be a good time to create a new repo on github and commit our changes. You could run something like this: 

```
$ git add .
$ git commit -m "initial commit and set up tests"
```

## Adding Devise and JWT Authentication

Add the devise-jwt gem to our Gemfile
```
$ echo "gem 'devise-jwt', '~> 0.5.6'" >> Gemfile
$ bundle install
$ rails generate devise:install
```

Next we need to add a secret key to Devise JWT so that it can generate secure passwords.  We also need to disable some features of Devise used in traditional web apps. 

#### ```/config/initizers/devise.rb```

Add the following code after ```Devise.setup do |config|``` in ```/config/initizers/devise.rb```

```Ruby
config.jwt do |jwt|
  jwt.secret = "<Find the secret key in this file and copy it here>"
end
config.navigational_formats = [] #<- Disables flash messages 
```

Now we can generate a User Model with devise to store user credentials when they create accounts.  Run this from the command line:

```
$ rails generate devise User
```

If you open up ```/app/models/user.rb``` you'll now see that Devise generated a User model configured to use devise.  We want to replace the following line:

```Ruby
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

```

with this:
```Ruby
  devise :database_authenticatable,
         :registerable,
         :validatable,
         :jwt_authenticatable, 
         jwt_revocation_strategy: self

```

We also need to add a RevocationStrategy to our Model.  This is used to log users out.  Each User record stores a unique string that is used to generate and check the tokens passed by the browser when the user is attempting to access private data.  If that unique string changes, the token won't match any longer, and the user will be logged out.  You can [read more about JWT revocation here](https://github.com/waiting-for-dev/devise-jwt#revocation-strategies).  Let's tell our User model what JWT revocation strategy we want to use.  Add the following line to your User model:
```Ruby
  include Devise::JWT::RevocationStrategies::JTIMatcher
```

So, your entire User Model should like like so:

```Ruby
class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :registerable,
         :validatable,
         :jwt_authenticatable, 
         jwt_revocation_strategy: self
end
```

And we need to add a new column to our ```users``` table to hold the token.  From the command line:

```
$ rails generate migration add_jti_matcher_to_users
```

Find the newly created migration file in the db folder of your app and add this code:

```Ruby
class AddJtiMatcherToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :jti, :string
    add_index :users, :jti, unique: true
  end
end
```

Don't forget to run your migration after its setup.

### Git Commit

We have finished adding Devise with JWT and a Devise User. This would be a good time to commit our changes. You could run something like this: 

```
$ git add .
$ git commit -m "adds Devise with JWT and Devise User model"
```

### Cors
Rails now comes with Cors support baked right in, but we need to enable it.  First, uncomment this line in your Gemfile:  ```gem 'rack-cors'```.  Then, check in ```/config/initilizers/cors.rb``` and comment in this code to set it up.  Make sure and re-run ```bundle install``` afterwards.  We also need to allow the proper 'origin' for our requests to originate from.  In our case, we'll allow it from anyone.  In a production app, you would only allow the domains you know are hosting your website.

#### ```/config/initilizers/cors.rb```
```Ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*' # <- We change this to allow requests from anyone

    resource '*',
      headers: :any,
      expose: :authorization, # <- Add this line to expose our auth header
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

### Git Commit

We have finished adding CORS. This would be a good time to commit our changes. You could run something like this: 

```
$ git add .
$ git commit -m "adds CORS"
```

### Responding with JSON
There is a bit of config to do so that Devise knows that we should respond with JSON to all requests coming into the server.  In ```/app/controllers/application_controller.rb```:

####```/app/controllers/application_controller```
```Ruby
class ApplicationController < ActionController::API
  respond_to :json  # <- Add this line
  include ActionController::MimeResponds # <- Add this line
end
```

And, in our routes file, we need to add the default JSON format to the devise route. You should only have one line of devise routes:
####```/config/routes.rb```
```Ruby
devise_for :users, defaults: { format: :json }
```


### Git Commit

We have finished setting up Devise to work with JSON. This would be a good time to commit our changes. You could run something like this: 

```
$ git add .
$ git commit -m "makes Devise work with JSON"
```


### Usage

You can now protect your resources by calling `authenticate_user!` as a before_action
inside your controllers.  Any methods that you want to assure a user is logged in to access will pass this authentication step if the user is logged in, and the user will receive a failing response if they don't pass a proper token.

```ruby

# Just an example!
class SecuredController < ApplicationController
  before_action :authenticate_user!

  def index
    # etc...
  end

  # etc...
end
```

## Registering New Users

If your application allows registration, you'll want to provide an endpoint that accepts at least new user login credentials like email and password, which creates a new user and returns a token so the user can submit subsequent requests.

Here are some tests to assure that the Devise controller is creating a user for us, and returning the token properly in the header.  Note that we didn't write any controller code at all to do this.  Devise comes equiped to create users for us, log them in, and log them out right out of the box!  Of course, you can customize the behavior Devise provides as much as you like.  [Read More](https://github.com/plataformatec/devise#controller-filters-and-helpers) on Devise's home page.

#### spec/requests/registration_spec.rb

** You may need to create the requests folder in spec and add the registration_spec file.

```ruby
require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe "Users", type: :request do
  describe "POST /users" do
    it "creates a user" do
      payload = {
        user: {
          email: 'jill@jiller.com',
          password: 'secret',
          password_confirmation: 'secret'
        }
      }

      post user_registration_path, params: payload
      expect(response).to have_http_status(201)
      expect(response.headers["Authorization"]).to_not be_blank
    end

    it "should return errors when fails to create" do
      payload = {
        user: {
          email: 'jill@jiller.com',
          password: 'secret',
          password_confirmation: 'wrong password'
        }
      }

      post user_registration_path, params: payload
      expect(response).to have_http_status(422)
      expect(response.headers["Authorization"]).to be_blank
    end
  end
end
```

Run those tests, and if everything is configured correctly for Devise, they should pass. You will probably have pending tests as well, but as long as no tests fail you are good to go. 


### Signing In

Next we'll write a few tests to make sure that users who have an account can sign in with their username and password.  Again, Devise handles all of this for us, so we just need to write some tests to exercise the code that Devise provides. (Note: in a production app, you wouldn't normally write tests for code that you didn't write yourself, into your application.  We're doing it here to get a better understanding of Devise and JWT.)

#### ```/spec/requests/sign_in_spec.rb```
```Ruby
require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe "Users", type: :request do
  describe "GET /users/sign_in" do
    let!(:user){ User.create(email: 'jill@jiller.com', password: 'secret') }
    it "logs in a user" do
      payload = {
        user: {
          email: 'jill@jiller.com',
          password: 'secret'
        }
      }

      post user_session_path, params: payload
      expect(response).to have_http_status(201)
      expect(response.headers["Authorization"]).to_not be_blank
    end
  end
end
```

## That's It!
That's all there is to a basic API backend with JWT authentication.  Make sure to run those specs one more time, and when they are all green,  you're ready to build a front end to your application.


### Git Commit

We have finished setting up our Devise tests. This would be a good time to commit our changes. You could run something like this: 

```
$ git add .
$ git commit -m "tests Devise registration and sign-in flows"
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
*Hint*: Divide the story into smaller tasks; commit to git when each task is complete.

**Story**: As an apartment owner, I can create a new apartment listing

