const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0]);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email ID already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  //Here bcrypt.genSalt(val) generates a salt value with which we will hash our plaintext password
  //The parameter val is the numberof rounds the salt generation algorithm will run to generate salt
  //And then hash function takes the plain text password and the salt and hashes the password.
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  // We send the jwt token as a custom header named x-auth-token, and set it's value to a valid jwt token
  // Which can then be used by the client to request to access restricted pages or make restricted changes
  res
    .header("x-auth-token", token)
    .header("Access-Control-Expose-Headers", "x-auth-token")
    .status(200)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
