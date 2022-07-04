const { Videogame, Genre } = require("../../db.js");
const axios = require("axios");
require("dotenv").config();

const { API_KEY } = process.env;

const apiInfo = async () => {
  let gamesInfo = [];

  for (let i = 1; i < 6; i++) {
    gamesInfo.push(
      axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=${i}`)
    );
  }

  return Promise.all(gamesInfo).then((response) => {
    let pages = [];
    let output = [];

    for (let i = 0; i < response.length; i++) {
      pages = [...pages, response[i].data.results];
    }

    pages.map((el) => {
      el.forEach((element) => {
        output.push({
          id: element.id,
          name: element.name,
          image: element.background_image,
          rating: element.rating.toFixed(2),
          genres: element.genres
            .map((g) => g.name)
            .join(", ")
            .trim(),
        });
      });
    });
    return output;
  });
};

const dbInfo = async () => {
  let dbData = await Videogame.findAll({
    include: {
      model: Genre,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });

  const dbFormat = dbData.map((game) => {
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

const allVideogames = async () => {
  const apiData = await apiInfo();
  const dbData = await dbInfo();

  const allGames = [...dbData, ...apiData].slice(0, 100);
  return allGames;
};

module.exports = allVideogames;
