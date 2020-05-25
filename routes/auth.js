const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  // generateAuthToken() is a custom method defined in the user model. This function generates a jwt token
  // Which can be sent to the client
  const token = user.generateAuthToken();
  return res.status(200).send(token);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}

module.exports = router;
