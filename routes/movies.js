const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const express = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const result = validate(req.body);

  if (result.error) return res.status(400).send(result.error.details[0]);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("The selected Genre does not exist");

  const movie = new Movie({
    title: req.body.title,
    genre: { _id: genre._id, name: genre.name },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();
  return res.status(200).send(movie);
});

router.put("/:id", auth, async (req, res) => {
  const result = validate(req.body);
  if (result.error) return res.status(400).send(result.error.details[0]);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Selected Genre does not exist");

  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre: { name: genre.name, _id: genre._id },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  if (!movie)
    return res.status(404).send("The movie with given ID was not found");
  res.status(200).send(movie);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie)
    return res.status(404).send({
      message: "The Movie Does Not Exist or it has already been deleted",
    });
  return res.status(200).send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie does not exist");
  res.status(200).send(movie);
});

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.status(200).send(movies);
});

module.exports = router;
