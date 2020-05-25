const Fawn = require("fawn");
const moment = require("moment");
const auth = require("../middlewares/auth");
const { Rental, validateRental } = require("../models/rental");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details);

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental)
    return res.status(400).send("Movie needs to be rented to be returned");

  if (rental.dateReturned)
    return res.status(400).send("Movie already Returned");

  rental.dateReturned = new Date();
  const rentalDays = moment(rental.dateReturned).diff(rental.dateOut, "days");
  rental.rentalFee =
    (rentalDays === 0 ? 1 : rentalDays) * rental.movie.dailyRentalRate;

  new Fawn.Task()
    .update(
      "rentals",
      { _id: rental._id },
      {
        $set: {
          dateReturned: rental.dateReturned,
          rentalFee: rental.rentalFee,
        },
      }
    )
    .update("movies", { _id: rental.movie._id }, { $inc: { numberInStock: 1 } })
    .run();

  res.status(200).send(rental);
});

module.exports = router;
