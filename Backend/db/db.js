const mongoose = require("mongoose"); //require mongoose

function connectToDb() { //function to connect database
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = connectToDb;
