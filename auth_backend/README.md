# Authentication

## Front to back communication
User authentication requires the frontend, directly controlled by the user and the backend, controlled by the developer to agree that the user is who he/she claims to be, and that there has been no interference, malicious or otherwise, between the two sides of the system.  This is the fundamentals of web application security, we need to make sure we know who is communicating, and that the communication is real.  There are many strategies developers use to ensure security in their applications, and just as many opinions on the benefits of each.  Some developers opt to construct their own authentication strategy, while others depend on tried and true standard methods supported and maintained by the community as a whole.  Best practice is to use standardized and open authentication tools for web apps.  Open source tools such as Knock and JWT, the two that we'll be using in class, have many, many smart people driving their development, protecting their apps against bugs and security vulnerabilities.  Just as important, these tools are well maintained, assuring that when new security risks are discovered, the tools are patched quickly.  It is our responsibility, as users of these tools, to make sure that we stay current with the latest versions, keeping our own apps as safe as possible.

## How authentication works

[auth workflow](https://s3.amazonaws.com/learn-site/curriculum/React/Authentication.jpg)

The backend app has the primary responsibility for maintaining security in an application.  It is the only place where us as developers can be certain that we have absolute control over our data.  The backend uses secrets and hashing algorithms for its secure data that it sends out to browsers and other clients.  The server then demands that the client sends a secure token that only the server could have generated with every request that requires authentication.

## Authenticating for APIs

Let's take a look at how authentication works on the server.  

