const express = require("express"); //require express router
const router = express.Router();
const { body } = require("express-validator"); //import body from express-validator
const userController = require("../controller/user"); //import user controller

router.post("/register", [
  body("email").isEmail().withMessage("Invalid Email"), //check validators
  body("fullname.firstname")
    .isLength({ min: 3 })
    .withMessage("first name must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
],userController.registerUser);

module.exports = router;
