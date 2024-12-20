const dotenv = require("dotenv"); //require dotenv module
dotenv.config(); //config dotenv
const express = require("express"); //require express module
const cors = require("cors"); //
const app = express(); //create an express app
const connectToDb = require("./db/db"); //require db connection
const userRoutes = require("./routes/user");

connectToDb(); //connect to db

app.use(cors()); //cors middleware
app.use(express.json()); //use express middleware
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRoutes); //user routes

module.exports = app;
