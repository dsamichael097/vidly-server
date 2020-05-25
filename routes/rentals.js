const auth = require("../middlewares/auth");
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", auth, async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");
  res.status(200).send(rental);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Customer ID");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid Movie ID");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  // This Fawn npm package under the hood performs 2 phase commit of mongo db, so that, atomicity can be
  // maintained in the database, i.e either all transactions happen or none of them.
  // here we directly deal with collections, so we pass plural names as case sensitive in the save
  // or update methods
  new Fawn.Task()
    .save("rentals", rental)
    .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
    .run();

  res.status(200).send(rental);
});

module.exports = router;
