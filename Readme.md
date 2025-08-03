# 📦 Parcel Delivery API

Welcome to the Parcel Delivery API, a secure, modular, and role-based backend system designed for a modern courier service. Built with **Express.js**, **Mongoose**, and **TypeScript**, this project provides a robust foundation for managing parcel deliveries, user roles, and real-time status tracking.

---

Live Link: https://parcel-delivery-system-alpha.vercel.app

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/40151578-f55ef070-67bc-4193-a0b6-a1c323611905?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D40151578-f55ef070-67bc-4193-a0b6-a1c323611905%26entityType%3Dcollection%26workspaceId%3De970fd7a-0c50-4374-8282-5d67086265e0)

---

### **🎯 Project Overview**

This API emulates the core functionalities of a professional courier service like Pathao or Sundarban. It features a comprehensive system where users can register, send parcels, and track their delivery status. The system is built with a strong emphasis on security, modular architecture, and role-based access control, ensuring that different users (Admins, Users, and Delivery Personnel) have appropriate permissions.

### **✨ Key Features**

- **Secure Authentication**: JWT-based authentication with access and refresh tokens stored in secure `httpOnly` cookies. Passwords are securely hashed using `bcryptjs`.
- **Role-Based Access Control (RBAC)**: A granular permission system with three core roles: `ADMIN`, `USER`, and `DELIVERY_MAN`.
- **Comprehensive Parcel Management**: Full lifecycle management for parcels, from creation and cancellation to assignment and delivery confirmation.
- **Real-Time Status Tracking**: An embedded status history log within each parcel provides a complete, chronological audit trail of every state change.
- **Intelligent Recipient Handling**: The system can automatically link a recipient to their user account via their `userId` or `email`, simplifying the parcel creation process.
- **Full Admin Oversight**: Administrators have complete control over users and parcels, including the ability to view all records, assign roles, block/unblock users, and manage parcel statuses.
- **Modular & Scalable Architecture**: The codebase is organized into logical modules (`auth`, `user`, `parcel`), making it clean, maintainable, and easy to extend.

---

### **🛠️ Environment Setup**

To get the project running locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd assignment-5-parcel-delivery-system
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the necessary variables. Follow the `.env.example` file as a template.

4.  **Start the server:**
    ```bash
    npm run start:dev
    ```
    The API will be available at `http://localhost:5000`.

---

### **🚀 API Endpoints Reference**

Below is a comprehensive list of all available API endpoints.

#### **Authentication (`/api/v1/auth`)**

| Endpoint          | Method | Access | Description                                   |
| ----------------- | ------ | ------ | --------------------------------------------- |
| `/register`       | `POST` | Public | Register a new user.                          |
| `/login`          | `POST` | Public | Log in to receive access/refresh tokens.      |
| `/refresh-token`  | `POST` | Public | Get a new access token using a refresh token. |
| `/reset-password` | `POST` | All    | Change the password for the logged-in user.   |
| `/logout`         | `POST` | All    | Log out and clear authentication cookies.     |

#### **User Management (`/api/v1/user`)**

| Endpoint           | Method  | Access | Description                                       |
| ------------------ | ------- | ------ | ------------------------------------------------- |
| `/all-users`       | `GET`   | Admin  | Get a list of all non-admin users.                |
| `/:id/assign-role` | `PATCH` | Admin  | Assign a role (`USER`, `DELIVERY_MAN`) to a user. |
| `/:id/status`      | `PATCH` | Admin  | Block or unblock a user.                          |

#### **Parcel Management (`/api/v1/parcels`)**

| Endpoint                      | Method  | Access              | Description                                      |
| ----------------------------- | ------- | ------------------- | ------------------------------------------------ |
| `/`                           | `POST`  | User                | Create a new parcel delivery request.            |
| `/me`                         | `GET`   | User                | Get a list of all parcels sent by the user.      |
| `/incoming`                   | `GET`   | User                | Get a list of all parcels addressed to the user. |
| `/my-deliveries`              | `GET`   | Delivery Man        | Get a list of all parcels assigned for delivery. |
| `/all`                        | `GET`   | Admin               | Get a list of all parcels in the system.         |
| `/:id`                        | `GET`   | User, Admin         | Get details of a specific parcel.                |
| `/:id/cancel`                 | `PATCH` | User, Admin         | Cancel a parcel if its status is `PENDING`.      |
| `/:id/assign`                 | `PATCH` | Admin               | Assign a `PENDING` parcel to a delivery man.     |
| `/:id/update-delivery-status` | `PATCH` | Delivery Man, Admin | Update the delivery status of a parcel.          |
| `/:id/confirm-delivery`       | `PATCH` | User (Recipient)    | Confirm that a parcel has been delivered.        |
| `/:id/block`                  | `PATCH` | Admin               | Put a parcel `ON_HOLD`.                          |
| `/:id/unblock`                | `PATCH` | Admin               | Release a parcel from being `ON_HOLD`.           |

---

### **🧪 API Testing**

You can use **Postman** or any other API client to test the endpoints. Remember to:

1.  Register and log in to get a bearer token.
2.  Include the `Authorization: Bearer <your_token>` header for all protected routes.
3.  For endpoints that require a different role (e.g., Admin), make sure to log in with the appropriate user to get the correct token.

---

