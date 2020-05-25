const express = require("express");
const { Genre } = require("../models/genre");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.status(200).send(genres);
});

module.exports = router;

// async function addGenre() {
//   const genre = new Genre({ name: "Thriller" });
//   const res = await genre.save();
//   console.log(res);
// }
//addGenre();

// The below given method is one method to use asyncMiddleware, but we have
// To attach this asyncMiddleware to every route handler which is somewhat tedious
//Therefore we can use an npm package which monkeypatches this similar function to every route
//handler at run time, and saves our load of manually doing it
// The name of the npm package is express-async-errors
/*
router.get("/",asyncMiddleware(async (req, res) => {
    const genres = await Genre.find();
    res.status(200).send(genres);
  })
);
*/

// After requiring the package, just define the route handlers as usual
// and the package will do it's work
