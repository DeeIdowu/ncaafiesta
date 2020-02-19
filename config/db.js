const mongoose = require("mongoose");
const dbPath =
  "mongodb+srv://RoscoeGetDough:biggiebiggie@civitas2-da44a.mongodb.net/test?retryWrites=true&w=majority"; //obtain any value from the database

//responsible for connecting to mongoDB via asynchronous function
const connectDB = async () => {
  //catching errors in async await
  try {
    await mongoose.connect(dbPath, {
      useNewUrlParser: true,
      useCreateIndex: true
    });

    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // to exit upon discovery of failure
  }

  const db = mongoose.connection;
  db.on("error", () => {
    console.log("error occured from the database");
  });
  db.once("open", () => {
    console.log("succesfully opened database");
  });
};

//exporting the method/function
module.exports = connectDB;