Thank you for checking out the Parcel Delivery API!

## Sample API Usage

### 1. Register a New User

**Request:** `POST /api/v1/user/register`

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "aSecurePassword123!",
  "phone": "1234567890",
  "address": "123 Main St, Anytown, USA"
}
```

### 2. Login

**Request:** `POST /api/v1/auth/login`

```json
{
  "email": "john.doe@example.com",
  "password": "aSecurePassword123!"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "688e8bf9d8ba4c573ec53228",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "USER"
    }
  }
}
```

### 3. Create a Parcel

**Request:** `POST /api/v1/parcels` (with `Authorization: Bearer <accessToken>`)

```json
{
  "recipient": {
    "name": "Jane Smith",
    "phone": "0987654321",
    "address": "456 Oak Ave, Othertown, USA",
    "email": "jane.smith@example.com"
  },
  "weight": 2.5,
  "pickupAddress": "123 Main St, Anytown, USA",
  "notes": "Handle with care."
}
```

**Response:**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "sender": "688e8bf9d8ba4c573ec53228",
    "recipient": {
      "name": "Jane Smith",
      "phone": "0987654321",
      "address": "456 Oak Ave, Othertown, USA",
      "email": "jane.smith@example.com"
    },
    "currentStatus": "PENDING",
    "statusHistory": [
      {
        "currentStatus": "PENDING",
        "timestamp": "2025-08-03T05:00:00.000Z",
        "updatedBy": "688e8bf9d8ba4c573ec53228",
        "note": "Parcel booking created by sender."
      }
    ],
    "_id": "688ed1a1b2c3d4e5f6a7b8c9",
    "trackingNumber": "TRK-20250803-ABC123"
  }
}
```

### 4. View Parcel Status History

When you fetch a parcel, the `statusHistory` array will be populated with the details of each status change, including who made the update.

**Response from `GET /api/v1/parcels/:id`:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Parcel retrieved successfully",
  "data": {
    "_id": "688ed1a1b2c3d4e5f6a7b8c9",
    "trackingNumber": "TRK-20250803-ABC123",
    "currentStatus": "IN_TRANSIT",
    "statusHistory": [
      {
        "currentStatus": "PENDING",
        "timestamp": "2025-08-03T05:00:00.000Z",
        "updatedBy": {
          "_id": "688e8bf9d8ba4c573ec53228",
          "name": "John Doe",
          "role": "USER"
        },
        "note": "Parcel booking created by sender."
      },
      {
        "currentStatus": "PICKED_UP",
        "timestamp": "2025-08-03T06:00:00.000Z",
        "updatedBy": {
          "_id": "688ea65e9242881b85dcd64d",
          "name": "Admin",
          "role": "ADMIN"
        },
        "note": "Assigned to delivery man: Delivery Dave."
      },
      {
        "currentStatus": "IN_TRANSIT",
        "timestamp": "2025-08-03T07:00:00.000Z",
        "updatedBy": {
          "_id": "688eb0818193e17b261f5e4e",
          "name": "Delivery Dave",
          "role": "DELIVERY_MAN"
        },
        "note": "Status updated to IN_TRANSIT by delivery man."
      }
    ]
  }
}
```

---

### 📂 Project Structure

The project follows a modular architecture to keep the codebase organized, scalable, and easy to maintain.

```
src/
├── app/
│   ├── modules/
│   │   ├── auth/         # Authentication logic (register, login, tokens)
│   │   ├── parcel/       # Parcel management (create, track, update)
│   │   └── user/         # User management (roles, status)
│   ├── middlewares/      # Express middlewares (auth, validation, error handling)
│   ├── routes/           # API route definitions
│   └── utils/            # Utility functions (catchAsync, AppError)
├── config/               # Environment variables and configuration
├── server.ts             # Main server entry point
└── app.ts                # Express application setup
```

- **`config/`**: Holds all environment-related configurations, loaded from `.env`.
- **`app/modules/`**: Contains the core business logic, with each module being self-contained (controller, service, model, validation, interface, routes).
- **`app/middlewares/`**: Custom middlewares for handling authentication (`auth.ts`), request validation (`validateRequest.ts`), and global error handling (`globalErrorHandler.ts`).
- **`app/routes/`**: Aggregates all module-specific routes into a single main router.
- **`app/utils/`**: Shared utility functions like `catchAsync` for cleaner async route handlers and `AppError` for custom error objects.
- **`app.ts`**: Initializes the Express app, applies global middlewares (CORS, JSON parser), and sets up routes.
- **`server.ts`**: Connects to the database and starts the server.

---

### 🛡️ Error Handling

The API uses a centralized error handling mechanism to ensure consistent and predictable error responses.

- **`AppError` Class**: A custom error class is used to create operational errors with a specific status code and message.
- **`catchAsync` Utility**: Route handlers are wrapped in a `catchAsync` function that catches any unhandled promise rejections and passes them to the global error handler.
- **Global Error Handler**: A global middleware catches all errors. It formats them into a standardized JSON response, hiding stack traces in production for security.

**Sample Error Response:**

```json
{
  "success": false,
  "message": "Parcel not found!",
  "errorSources": [
    {
      "path": "",
      "message": "Parcel not found!"
    }
  ],
  "stack": null
}
```

---

### 📄 License

This project is licensed under the MIT License.
