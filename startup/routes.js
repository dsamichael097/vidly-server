const express = require("express");
const cors = require("cors");
const movies = require("../routes/movies");
const genres = require("../routes/genres");
const rentals = require("../routes/rentals");
const returns = require("../routes/returns");
const customers = require("../routes/customers");
const auth = require("../routes/auth");
const users = require("../routes/users");
const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());

  app.use("/api/movies", movies);
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/rentals", rentals);
  app.use("/api/returns", returns);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  // We use this middleware which is called the express error middleware to
  // log and handle internal server errors, whenever a client sends a request
  // Ans send him an error response. The parameter 'error' is a function reference
  // defined in middlewares/error.js
  app.use(error);
};
