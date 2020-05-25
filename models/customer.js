const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { movieSchema } = require("./movie");

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  rental: { type: [movieSchema] },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    phone: Joi.string().min(10).max(10).required().label("Phone Number"),
    isGold: Joi.boolean(),
  }).options({ abortEarly: false });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
exports.customerSchema = customerSchema;
