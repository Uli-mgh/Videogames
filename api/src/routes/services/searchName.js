const axios = require("axios");
const { Videogame, Genre } = require("../../db.js");
require("dotenv").config();
const { API_KEY } = process.env;

const { Op } = require("sequelize");

const searchNameApi = async (name) => {
  let gamesApi = await axios.get(
    `https://api.rawg.io/api/games?key=${API_KEY}&search=${name}`
  );

  // Traigo las 15 juegos que coincidan
  const searchs = gamesApi.data.results.slice(0, 15);

  return searchs.map((el) => {
    return {
      id: el.id,
      name: el.name,
      image: el.background_image,
      rating: el.rating.toFixed(2),
      released: el.released,
      platforms: el.platforms.map((p) => p.platform.name),
      genres: el.genres
        .map((g) => g.name)
        .join(", ")
        .trim(),
    };
  });
};

const searchNameDb = async (name) => {
  let gamesDb = await Videogame.findAll({
    where: {
      name: {
        [Op.iLike]: "%" + name + "%",
      },
    },
    include: {
      model: Genre,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });

  const dbFormat = gamesDb.map((game) => {
    const {
      id,
      name,
      genres,
      image,
      rating,
      released,
      description,
      platforms,
      createdInDb,
    } = game;

    const gameFormat = {
      id,
      name,
      genres: genres
        .map((g) => g.name)
        .join(", ")
        .trim(),
      image,
      rating,
      released,
      description,
      platforms,
      createdInDb,
    };

    return gameFormat;
  });
  return dbFormat;
};

const getVGSearchName = async (name) => {
  const searchApiData = await searchNameApi(name);
  const searchDbData = await searchNameDb(name);

  const theSearch = [...searchDbData, ...searchApiData].slice(0, 15); //traigo hasta 15
  return theSearch;
};

module.exports = getVGSearchName; // no me salio un nombre menos largo
