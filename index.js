require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./src/controllers/user");

const app = express();

const SERVER_PORT = process.env.PORT || 8080;
const DB_URI = process.env.DB_URI;

// Configure middleware
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect(DB_URI, {
      // Optionally, you can configure other options here if needed
    });
    console.log("Connected to MongoDB");

    // Use user routes after connection is established
    app.use("/api", userRouter);

    // Start the server
    app.listen(SERVER_PORT, () => {
      console.log("Server listening on port " + SERVER_PORT);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB...", error);
  }
})();
