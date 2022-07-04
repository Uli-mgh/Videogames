const axios = require("axios");
const { Genre } = require("../../db.js");

require("dotenv").config();
const { API_KEY } = process.env;

const genresData = async () => {
  let genres = [];

  const genresApi = await axios.get(
    `https://api.rawg.io/api/genres?key=${API_KEY}`
  );
  genresApi.data.results.forEach((e) => {
    genres.push({ id: e.id, name: e.name });
  });

  genres.forEach((e) => {
    Genre.findOrCreate({
      where: {
        id: e.id,
        name: e.name,
      },
    });
  });
};

const getGenres = async (req, res, next) => {
  try {
    genresData();
    const genresDb = await Genre.findAll();
    res.status(200).send(genresDb);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGenres,
};
