const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  //The -__v in select signifies that __v filed should not be selected
  // The minus(-) sign at the start makes the difference
  const customers = await Customer.find().select("-__v");
  res.status(200).send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id).select("-__v");
  if (!customer) return res.status(404).send("No such customer exists");
  res.status(200).send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details);

  const customer = new Customer(req.body);
  await customer.save();
  res.status(200).send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details);

  //If in options new is not set to true, mongoose will not return the updated result
  //It will return the old result
  const options = { new: true };
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    options
  );
  if (!customer)
    return res.status(404).send("Customer with given ID does not exist");
  res.status(200).send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with given ID does not exist");
  res.status(200).send(customer);
});

module.exports = router;
