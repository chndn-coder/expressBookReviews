📚 Online Book Review Application

This project is a simple book review system built with Node.js and Express.js.
It allows users to browse books, search by ISBN/author/title, register & login, and then add, update, or delete their own reviews.

The API is secured with JWT (JSON Web Token) authentication, and I tested all endpoints using Postman.
On top of that, I also wrote some small Node.js client methods with Axios to show how Promises, callbacks, and async/await work in practice.


✨ What you can do with this app

View the complete book list

Search for books by ISBN, author, or title

See reviews for each book

Register as a new user

Login to get a secure JWT token

Add your own review to a book

Update or delete your own review


🛠️ Tech used

Node.js + Express.js → server and API routes

JWT + express-session → authentication and session handling

bcrypt → password hashing

Axios → HTTP client for testing async functions

Postman → manual API testing


🚀 Getting started

1.Clone the repo:
git clone <your-repo-link>
cd <repo-folder>

2.Install dependencies:
npm install

3.Run the server:
node server.js

By default, the server runs on http://localhost:5000


🔑 API overview

Public routes (anyone can use):

GET /books → all books
GET /books/isbn/:isbn → search by ISBN
GET /books/author/:author → search by author
GET /books/title/:title → search by title
GET /books/:isbn/review → get reviews for a book
POST /register → register new user
POST /login → login (returns JWT token)
Protected routes (require JWT in header):
POST /books/:isbn/review → add a review
PUT /books/:isbn/review → update your review
DELETE /books/:isbn/review → delete your review
When calling protected routes, add a header:

Authorization: Bearer <your_jwt_token>



🧪 Testing

I tested the app in two ways:

Postman – to send requests and check responses.

Example: Register a user, login, copy the token, then try adding a review.

Node.js client (client_methods.js) – shows async styles:

Get all books (callback)

Search by ISBN (promise)

Search by author (promise)

Search by title (async/await)


✅ What’s done

 API endpoints for books and reviews

 User authentication with JWT + session

 CRUD on reviews (only by the review owner)

 Async/await, Promises, callback demos with Axios

 Postman tested


 👨‍💻 Author

Made by Chandan Kumar as part of the Final Project – Online Book Review Application 🎓