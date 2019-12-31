const mongoose = require("mongoose");
const config = require("config"); // to obtain the string
const db = config.get("mongoURI"); //obtain any value from the database

//responsible for connecting to mongoDB via asynchronous function
const connectDB = async () => {
  //catching errors in async await
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true
    });

    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // to exit upon discovery of failure
  }
};

//exporting the method/function
module.exports = connectDB;
