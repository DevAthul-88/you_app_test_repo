This documentation provides an overview of the **Chat Application's** core features, including user authentication, profile management, messaging, and user management functionalities like blocking and unblocking users.

## Authentication

### User Registration
- **Description**: New users can register for the application by providing necessary details like email and password.
- **Core Flow**:
  1. User provides their name, email, and password.
  2. Upon successful registration, the user is granted a JWT token.
  
### User Login
- **Description**: Existing users can log in by providing their registered email and password.
- **Core Flow**:
  1. User provides email and password.
  2. If credentials are valid, a JWT token is issued for authenticated access.
  
### JWT Authentication
- **Description**: After login, a JWT (JSON Web Token) is issued to the user. This token is required for subsequent requests to authenticate the user.
- **Core Flow**:
  1. The user sends the JWT token in the Authorization header for all authenticated requests.
  2. If the token is expired or invalid, the request will be rejected with a `401 Unauthorized` response.

## User Profile

### View Profile
- **Description**: Each user can view their profile information, including name, email, and other basic details.
- **Core Flow**:
  1. The user accesses the `/user/profile` endpoint.
  2. The server retrieves and returns the user’s profile information.

### Update Profile
- **Description**: Users can update their profile details, such as name or email.
- **Core Flow**:
  1. The user provides updated profile details through the `/user/profile` endpoint.
  2. The server processes the update and returns a success response.
  
### Change Password
- **Description**: Users can change their password by providing their current password and new password.
- **Core Flow**:
  1. The user submits the current password and the new password through the `/user/change-password` endpoint.
  2. The server validates the current password and updates it with the new one.

## Messaging

### Send Message
- **Description**: Allows users to send messages to their contacts.
- **Core Flow**:
  1. The user provides the message content and the recipient’s user ID.
  2. The server stores the message and sends a success response.

### View Messages
- **Description**: Users can view the chat history between them and their contacts.
- **Core Flow**:
  1. The user sends a request with the contact’s user ID.
  2. The server retrieves all the messages exchanged between the two users.

### Edit Message
- **Description**: Users can edit a previously sent message.
- **Core Flow**:
  1. The user provides the message ID and the new content.
  2. The server updates the message and returns the updated message details.

### Delete Message
- **Description**: Users can delete a message that they’ve sent.
- **Core Flow**:
  1. The user provides the message ID they want to delete.
  2. The server deletes the message and returns a success response.

## User Management

### Block User
- **Description**: Users can block another user to prevent them from sending messages.
- **Core Flow**:
  1. The user provides the ID of the user they wish to block.
  2. The server updates the user’s block list and prevents further communication with the blocked user.

### Unblock User
- **Description**: Users can unblock a previously blocked user, allowing them to send messages again.
- **Core Flow**:
  1. The user provides the ID of the user they wish to unblock.
  2. The server removes the user from the block list and allows communication again.

## Error Handling

### Common Errors
- **400 Bad Request**: The request is malformed, or data is invalid (e.g., missing required fields).
- **404 Not Found**: Resource (such as a message or user) was not found.
- **401 Unauthorized**: The user is not authenticated or the token is expired.
- **403 Forbidden**: The user is trying to access a resource they are not permitted to (e.g., sending a message to a blocked user).
- **500 Internal Server Error**: A generic error indicating that something went wrong on the server.

---

# **API Documentation**

## **Introduction**
This API provides endpoints for user authentication, profile management, and chat functionalities. It is built using NestJS, providing RESTful services with JWT authentication.


---

## **Authentication API**

### **POST /api/register**
- **Description**: Register a new user.
- **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "username": "user123",
      "password": "password123"
    }
    ```
- **Response**:
    - **Status 201**: Successfully registered.
    - **Status 400**: Invalid input or user already exists.
    - **Example Response**:
    ```json
    {
      "message": "User created successfully"
    }
    ```

---

### **POST /api/login**
- **Description**: Login a user and get a JWT token for authentication.
- **Request Body**:
    ```json
    {
      "username": "user123",
      "password": "password123"
    }
    ```
- **Response**:
    - **Status 200**: Login successful.
    - **Status 401**: Invalid credentials.
    - **Example Response**:
    ```json
    {
      "access_token": "your-jwt-token"
    }
    ```

---

## **User Profile API**

### **POST /api/createProfile**
- **Description**: Create a user profile. Requires authentication via JWT.
- **Headers**:
    - `Authorization`: Bearer `your-jwt-token`
- **Request Body**:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "bio": "A software engineer"
    }
    ```
- **Response**:
    - **Status 201**: Profile created successfully.
    - **Status 400**: Invalid input data.
    - **Example Response**:
    ```json
    {
      "message": "Profile created successfully"
    }
    ```

---

### **GET /api/getProfile**
- **Description**: Retrieve the user’s profile. Requires authentication via JWT.
- **Headers**:
    - `Authorization`: Bearer `your-jwt-token`
- **Response**:
    - **Status 200**: Profile fetched successfully.
    - **Status 404**: Profile not found.
    - **Example Response**:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "bio": "A software engineer"
    }
    ```

---

### **PUT /api/updateProfile**
- **Description**: Update the user’s profile. Requires authentication via JWT.
- **Headers**:
    - `Authorization`: Bearer `your-jwt-token`
- **Request Body**:
    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "bio": "A senior software engineer"
    }
    ```
- **Response**:
    - **Status 200**: Profile updated successfully.
    - **Status 400**: Invalid data.
    - **Example Response**:
    ```json
    {
      "message": "Profile updated successfully"
    }
    ```

---

## **Chat API**

### **POST /chat/sendMessage**
- **Description**: Send a message to a contact.
- **Request Body**:
    ```json
    {
      "senderId": "user123",
      "receiverId": "contact456",
      "message": "Hello, how are you?"
    }
    ```
- **Response**:
    - **Status 200**: Message sent successfully.
    - **Status 400**: Invalid data.
    - **Example Response**:
    ```json
    {
      "message": "Message sent successfully"
    }
    ```

---

### **GET /chat/viewMessages/:userId/:contactId**
- **Description**: View the chat history between the user and a contact.
- **Path Parameters**:
    - `userId`: The ID of the user.
    - `contactId`: The ID of the contact.
- **Response**:
    - **Status 200**: Messages retrieved successfully.
    - **Status 404**: Messages not found.
    - **Example Response**:
    ```json
    [
      {
        "senderId": "user123",
        "receiverId": "contact456",
        "message": "Hello, how are you?",
        "timestamp": "2025-02-21T10:20:00Z"
      },
      {
        "senderId": "contact456",
        "receiverId": "user123",
        "message": "I'm doing well, thanks!",
        "timestamp": "2025-02-21T10:22:00Z"
      }
    ]
    ```

---

## **Error Codes**
- **400 Bad Request**: The request was invalid or malformed.
- **401 Unauthorized**: The user is not authenticated or the JWT token is missing/invalid.
- **404 Not Found**: The requested resource (profile/messages) was not found.
- **500 Internal Server Error**: There was an error on the server while processing the request.

---

## **Authentication**
All API routes except registration and login require authentication via JWT. To authenticate, include the token in the `Authorization` header of your request:
```text
Authorization: Bearer <your-jwt-token>
