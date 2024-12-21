# Backend Documentation for User Registration Endpoint

## Overview
This documentation provides a detailed explanation of the backend implementation for the user registration endpoint. It includes the functionality of the controller, router, model, and service files used to handle user registration securely and effectively.

---

## Controller: `controller/user.js`

### Description
This file contains the logic for registering a user.

### Key Functions

#### `registerUser`
- **Purpose:** Handles user registration by validating input, hashing passwords, creating a user, and generating an authentication token.
- **Workflow:**
  1. Validates the request body using `express-validator`.
  2. Extracts `fullname`, `email`, and `password` from the request body.
  3. Hashes the user's password using a method from the User model.
  4. Creates a new user using the `userService`.
  5. Generates an authentication token for the newly created user.
  6. Sends a response with the token and user details.

```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}

const { fullname, email, password } = req.body;
const hashedPassword = await userModel.hashPassword(password);

const user = await userService.createUser({
  firstname: fullname.firstname,
  lastname: fullname.lastname,
  email,
  password: hashedPassword,
});

const token = user.generateAuthToken();
res.status(201).json({ token, user });
```

---

## Router: `routes/user.js`

### Description
Defines the API route for user registration.

### Endpoint: `POST /register`
- **Validation:** Uses `express-validator` to validate the input fields:
  - `email`: Must be a valid email format.
  - `fullname.firstname`: Minimum 3 characters.
  - `password`: Minimum 6 characters.

```javascript
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.registerUser
);
```

---

## Model: `models/user.js`

### Description
Defines the schema and methods for the User collection in MongoDB.

### Schema Definition

```javascript
const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
});
```

### Key Methods

1. **`generateAuthToken`**
   - Generates a JWT token using the user's `_id`.
   ```javascript
   userSchema.methods.generateAuthToken = function () {
     const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
     return token;
   };
   ```

2. **`comparePassword`**
   - Compares a plain-text password with the hashed password stored in the database.
   ```javascript
   userSchema.methods.comparePassword = async function (password) {
     return await bcrypt.compare(password, this.password);
   };
   ```

3. **`hashPassword`**
   - Hashes a plain-text password using bcrypt.
   ```javascript
   userSchema.statics.hashPassword = async function (password) {
     return await bcrypt.hash(password, 10);
   };
   ```

---

## Service: `services/user.service.js`

### Description
Contains business logic for creating a user.

### Key Function

#### `createUser`
- **Purpose:** Saves a new user to the database.
- **Validation:** Ensures all required fields (`firstname`, `email`, `password`) are provided.
- **Implementation:**

```javascript
module.exports.createUser = async ({ firstname, lastname, email, password }) => {
  if (!firstname || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });
  return user;
};
```

---

## Summary
- **Validation:** Input is validated at the router level using `express-validator`.
- **Security:** Passwords are hashed before being saved in the database, and authentication tokens are generated using JWT.
- **Modularity:** The functionality is split across the controller, router, model, and service for better maintainability.

