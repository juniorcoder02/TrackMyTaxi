const mongoose = require("mongoose"); //require mongoose
const bcrypt = require("bcrypt"); //require bcrypt and jwt
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({ //create userSchema
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "last name must be at least 3 characters long"],
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

userSchema.methods.generateAuthToken = function () { //create generate token method
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

userSchema.methods.comparePassword = async function (password) { //create compare password method
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) { //create hash password method
  return await bcrypt.hash(password, 10);
};

const User = mongoose.model("user", userSchema); //create user model

module.exports = User;
