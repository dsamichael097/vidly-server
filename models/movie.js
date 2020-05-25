const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: { type: Number, min: 0, max: 100, required: true },
  dailyRentalRate: { type: Number, min: 0, max: 10, required: true },
  publishDate: { type: Date, default: Date.now() },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
    genreId: Joi.objectId().required().label("Genre"),
    numberInStock: Joi.number()
      .min(0)
      .max(100)
      .required()
      .label("Number In Stock"),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(10)
      .required()
      .label("Daily Rental Rate"),
  });

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
exports.movieSchema = movieSchema;
