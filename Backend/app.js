const dotenv = require("dotenv"); //require dotenv module
dotenv.config(); //config dotenv
const express = require("express"); //require express module
const cors = require("cors"); //
const app = express(); //create an express app

app.use(cors()); //cors middleware
app.get("/",(req,res)=>{
    res.send("Hello World");
})

module.exports = app;