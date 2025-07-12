const mongoose = require("mongoose");
require("dotenv").config();

const ConnectDb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO ,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = ConnectDb;
