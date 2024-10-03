# Todo App

This project is a **Todo Application** that allows users to register, log in, and manage their tasks through a RESTful API. It utilizes **Node.js** with **Express** for the backend, **MongoDB** for data storage, and **JSON Web Tokens (JWT)** for user authentication.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Main Functionalities](#main-functionalities)
- [How-It-Works](how-it-works)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration with validation.
- User authentication with JWT.
- Create, read, update, and delete (CRUD) todos.
- Secure access to todos based on user authentication.

## Technologies Used

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing user and todo data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **bcryptjs**: Library to hash passwords for secure storage.
- **jsonwebtoken**: Library to issue JSON Web Tokens for user authentication.
- **express-validator**: Middleware for validating request data.

## Main Functionalities

1. **User Registration**:
   - Users can register by providing a username, email, and password.
   - The application hashes the password for secure storage in the database.

2. **User Login**:
   - Registered users can log in using their email and password.
   - Upon successful login, a JWT is generated and returned, which the user can use to authenticate subsequent requests.

3. **Todo Management**:
   - Users can create new todos by providing a title and description. This requires a valid JWT token in the request header for authorization.
   - Users can retrieve their todos, which are fetched based on the authenticated user’s ID. This is also secured by the JWT token.

## How It Works

1. **Setting Up the Server**:
   - The server is created using Express and connects to a MongoDB database. 
   - The application listens for incoming requests on a specified port.

2. **API Endpoints**:
   - The API exposes endpoints for user registration, login, and todo management. Each endpoint is designed to handle specific HTTP methods (e.g., POST, GET) to perform the corresponding operations.

3. **Authentication**:
   - During registration and login, user data is validated and processed. Successful login generates a JWT, which is sent back to the user.
   - For protected routes (like adding and retrieving todos), the JWT must be included in the request headers. The server verifies the token to ensure the user is authenticated before processing the request.

4. **Data Storage**:
   - All user and todo data is stored in a MongoDB database, allowing for persistent storage and retrieval.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ryu-ryuk/todo-app.git
   cd todo-app 
   ```


2. Install the dependencies:
    ```bash
    npm install  
    ```

3. Create a .env file in the root directory and add your MongoDB URI and JWT secret:
    ```
    MONGO_URI=<your_mongodb_uri>
    JWT_SECRET=<your_jwt_secret>

    ```
4. Start the Application:
    ```
    npm start
    ```


## API Endpoints
User Registration
Endpoint: ```/api/auth/register```
Method: ```POST```
Request Body:

```
{
  "username": "your_username",
  "email": "your_email@example.com",
  "password": "your_password"
}
```

## User Login
Endpoint: ```/api/auth/login```
Method: ```POST```
Request Body:
```
{
  "email": "your_email@example.com",
  "password": "your_password"
}
```

## Add Todo
Endpoint: ```/api/todos```
Method: ```POST```
Headers:
    ```Authorization: Bearer <your_token_here>```
Request Body:
```
{
  "title": "Todo Title",
  "description": "Todo Description"
}
```

## Get Todos
Endpoint: ```/api/todos```
Method: `GET`
Headers:
    ```Authorization: Bearer <your_token_here>```


### Conclusion

This Todo Application provides a basic yet functional demonstration of user authentication and CRUD operations using RESTful APIs. It can be extended with additional features, such as updating and deleting todos, implementing user roles, or integrating a frontend interface for enhanced user interaction.
