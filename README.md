# 🔖 Bookmark Manager

![MERN](https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-MongoDB%20ODM-880000?style=for-the-badge&logo=mongoose&logoColor=white)

## 🔖 About

**Bookmark Manager** is a full-stack **MERN application** designed to help users save and manage their favorite websites in one centralized place.

Users can store website information including:

- 🌐 Site name
- 🔗 Site URL
- 🖼️ Site logo

The application also includes a user account system with **UUID-based user identification, email uniqueness, OTP support, account verification, and admin role management**.

---

# ✨ Features

### 🔖 Bookmark Management

- Add website bookmarks
- Store website name
- Store website URL
- Store website logo
- Organize bookmarks under individual users
- Manage multiple bookmarks for a user

### 👤 User Management

- User registration
- Unique user ID using UUID
- Username
- Unique email address
- Password-based authentication
- OTP support
- OTP expiration
- Account verification
- Admin role support

### 🛡️ Account Management

The user model supports:

- `userId`
- `userName`
- `email`
- `password`
- `otp`
- `otpExpireAt`
- `verified`
- `admin`

---

# 🧰 Tech Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS / Tailwind CSS *(if used in the frontend)*

## Backend

- Node.js
- Express.js
- REST APIs

## Database

- MongoDB
- Mongoose

## Utilities

- UUID

---

# 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │      React.js       │
                    │     Frontend UI     │
                    └──────────┬──────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌─────────────────────┐
                    │     Express.js      │
                    │      REST API       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Node.js       │
                    │   Backend Logic     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Mongoose       │
                    │      ODM Layer      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │      Database       │
                    └─────────────────────┘
```

---

# 🗃️ Database Models

The application currently uses two primary Mongoose models:

```text
Signup
Bookmark
```

---

## 👤 Signup Model

The `Signup` model manages user account information.

```text
Signup
│
├── userId
├── userName
├── email
├── password
├── otp
├── otpExpireAt
├── verified
└── admin
```

### User ID

A UUID is automatically generated for users:

```js
userId: {
    type: String,
    default: uuidv4
}
```

### Email

Email addresses are unique:

```js
email: {
    type: String,
    required: true,
    unique: true
}
```

### Verification

The model supports account verification using:

```text
otp
otpExpireAt
verified
```

### Admin

Administrative users can be identified using:

```js
admin: {
    type: Boolean,
    default: false,
    required: true
}
```

---

# 🔖 Bookmark Model

The `Bookmark` model stores website bookmarks associated with a user.

```text
Bookmark
│
├── userId
├── userName
├── email
└── bookmarks[]
    ├── siteName
    ├── siteURL
    └── siteLogo
```

Each user can have multiple bookmarks.

### Bookmark Fields

| Field | Type | Description |
|---|---|---|
| `userId` | String | User identifier |
| `userName` | String | Username |
| `email` | String | User email |
| `siteName` | String | Website name |
| `siteURL` | String | Website URL |
| `siteLogo` | String | Website logo |

---

# 🔄 Application Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Account Verification
 │
 ▼
Authenticated User
 │
 ▼
Bookmark Manager
 │
 ├── Add Bookmark
 │      ├── Site Name
 │      ├── Site URL
 │      └── Site Logo
 │
 ├── View Bookmarks
 │
 ├── Update Bookmark
 │
 └── Delete Bookmark
```

---

# 📂 Suggested Project Structure

```text
Bookmark-Manager/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── models/
│   │   ├── bookmark.js
│   │   └── signup.js
│   │
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

> Adjust the structure according to your actual project.

---

# ⚙️ Getting Started

## 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd Bookmark-Manager
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Add any additional environment variables required by your authentication or OTP implementation.

---

## 4. Start the Backend

```bash
npm start
```

Or, if your project uses a development script:

```bash
npm run dev
```

---

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm start
```

---

# 🔐 Security & Data Handling

The provided models implement several basic data-validation mechanisms:

- Required user fields
- Unique email addresses
- UUID-based user IDs
- Required bookmark information
- Trimmed bookmark names and URLs
- OTP support
- OTP expiration
- Account verification status
- Admin role identification

> Password hashing, JWT/session authentication, and other security mechanisms should be documented here if they are implemented in your backend code.

---

# 📊 Feature Overview

| Feature | Description |
|---|---|
| 🔖 Bookmarks | Save and manage website bookmarks |
| 🌐 Site URL | Store website addresses |
| 🖼️ Site Logo | Store website logo information |
| 👤 User Accounts | Individual user management |
| 🔑 Authentication | Password-based account access |
| 📩 OTP | OTP-based verification support |
| ✅ Verification | User account verification |
| 🛡️ Admin | Admin role support |
| 🗄️ MongoDB | Persistent data storage |

---

# 🎯 Project Goals

The goal of Bookmark Manager is to provide a simple and centralized way to manage frequently used websites while demonstrating practical **MERN stack development**.

The project demonstrates:

- React frontend development
- Node.js backend development
- Express REST APIs
- MongoDB database integration
- Mongoose schema design
- Nested MongoDB documents
- User authentication concepts
- OTP verification
- UUID-based user identification
- Admin role management
- User-specific bookmark management

---

# 🚀 Future Improvements

Possible future enhancements include:

- 🔍 Bookmark search
- 🏷️ Bookmark categories
- ⭐ Favorite bookmarks
- 📌 Pin important websites
- 📁 Bookmark folders
- 🔄 Drag-and-drop organization
- 🌙 Dark mode
- 🔗 Automatic website metadata
- 🖼️ Automatic favicon retrieval
- 📤 Bookmark export/import
- ☁️ Cloud deployment
- 🔐 Stronger authentication and authorization
- 📱 Progressive Web App support

---

# 👨‍💻 Developer

**Software Engineer 😎**

Full-Stack Developer | MERN Stack & Blockchain | Building secure web apps, decentralized systems & practical solutions 🚀

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📜 License