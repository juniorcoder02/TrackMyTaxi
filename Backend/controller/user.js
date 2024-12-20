const userModel = require("../models/user"); //require user model
const userService = require("../services/user.service"); //require user service
const { validationResult } = require("express-validator"); //require validation result from express-validator

module.exports.registerUser = async (req, res, next) => { //function to check if any error exists
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body; //extract details from body

  const hashedPassword = await userModel.hashPassword(password); //hashing password

  const user = await userService.createUser({ //create user
    firstname:fullname.firstname,
    lastname:fullname.lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken(); //generate auth token

  res.status(201).json({ token,user }); //send response
};
